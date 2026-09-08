from datetime import datetime 
from sqlalchemy import Column, DateTime, Float, Integer, String 
from app.database.base import Base 

class CryptoPriceHistory(Base):
  __tablename__ =  "CryptoPriceHistory"

  id = Column(Integer, primary_key=True)
  symbol = Column(String(10), nullable=False)
  price = Column(Float, nullable=False)
  change_24h = Column(Float, nullable=False)
  currency = Column(String(3), nullable=False)
  recorded_at = Column(DateTime, nullable=False)