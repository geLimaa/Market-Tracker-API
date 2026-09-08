from pydantic import BaseModel
from datetime import datetime

class CryptoPrice(BaseModel):
  symbol: str
  price: float
  change_24h: float
  currency: str

class CryptoPriceHistory(BaseModel):
  symbol: str
  price: float
  change_24h: float
  currency: str
  recorded_at: datetime
 