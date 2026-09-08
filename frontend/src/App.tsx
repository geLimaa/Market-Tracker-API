import { useEffect, useState } from 'react';
import { CryptoCard } from './components/CryptoCard';
import { CurrencyCard } from './components/CurrencyCard';
import { ExchangeChart } from './components/ExchangeChart';
import { Header } from './components/Header';
import { PriceChart } from './components/PriceChart';
import {
  getCryptoHistory,
  getCryptoPrices,
  getExchangeHistory,
  getExchangeRate,
} from './services/api';
import type {
  CoinId,
  CryptoPrice,
  CryptoPriceHistory,
  ExchangeRate,
  ExchangeRateHistory,
} from './types/market';

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

  async function loadMarketData() {
    try {
      setError(false);

      const [cryptos, usd, eur] = await Promise.all([
        getCryptoPrices(),
        getExchangeRate('USD', 'BRL'),
        getExchangeRate('EUR', 'BRL'),
      ]);

      setCrypto({
        bitcoin: cryptos.find(coin => coin.symbol === 'BITCOIN')!,
        ethereum: cryptos.find(coin => coin.symbol === 'ETHEREUM')!,
        solana: cryptos.find(coin => coin.symbol === 'SOLANA')!,
      });      
      setRates({ USD: usd, EUR: eur });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(coin: CoinId) {
    setHistoryLoading(true);

    try {
      const result = await getCryptoHistory(coin);
      setHistory(result);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function loadExchangeHistory(currency: 'USD' | 'EUR') {
    setExchangeHistoryLoading(true);

    try {
      const result = await getExchangeHistory(currency, 'BRL');
      setExchangeHistory(result);
    } catch {
      setExchangeHistory([]);
    } finally {
      setExchangeHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadMarketData();

    const timer = window.setInterval(loadMarketData, 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    loadHistory(selectedCoin);
  }, [selectedCoin]);

  useEffect(() => {
    loadExchangeHistory(selectedCurrency);
  }, [selectedCurrency]);

  return (
    <div className="app-shell">
      <Header />

      <main>
        {error && (
          <div className="error-banner">
            <span>!</span>
            <div>
              <strong>Unable to load market data.</strong>
              <p>Check that the API is running, then try again.</p>
            </div>
            <button onClick={loadMarketData}>Retry</button>
          </div>
        )}

        <div className="intro">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Good morning, investor.</h1>
            <p className="subheading">
              Keep an eye on the markets that matter to you.
            </p>
          </div>
          <div className="updated">
            <span className="pulse" /> Updates every 60 seconds
          </div>
        </div>

        <section>
          <div className="section-title">
            <h2>Cryptocurrencies</h2>
            <span>USD market prices</span>
          </div>

          <div className="crypto-grid">
            {coins.map((coin) => (
              <CryptoCard
                key={coin}
                coinId={coin}
                data={crypto[coin]}
                loading={loading}
              />
            ))}
          </div>
        </section>

        <section className="currency-section">
          <div className="section-title">
            <h2>Exchange rates</h2>
            <span>Brazilian real</span>
          </div>

          <div className="currency-grid">
            <CurrencyCard
              base="USD"
              target="BRL"
              data={rates.USD}
              loading={loading}
            />
            <CurrencyCard
              base="EUR"
              target="BRL"
              data={rates.EUR}
              loading={loading}
            />
          </div>
        </section>

        <PriceChart
          coinId={selectedCoin}
          data={history}
          loading={historyLoading}
          onChange={setSelectedCoin}
        />
        <ExchangeChart
          currency={selectedCurrency}
          data={exchangeHistory}
          loading={exchangeHistoryLoading}
          onChange={setSelectedCurrency}
        />
      </main>

      <footer>
        <span>MarketTracker</span>
        <span>Data provided by your market API</span>
      </footer>
    </div>
  );
}

export default App;
