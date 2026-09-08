import asyncio
from app.database.connection import SessionLocal
from app.services.crypto_history import save_crypto_price, delete_old_crypto_history
from app.services.currency_history import save_exchange_rate, delete_old_exchange_rate_history
from app.services.coingecko import CoinGeckoClient
from app.services.frankfurter import FrankfurterClient

SUPPORTED_COINS = [
  "bitcoin",
  "ethereum",
  "solana"
]

SUPPORTED_CURRENCIES = [
    ("USD", "BRL"),
    ("EUR", "BRL"),
]

coingecko = CoinGeckoClient()
frankfurter = FrankfurterClient()

async def collect_crypto():

  session = SessionLocal()

  try:
    
    data = await coingecko.get_prices(SUPPORTED_COINS)
    for coin in SUPPORTED_COINS:
      
      coin_data = data[coin]

      save_crypto_price(
        session=session,
        symbol=coin.upper(),
        price=coin_data["usd"],
        change_24h=coin_data["usd_24h_change"],
        currency="USD"
      )
      
      print(f"{coin.upper()}: ${coin_data['usd']}")  
  
  finally:
    session.close()

async def collect_currency():

  session = SessionLocal()

  try:
    for base, target in SUPPORTED_CURRENCIES:

      data = await frankfurter.get_rate(base, target)
      rate = data["rates"][target]

      save_exchange_rate(
        session=session,
        base=base,
        target=target,
        rate=rate
      )

      print(f"{base}/{target}: "f"{rate}")

  finally:
    session.close()

async def collect_market_data():
    
  while True:
    await collect_crypto()
    await collect_currency()

    session = SessionLocal()

    try:
      delete_old_crypto_history(session)
      delete_old_exchange_rate_history(session)
    finally:
      session.close()
      
    await asyncio.sleep(900)