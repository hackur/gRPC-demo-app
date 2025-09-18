import * as grpc from '@grpc/grpc-js';
import crypto from 'crypto';

// File storage simulator
class FileStorage {
  private files: Map<string, any> = new Map();
  private fileChunks: Map<string, Buffer[]> = new Map();

  constructor() {
    this.initializeFiles();
  }

  private initializeFiles() {
    // Add some sample files
    this.files.set('file-001', {
      id: 'file-001',
      name: 'sample-document.pdf',
      size: 1024 * 500, // 500KB
      mime_type: 'application/pdf',
      created_at: new Date(),
      modified_at: new Date(),
      checksum: 'abc123',
    });

    this.files.set('file-002', {
      id: 'file-002',
      name: 'presentation.pptx',
      size: 1024 * 1024 * 2, // 2MB
      mime_type: 'application/vnd.ms-powerpoint',
      created_at: new Date(),
      modified_at: new Date(),
      checksum: 'def456',
    });
  }

  storeChunk(fileId: string, chunk: Buffer) {
    const chunks = this.fileChunks.get(fileId) || [];
    chunks.push(chunk);
    this.fileChunks.set(fileId, chunks);
  }

  finalizeUpload(fileId: string, metadata: any) {
    const chunks = this.fileChunks.get(fileId) || [];
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

    const fileInfo = {
      id: fileId,
      name: metadata.name,
      size: totalSize,
      mime_type: metadata.mime_type,
      created_at: new Date(),
      modified_at: new Date(),
      checksum: crypto.createHash('md5').update(Buffer.concat(chunks)).digest('hex'),
    };

    this.files.set(fileId, fileInfo);
    return fileInfo;
  }

  getFile(fileId: string) {
    return this.files.get(fileId);
  }

  getAllFiles() {
    return Array.from(this.files.values());
  }

  deleteFile(fileId: string) {
    const existed = this.files.has(fileId);
    this.files.delete(fileId);
    this.fileChunks.delete(fileId);
    return existed;
  }
}

export class FileServiceHandlers {
  private storage: FileStorage;
  private uploadSessions: Map<string, any> = new Map();

  constructor() {
    this.storage = new FileStorage();
  }

  // Client streaming - Upload file
  uploadFile(call: grpc.ServerReadableStream<any, any>, callback: grpc.sendUnaryData<any>) {
    console.log('📤 Starting file upload');

    let fileId: string | null = null;
    let metadata: any = null;
    let totalBytes = 0;
    const chunks: Buffer[] = [];

    call.on('data', (chunk: any) => {
      // First chunk contains metadata
      if (!fileId && chunk.metadata) {
        fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        metadata = chunk.metadata;
        console.log(`📤 Uploading file: ${metadata.name}`);
      }

      // Store chunk
      if (chunk.content) {
        const buffer = Buffer.from(chunk.content);
        chunks.push(buffer);
        totalBytes += buffer.length;

        if (fileId) {
          this.storage.storeChunk(fileId, buffer);
        }
      }

      // Check if last chunk
      if (chunk.is_last_chunk) {
        console.log(`📤 Upload complete: ${totalBytes} bytes`);
      }
    });

    call.on('end', () => {
      if (fileId && metadata) {
        const fileInfo = this.storage.finalizeUpload(fileId, metadata);

        callback(null, {
          success: true,
          file_id: fileId,
          bytes_received: totalBytes,
          message: `File uploaded successfully: ${metadata.name}`,
        });
      } else {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Invalid upload: missing metadata',
        });
      }
    });

    call.on('error', (error) => {
      console.error('📤 Upload error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Upload failed',
      });
    });
  }

  // Server streaming - Download file
  downloadFile(call: grpc.ServerWritableStream<any, any>) {
    console.log('📥 Starting file download:', call.request.file_id);

    const fileId = call.request.file_id;
    const chunkSize = call.request.chunk_size || 1024 * 64; // 64KB chunks
    const fileInfo = this.storage.getFile(fileId);

    if (!fileInfo) {
      call.destroy(new Error(`File not found: ${fileId}`));
      return;
    }

    // Simulate file content
    const totalChunks = Math.ceil(fileInfo.size / chunkSize);
    let chunkNumber = 0;

    const sendChunk = () => {
      if (call.cancelled) return;

      chunkNumber++;

      // Create mock chunk data
      const remainingBytes = fileInfo.size - (chunkNumber - 1) * chunkSize;
      const currentChunkSize = Math.min(chunkSize, remainingBytes);
      const content = Buffer.alloc(currentChunkSize, 'x'); // Mock content

      const chunk = {
        file_id: fileId,
        content,
        chunk_number: chunkNumber,
        is_last_chunk: chunkNumber === totalChunks,
        metadata: chunkNumber === 1 ? fileInfo : null, // Send metadata with first chunk
      };

      call.write(chunk);

      if (chunkNumber < totalChunks) {
        // Send next chunk after a small delay to simulate network
        setTimeout(sendChunk, 10);
      } else {
        call.end();
        console.log(`📥 Download complete: ${fileInfo.name}`);
      }
    };

    // Start sending chunks
    sendChunk();

    call.on('cancelled', () => {
      console.log('📥 Download cancelled');
    });
  }

  // Unary - List files
  listFiles(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const files = this.storage.getAllFiles();
    const limit = call.request.limit || 100;
    const paginatedFiles = files.slice(0, limit);

    callback(null, {
      files: paginatedFiles,
      next_cursor: files.length > limit ? 'next-page-token' : null,
    });
  }

  // Unary - Delete file
  deleteFile(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const fileId = call.request.file_id;
    const deleted = this.storage.deleteFile(fileId);

    if (deleted) {
      callback(null, {
        success: true,
        message: `File ${fileId} deleted successfully`,
      });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `File ${fileId} not found`,
      });
    }
  }

  // Unary - Get file metadata
  getFileMetadata(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const fileId = call.request.file_id;
    const fileInfo = this.storage.getFile(fileId);

    if (fileInfo) {
      callback(null, fileInfo);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `File ${fileId} not found`,
      });
    }
  }
}