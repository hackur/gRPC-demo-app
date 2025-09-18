import * as grpc from '@grpc/grpc-js';
import { TradingServiceInterface, BaseServiceHandler } from '../types/grpc-handlers';

// Trading data simulator
class TradingSimulator {
  private symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'GOOGL', 'TSLA', 'MSFT'];
  private prices: Map<string, number> = new Map();
  private portfolio: any;

  constructor() {
    this.initializePrices();
    this.initializePortfolio();
  }

  private initializePrices() {
    this.prices.set('BTC/USD', 45000);
    this.prices.set('ETH/USD', 3000);
    this.prices.set('AAPL', 175);
    this.prices.set('GOOGL', 140);
    this.prices.set('TSLA', 250);
    this.prices.set('MSFT', 380);
  }

  private initializePortfolio() {
    this.portfolio = {
      total_value: 100000,
      available_balance: 25000,
      positions: [
        {
          symbol: 'BTC/USD',
          quantity: 0.5,
          average_price: 43000,
          current_price: 45000,
          pnl: 1000,
        },
        {
          symbol: 'AAPL',
          quantity: 100,
          average_price: 170,
          current_price: 175,
          pnl: 500,
        },
      ],
    };
  }

  generateMarketTick(symbol: string) {
    const basePrice = this.prices.get(symbol) || 100;
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const newPrice = basePrice * (1 + variation);
    this.prices.set(symbol, newPrice);

    return {
      symbol,
      price: newPrice,
      volume: Math.random() * 1000000,
      change_24h: (Math.random() - 0.5) * 10,
      high_24h: newPrice * 1.05,
      low_24h: newPrice * 0.95,
      timestamp: new Date(),
    };
  }

  generateOrderBook(symbol: string, depth: number) {
    const basePrice = this.prices.get(symbol) || 100;
    const bids = [];
    const asks = [];

    for (let i = 0; i < depth; i++) {
      bids.push({
        price: basePrice * (0.99 - i * 0.001),
        quantity: Math.random() * 100,
      });
      asks.push({
        price: basePrice * (1.01 + i * 0.001),
        quantity: Math.random() * 100,
      });
    }

    return {
      symbol,
      bids,
      asks,
      timestamp: new Date(),
    };
  }

  getPortfolio() {
    // Update current prices
    this.portfolio.positions.forEach((position: any) => {
      const currentPrice = this.prices.get(position.symbol) || position.current_price;
      position.current_price = currentPrice;
      position.pnl = (currentPrice - position.average_price) * position.quantity;
    });

    return this.portfolio;
  }
}

export class TradingServiceHandlers extends BaseServiceHandler implements TradingServiceInterface {
  private simulator: TradingSimulator;

  // Index signature for gRPC compatibility
  [key: string]: any;

  constructor() {
    super();
    this.simulator = new TradingSimulator();
  }

  // Server streaming - Market data
  streamMarketData(call: grpc.ServerWritableStream<any, any>) {
    console.log('📈 Starting market data stream for:', call.request.symbols);

    const symbols = call.request.symbols || ['BTC/USD', 'ETH/USD'];

    // Send market ticks every 500ms
    const interval = setInterval(() => {
      symbols.forEach((symbol: string) => {
        const tick = this.simulator.generateMarketTick(symbol);

        if (!call.cancelled) {
          call.write(tick);
        }
      });
    }, 500);

    call.on('cancelled', () => {
      clearInterval(interval);
      console.log('📈 Market data stream cancelled');
    });
  }

  // Server streaming - Order book updates
  streamOrderBook(call: grpc.ServerWritableStream<any, any>) {
    console.log('📊 Starting order book stream for:', call.request.symbol);

    const symbol = call.request.symbol || 'BTC/USD';
    const depth = call.request.depth || 10;

    // Send order book updates every second
    const interval = setInterval(() => {
      const orderBook = this.simulator.generateOrderBook(symbol, depth);

      if (!call.cancelled) {
        call.write(orderBook);
      }
    }, 1000);

    call.on('cancelled', () => {
      clearInterval(interval);
      console.log('📊 Order book stream cancelled');
    });
  }

  // Server streaming - Portfolio updates
  streamPortfolio(call: grpc.ServerWritableStream<any, any>) {
    console.log('💼 Starting portfolio stream');

    // Send portfolio updates every 2 seconds
    const interval = setInterval(() => {
      const portfolio = this.simulator.getPortfolio();

      if (!call.cancelled) {
        call.write({
          portfolio,
          timestamp: new Date(),
        });
      }
    }, 2000);

    call.on('cancelled', () => {
      clearInterval(interval);
      console.log('💼 Portfolio stream cancelled');
    });
  }

  // Unary - Execute trade
  executeTrade(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { symbol, type, quantity, price } = call.request;

    console.log(`💰 Executing ${type} trade: ${quantity} ${symbol} @ ${price}`);

    // Simulate trade execution
    setTimeout(() => {
      callback(null, {
        trade_id: `trade-${Date.now()}`,
        success: true,
        message: `${type} order executed: ${quantity} ${symbol} @ ${price}`,
        executed_at: new Date(),
      });
    }, 300);
  }

  // Unary - Get portfolio
  getPortfolio(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const portfolio = this.simulator.getPortfolio();
    callback(null, portfolio);
  }
}