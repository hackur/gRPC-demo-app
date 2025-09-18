# gRPC Architecture Patterns & Best Practices

## Table of Contents
1. [RPC Communication Patterns](#rpc-communication-patterns)
2. [Service Design Patterns](#service-design-patterns)
3. [Error Handling Patterns](#error-handling-patterns)
4. [Authentication & Security Patterns](#authentication--security-patterns)
5. [Performance Optimization Patterns](#performance-optimization-patterns)
6. [Testing Patterns](#testing-patterns)

---

## RPC Communication Patterns

### 1. Unary RPC Pattern
**Use Case**: Simple request-response interactions
```typescript
// Proto definition
rpc GetUser(GetUserRequest) returns (User);

// Server implementation
async getUser(call, callback) {
  const userId = call.request.id;
  const user = await db.findUser(userId);
  callback(null, user);
}

// Client usage
const user = await client.getUser({ id: '123' });
```

**When to use:**
- Simple CRUD operations
- Synchronous data fetching
- Quick computations

### 2. Server Streaming RPC Pattern
**Use Case**: Server sends multiple responses to single client request
```typescript
// Proto definition
rpc ListProducts(ListProductsRequest) returns (stream Product);

// Server implementation
listProducts(call) {
  const products = db.streamProducts();
  for (const product of products) {
    call.write(product);
    // Add backpressure handling
    if (!call.writable) {
      await new Promise(resolve => call.once('drain', resolve));
    }
  }
  call.end();
}

// Client usage
const stream = client.listProducts({ category: 'electronics' });
stream.on('data', product => console.log(product));
stream.on('end', () => console.log('Stream ended'));
```

**When to use:**
- Large dataset transfers
- Real-time updates
- Progressive data loading

### 3. Client Streaming RPC Pattern
**Use Case**: Client sends multiple requests, server responds once
```typescript
// Proto definition
rpc UploadFile(stream FileChunk) returns (UploadStatus);

// Server implementation
uploadFile(call, callback) {
  const chunks = [];
  call.on('data', chunk => chunks.push(chunk));
  call.on('end', () => {
    const file = Buffer.concat(chunks);
    saveFile(file);
    callback(null, { success: true, size: file.length });
  });
}

// Client usage
const stream = client.uploadFile((err, response) => {
  console.log('Upload complete:', response);
});
chunks.forEach(chunk => stream.write(chunk));
stream.end();
```

**When to use:**
- File uploads
- Batch processing
- Aggregating data from client

### 4. Bidirectional Streaming RPC Pattern
**Use Case**: Both client and server send streams of messages
```typescript
// Proto definition
rpc Chat(stream ChatMessage) returns (stream ChatMessage);

// Server implementation
chat(call) {
  call.on('data', message => {
    // Broadcast to all connected clients
    broadcast(message);
  });

  // Send messages to this client
  onNewMessage((msg) => {
    call.write(msg);
  });
}

// Client usage
const stream = client.chat();
stream.on('data', message => displayMessage(message));
stream.write({ text: 'Hello!' });
```

**When to use:**
- Real-time chat
- Collaborative editing
- Live gaming

---

## Service Design Patterns

### 1. API Gateway Pattern
```typescript
// Gateway service aggregates multiple gRPC services
class ApiGateway {
  constructor() {
    this.userService = new UserServiceClient();
    this.orderService = new OrderServiceClient();
    this.inventoryService = new InventoryServiceClient();
  }

  async getUserDashboard(userId) {
    const [user, orders, recommendations] = await Promise.all([
      this.userService.getUser({ id: userId }),
      this.orderService.getUserOrders({ userId }),
      this.inventoryService.getRecommendations({ userId })
    ]);

    return { user, orders, recommendations };
  }
}
```

### 2. Service Mesh Pattern
```yaml
# Using Istio/Linkerd for service mesh
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: grpc-service
spec:
  http:
  - match:
    - headers:
        x-user-type:
          exact: premium
    route:
    - destination:
        host: grpc-service-premium
  - route:
    - destination:
        host: grpc-service-standard
```

### 3. Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailTime: Date;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async call(fn: Function) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > 30000) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
      }
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailTime = new Date();

      if (this.failures >= 5) {
        this.state = 'OPEN';
      }
      throw error;
    }
  }
}
```

### 4. Saga Pattern for Distributed Transactions
```typescript
class OrderSaga {
  async executeOrder(order) {
    const steps = [
      { service: 'inventory', method: 'reserve', compensate: 'release' },
      { service: 'payment', method: 'charge', compensate: 'refund' },
      { service: 'shipping', method: 'schedule', compensate: 'cancel' }
    ];

    const completed = [];

    try {
      for (const step of steps) {
        const result = await this[step.service][step.method](order);
        completed.push({ ...step, result });
      }
      return { success: true, order };
    } catch (error) {
      // Compensate in reverse order
      for (const step of completed.reverse()) {
        await this[step.service][step.compensate](step.result);
      }
      throw error;
    }
  }
}
```

---

## Error Handling Patterns

### 1. Rich Error Details Pattern
```protobuf
// Proto definition for rich errors
message ErrorDetails {
  string code = 1;
  string message = 2;
  map<string, string> metadata = 3;
  repeated ValidationError validation_errors = 4;
}

message ValidationError {
  string field = 1;
  string message = 2;
}
```

```typescript
// Server error handling
function handleError(err, callback) {
  const status = {
    code: grpc.status.INVALID_ARGUMENT,
    message: 'Validation failed',
    details: ErrorDetails.encode({
      code: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      validation_errors: [
        { field: 'email', message: 'Invalid email format' },
        { field: 'age', message: 'Must be 18 or older' }
      ]
    })
  };
  callback(status);
}
```

### 2. Retry with Exponential Backoff
```typescript
class RetryClient {
  async callWithRetry(method, request, maxRetries = 3) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await method(request);
      } catch (error) {
        lastError = error;

        // Check if error is retryable
        if (!this.isRetryable(error)) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  isRetryable(error) {
    const retryableCodes = [
      grpc.status.UNAVAILABLE,
      grpc.status.DEADLINE_EXCEEDED,
      grpc.status.RESOURCE_EXHAUSTED
    ];
    return retryableCodes.includes(error.code);
  }
}
```

### 3. Deadline Propagation
```typescript
// Client sets deadline
const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);

const call = client.longRunningOperation(
  request,
  { deadline },
  callback
);

// Server checks remaining time
function longRunningOperation(call, callback) {
  const deadline = call.getDeadline();
  const remaining = deadline - Date.now();

  if (remaining < 1000) {
    callback({
      code: grpc.status.DEADLINE_EXCEEDED,
      message: 'Not enough time to complete operation'
    });
    return;
  }

  // Process with deadline awareness
  processWithTimeout(call.request, remaining - 500)
    .then(result => callback(null, result))
    .catch(err => callback(err));
}
```

---

## Authentication & Security Patterns

### 1. Token-Based Authentication
```typescript
// Server interceptor
function authInterceptor(methodDescriptor, call) {
  return new grpc.ServerInterceptingCall(call, {
    start: (next) => {
      const metadata = call.metadata;
      const token = metadata.get('authorization')[0];

      if (!token || !verifyJWT(token)) {
        call.sendStatus({
          code: grpc.status.UNAUTHENTICATED,
          details: 'Invalid or missing token'
        });
        return;
      }

      // Attach user context
      call.request.user = decodeJWT(token);
      next();
    }
  });
}
```

### 2. mTLS (Mutual TLS)
```typescript
// Server with mTLS
const server = new grpc.Server();

const credentials = grpc.ServerCredentials.createSsl(
  fs.readFileSync('ca.pem'),
  [{
    cert_chain: fs.readFileSync('server.pem'),
    private_key: fs.readFileSync('server-key.pem')
  }],
  true // Require client certificate
);

server.bindAsync('0.0.0.0:50051', credentials, callback);

// Client with mTLS
const credentials = grpc.credentials.createSsl(
  fs.readFileSync('ca.pem'),
  fs.readFileSync('client-key.pem'),
  fs.readFileSync('client.pem')
);

const client = new ServiceClient('localhost:50051', credentials);
```

### 3. API Key Authentication
```typescript
class ApiKeyAuthenticator {
  private apiKeys = new Map<string, ApiKeyInfo>();

  authenticate(call, callback) {
    const apiKey = call.metadata.get('x-api-key')[0];

    if (!apiKey || !this.apiKeys.has(apiKey)) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid API key'
      });
      return;
    }

    const keyInfo = this.apiKeys.get(apiKey);

    // Check rate limits
    if (!this.checkRateLimit(keyInfo)) {
      callback({
        code: grpc.status.RESOURCE_EXHAUSTED,
        message: 'Rate limit exceeded'
      });
      return;
    }

    // Attach context
    call.request.apiKeyInfo = keyInfo;
    callback(null);
  }
}
```

---

## Performance Optimization Patterns

### 1. Connection Pooling
```typescript
class ConnectionPool {
  private connections: Map<string, grpc.Channel> = new Map();
  private maxConnections = 10;
  private currentIndex = 0;

