/**
 * @fileoverview gRPC service client wrappers and type definitions.
 * Provides service clients for IoT, Trading, Chat, File, and Analytics services.
 * Currently contains mock implementations that will be replaced with generated
 * clients from proto files.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

import { GrpcConnection } from './client';

/**
 * Request interface for streaming device telemetry data.
 *
 * @interface DeviceStreamRequest
 */
export interface DeviceStreamRequest {
  /** Array of device IDs to monitor */
  deviceIds: string[];
  /** Optional filter for specific metric types */
  metricsFilter?: string[];
}

/**
 * Telemetry data structure from IoT devices.
 *
 * @interface TelemetryData
 */
export interface TelemetryData {
  /** Unique identifier for the device */
  deviceId: string;
  /** Timestamp when the data was collected */
  timestamp: Date;
  /** Key-value pairs of metric names and values */
  metrics: { [key: string]: number };
  /** Current operational status of the device */
  status: string;
}

/**
 * Alert notification from IoT monitoring system.
 *
 * @interface Alert
 */
export interface Alert {
  /** Unique identifier for the alert */
  id: string;
  /** Device that triggered the alert */
  deviceId: string;
  /** Severity level of the alert */
  severity: 'info' | 'warning' | 'critical';
  /** Human-readable alert message */
  message: string;
  /** When the alert was generated */
  timestamp: Date;
}

/**
 * Request interface for market data streaming.
 *
 * @interface MarketDataRequest
 */
export interface MarketDataRequest {
  /** Array of trading symbols to monitor */
  symbols: string[];
  /** Whether to include bid/ask order book data */
  includeOrderBook?: boolean;
}

/**
 * Market data for a trading symbol.
 *
 * @interface MarketData
 */
export interface MarketData {
  /** Trading symbol (e.g., 'AAPL', 'BTC-USD') */
  symbol: string;
  /** Current market price */
  price: number;
  /** Trading volume */
  volume: number;
  /** Price change from previous period */
  change: number;
  /** Timestamp of the market data */
  timestamp: Date;
  /** Current highest bid price */
  bid?: number;
  /** Current lowest ask price */
  ask?: number;
}

/**
 * Chat message structure for real-time messaging.
 *
 * @interface ChatMessage
 */
export interface ChatMessage {
  /** Unique message identifier (assigned by server) */
  id?: string;
  /** Chat room identifier */
  roomId: string;
  /** User who sent the message */
  userId: string;
  /** Message content */
  content: string;
  /** When the message was sent */
  timestamp?: Date;
}

/**
 * Chat room information.
 *
 * @interface ChatRoom
 */
export interface ChatRoom {
  /** Unique room identifier */
  id: string;
  /** Display name of the chat room */
  name: string;
  /** List of user IDs currently in the room */
  participants: string[];
}

/**
 * File chunk for streaming file uploads/downloads.
 *
 * @interface FileChunk
 */
export interface FileChunk {
  /** File identifier (assigned during upload) */
  fileId?: string;
  /** Binary data of the chunk */
  data: Uint8Array;
  /** Byte offset of this chunk in the complete file */
  offset?: number;
  /** Total size of the complete file */
  totalSize?: number;
  /** Additional file metadata */
  metadata?: { [key: string]: string };
}

/**
 * Status information for file operations.
 *
 * @interface FileStatus
 */
export interface FileStatus {
  /** File identifier */
  fileId: string;
  /** Current status of the file operation */
  status: 'uploading' | 'processing' | 'complete' | 'error';
  /** Progress percentage (0-100) */
  progress: number;
  /** Optional status message */
  message?: string;
}

/**
 * Request interface for analytics metrics.
 *
 * @interface MetricsRequest
 */
export interface MetricsRequest {
  /** Array of metric identifiers to retrieve */
  metricIds: string[];
  /** Optional time range filter */
  timeRange?: { start: Date; end: Date };
}

/**
 * Analytics metric data structure.
 *
 * @interface Metric
 */
export interface Metric {
  /** Unique metric identifier */
  id: string;
  /** Human-readable metric name */
  name: string;
  /** Current metric value */
  value: number;
  /** Unit of measurement */
  unit: string;
  /** Optional breakdown by category */
  breakdown?: { [key: string]: number };
}

/**
 * Generated analytics report.
 *
 * @interface Report
 */
