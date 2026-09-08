import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CryptoPriceHistory } from '../types/market';
import type { CoinId } from '../types/market';

interface Props { coinId: CoinId; data: CryptoPriceHistory[]; loading: boolean; onChange: (coin: CoinId) => void }

const labels: Record<CoinId, string> = { bitcoin: 'Bitcoin', ethereum: 'Ethereum', solana: 'Solana' };

export function PriceChart({ coinId, data, loading, onChange }: Props) {
  const chartData = useMemo(() => data.map((item) => ({ ...item, label: item.recorded_at })), [data]);

  const formatAxisDate = (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatTooltipDate = (value: string) => new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <section className="chart-panel">
      <div className="panel-heading"><div><p className="eyebrow">PRICE HISTORY</p><h2>{labels[coinId]} performance</h2></div><select value={coinId} onChange={(e) => onChange(e.target.value as CoinId)} aria-label="Select cryptocurrency">{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
      <div className="chart-area">
        {loading ? <div className="chart-loading"><span className="spinner" /> Loading history...</div> : data.length === 0 ? <div className="empty-state"><div className="empty-icon">⌁</div><p>No history available yet</p><span>Price records will appear here as the market is collected.</span></div> : (
          <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf4" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8993a5', fontSize: 11 }} minTickGap={28} tickFormatter={formatAxisDate} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8993a5', fontSize: 11 }} width={72} tickFormatter={(value) => `$${Number(value).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })}`} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ border: 0, borderRadius: 12, boxShadow: '0 8px 24px rgba(21,31,52,.14)' }} labelStyle={{ color: '#8993a5', fontSize: 12 }} labelFormatter={(value) => formatTooltipDate(String(value))} formatter={(value) => [`$ ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`, 'Price']} />
            <Line type="monotone" dataKey="price" stroke="#635bff" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#635bff', stroke: '#fff', strokeWidth: 3 }} />
          </LineChart></ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
