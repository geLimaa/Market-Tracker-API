import type {
  CoinId,
  CryptoPrice,
  CryptoPriceHistory,
  ExchangeRate,
  ExchangeRateHistory,
} from '../types/market';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getCryptoPrice(coinId: CoinId) {
  return get<CryptoPrice>(`/crypto/${coinId}`);
}

export function getCryptoHistory(coinId: CoinId) {
  return get<CryptoPriceHistory[]>(`/crypto/${coinId}/history`);
}

export function getExchangeRate(base: string, target: string) {
  return get<ExchangeRate>(`/currency/${base}/${target}`);
}

export function getExchangeHistory(base: string, target: string) {
  return get<ExchangeRateHistory[]>(`/currency/${base}/${target}/history`);
}