export interface Report {
  /** Unique report identifier */
  id: string;
  /** Report title */
  title: string;
  /** Binary report content */
  content: Uint8Array;
  /** Report format (e.g., 'pdf', 'csv', 'xlsx') */
  format: string;
  /** When the report was generated */
  generatedAt: Date;
}

/**
 * Analytics dashboard configuration.
 *
 * @interface Dashboard
 */
export interface Dashboard {
  /** Unique dashboard identifier */
  id: string;
  /** Dashboard display name */
  name: string;
  /** Array of widgets in the dashboard */
  widgets: Widget[];
}

/**
 * Dashboard widget configuration.
 *
 * @interface Widget
 */
export interface Widget {
  /** Unique widget identifier */
  id: string;
  /** Type of widget visualization */
  type: 'metric' | 'chart' | 'table';
  /** Widget display title */
  title: string;
  /** Widget-specific configuration */
  config: { [key: string]: any };
  /** Binary widget data */
  data: Uint8Array;
}

/**
 * Client for IoT device monitoring and telemetry services.
 * Provides streaming access to device data and alerts.
 *
 * @class IoTServiceClient
 */
export class IoTServiceClient {
  /**
   * Creates a new IoT service client.
   *
   * @param {GrpcConnection} connection - The gRPC connection to use
   */
  constructor(private connection: GrpcConnection) {}

