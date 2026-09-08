from fastapi import APIRouter, HTTPException, Depends

import asyncio
from typing import List
from sqlalchemy.orm import Session
from app.database.connection import get_session
from app.services.crypto_history import save_crypto_price, get_crypto_history
from app.services.collector import SUPPORTED_COINS
from app.services.cache import cache
from app.schemas.crypto import CryptoPrice, CryptoPriceHistory
from app.services.coingecko import CoinGeckoClient
from app.exceptions import CoinGeckoTimeoutError, CoinGeckoRateLimitError, CoinGeckoAPIError

crypto_router = APIRouter(prefix="/api/v1/crypto", tags=["Crypto"])

client = CoinGeckoClient()

@crypto_router.get("/", response_model=list[CryptoPrice])
async def get_crypto_prices():

  key = "crypto:all"
  cached_data = cache.get(key)

  if cached_data is not None:
    return cached_data

  try:
    data = await client.get_prices(SUPPORTED_COINS)

    prices = []
    for coin_id in SUPPORTED_COINS:
      coin_data = data[coin_id]

      prices.append(
        CryptoPrice(
          symbol=coin_id.upper(),
          price=coin_data["usd"],
          change_24h=coin_data["usd_24h_change"],
          currency="USD"
        )
      )

    cache.set(key, prices)
    return prices

  except CoinGeckoTimeoutError:
    raise HTTPException(
      status_code=503,
      detail="CoinGecko request timed out"
    )

  except CoinGeckoRateLimitError:
    raise HTTPException(
      status_code=429,
      detail="CoinGecko rate limit exceeded"
    )

  except CoinGeckoAPIError:
    raise HTTPException(
      status_code=503,
      detail="CoinGecko is currently unavailable"
    )

@crypto_router.get("/{coin_id}", response_model=CryptoPrice)
async def get_crypto_price(coin_id: str, session: Session=Depends(get_session)):

    if coin_id not in SUPPORTED_COINS:
      raise HTTPException(
        status_code=404,
        detail="Invalid Cryptocurrency"
      )
      
    key = f"crypto:{coin_id}"
    cached_data = cache.get(key)

    if cached_data is not None:
      return cached_data

    try:
      data = await client.get_prices(SUPPORTED_COINS)
      coin_data = data[coin_id]

      result = CryptoPrice(
        symbol=coin_id.upper(),
        price=coin_data["usd"],
        change_24h=coin_data["usd_24h_change"],
        currency="USD"
      )

      save_crypto_price(
        session=session,
        symbol=coin_id.upper(),
        price=coin_data["usd"],
        change_24h=coin_data["usd_24h_change"],
        currency="USD"
      )

      cache.set(key, result)

      return result

    except CoinGeckoTimeoutError:
      raise HTTPException(
        status_code=503,
        detail="CoinGecko request timed out"
      )

    except CoinGeckoRateLimitError:
      raise HTTPException(
        status_code=429,
        detail="CoinGecko rate limit exceeded"
      )

    except CoinGeckoAPIError:
      raise HTTPException(
        status_code=503,
        detail="CoinGecko is currently unavailable"
      )

@crypto_router.get("/{coin_id}/history", response_model=List[CryptoPriceHistory])
async def get_crypto_history_endpoint(coin_id: str, session: Session=Depends(get_session)):
  
  if coin_id not in SUPPORTED_COINS:
    raise HTTPException(
      status_code=404,
      detail="Cryptocurrency not supported"
    )
  
  history = get_crypto_history(session, coin_id.upper())

  return history