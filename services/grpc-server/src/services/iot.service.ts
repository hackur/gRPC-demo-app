import * as grpc from '@grpc/grpc-js';

// Mock data generator for IoT devices
class DeviceSimulator {
  private devices: Map<string, any> = new Map();

  constructor() {
    this.initializeDevices();
  }

  private initializeDevices() {
    const deviceTypes = ['SENSOR', 'ACTUATOR', 'GATEWAY', 'CAMERA'];
    const locations = ['Building A', 'Building B', 'Warehouse', 'Lab', 'Office'];

    for (let i = 1; i <= 10; i++) {
      const deviceId = `device-${i.toString().padStart(3, '0')}`;
      this.devices.set(deviceId, {
        id: deviceId,
        name: `IoT Device ${i}`,
        type: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        firmware_version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
        connection_status: Math.random() > 0.2 ? 'ONLINE' : 'OFFLINE',
        metadata: {
          manufacturer: 'TechCorp',
          model: `Model-${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        },
        last_seen: new Date(),
      });
    }
  }

  getDevice(deviceId: string) {
    return this.devices.get(deviceId);
  }

  getAllDevices() {
    return Array.from(this.devices.values());
  }

  generateTelemetryData(deviceId: string) {
    return {
      device_id: deviceId,
      timestamp: new Date(),
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 30,
      pressure: 1000 + Math.random() * 50,
      battery_level: Math.random() * 100,
      signal_strength: -40 - Math.floor(Math.random() * 60),
      custom_metrics: {
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100,
        disk_usage: Math.random() * 100,
      },
    };
  }

  generateAlert(deviceId: string) {
    const severities = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
    const titles = [
      'High Temperature Detected',
      'Low Battery Warning',
      'Connection Lost',
      'Sensor Malfunction',
      'Firmware Update Available',
    ];

    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      device_id: deviceId,
      severity: severities[Math.floor(Math.random() * severities.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      message: 'Automated alert from device monitoring system',
      timestamp: new Date(),
    };
  }
}

export class IoTServiceHandlers {
  private simulator: DeviceSimulator;

  constructor() {
    this.simulator = new DeviceSimulator();
  }

  // Server streaming - Real-time telemetry
  streamDeviceTelemetry(call: grpc.ServerWritableStream<any, any>) {
    console.log('📡 Starting telemetry stream for devices:', call.request.device_ids);

    const deviceIds = call.request.device_ids || [];
    const includeMetrics = call.request.include_metrics || true;

    // Send telemetry data every second
    const interval = setInterval(() => {
      deviceIds.forEach((deviceId: string) => {
        const telemetry = this.simulator.generateTelemetryData(deviceId);

        if (!call.cancelled) {
          call.write(telemetry);
        }
      });
    }, 1000);

    // Clean up on cancellation
    call.on('cancelled', () => {
      clearInterval(interval);
      console.log('📡 Telemetry stream cancelled');
    });

    call.on('error', (error) => {
      clearInterval(interval);
      console.error('📡 Telemetry stream error:', error);
    });
  }

  // Server streaming - Device status updates
  streamDeviceStatus(call: grpc.ServerWritableStream<any, any>) {
    console.log('📊 Starting status stream for devices:', call.request.device_ids);

    const deviceIds = call.request.device_ids || [];

    // Send status updates every 2 seconds
    const interval = setInterval(() => {
      deviceIds.forEach((deviceId: string) => {
        const status = {
          device_id: deviceId,
          status: Math.random() > 0.1 ? 'ONLINE' : 'OFFLINE',
          message: 'Device status update',
          timestamp: new Date(),
        };

        if (!call.cancelled) {
          call.write(status);
        }
      });
    }, 2000);

    call.on('cancelled', () => {
      clearInterval(interval);
    });
  }

  // Server streaming - Alert notifications
  streamAlerts(call: grpc.ServerWritableStream<any, any>) {
    console.log('🚨 Starting alert stream');

    const deviceIds = call.request.device_ids || [];

    // Send random alerts every 3-10 seconds
    const sendAlert = () => {
      if (call.cancelled) return;

      const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
      if (deviceId) {
        const alert = this.simulator.generateAlert(deviceId);
        call.write(alert);
      }

      // Schedule next alert
      const delay = 3000 + Math.random() * 7000;
      setTimeout(sendAlert, delay);
    };

    // Start sending alerts
    if (deviceIds.length > 0) {
      sendAlert();
    }

    call.on('cancelled', () => {
      console.log('🚨 Alert stream cancelled');
    });
  }

  // Unary - Get single device
  getDevice(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const deviceId = call.request.device_id;
    const device = this.simulator.getDevice(deviceId);

    if (device) {
      callback(null, device);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Device ${deviceId} not found`,
      });
    }
  }

  // Unary - List all devices
  listDevices(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const devices = this.simulator.getAllDevices();
    callback(null, { devices });
  }

  // Unary - Control device
  controlDevice(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { device_id, command, parameters } = call.request;

    console.log(`⚙️ Executing command "${command}" on device ${device_id}`);

    // Simulate command execution
    setTimeout(() => {
      callback(null, {
        success: true,
        message: `Command "${command}" executed successfully`,
        executed_at: new Date(),
      });
    }, 500);
  }

  // Unary - Get device history
  getDeviceHistory(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { device_id, start_time, end_time } = call.request;

    // Generate mock historical data
    const dataPoints = [];
    for (let i = 0; i < 100; i++) {
      dataPoints.push(this.simulator.generateTelemetryData(device_id));
    }

    callback(null, { data_points: dataPoints });
  }
}