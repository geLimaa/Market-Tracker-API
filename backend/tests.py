import pytest
import httpx

from app.services.cache import Cache
from app.services.coingecko import CoinGeckoClient
from app.services.frankfurter import FrankfurterClient

def test_cache_miss():
    cache = Cache(ttl=60)

    assert cache.get("bitcoin") is None


def test_cache_hit():
    cache = Cache(ttl=60)

    cache.set("bitcoin", {"price": 100000})

    result = cache.get("bitcoin")

    assert result == {"price": 100000}

@pytest.mark.asyncio
async def test_coingecko_get_price(monkeypatch):
    client = CoinGeckoClient()

    async def mock_get(self, url, params=None):
        request = httpx.Request("GET", url)

        return httpx.Response(
            200,
            json={
                "bitcoin": {
                    "usd": 100000,
                    "usd_24h_change": 2.5
                }
            },
            request=request
        )

    monkeypatch.setattr(
        httpx.AsyncClient,
        "get",
        mock_get
    )

    result = await client.get_price("bitcoin")

    assert result["bitcoin"]["usd"] == 100000
    assert result["bitcoin"]["usd_24h_change"] == 2.5

@pytest.mark.asyncio
async def test_frankfurter_get_rate(monkeypatch):
    client = FrankfurterClient()

    async def mock_get(self, url, params=None):
        request = httpx.Request("GET", url)

        return httpx.Response(
            200,
            json={
                "base": "USD",
                "rates": {
                    "BRL": 5.25
                }
            },
            request=request
        )

    monkeypatch.setattr(
        httpx.AsyncClient,
        "get",
        mock_get
    )

    result = await client.get_rate("USD", "BRL")

    assert result["base"] == "USD"
    assert result["rates"]["BRL"] == 5.25