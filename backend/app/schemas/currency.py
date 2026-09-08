from pydantic import BaseModel
from datetime import datetime

class ExchangeRate(BaseModel):
  base: str
  target: str
  rate: float

class ExchangeRateHistory(BaseModel):
  base: str
  target: str
  rate: float
  recorded_at: datetime
  