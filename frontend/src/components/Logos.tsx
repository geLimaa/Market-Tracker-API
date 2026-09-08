interface CryptoLogoProps {
  coinId: 'bitcoin' | 'ethereum' | 'solana';
  size?: number;
}

export function CryptoLogo({ coinId, size = 36 }: CryptoLogoProps) {
  if (coinId === 'bitcoin') {
    return (
      <svg
        className="asset-logo crypto-logo bitcoin-logo"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        role="img"
        aria-label="Bitcoin"
      >
        <circle cx="20" cy="20" r="19" fill="currentColor" />
        <path
          d="M24.8 10.6c3.8.9 5.4 3.2 4.6 6.1-.4 1.5-1.3 2.5-2.6 3.1 2.3 1 3.2 2.8 2.6 5.2-.8 3.2-3.5 4.7-7.2 4.1l-.7 3.2-2.6-.6.7-3-2.1-.5-.7 3-2.6-.6.7-3-2.2-.5.6-2.6 2.2.5 3.1-12.8-2.2-.5.6-2.6 2.2.5.7-3 2.6.6-.7 3.1 2.1.5.7-3.1 2.6.6-.7 3.2Zm-5.1 10.2-.9 3.8 3.7.9c1.7.4 2.9-.1 3.3-1.5.4-1.4-.4-2.3-2.1-2.7l-4-.5Zm1.3-5.4-.8 3.2 3.3.8c1.5.4 2.5-.1 2.8-1.3.3-1.2-.4-2-1.9-2.4l-3.4-.3Z"
          fill="white"
        />
      </svg>
    );
  }

  if (coinId === 'ethereum') {
    return (
      <svg
        className="asset-logo crypto-logo ethereum-logo"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        role="img"
        aria-label="Ethereum"
      >
        <circle cx="20" cy="20" r="19" fill="currentColor" />
        <path
          d="m20 5.5-9.2 15 9.2 5.4 9.2-5.4L20 5.5Zm0 22.5-9.2-5.4L20 35l9.2-12.4L20 28Z"
          fill="white"
          opacity=".95"
        />
        <path
          d="m20 5.5-9.2 15L20 17V5.5Zm0 22.5-9.2-5.4L20 35v-7Z"
          fill="white"
          opacity=".65"
        />
      </svg>
    );
  }

  return (
    <svg
      className="asset-logo crypto-logo solana-logo"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Solana"
    >
      <defs>
        <linearGradient
          id="solana-gradient"
          x1="5"
          y1="34"
          x2="35"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9945ff" />
          <stop offset=".5" stopColor="#14f195" />
          <stop offset="1" stopColor="#00c2ff" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="#101827" />
      <path
        d="M10 13.5c.5-.8 1.2-1.2 2.1-1.2h17.7c.9 0 1.3 1.1.7 1.7l-2.5 2.5c-.5.5-1.2.8-2 .8H8.3c-.9 0-1.3-1.1-.7-1.7l2.4-2.1Zm0 10.7c.5-.5 1.2-.8 2-.8h17.7c.9 0 1.3 1.1.7 1.7l-2.5 2.5c-.5.8-1.2 1.2-2.1 1.2H8.3c-.9 0-1.3-1.1-.7-1.7l2.4-2.9Zm0-5.3c.5-.8 1.2-1.2 2.1-1.2h17.7c.9 0 1.3 1.1.7 1.7L28 21.9c-.5.5-1.2.8-2 .8H8.3c-.9 0-1.3-1.1-.7-1.7l2.4-2.1Z"
        fill="url(#solana-gradient)"
      />
    </svg>
  );
}

export function CurrencyPairLogo({ base, target }: { base: string; target: string }) {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', BRL: 'R$' };
  return (
    <span
      className="currency-pair-logo"
      aria-label={`${base} to ${target}`}
    >
      <span className={`currency-symbol currency-${base.toLowerCase()}`}>
        {symbols[base] ?? base}
      </span>
      <span className={`currency-symbol currency-${target.toLowerCase()}`}>
        {symbols[target] ?? target}
      </span>
    </span>
  );
}

export function BrandLogo() {
  return (
    <svg
      className="brand-logo"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      role="img"
      aria-label="MarketTracker"
    >
      <rect width="36" height="36" rx="11" fill="#635bff" />
      <path
        d="M8 24.5 13.2 18l4.1 3.5 7.2-9"
        fill="none"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24.5" cy="12.5" r="2.4" fill="#a8ffdc" />
    </svg>
  );
}