  /**
   * Streams real-time telemetry data from specified IoT devices.
   *
   * @param {DeviceStreamRequest} request - Request containing device IDs and filters
   * @param {function} onData - Callback function for receiving telemetry data
   * @param {function} [onError] - Optional error handling callback
   * @returns {function} Cleanup function to stop the stream
   *
   * @example
   * ```typescript
   * const cleanup = client.streamDeviceTelemetry(
   *   { deviceIds: ['device1', 'device2'] },
   *   (data) => console.log('Telemetry:', data),
   *   (error) => console.error('Stream error:', error)
   * );
   *
   * // Later, stop the stream
   * cleanup();
   * ```
   */
  streamDeviceTelemetry(
    request: DeviceStreamRequest,
    onData: (data: TelemetryData) => void,
    onError?: (error: Error) => void
  ) {
    // Mock implementation - will be replaced with actual gRPC calls
    const interval = setInterval(() => {
      request.deviceIds.forEach(deviceId => {
        onData({
          deviceId,
          timestamp: new Date(),
          metrics: {
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            pressure: 1000 + Math.random() * 50,
          },
          status: 'online',
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }

  /**
   * Streams real-time alerts from the IoT monitoring system.
   *
   * @param {Object} request - Alert stream configuration
   * @param {string[]} [request.severityFilter] - Optional filter for alert severity levels
   * @param {function} onAlert - Callback function for receiving alerts
   * @param {function} [onError] - Optional error handling callback
   * @returns {function} Cleanup function to stop the stream
   */
  streamAlerts(
    request: { severityFilter?: string[] },
    onAlert: (alert: Alert) => void,
    onError?: (error: Error) => void
  ) {
    // Mock implementation
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        onAlert({
          id: `alert-${Date.now()}`,
          deviceId: `device-${Math.floor(Math.random() * 10)}`,
          severity: ['info', 'warning', 'critical'][Math.floor(Math.random() * 3)] as any,
          message: 'Mock alert message',
          timestamp: new Date(),
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}

/**
 * Client for real-time trading and market data services.
 *
 * @class TradingServiceClient
 */
export class TradingServiceClient {
  /**
   * Creates a new trading service client.
   *
   * @param {GrpcConnection} connection - The gRPC connection to use
   */
  constructor(private connection: GrpcConnection) {}

  /**
   * Streams real-time market data for specified trading symbols.
   *
   * @param {MarketDataRequest} request - Request containing symbols to monitor
   * @param {function} onData - Callback function for receiving market data
   * @param {function} [onError] - Optional error handling callback
   * @returns {function} Cleanup function to stop the stream
   *
   * @example
   * ```typescript
   * const cleanup = client.streamMarketData(
   *   { symbols: ['AAPL', 'GOOGL'], includeOrderBook: true },
   *   (data) => console.log('Market data:', data)
   * );
   * ```
   */
  streamMarketData(
    request: MarketDataRequest,
    onData: (data: MarketData) => void,
    onError?: (error: Error) => void
  ) {
    // Mock implementation
    const interval = setInterval(() => {
      request.symbols.forEach(symbol => {
        const basePrice = 100 + Math.random() * 1000;
        onData({
          symbol,
          price: basePrice,
          volume: Math.floor(Math.random() * 1000000),
          change: (Math.random() - 0.5) * 10,
          timestamp: new Date(),
          bid: basePrice - Math.random(),
          ask: basePrice + Math.random(),
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }
}

/**
 * Client for real-time chat and messaging services.
 *
 * @class ChatServiceClient
 */
export class ChatServiceClient {
  /**
   * Creates a new chat service client.
   *
   * @param {GrpcConnection} connection - The gRPC connection to use
   */
  constructor(private connection: GrpcConnection) {}

  /**
   * Joins a chat room and establishes bidirectional messaging.
   *
   * @param {string} roomId - The chat room identifier to join
   * @returns {BidiStreamMock<ChatMessage, ChatMessage>} Bidirectional stream for sending and receiving messages
   *
   * @example
   * ```typescript
   * const chatStream = client.joinRoom('room123');
   *
   * chatStream.onMessage((message) => {
   *   console.log('Received:', message.content);
   * });
   *
   * chatStream.send({
   *   roomId: 'room123',
   *   userId: 'user456',
   *   content: 'Hello, world!'
   * });
   * ```
   */
  joinRoom(roomId: string): BidiStreamMock<ChatMessage, ChatMessage> {
    // Mock implementation
    const handlers: ((msg: ChatMessage) => void)[] = [];
    
    // Simulate incoming messages
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          roomId,
          userId: `user-${Math.floor(Math.random() * 5)}`,
          content: 'Mock message',
          timestamp: new Date(),
        };
        handlers.forEach(h => h(msg));
      }
    }, 3000);

    return {
      send: (msg: ChatMessage) => {
        // Echo back with ID
        setTimeout(() => {
          handlers.forEach(h => h({ ...msg, id: `msg-${Date.now()}` }));
        }, 100);
      },
      onMessage: (handler: (msg: ChatMessage) => void) => {
        handlers.push(handler);
      },
      close: () => clearInterval(interval),
    };
  }
}

/**
 * Client for file upload, download, and streaming services.
 *
 * @class FileServiceClient
 */
export class FileServiceClient {
  /**
   * Creates a new file service client.
   *
   * @param {GrpcConnection} connection - The gRPC connection to use
   */
  constructor(private connection: GrpcConnection) {}

  /**
   * Starts a file upload operation with streaming progress updates.
   *
   * @param {function} onStatus - Callback function for upload status updates
   * @returns {ClientStreamMock<FileChunk, FileStatus>} Client stream for sending file chunks
   *
   * @example
   * ```typescript
   * const uploadStream = client.uploadFile((status) => {
   *   console.log(`Upload progress: ${status.progress}%`);
   * });
   *
   * // Send file in chunks
   * uploadStream.send({
   *   data: fileChunk,
   *   totalSize: fileSize,
   *   metadata: { filename: 'document.pdf' }
   * });
   *
   * uploadStream.end();
   * ```
   */
  uploadFile(
    onStatus: (status: FileStatus) => void
  ): ClientStreamMock<FileChunk, FileStatus> {
    let totalSize = 0;
    let received = 0;
    const fileId = `file-${Date.now()}`;

    return {
      send: (chunk: FileChunk) => {
        if (chunk.totalSize) totalSize = chunk.totalSize;
        received += chunk.data.length;
        
        onStatus({
          fileId,
          status: 'uploading',
          progress: totalSize ? (received / totalSize) * 100 : 0,
        });

        if (received >= totalSize && totalSize > 0) {
          setTimeout(() => {
            onStatus({
              fileId,
              status: 'complete',
              progress: 100,
              message: 'Upload complete',
            });
          }, 500);
        }
      },
      end: () => {
        // Finalize upload
      },
    };
  }

  /**
   * Downloads a file by streaming chunks from the server.
   *
   * @param {string} fileId - The identifier of the file to download
   * @param {function} onChunk - Callback function for receiving file chunks
   * @param {function} [onComplete] - Optional callback when download completes
   * @returns {function} Cleanup function to cancel the download
   */
  downloadFile(
    fileId: string,
    onChunk: (chunk: FileChunk) => void,
    onComplete?: () => void
  ) {
    // Mock implementation
    const totalSize = 1024 * 1024; // 1MB
    const chunkSize = 1024 * 64; // 64KB
    let sent = 0;

    const interval = setInterval(() => {
      const size = Math.min(chunkSize, totalSize - sent);
      onChunk({
        fileId,
        data: new Uint8Array(size),
        offset: sent,
        totalSize,
      });
      
      sent += size;
      if (sent >= totalSize) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 100);

    return () => clearInterval(interval);
  }
}

/**
 * Client for analytics, metrics, and reporting services.
 *
 * @class AnalyticsServiceClient
 */
export class AnalyticsServiceClient {
  /**
   * Creates a new analytics service client.
   *
   * @param {GrpcConnection} connection - The gRPC connection to use
   */
  constructor(private connection: GrpcConnection) {}

  /**
   * Retrieves analytics metrics based on the provided request.
   *
   * @param {MetricsRequest} request - Request specifying which metrics to retrieve
   * @returns {Promise<Metric[]>} Promise resolving to an array of metrics
   *
   * @example
   * ```typescript
   * const metrics = await client.getMetrics({
   *   metricIds: ['revenue', 'users', 'conversion'],
   *   timeRange: {
   *     start: new Date('2023-01-01'),
   *     end: new Date('2023-12-31')
   *   }
   * });
   * ```
   */
  async getMetrics(request: MetricsRequest): Promise<Metric[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          request.metricIds.map(id => ({
            id,
            name: `Metric ${id}`,
            value: Math.random() * 1000,
            unit: 'count',
            breakdown: {
              'Category A': Math.random() * 500,
              'Category B': Math.random() * 500,
            },
          }))
        );
      }, 500);
    });
  }

  /**
   * Retrieves a complete dashboard configuration with all widgets.
   *
   * @param {string} dashboardId - The unique identifier of the dashboard
   * @returns {Promise<Dashboard>} Promise resolving to the dashboard configuration
   */
  async getDashboard(dashboardId: string): Promise<Dashboard> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: dashboardId,
          name: 'Mock Dashboard',
          widgets: [
            {
              id: 'w1',
              type: 'metric',
              title: 'Revenue',
              config: {},
              data: new Uint8Array([]),
            },
            {
              id: 'w2',
              type: 'chart',
              title: 'User Growth',
              config: { chartType: 'line' },
              data: new Uint8Array([]),
            },
          ],
        });
      }, 300);
    });
  }
}

