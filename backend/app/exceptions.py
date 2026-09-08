class CoinGeckoError(Exception):
  pass

class CoinGeckoTimeoutError(CoinGeckoError):
  pass

class CoinGeckoRateLimitError(CoinGeckoError):
  pass

class CoinGeckoAPIError(CoinGeckoError):
  pass

class FrankfurterError(Exception):
  pass

class FrankfurterTimeoutError(CoinGeckoError):
  pass

class FrankfurterRateLimitError(CoinGeckoError):
  pass

class FrankfurterAPIError(CoinGeckoError):
  pass