  getChannel(address: string): grpc.Channel {
    const key = `${address}_${this.currentIndex % this.maxConnections}`;

    if (!this.connections.has(key)) {
      const channel = grpc.createChannel(address, grpc.credentials.createInsecure(), {
        'grpc.keepalive_time_ms': 10000,
        'grpc.keepalive_timeout_ms': 5000,
        'grpc.keepalive_permit_without_calls': 1,
        'grpc.http2.max_pings_without_data': 0,
        'grpc.http2.min_time_between_pings_ms': 10000,
      });
      this.connections.set(key, channel);
    }

    this.currentIndex++;
    return this.connections.get(key);
  }
}
```

### 2. Request Batching
```typescript
class BatchProcessor {
  private queue: Request[] = [];
  private timer: NodeJS.Timeout;
  private maxBatchSize = 100;
  private maxWaitTime = 50; // ms

  async add(request: Request): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.queue.push({ ...request, resolve, reject });

      if (this.queue.length >= this.maxBatchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.maxWaitTime);
      }
    });
  }

  private async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const batch = this.queue.splice(0, this.maxBatchSize);
    if (batch.length === 0) return;

    try {
      const responses = await this.processBatch(batch);
      batch.forEach((req, i) => req.resolve(responses[i]));
    } catch (error) {
      batch.forEach(req => req.reject(error));
    }
  }
}
```

### 3. Field Mask Pattern
```protobuf
// Use field masks to request only needed fields
message GetUserRequest {
  string id = 1;
  google.protobuf.FieldMask field_mask = 2;
}
```

```typescript
// Client requests only specific fields
const request = {
  id: '123',
  field_mask: {
    paths: ['name', 'email', 'profile.avatar']
  }
};

