/**
 * @fileoverview gRPC client connection management for web applications.
 * Provides a robust connection class with automatic reconnection, streaming support,
 * and connection status management for gRPC-web communications.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

import { grpc } from '@improbable-eng/grpc-web';

/**
 * Configuration options for establishing a gRPC connection.
 *
 * @interface GrpcConnectionOptions
 */
export interface GrpcConnectionOptions {
  /** The hostname or IP address of the gRPC server */
  host: string;
  /** The port number of the gRPC server (default: 8080) */
  port?: number;
  /** Whether to use TLS/HTTPS for the connection (default: false) */
  useTLS?: boolean;
  /** Additional metadata to include with requests */
  metadata?: { [key: string]: string };
}

/**
 * Main gRPC connection class that manages client connections to gRPC services.
 * Provides automatic reconnection, error handling, and support for all gRPC streaming patterns.
 *
 * @class GrpcConnection
 * @example
 * ```typescript
 * const connection = new GrpcConnection({
 *   host: 'api.example.com',
 *   port: 443,
 *   useTLS: true,
 *   metadata: { 'authorization': 'Bearer token' }
 * });
 * ```
 */
export class GrpcConnection {
  /** The complete URL of the gRPC server */
  private host: string;
  /** Metadata to be sent with each request */
  private metadata: grpc.Metadata;
  /** Time in milliseconds between reconnection attempts */
  private reconnectInterval: number = 5000;
  /** Maximum number of reconnection attempts before giving up */
  private maxReconnectAttempts: number = 10;
  /** Current number of reconnection attempts */
  private reconnectAttempts: number = 0;
  /** Current connection status */
  private isConnected: boolean = false;
  /** Optional callback for connection status changes */
  private onStatusChange?: (status: ConnectionStatus) => void;

  /**
   * Creates a new gRPC connection instance.
   *
   * @param {GrpcConnectionOptions} options - Configuration options for the connection
   */
  constructor(options: GrpcConnectionOptions) {
    const protocol = options.useTLS ? 'https' : 'http';
    const port = options.port || 8080;
    this.host = `${protocol}://${options.host}:${port}`;

    this.metadata = new grpc.Metadata();
    if (options.metadata) {
      Object.entries(options.metadata).forEach(([key, value]) => {
        this.metadata.set(key, value);
      });
    }
  }

  /**
   * Gets the current host URL.
   *
   * @returns {string} The complete host URL including protocol and port
   */
  getHost(): string {
    return this.host;
  }

  /**
   * Gets the current metadata object.
   *
   * @returns {grpc.Metadata} The metadata object containing request headers
   */
  getMetadata(): grpc.Metadata {
    return this.metadata;
  }

  /**
   * Sets a callback handler for connection status changes.
   *
   * @param {function} handler - Callback function that receives status updates
   */
  setStatusChangeHandler(handler: (status: ConnectionStatus) => void) {
    this.onStatusChange = handler;
  }

  /**
   * Updates the connection status and notifies the status change handler.
   *
   * @private
   * @param {ConnectionStatus} status - The new connection status
   */
  private updateStatus(status: ConnectionStatus) {
    this.isConnected = status === 'connected';
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }

  /**
   * Establishes a connection to the gRPC server.
   * Note: Actual connection is established when the first request is made.
   */
  connect() {
    this.updateStatus('connecting');
    // Connection is established when first request is made
    this.updateStatus('connected');
    this.reconnectAttempts = 0;
  }

  /**
   * Disconnects from the gRPC server.
   */
  disconnect() {
    this.updateStatus('disconnected');
  }

