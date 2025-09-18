/**
 * @fileoverview Global application state management using Zustand.
 * Manages state for gRPC connections, IoT data, trading data, chat messages,
 * file operations, analytics, and performance metrics.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ConnectionStatus } from '@/lib/grpc/client';
import {
  TelemetryData,
  Alert,
  MarketData,
  ChatMessage,
  FileStatus,
  Metric,
  Dashboard
} from '@/lib/grpc/services';

/**
 * State interface for gRPC connection management.
 *
 * @interface ConnectionState
 */
interface ConnectionState {
  /** Current connection status */
  status: ConnectionStatus;
  /** Last error message, if any */
  error: string | null;
  /** Number of reconnection attempts made */
  reconnectAttempts: number;
  /** Update the connection status */
  setStatus: (status: ConnectionStatus) => void;
  /** Set or clear error message */
  setError: (error: string | null) => void;
  /** Increment reconnection attempt counter */
  incrementReconnectAttempts: () => void;
  /** Reset reconnection attempt counter */
  resetReconnectAttempts: () => void;
}

/**
 * State interface for IoT device monitoring.
 *
 * @interface IoTState
 */
interface IoTState {
  /** Map of device IDs to their latest telemetry data */
  telemetryData: Map<string, TelemetryData>;
  /** Array of recent alerts (limited to 50) */
  alerts: Alert[];
  /** List of currently selected device IDs */
  selectedDevices: string[];
  /** Add or update telemetry data for a device */
  addTelemetryData: (data: TelemetryData) => void;
  /** Add a new alert to the list */
  addAlert: (alert: Alert) => void;
  /** Update the list of selected devices */
  setSelectedDevices: (devices: string[]) => void;
  /** Clear all alerts */
  clearAlerts: () => void;
}

/**
 * State interface for trading and market data.
 *
 * @interface TradingState
 */
interface TradingState {
  /** Map of symbols to their latest market data */
  marketData: Map<string, MarketData>;
  /** List of symbols in the user's watchlist */
  watchlist: string[];
  /** Current order book data for a symbol */
  orderBook: { symbol: string; bids: number[]; asks: number[] } | null;
  /** Update market data for a symbol */
  updateMarketData: (data: MarketData) => void;
  /** Update the watchlist */
  setWatchlist: (symbols: string[]) => void;
  /** Set order book data */
  setOrderBook: (orderBook: any) => void;
}

/**
 * State interface for chat and messaging.
 *
 * @interface ChatState
 */
interface ChatState {
  /** Map of room IDs to their message arrays */
  messages: Map<string, ChatMessage[]>;
  /** Currently active chat room ID */
  activeRoom: string | null;
  /** Map of room IDs to users currently typing */
  typingUsers: Map<string, string[]>;
  /** Add a message to a specific room */
  addMessage: (roomId: string, message: ChatMessage) => void;
  /** Set the active chat room */
  setActiveRoom: (roomId: string | null) => void;
  /** Update typing users for a room */
  setTypingUsers: (roomId: string, users: string[]) => void;
  /** Clear all messages for a room */
  clearMessages: (roomId: string) => void;
}

/**
 * State interface for file operations.
 *
 * @interface FileState
 */
interface FileState {
  /** Map of file IDs to their upload status */
  uploads: Map<string, FileStatus>;
  /** Map of file IDs to their download status */
  downloads: Map<string, FileStatus>;
  /** Update the status of a file upload */
  updateUploadStatus: (status: FileStatus) => void;
  /** Update the status of a file download */
  updateDownloadStatus: (status: FileStatus) => void;
  /** Remove upload tracking for a file */
  removeUpload: (fileId: string) => void;
  /** Remove download tracking for a file */
  removeDownload: (fileId: string) => void;
}

/**
 * State interface for analytics and reporting.
 *
 * @interface AnalyticsState
 */
interface AnalyticsState {
  /** Map of metric IDs to their data */
  metrics: Map<string, Metric>;
  /** Map of dashboard IDs to their configurations */
  dashboards: Map<string, Dashboard>;
  /** Currently active dashboard ID */
  activeDashboard: string | null;
  /** Update a metric's data */
  updateMetric: (metric: Metric) => void;
  /** Set or update a dashboard configuration */
  setDashboard: (dashboard: Dashboard) => void;
  /** Set the active dashboard */
  setActiveDashboard: (dashboardId: string | null) => void;
}

