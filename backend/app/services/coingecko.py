import httpx
from app.exceptions import CoinGeckoTimeoutError, CoinGeckoRateLimitError, CoinGeckoAPIError

class CoinGeckoClient:

  BASE_URL = "https://api.coingecko.com/api/v3"

  async def get_price(self, coin_id: str):
    url = f"{self.BASE_URL}/simple/price"

    params = {
      "ids": coin_id,
      "vs_currencies": "usd",
      "include_24hr_change": "true"
    }

    try:
      async with httpx.AsyncClient(timeout=10.0) as client:
        print(f"COINGECKO REQUEST: {coin_id}")

        response = await client.get(url, params=params)

        print(f"COINGECKO RESPONSE: {coin_id} -> {response.status_code}")

      response.raise_for_status() # error threat
      return response.json()

    except httpx.TimeoutException:
      raise CoinGeckoTimeoutError()

    except httpx.HTTPStatusError as error:
      if error.response.status_code == 429:
        raise CoinGeckoRateLimitError()
      raise CoinGeckoAPIError()

    except httpx.HTTPError as error:
      raise CoinGeckoAPIError() from error