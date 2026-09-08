import type { ExchangeRate } from '../types/market';
import { CurrencyPairLogo } from './Logos';

interface Props {
  base: string;
  target: string;
  data?: ExchangeRate;
  loading?: boolean;
}

export function CurrencyCard({ base, target, data, loading }: Props) {
  return (
    <article className="currency-card">
      <div className="currency-label">
        <CurrencyPairLogo base={base} target={target} />
        <span>{base} / {target}</span>
      </div>

      {loading ? (
        <div className="skeleton currency-skeleton" />
      ) : (
        <div className="currency-value">
          {data
            ? data.rate.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })
            : '—'}
        </div>
      )}

      <span className="currency-caption">1 {base} in {target}</span>
    </article>
  );
}
