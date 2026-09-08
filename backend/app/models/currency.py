from datetime import datetime 
from sqlalchemy import Column, DateTime, Float, Integer, String 
from app.database.base import Base

class ExchangeRateHistory(Base):
  __tablename__ = "ExchangeRateHistory"

  id = Column(Integer, primary_key=True)
  base = Column(String(3), nullable=False)
  target = Column(String(3), nullable=False)
  rate = Column(Float, nullable=False)
  recorded_at = Column(DateTime, nullable=False)