/**
 * Mock interface for bidirectional streaming.
 * Will be replaced with actual gRPC stream types.
 *
 * @interface BidiStreamMock
 * @template TRequest - Type of messages sent to server
 * @template TResponse - Type of messages received from server
 */
interface BidiStreamMock<TRequest, TResponse> {
  /** Send a message to the server */
  send: (message: TRequest) => void;
  /** Register handler for incoming messages */
  onMessage: (handler: (message: TResponse) => void) => void;
  /** Close the stream */
  close: () => void;
}

/**
 * Mock interface for client streaming.
 * Will be replaced with actual gRPC stream types.
 *
 * @interface ClientStreamMock
 * @template TRequest - Type of messages sent to server
 * @template TResponse - Type of response from server
 */
interface ClientStreamMock<TRequest, TResponse> {
  /** Send a message to the server */
  send: (message: TRequest) => void;
  /** Signal end of client messages */
  end: () => void;
}

/**
 * Factory function to create all service clients with a shared connection.
 *
 * @param {GrpcConnection} connection - The gRPC connection to use for all services
 * @returns {Object} Object containing all service client instances
 *
 * @example
 * ```typescript
 * const connection = getGrpcConnection({ host: 'api.example.com' });
 * const services = createServiceClients(connection);
 *
 * // Use individual services
 * services.iot.streamDeviceTelemetry(request, onData);
 * services.trading.streamMarketData(request, onData);
 * ```
 */
export function createServiceClients(connection: GrpcConnection) {
  return {
    /** IoT device monitoring service */
    iot: new IoTServiceClient(connection),
    /** Trading and market data service */
    trading: new TradingServiceClient(connection),
    /** Real-time chat service */
    chat: new ChatServiceClient(connection),
    /** File upload/download service */
    file: new FileServiceClient(connection),
    /** Analytics and reporting service */
    analytics: new AnalyticsServiceClient(connection),
  };
}