// Server returns only requested fields
function getUser(call, callback) {
  const user = await db.getUser(call.request.id);
  const filtered = applyFieldMask(user, call.request.field_mask);
  callback(null, filtered);
}
```

### 4. Compression
```typescript
// Enable gzip compression
const options = {
  'grpc.default_compression_algorithm': 2, // gzip
  'grpc.default_compression_level': 2
};

const client = new ServiceClient(address, credentials, options);
```

---

## Testing Patterns

### 1. Mock Server Pattern
```typescript
class MockGrpcServer {
  private server: grpc.Server;
  private responses = new Map();

  constructor() {
    this.server = new grpc.Server();
  }

  addMockResponse(method: string, response: any) {
    this.responses.set(method, response);
  }

  implement(service: any) {
    const implementation = {};

    for (const method of Object.keys(service)) {
      implementation[method] = (call, callback) => {
        const response = this.responses.get(method);
        if (response instanceof Error) {
          callback(response);
        } else {
          callback(null, response);
        }
      };
    }

    this.server.addService(service, implementation);
  }

  start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server.bindAsync(
        `localhost:${port}`,
        grpc.ServerCredentials.createInsecure(),
        () => resolve()
      );
    });
  }
}
```

### 2. Integration Testing Pattern
```typescript
describe('User Service Integration Tests', () => {
  let server: grpc.Server;
  let client: UserServiceClient;

  beforeAll(async () => {
    // Start real server with test database
    server = await startTestServer();
    client = new UserServiceClient('localhost:50051');
  });

  afterAll(async () => {
    await server.forceShutdown();
  });

  test('should create and retrieve user', async () => {
    // Create user
    const createResponse = await client.createUser({
      name: 'Test User',
      email: 'test@example.com'
    });

    expect(createResponse.id).toBeDefined();

    // Retrieve user
    const getResponse = await client.getUser({
      id: createResponse.id
    });

    expect(getResponse.name).toBe('Test User');
    expect(getResponse.email).toBe('test@example.com');
  });
});
```

### 3. Load Testing Pattern
```typescript
import * as grpc from '@grpc/grpc-js';
import { performance } from 'perf_hooks';

class LoadTester {
  private results: number[] = [];

  async runTest(
    client: any,
    method: string,
    request: any,
    options: {
      concurrency: number;
      duration: number; // seconds
      rps?: number; // requests per second limit
    }
  ) {
    const startTime = performance.now();
    const endTime = startTime + (options.duration * 1000);

    const workers = Array(options.concurrency).fill(null).map(() =>
      this.worker(client, method, request, endTime, options.rps)
    );

    await Promise.all(workers);

    return this.calculateStats();
  }

  private async worker(client, method, request, endTime, rps?) {
    while (performance.now() < endTime) {
      const start = performance.now();

      try {
        await client[method](request);
        const duration = performance.now() - start;
        this.results.push(duration);
      } catch (error) {
        // Track errors
      }

      // Rate limiting
      if (rps) {
        const delay = 1000 / rps;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  private calculateStats() {
    const sorted = this.results.sort((a, b) => a - b);
    return {
      count: sorted.length,
      mean: sorted.reduce((a, b) => a + b, 0) / sorted.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      min: sorted[0],
      max: sorted[sorted.length - 1]
    };
  }
}
```

---

## Summary

These patterns provide a comprehensive foundation for building robust gRPC applications:

1. **Communication Patterns**: Choose the right RPC type for your use case
2. **Service Design**: Implement microservice patterns like API Gateway and Circuit Breaker
3. **Error Handling**: Provide rich error information with proper retry logic
4. **Security**: Implement proper authentication and authorization
5. **Performance**: Optimize with connection pooling, batching, and compression
6. **Testing**: Ensure reliability with comprehensive testing strategies

Each pattern can be adapted and combined based on specific requirements. The key is to understand the trade-offs and choose patterns that align with your application's needs.