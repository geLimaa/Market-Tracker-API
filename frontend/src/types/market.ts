export type CoinId = 'bitcoin' | 'ethereum' | 'solana';

export interface CryptoPrice {
  symbol: string;
  price: number;
  change_24h: number;
  currency: string;
}

export interface CryptoPriceHistory extends CryptoPrice {
  recorded_at: string;
}

export interface ExchangeRate {
  base: string;
  target: string;
  rate: number;
}

export interface ExchangeRateHistory extends ExchangeRate {
  recorded_at: string;
}
