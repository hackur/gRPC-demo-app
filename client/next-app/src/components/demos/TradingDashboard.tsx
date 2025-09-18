'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { WidgetCard } from '@/components/ui/WidgetCard';
import { useGrpcConnection } from '@/hooks/useGrpcConnection';
import useAppStore, { useTradingData } from '@/store/appStore';

export function TradingDashboard() {
  const { services } = useGrpcConnection();
  const { marketData, watchlist, updateMarketData, setWatchlist } = useAppStore();
  const tradingData = useTradingData();
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  useEffect(() => {
    if (!services?.trading) return;

    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    setWatchlist(symbols);

    const unsubscribe = services.trading.streamMarketData(
      { symbols },
      (data) => {
        updateMarketData(data);
        
        if (data.symbol === selectedSymbol) {
          setPriceHistory(prev => [...prev.slice(-30), {
            time: new Date(data.timestamp).toLocaleTimeString(),
            price: data.price,
            volume: data.volume
          }]);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [services, selectedSymbol, updateMarketData, setWatchlist]);

  const currentData = marketData.get(selectedSymbol);
  const marketDataArray = Array.from(marketData.values());

  return (
    <div className="space-y-6">
      {/* Symbol Selector */}
      <div className="flex gap-2 flex-wrap">
        {watchlist.map(symbol => {
          const data = marketData.get(symbol);
          const isPositive = (data?.change || 0) > 0;
          
          return (
            <button
              key={symbol}
              onClick={() => setSelectedSymbol(symbol)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                selectedSymbol === symbol 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'bg-[var(--surface)] hover:bg-[var(--surface)]/80'
              }`}
            >
              <span className="font-medium">{symbol}</span>
              {data && (
                <span className={`text-sm ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetCard
          title="Current Price"
          subtitle={selectedSymbol}
          icon={<DollarSign />}
          size="small"
          glowColor="var(--primary)"
        >
          <div className="text-3xl font-bold">
            ${currentData?.price?.toFixed(2) || '--'}
          </div>
          <div className={`text-sm mt-1 flex items-center gap-1 ${
            (currentData?.change || 0) > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {(currentData?.change || 0) > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(currentData?.change || 0).toFixed(2)}%
          </div>
        </WidgetCard>

        <WidgetCard
          title="Volume"
          subtitle="24h trading"
          icon={<BarChart3 />}
          size="small"
          glowColor="var(--secondary)"
        >
          <div className="text-3xl font-bold">
            {(currentData?.volume || 0) > 1000000 
              ? `${((currentData?.volume || 0) / 1000000).toFixed(1)}M`
              : (currentData?.volume || 0).toLocaleString()
            }
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            shares traded
          </div>
        </WidgetCard>

        <WidgetCard
          title="Bid"
          subtitle="Best bid"
          icon={<TrendingDown />}
          size="small"
          glowColor="var(--accent)"
        >
          <div className="text-3xl font-bold text-green-400">
            ${currentData?.bid?.toFixed(2) || '--'}
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            Spread: ${((currentData?.ask || 0) - (currentData?.bid || 0)).toFixed(2)}
          </div>
        </WidgetCard>

        <WidgetCard
          title="Ask"
          subtitle="Best ask"
          icon={<TrendingUp />}
          size="small"
          glowColor="var(--accent)"
        >
          <div className="text-3xl font-bold text-red-400">
            ${currentData?.ask?.toFixed(2) || '--'}
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            Market cap: $2.8T
          </div>
        </WidgetCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetCard
          title="Price Chart"
          subtitle={selectedSymbol}
          icon={<TrendingUp />}
          size="medium"
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--primary)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={false}
                animationDuration={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </WidgetCard>

        <WidgetCard
          title="Volume Chart"
          subtitle={selectedSymbol}
          icon={<BarChart3 />}
          size="medium"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priceHistory.slice(-15)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--secondary)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="volume" fill="var(--secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </WidgetCard>
      </div>

      {/* Market Overview */}
      <WidgetCard
        title="Market Overview"
        subtitle="Top movers"
        icon={<TrendingUp />}
        size="large"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--surface)]">
                <th className="text-left py-2 text-[var(--text-secondary)]">Symbol</th>
                <th className="text-right py-2 text-[var(--text-secondary)]">Price</th>
                <th className="text-right py-2 text-[var(--text-secondary)]">Change</th>
                <th className="text-right py-2 text-[var(--text-secondary)]">Volume</th>
                <th className="text-right py-2 text-[var(--text-secondary)]">Bid/Ask</th>
              </tr>
            </thead>
            <tbody>
              {marketDataArray.map((data) => {
                const isPositive = data.change > 0;
                return (
                  <tr key={data.symbol} className="border-b border-[var(--surface)]/50">
                    <td className="py-3 font-medium">{data.symbol}</td>
                    <td className="text-right">${data.price.toFixed(2)}</td>
                    <td className={`text-right ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                    </td>
                    <td className="text-right">
                      {data.volume > 1000000 
                        ? `${(data.volume / 1000000).toFixed(1)}M`
                        : data.volume.toLocaleString()
                      }
                    </td>
                    <td className="text-right text-sm">
                      <span className="text-green-400">{data.bid?.toFixed(2)}</span>
                      {' / '}
                      <span className="text-red-400">{data.ask?.toFixed(2)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </WidgetCard>
    </div>
  );
}