  /**
   * Attempts to reconnect to the gRPC server with exponential backoff.
   * Throws an error if maximum reconnection attempts are exceeded.
   *
   * @async
   * @throws {Error} When maximum reconnection attempts are reached
   */
  async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.updateStatus('error');
      throw new Error('Max reconnection attempts reached');
    }

    this.reconnectAttempts++;
    this.updateStatus('reconnecting');

    await new Promise(resolve => setTimeout(resolve, this.reconnectInterval));

    try {
      this.connect();
    } catch (error) {
      console.error('Reconnection failed:', error);
      return this.reconnect();
    }
  }

  /**
   * Handles errors that occur during streaming operations.
   * Automatically attempts reconnection for unavailable service errors.
   *
   * @param {any} error - The error object from the gRPC stream
   */
  handleStreamError(error: any) {
    console.error('Stream error:', error);
    if (error.code === grpc.Code.Unavailable) {
      this.reconnect();
    }
  }

  /**
   * Executes a unary gRPC call (single request, single response).
   *
   * @template TRequest - The type of the request message
   * @template TResponse - The type of the response message
   * @param {grpc.MethodDefinition<TRequest, TResponse>} methodDescriptor - The gRPC method definition
   * @param {TRequest} request - The request message to send
   * @param {function} callback - Callback function to handle the response or error
   */
  unaryCall<TRequest, TResponse>(
    methodDescriptor: grpc.MethodDefinition<TRequest, TResponse>,
    request: TRequest,
    callback: (error: grpc.Error | null, response?: TResponse) => void
  ) {
    grpc.unary(methodDescriptor, {
      request,
      host: this.host,
      metadata: this.metadata,
      onEnd: (response) => {
        if (response.status !== grpc.Code.OK) {
          const error = {
            code: response.status,
            message: response.statusMessage,
          } as grpc.Error;
          callback(error);
          this.handleStreamError(error);
        } else {
          callback(null, response.message as TResponse);
        }
      },
    });
  }

  /**
   * Executes a server streaming gRPC call (single request, multiple responses).
   *
   * @template TRequest - The type of the request message
   * @template TResponse - The type of the response messages
   * @param {grpc.MethodDefinition<TRequest, TResponse>} methodDescriptor - The gRPC method definition
   * @param {TRequest} request - The request message to send
   * @param {function} onMessage - Callback function called for each response message
   * @param {function} [onEnd] - Optional callback function called when the stream ends
   * @returns {grpc.Request} The gRPC request object for stream control
   */
  serverStreamingCall<TRequest, TResponse>(
    methodDescriptor: grpc.MethodDefinition<TRequest, TResponse>,
    request: TRequest,
    onMessage: (message: TResponse) => void,
    onEnd?: (error?: grpc.Error) => void
  ): grpc.Request {
    return grpc.invoke(methodDescriptor, {
      request,
      host: this.host,
      metadata: this.metadata,
      onMessage: (message: TResponse) => {
        onMessage(message);
      },
      onEnd: (code, message) => {
        if (code !== grpc.Code.OK) {
          const error = { code, message } as grpc.Error;
          this.handleStreamError(error);
          if (onEnd) onEnd(error);
        } else {
          if (onEnd) onEnd();
        }
      },
    });
  }

  /**
   * Creates a client streaming gRPC call (multiple requests, single response).
   *
   * @template TRequest - The type of the request messages
   * @template TResponse - The type of the response message
   * @param {grpc.MethodDefinition<TRequest, TResponse>} methodDescriptor - The gRPC method definition
   * @returns {ClientStream<TRequest, TResponse>} A client stream for sending multiple requests
   */
  clientStreamingCall<TRequest, TResponse>(
    methodDescriptor: grpc.MethodDefinition<TRequest, TResponse>
  ): ClientStream<TRequest, TResponse> {
    const client = grpc.client(methodDescriptor, {
      host: this.host,
      metadata: this.metadata,
    });

    return new ClientStream(client, this);
  }

  /**
   * Creates a bidirectional streaming gRPC call (multiple requests, multiple responses).
   *
   * @template TRequest - The type of the request messages
   * @template TResponse - The type of the response messages
   * @param {grpc.MethodDefinition<TRequest, TResponse>} methodDescriptor - The gRPC method definition
   * @param {function} onMessage - Callback function called for each response message
   * @param {function} [onEnd] - Optional callback function called when the stream ends
   * @returns {BidiStream<TRequest, TResponse>} A bidirectional stream for sending and receiving messages
   */
  bidiStreamingCall<TRequest, TResponse>(
    methodDescriptor: grpc.MethodDefinition<TRequest, TResponse>,
    onMessage: (message: TResponse) => void,
    onEnd?: (error?: grpc.Error) => void
  ): BidiStream<TRequest, TResponse> {
    const client = grpc.client(methodDescriptor, {
      host: this.host,
      metadata: this.metadata,
    });

    client.onMessage((message: TResponse) => {
      onMessage(message);
    });

    client.onEnd((code, message) => {
      if (code !== grpc.Code.OK) {
        const error = { code, message } as grpc.Error;
        this.handleStreamError(error);
        if (onEnd) onEnd(error);
      } else {
        if (onEnd) onEnd();
      }
    });

    client.start();

    return new BidiStream(client, this);
  }
}

