import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ExchangeRateHistory } from '../types/market';

type CurrencyId = 'USD' | 'EUR';

interface Props { currency: CurrencyId; data: ExchangeRateHistory[]; loading: boolean; onChange: (currency: CurrencyId) => void }

const labels: Record<CurrencyId, string> = { USD: 'USD / BRL', EUR: 'EUR / BRL' };

export function ExchangeChart({ currency, data, loading, onChange }: Props) {
  const chartData = useMemo(() => data.map((item) => ({ ...item, label: item.recorded_at })), [data]);
  const formatAxisDate = (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatTooltipDate = (value: string) => new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <section className="chart-panel exchange-chart-panel">
      <div className="panel-heading"><div><p className="eyebrow">EXCHANGE HISTORY</p><h2>{labels[currency]} performance</h2></div><select value={currency} onChange={(event) => onChange(event.target.value as CurrencyId)} aria-label="Select exchange rate">{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
      <div className="chart-area">
        {loading ? <div className="chart-loading"><span className="spinner" /> Loading history...</div> : data.length === 0 ? <div className="empty-state"><div className="empty-icon">⌁</div><p>No history available yet</p><span>Exchange records will appear here as the market is collected.</span></div> : (
          <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf4" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8993a5', fontSize: 11 }} minTickGap={28} tickFormatter={formatAxisDate} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8993a5', fontSize: 11 }} width={62} tickFormatter={(value) => Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ border: 0, borderRadius: 12, boxShadow: '0 8px 24px rgba(21,31,52,.14)' }} labelStyle={{ color: '#8993a5', fontSize: 12 }} labelFormatter={(value) => formatTooltipDate(String(value))} formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`, 'Rate']} />
            <Line type="monotone" dataKey="rate" stroke="#17a673" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#17a673', stroke: '#fff', strokeWidth: 3 }} />
          </LineChart></ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
