/**
 * @fileoverview React hook for managing gRPC connections and service clients.
 * Provides a centralized way to establish and manage gRPC connections with
 * automatic status tracking and service client creation.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

'use client';

import { useEffect, useState } from 'react';
import { getGrpcConnection, GrpcConnection } from '@/lib/grpc/client';
import { createServiceClients } from '@/lib/grpc/services';
import useAppStore from '@/store/appStore';

/**
 * Custom hook for managing gRPC connection and service clients.
 * Automatically connects on mount, tracks connection status, and provides
 * all service clients ready for use.
 *
 * @hook useGrpcConnection
 * @returns {Object} Object containing connection and service clients
 * @returns {GrpcConnection | null} returns.connection - The gRPC connection instance
 * @returns {Object | null} returns.services - Object containing all service clients (iot, trading, chat, file, analytics)
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { connection, services } = useGrpcConnection();
 *
 *   useEffect(() => {
 *     if (services) {
 *       // Start streaming telemetry data
 *       const cleanup = services.iot.streamDeviceTelemetry(
 *         { deviceIds: ['device1', 'device2'] },
 *         (data) => console.log('Telemetry:', data)
 *       );
 *       return cleanup;
 *     }
 *   }, [services]);
 *
 *   return <div>Connection status: {connection?.getHost()}</div>;
 * }
 * ```
 */
export function useGrpcConnection() {
  /** The gRPC connection instance */
  const [connection, setConnection] = useState<GrpcConnection | null>(null);
  /** All service clients created from the connection */
  const [services, setServices] = useState<ReturnType<typeof createServiceClients> | null>(null);
  /** Store actions for updating connection status */
  const { setStatus, setError } = useAppStore();

  useEffect(() => {
    // Create connection with environment-based configuration
    const conn = getGrpcConnection({
      host: process.env.NEXT_PUBLIC_GRPC_HOST || 'localhost',
      port: parseInt(process.env.NEXT_PUBLIC_GRPC_PORT || '8080'),
      useTLS: process.env.NEXT_PUBLIC_USE_TLS === 'true',
    });

    // Set up status change handler to update global state
    conn.setStatusChangeHandler((status) => {
      setStatus(status);
      if (status === 'error') {
        setError('Connection failed');
      } else {
        setError(null);
      }
    });

    // Establish connection and create service clients
    conn.connect();
    setConnection(conn);

    const serviceClients = createServiceClients(conn);
    setServices(serviceClients);

    // Cleanup function to disconnect when component unmounts
    return () => {
      conn.disconnect();
    };
  }, [setStatus, setError]);

  return { connection, services };
}