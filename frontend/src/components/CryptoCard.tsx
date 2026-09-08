import type { CryptoPrice } from '../types/market';
import { CryptoLogo } from './Logos';

const coinMeta: Record<string, { name: string; symbol: string; color: string }> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', color: '#f7931a' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', color: '#627eea' },
  solana: { name: 'Solana', symbol: 'SOL', color: '#8b5cf6' },
};

interface Props { coinId: string; data?: CryptoPrice; loading?: boolean }

export function CryptoCard({ coinId, data, loading }: Props) {
  const meta = coinMeta[coinId];
  const positive = (data?.change_24h ?? 0) >= 0;
  return (
    <article className="market-card">
      <div className="card-heading">
        <div className="coin-icon" style={{ background: `${meta.color}18`, color: meta.color }}><CryptoLogo coinId={coinId as 'bitcoin' | 'ethereum' | 'solana'} /></div>
        <div><h3>{meta.name}</h3><span>{meta.symbol} · USD</span></div>
        <span className="card-menu">•••</span>
      </div>
      {loading ? <div className="skeleton price-skeleton" /> : (
        <div className="price">{data ? `$ ${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</div>
      )}
      <div className={`change ${positive ? 'positive' : 'negative'}`}>
        <span>{positive ? '↗' : '↘'}</span> {data ? `${positive ? '+' : ''}${data.change_24h.toFixed(2)}%` : '—'}
        <small>24h</small>
      </div>
    </article>
  );
}