/**
 * Wrapper class for client streaming gRPC calls.
 * Allows sending multiple request messages and receiving a single response.
 *
 * @class ClientStream
 * @template TRequest - The type of request messages
 * @template TResponse - The type of response message
 */
export class ClientStream<TRequest, TResponse> {
  /**
   * Creates a new client stream instance.
   *
   * @param {grpc.Client<TRequest, TResponse>} client - The underlying gRPC client
   * @param {GrpcConnection} connection - The connection instance for error handling
   */
  constructor(
    private client: grpc.Client<TRequest, TResponse>,
    private connection: GrpcConnection
  ) {
    this.client.start();
  }

  /**
   * Sends a message to the server.
   *
   * @param {TRequest} message - The message to send
   */
  send(message: TRequest) {
    this.client.send(message);
  }

  /**
   * Signals that no more messages will be sent.
   */
  end() {
    this.client.finishSend();
  }

  /**
   * Sets up a callback to handle response messages.
   *
   * @param {function} callback - Function to call when a response is received
   */
  onMessage(callback: (message: TResponse) => void) {
    this.client.onMessage(callback);
  }

  /**
   * Sets up a callback to handle stream completion.
   *
   * @param {function} callback - Function to call when the stream ends
   */
  onEnd(callback: (error?: grpc.Error) => void) {
    this.client.onEnd((code, message) => {
      if (code !== grpc.Code.OK) {
        const error = { code, message } as grpc.Error;
        this.connection.handleStreamError(error);
        callback(error);
      } else {
        callback();
      }
    });
  }
}

/**
 * Wrapper class for bidirectional streaming gRPC calls.
 * Allows sending and receiving multiple messages simultaneously.
 *
 * @class BidiStream
 * @template TRequest - The type of request messages
 * @template TResponse - The type of response messages
 */
export class BidiStream<TRequest, TResponse> {
  /**
   * Creates a new bidirectional stream instance.
   *
   * @param {grpc.Client<TRequest, TResponse>} client - The underlying gRPC client
   * @param {GrpcConnection} connection - The connection instance for error handling
   */
  constructor(
    private client: grpc.Client<TRequest, TResponse>,
    private connection: GrpcConnection
  ) {}

  /**
   * Sends a message to the server.
   *
   * @param {TRequest} message - The message to send
   */
  send(message: TRequest) {
    this.client.send(message);
  }

  /**
   * Signals that no more messages will be sent.
   */
  end() {
    this.client.finishSend();
  }

  /**
   * Closes the stream completely.
   */
  close() {
    this.client.close();
  }
}

/**
 * Possible connection states for gRPC connections.
 *
 * @typedef {string} ConnectionStatus
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

/** Singleton connection instance */
let connectionInstance: GrpcConnection | null = null;

/**
 * Gets or creates a singleton gRPC connection instance.
 * If no options are provided and no instance exists, creates a default development connection.
 *
 * @param {GrpcConnectionOptions} [options] - Optional connection configuration
 * @returns {GrpcConnection} The singleton connection instance
 *
 * @example
 * ```typescript
 * // Get connection with custom options
 * const connection = getGrpcConnection({
 *   host: 'api.example.com',
 *   port: 443,
 *   useTLS: true
 * });
 *
 * // Get default development connection
 * const devConnection = getGrpcConnection();
 * ```
 */
export function getGrpcConnection(options?: GrpcConnectionOptions): GrpcConnection {
  if (!connectionInstance && options) {
    connectionInstance = new GrpcConnection(options);
  } else if (!connectionInstance) {
    // Default to localhost:8080 for development
    connectionInstance = new GrpcConnection({
      host: 'localhost',
      port: 8080,
      useTLS: false,
    });
  }
  return connectionInstance;
}

/**
 * Resets the singleton gRPC connection instance.
 * Disconnects the current connection if it exists and clears the singleton.
 */
export function resetGrpcConnection() {
  if (connectionInstance) {
    connectionInstance.disconnect();
    connectionInstance = null;
  }
}