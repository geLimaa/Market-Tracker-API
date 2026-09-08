import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { CryptoCard } from './components/CryptoCard';
import { CurrencyCard } from './components/CurrencyCard';
import { PriceChart } from './components/PriceChart';
import { ExchangeChart } from './components/ExchangeChart';
import { getCryptoHistory, getCryptoPrice, getExchangeHistory, getExchangeRate } from './services/api';
import type { CoinId, CryptoPrice, CryptoPriceHistory, ExchangeRate, ExchangeRateHistory } from './types/market';

const coins: CoinId[] = ['bitcoin', 'ethereum', 'solana'];

function App() {
  const [crypto, setCrypto] = useState<Record<string, CryptoPrice>>({});
  const [rates, setRates] = useState<Record<string, ExchangeRate>>({});
  const [selectedCoin, setSelectedCoin] = useState<CoinId>('bitcoin');
  const [history, setHistory] = useState<CryptoPriceHistory[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR'>('USD');
  const [exchangeHistory, setExchangeHistory] = useState<ExchangeRateHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [exchangeHistoryLoading, setExchangeHistoryLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadMarketData = useCallback(async () => {
    try {
      setError(false);
      const [bitcoin, ethereum, solana, usd, eur] = await Promise.all([
        getCryptoPrice('bitcoin'), getCryptoPrice('ethereum'), getCryptoPrice('solana'),
        getExchangeRate('USD', 'BRL'), getExchangeRate('EUR', 'BRL'),
      ]);
      setCrypto({ bitcoin, ethereum, solana });
      setRates({ USD: usd, EUR: eur });
    } catch { setError(true); } finally { setLoading(false); }
  }, []);

  const loadHistory = useCallback(async (coin: CoinId) => {
    setHistoryLoading(true);
    try { setHistory(await getCryptoHistory(coin)); } catch { setHistory([]); } finally { setHistoryLoading(false); }
  }, []);

  const loadExchangeHistory = useCallback(async (currency: 'USD' | 'EUR') => {
    setExchangeHistoryLoading(true);
    try { setExchangeHistory(await getExchangeHistory(currency, 'BRL')); } catch { setExchangeHistory([]); } finally { setExchangeHistoryLoading(false); }
  }, []);

  useEffect(() => { loadMarketData(); const timer = window.setInterval(loadMarketData, 60000); return () => window.clearInterval(timer); }, [loadMarketData]);
  useEffect(() => { loadHistory(selectedCoin); }, [selectedCoin, loadHistory]);
  useEffect(() => { loadExchangeHistory(selectedCurrency); }, [selectedCurrency, loadExchangeHistory]);

  return <div className="app-shell"><Header /><main>
    {error && <div className="error-banner"><span>!</span><div><strong>Unable to load market data.</strong><p>Check that the API is running, then try again.</p></div><button onClick={loadMarketData}>Retry</button></div>}
    <div className="intro"><div><p className="eyebrow">OVERVIEW</p><h1>Good morning, investor.</h1><p className="subheading">Keep an eye on the markets that matter to you.</p></div><div className="updated"><span className="pulse" /> Updates every 60 seconds</div></div>
    <section><div className="section-title"><h2>Cryptocurrencies</h2><span>USD market prices</span></div><div className="crypto-grid">{coins.map((coin) => <CryptoCard key={coin} coinId={coin} data={crypto[coin]} loading={loading} />)}</div></section>
    <section className="currency-section"><div className="section-title"><h2>Exchange rates</h2><span>Brazilian real</span></div><div className="currency-grid"><CurrencyCard base="USD" target="BRL" data={rates.USD} loading={loading} /><CurrencyCard base="EUR" target="BRL" data={rates.EUR} loading={loading} /></div></section>
    <PriceChart coinId={selectedCoin} data={history} loading={historyLoading} onChange={setSelectedCoin} />
    <ExchangeChart currency={selectedCurrency} data={exchangeHistory} loading={exchangeHistoryLoading} onChange={setSelectedCurrency} />
  </main><footer><span>MarketTracker</span><span>Data provided by your market API</span></footer></div>;
}

export default App;