/**
 * State interface for performance monitoring.
 *
 * @interface PerformanceState
 */
interface PerformanceState {
  /** Current latency in milliseconds */
  latency: number;
  /** Current throughput (messages per second) */
  throughput: number;
  /** Total number of messages processed */
  messageCount: number;
  /** Current error rate as a percentage */
  errorRate: number;
  /** Update the latency metric */
  updateLatency: (latency: number) => void;
  /** Update the throughput metric */
  updateThroughput: (throughput: number) => void;
  /** Increment the message counter */
  incrementMessageCount: () => void;
  /** Update the error rate */
  updateErrorRate: (rate: number) => void;
}

/**
 * Main application store interface combining all state domains.
 * Extends all individual state interfaces and adds global actions.
 *
 * @interface AppStore
 * @extends {ConnectionState}
 * @extends {IoTState}
 * @extends {TradingState}
 * @extends {ChatState}
 * @extends {FileState}
 * @extends {AnalyticsState}
 * @extends {PerformanceState}
 */
interface AppStore extends
  ConnectionState,
  IoTState,
  TradingState,
  ChatState,
  FileState,
  AnalyticsState,
  PerformanceState {
  /** Reset all state to initial values */
  resetAll: () => void;
}

/**
 * Main application store created with Zustand.
 * Includes devtools and persistence middleware for selected state.
 *
 * @example
 * ```typescript
 * const store = useAppStore();
 * const status = useAppStore(state => state.status);
 * ```
 */
const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Connection State
        status: 'disconnected' as ConnectionStatus,
        error: null,
        reconnectAttempts: 0,
        setStatus: (status) => set({ status }),
        setError: (error) => set({ error }),
        incrementReconnectAttempts: () => 
          set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
        resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),

        // IoT State
        telemetryData: new Map(),
        alerts: [],
        selectedDevices: [],
        addTelemetryData: (data) =>
          set((state) => {
            const newData = new Map(state.telemetryData);
            newData.set(data.deviceId, data);
            return { telemetryData: newData };
          }),
        addAlert: (alert) =>
          set((state) => ({ 
            alerts: [alert, ...state.alerts].slice(0, 50) // Keep last 50 alerts
          })),
        setSelectedDevices: (devices) => set({ selectedDevices: devices }),
        clearAlerts: () => set({ alerts: [] }),

        // Trading State
        marketData: new Map(),
        watchlist: [],
        orderBook: null,
        updateMarketData: (data) =>
          set((state) => {
            const newData = new Map(state.marketData);
            newData.set(data.symbol, data);
            return { marketData: newData };
          }),
        setWatchlist: (symbols) => set({ watchlist: symbols }),
        setOrderBook: (orderBook) => set({ orderBook }),

        // Chat State
        messages: new Map(),
        activeRoom: null,
        typingUsers: new Map(),
        addMessage: (roomId, message) =>
          set((state) => {
            const roomMessages = state.messages.get(roomId) || [];
            const newMessages = new Map(state.messages);
            newMessages.set(roomId, [...roomMessages, message]);
            return { messages: newMessages };
          }),
        setActiveRoom: (roomId) => set({ activeRoom: roomId }),
        setTypingUsers: (roomId, users) =>
          set((state) => {
            const newTypingUsers = new Map(state.typingUsers);
            newTypingUsers.set(roomId, users);
            return { typingUsers: newTypingUsers };
          }),
        clearMessages: (roomId) =>
          set((state) => {
            const newMessages = new Map(state.messages);
            newMessages.delete(roomId);
            return { messages: newMessages };
          }),

        // File State
        uploads: new Map(),
        downloads: new Map(),
        updateUploadStatus: (status) =>
          set((state) => {
            const newUploads = new Map(state.uploads);
            newUploads.set(status.fileId, status);
            return { uploads: newUploads };
          }),
        updateDownloadStatus: (status) =>
          set((state) => {
            const newDownloads = new Map(state.downloads);
            newDownloads.set(status.fileId, status);
            return { downloads: newDownloads };
          }),
        removeUpload: (fileId) =>
          set((state) => {
            const newUploads = new Map(state.uploads);
            newUploads.delete(fileId);
            return { uploads: newUploads };
          }),
        removeDownload: (fileId) =>
          set((state) => {
            const newDownloads = new Map(state.downloads);
            newDownloads.delete(fileId);
            return { downloads: newDownloads };
          }),

        // Analytics State
        metrics: new Map(),
        dashboards: new Map(),
        activeDashboard: null,
        updateMetric: (metric) =>
          set((state) => {
            const newMetrics = new Map(state.metrics);
            newMetrics.set(metric.id, metric);
            return { metrics: newMetrics };
          }),
        setDashboard: (dashboard) =>
          set((state) => {
            const newDashboards = new Map(state.dashboards);
            newDashboards.set(dashboard.id, dashboard);
            return { dashboards: newDashboards };
          }),
        setActiveDashboard: (dashboardId) => set({ activeDashboard: dashboardId }),

        // Performance State
        latency: 0,
        throughput: 0,
        messageCount: 0,
        errorRate: 0,
        updateLatency: (latency) => set({ latency }),
        updateThroughput: (throughput) => set({ throughput }),
        incrementMessageCount: () =>
          set((state) => ({ messageCount: state.messageCount + 1 })),
        updateErrorRate: (rate) => set({ errorRate: rate }),

        // Global Actions
        resetAll: () =>
          set({
            status: 'disconnected',
            error: null,
            reconnectAttempts: 0,
            telemetryData: new Map(),
            alerts: [],
            selectedDevices: [],
            marketData: new Map(),
            watchlist: [],
            orderBook: null,
            messages: new Map(),
            activeRoom: null,
            typingUsers: new Map(),
            uploads: new Map(),
            downloads: new Map(),
            metrics: new Map(),
            dashboards: new Map(),
            activeDashboard: null,
            latency: 0,
            throughput: 0,
            messageCount: 0,
            errorRate: 0,
          }),
      }),
      {
        name: 'grpc-demo-store',
        // Only persist certain fields
        partialize: (state) => ({
          watchlist: state.watchlist,
          selectedDevices: state.selectedDevices,
        }),
      }
    )
  )
);

