import { BrandLogo } from './Logos';

export function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <BrandLogo />
        <div>
          <div className="brand-name">MarketTracker</div>
          <div className="brand-tagline">Market data at a glance</div>
        </div>
      </div>
      <div className="live-status">
        <span className="live-dot" /> Live market data
      </div>
    </header>
  );
}
