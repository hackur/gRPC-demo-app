import * as grpc from '@grpc/grpc-js';

// Base types for gRPC service implementations
export interface UntypedServiceImplementation {
  [key: string]: grpc.UntypedHandleCall;
}

// Generic handler types for different gRPC call patterns
export type UnaryHandler<TRequest = any, TResponse = any> = (
  call: grpc.ServerUnaryCall<TRequest, TResponse>,
  callback: grpc.sendUnaryData<TResponse>
) => void;

export type ServerStreamingHandler<TRequest = any, TResponse = any> = (
  call: grpc.ServerWritableStream<TRequest, TResponse>
) => void;

export type ClientStreamingHandler<TRequest = any, TResponse = any> = (
  call: grpc.ServerReadableStream<TRequest, TResponse>,
  callback: grpc.sendUnaryData<TResponse>
) => void;

export type BidirectionalStreamingHandler<TRequest = any, TResponse = any> = (
  call: grpc.ServerDuplexStream<TRequest, TResponse>
) => void;

// IoT Service Handler Interface
export interface IoTServiceInterface {
  // Server streaming methods
  streamDeviceTelemetry: ServerStreamingHandler;
  streamDeviceStatus: ServerStreamingHandler;
  streamAlerts: ServerStreamingHandler;

  // Unary methods
  getDevice: UnaryHandler;
  listDevices: UnaryHandler;
  controlDevice: UnaryHandler;
  getDeviceHistory: UnaryHandler;
}

// Trading Service Handler Interface
export interface TradingServiceInterface {
  // Server streaming methods
  streamMarketData: ServerStreamingHandler;
  streamOrderBook: ServerStreamingHandler;
  streamPortfolio: ServerStreamingHandler;

  // Unary methods
  executeTrade: UnaryHandler;
  getPortfolio: UnaryHandler;
}

// Chat Service Handler Interface
export interface ChatServiceInterface {
  // Bidirectional streaming methods
  streamChat: BidirectionalStreamingHandler;
  streamPresence: BidirectionalStreamingHandler;

  // Unary methods
  getChatHistory: UnaryHandler;
  createRoom: UnaryHandler;
}

// File Service Handler Interface
export interface FileServiceInterface {
  // Client streaming method
  uploadFile: ClientStreamingHandler;

  // Server streaming method
  downloadFile: ServerStreamingHandler;

  // Unary methods
  listFiles: UnaryHandler;
  deleteFile: UnaryHandler;
  getFileMetadata: UnaryHandler;
}

// Analytics Service Handler Interface
export interface AnalyticsServiceInterface {
  // Unary methods
  getMetrics: UnaryHandler;
  getReport: UnaryHandler;
  getDashboard: UnaryHandler;
  exportData: UnaryHandler;
}

// Base service handler class for common functionality
export abstract class BaseServiceHandler {
  protected logRequest(methodName: string, request?: any): void {
    console.log(`🔧 ${methodName} called${request ? ` with: ${JSON.stringify(request).substring(0, 100)}` : ''}`);
  }

  protected logError(methodName: string, error: any): void {
    console.error(`❌ ${methodName} error:`, error);
  }

  protected createError(code: grpc.status, message: string): grpc.ServiceError {
    return {
      code,
      message,
      name: 'ServiceError',
      details: message,
      metadata: new grpc.Metadata(),
    };
  }
}

// Type guards for method validation
export function isUnaryMethod(handler: any): handler is UnaryHandler {
  return typeof handler === 'function' && handler.length === 2;
}

export function isServerStreamingMethod(handler: any): handler is ServerStreamingHandler {
  return typeof handler === 'function' && handler.length === 1;
}

export function isClientStreamingMethod(handler: any): handler is ClientStreamingHandler {
  return typeof handler === 'function' && handler.length === 2;
}

export function isBidirectionalStreamingMethod(handler: any): handler is BidirectionalStreamingHandler {
  return typeof handler === 'function' && handler.length === 1;
}

// Utility function to safely convert service handlers to UntypedServiceImplementation
export function toUntypedServiceImplementation<T extends Record<string, grpc.UntypedHandleCall>>(
  serviceHandler: T
): grpc.UntypedServiceImplementation {
  return serviceHandler as grpc.UntypedServiceImplementation;
}