export default useAppStore;

/**
 * Optimized selector hook for connection status.
 * Use this instead of accessing the full store when only connection status is needed.
 *
 * @returns {ConnectionStatus} Current connection status
 */
export const useConnectionStatus = () => useAppStore((state) => state.status);

/**
 * Optimized selector hook for IoT-related data.
 * Prevents unnecessary re-renders by selecting only IoT state.
 *
 * @returns {Object} IoT state including telemetry data, alerts, and selected devices
 */
export const useIoTData = () => useAppStore((state) => ({
  telemetryData: state.telemetryData,
  alerts: state.alerts,
  selectedDevices: state.selectedDevices,
}));

/**
 * Optimized selector hook for trading-related data.
 *
 * @returns {Object} Trading state including market data, watchlist, and order book
 */
export const useTradingData = () => useAppStore((state) => ({
  marketData: state.marketData,
  watchlist: state.watchlist,
  orderBook: state.orderBook,
}));

/**
 * Optimized selector hook for chat-related data.
 *
 * @returns {Object} Chat state including messages, active room, and typing users
 */
export const useChatData = () => useAppStore((state) => ({
  messages: state.messages,
  activeRoom: state.activeRoom,
  typingUsers: state.typingUsers,
}));

/**
 * Optimized selector hook for file operation data.
 *
 * @returns {Object} File state including upload and download statuses
 */
export const useFileData = () => useAppStore((state) => ({
  uploads: state.uploads,
  downloads: state.downloads,
}));

/**
 * Optimized selector hook for analytics data.
 *
 * @returns {Object} Analytics state including metrics, dashboards, and active dashboard
 */
export const useAnalyticsData = () => useAppStore((state) => ({
  metrics: state.metrics,
  dashboards: state.dashboards,
  activeDashboard: state.activeDashboard,
}));

/**
 * Optimized selector hook for performance monitoring data.
 *
 * @returns {Object} Performance metrics including latency, throughput, message count, and error rate
 */
export const usePerformanceData = () => useAppStore((state) => ({
  latency: state.latency,
  throughput: state.throughput,
  messageCount: state.messageCount,
  errorRate: state.errorRate,
}));