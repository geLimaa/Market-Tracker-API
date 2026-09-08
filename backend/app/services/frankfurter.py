import httpx 
from app.exceptions import FrankfurterTimeoutError, FrankfurterRateLimitError, FrankfurterAPIError

class FrankfurterClient:

  BASE_URL = "https://api.frankfurter.dev/v1"

  async def get_rate(self, base: str, target: str):
    url = f"{self.BASE_URL}/latest"

    params = {
      "base": base,
      "symbols": target
    }

    try:
      async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, params=params)
      
      response.raise_for_status() 
      return response.json()

    except httpx.TimeoutException:
      raise FrankfurterTimeoutError()

    except httpx.HTTPStatusError as error:
      if error.response.status_code == 429:
        raise FrankfurterRateLimitError()
      raise FrankfurterAPIError()

    except httpx.HTTPError as error:
      raise FrankfurterAPIError() from error