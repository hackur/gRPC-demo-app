import * * grpc from '@grpc/grpc-js';

// Analytics data generator
class AnalyticsEngine {
  private metricsCache: Map<string, any> = new Map();

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // Initialize some base metrics
    const metrics = [
      { id: 'revenue', name: 'Total Revenue', value: 125000, unit: 'USD' },
      { id: 'users', name: 'Active Users', value: 4523, unit: 'users' },
      { id: 'conversion', name: 'Conversion Rate', value: 3.4, unit: '%' },
      { id: 'latency', name: 'Avg Latency', value: 142, unit: 'ms' },
      { id: 'uptime', name: 'Uptime', value: 99.98, unit: '%' },
    ];

    metrics.forEach(metric => {
      this.metricsCache.set(metric.id, metric);
    });
  }

  getMetrics(metricIds: string[]) {
    const metrics = metricIds.map(id => {
      const cached = this.metricsCache.get(id);
      if (cached) {
        // Add some variation to simulate real data
        return {
          ...cached,
          value: cached.value * (0.95 + Math.random() * 0.1),
          breakdown: this.generateBreakdown(cached.id),
        };
      }
      return null;
    }).filter(Boolean);

    return metrics;
  }

  private generateBreakdown(metricId: string) {
    const breakdowns: { [key: string]: { [key: string]: number } } = {
      revenue: {
        'Product A': 45000,
        'Product B': 35000,
        'Product C': 25000,
        'Services': 20000,
      },
      users: {
        'Mobile': 2500,
        'Desktop': 1523,
        'Tablet': 500,
      },
      conversion: {
        'Landing Page': 5.2,
        'Product Page': 3.8,
        'Checkout': 1.2,
      },
    };

    return breakdowns[metricId] || {};
  }

  generateReport(reportType: string) {
    const reports: { [key: string]: any } = {
      daily: {
        id: `report-${Date.now()}`,
        title: 'Daily Performance Report',
        content: Buffer.from(JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          metrics: this.getMetrics(['revenue', 'users', 'conversion']),
          summary: 'Daily performance within expected ranges',
        })),
        format: 'json',
      },
      weekly: {
        id: `report-${Date.now()}`,
        title: 'Weekly Analytics Report',
        content: Buffer.from(JSON.stringify({
          week: `Week ${Math.floor((new Date().getDate() - 1) / 7) + 1}`,
          metrics: this.getMetrics(['revenue', 'users', 'conversion', 'uptime']),
          trends: 'Positive growth in all key metrics',
        })),
        format: 'json',
      },
    };

    return reports[reportType] || reports.daily;
  }

  getDashboard(dashboardId: string) {
    return {
      id: dashboardId,
      name: 'Main Dashboard',
      widgets: [
        {
          id: 'widget-1',
          type: 'metric',
          title: 'Revenue',
          config: { metric_id: 'revenue', display: 'card' },
          data: Buffer.from(JSON.stringify(this.getMetrics(['revenue'])[0])),
        },
        {
          id: 'widget-2',
          type: 'chart',
          title: 'User Growth',
          config: { metric_id: 'users', chart_type: 'line' },
          data: Buffer.from(JSON.stringify({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            values: [4200, 4350, 4400, 4480, 4523],
          })),
        },
        {
          id: 'widget-3',
          type: 'table',
          title: 'Top Products',
          config: { sort: 'revenue', limit: 5 },
          data: Buffer.from(JSON.stringify([
            { product: 'Product A', revenue: 45000, units: 230 },
            { product: 'Product B', revenue: 35000, units: 180 },
            { product: 'Product C', revenue: 25000, units: 150 },
          ])),
        },
      ],
    };
  }
}

export class AnalyticsServiceHandlers {
  private engine: AnalyticsEngine;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 60000; // 1 minute cache

  constructor() {
    this.engine = new AnalyticsEngine();
  }

  // Unary - Get metrics with caching
  getMetrics(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { metric_ids } = call.request;
    const cacheKey = `metrics-${metric_ids.join('-')}`;

    // Check cache
    const cached = this.requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📊 Returning cached metrics');
      callback(null, cached.data);
      return;
    }

    // Generate fresh metrics
    console.log('📊 Generating fresh metrics for:', metric_ids);
    const metrics = this.engine.getMetrics(metric_ids);

    const response = {
      metrics,
      generated_at: new Date(),
    };

    // Cache the response
    this.requestCache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    });

    callback(null, response);
  }

  // Unary - Get report
  getReport(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { report_type } = call.request;
    console.log('📈 Generating report:', report_type);

    const report = this.engine.generateReport(report_type);
    report.generated_at = new Date();

    callback(null, report);
  }

  // Unary - Get dashboard
  getDashboard(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { dashboard_id } = call.request;
    console.log('📊 Loading dashboard:', dashboard_id);

    const dashboard = this.engine.getDashboard(dashboard_id || 'default');
    callback(null, dashboard);
  }

  // Unary - Export data
  exportData(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { format, metrics } = call.request;
    console.log('💾 Exporting data in format:', format);

    // Simulate export process
    setTimeout(() => {
      callback(null, {
        download_url: `https://api.example.com/exports/${Date.now()}.${format}`,
        file_size: 1024 * 250, // 250KB
        expires_at: new Date(Date.now() + 3600000), // 1 hour from now
      });
    }, 1000);
  }
}