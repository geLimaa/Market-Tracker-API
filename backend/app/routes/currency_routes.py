from fastapi import APIRouter, HTTPException, Depends

from typing import List
from sqlalchemy.orm import Session 
from app.database.connection import get_session
from app.services.currency_history import save_exchange_rate, get_exchange_rate_history
from app.services.cache import cache
from app.schemas.currency import ExchangeRate, ExchangeRateHistory
from app.services.frankfurter import FrankfurterClient
from app.exceptions import FrankfurterTimeoutError, FrankfurterRateLimitError, FrankfurterAPIError

currency_router = APIRouter(prefix="/api/v1/currency", tags=["Currency"])

client = FrankfurterClient()

@currency_router.get("/{base}/{target}", response_model=ExchangeRate)
async def get_exchange_rate(base: str, target: str, session: Session=Depends(get_session)):

    base = base.upper()
    target = target.upper()

    key = f"currency:{base}:{target}"
    cached_data = cache.get(key)

    if cached_data is not None:
      return cached_data

    try:
      data = await client.get_rate(base.upper(), target.upper())
      rate = data["rates"][target.upper()]

      result = ExchangeRate(
        base=data["base"],
        target=target.upper(),
        rate=rate
      )

      save_exchange_rate(
        session=session,
        base=data["base"],
        target=target.upper(),
        rate=rate
      )

      cache.set(key, result)
      return result

    except FrankfurterTimeoutError:
      raise HTTPException(
        status_code=503,
        detail="Frankfurter request timed out"
      )

    except FrankfurterRateLimitError:
      raise HTTPException(
        status_code=429,
        detail="Frankfurter rate limit exceeded"
      )
    
    except FrankfurterAPIError:
      raise HTTPException(
        status_code=503,
        detail="Frankfurter is currently unavailable"
      )

@currency_router.get("/{base}/{target}/history", response_model=list[ExchangeRateHistory])
async def get_exchange_rate_history_endpoint(base: str, target: str, session: Session=Depends(get_session)):
  
  base = base.upper()
  target = target.upper()
  
  history = get_exchange_rate_history(session, base, target)

  return history