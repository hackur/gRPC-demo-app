import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Import service handlers
import { IoTServiceHandlers } from './services/iot.service';
import { TradingServiceHandlers } from './services/trading.service';
import { ChatServiceHandlers } from './services/chat.service';
import { FileServiceHandlers } from './services/file.service';
import { AnalyticsServiceHandlers } from './services/analytics.service';

// Load proto file
const PROTO_PATH = path.join(__dirname, '../../../packages/protos/src/services.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

class GrpcServer {
  private server: grpc.Server;
  private port: number;

  constructor(port = 50051) {
    this.port = port;
    this.server = new grpc.Server({
      'grpc.max_receive_message_length': 1024 * 1024 * 10, // 10MB
      'grpc.max_send_message_length': 1024 * 1024 * 10,
      'grpc.keepalive_time_ms': 10000,
      'grpc.keepalive_timeout_ms': 5000,
      'grpc.keepalive_permit_without_calls': 1,
    });

    this.setupServices();
  }

  private setupServices() {
    console.log('🔧 Setting up gRPC services...');

    // Add IoT Service
    this.server.addService(
      proto.demo.IoTService.service,
      new IoTServiceHandlers()
    );
    console.log('✅ IoT Service registered');

    // Add Trading Service
    this.server.addService(
      proto.demo.TradingService.service,
      new TradingServiceHandlers()
    );
    console.log('✅ Trading Service registered');

    // Add Chat Service
    this.server.addService(
      proto.demo.ChatService.service,
      new ChatServiceHandlers()
    );
    console.log('✅ Chat Service registered');

    // Add File Service
    this.server.addService(
      proto.demo.FileService.service,
      new FileServiceHandlers()
    );
    console.log('✅ File Service registered');

    // Add Analytics Service
    this.server.addService(
      proto.demo.AnalyticsService.service,
      new AnalyticsServiceHandlers()
    );
    console.log('✅ Analytics Service registered');
  }

  start() {
    this.server.bindAsync(
      `0.0.0.0:${this.port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error('Failed to start server:', err);
          return;
        }

        console.log(`
╔═══════════════════════════════════════╗
║     gRPC Demo Server Started! 🚀      ║
╠═══════════════════════════════════════╣
║  Port: ${port}                        ║
║  Mode: Development                    ║
║  Services: 5 registered               ║
╚═══════════════════════════════════════╝
        `);

        // Start the server
        this.server.start();
      }
    );
  }

  async shutdown() {
    return new Promise<void>((resolve) => {
      this.server.tryShutdown(() => {
        console.log('Server shut down gracefully');
        resolve();
      });
    });
  }
}

// Start the server
const server = new GrpcServer();
server.start();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await server.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await server.shutdown();
  process.exit(0);
});

export default GrpcServer;