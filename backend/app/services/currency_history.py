from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.currency import ExchangeRateHistory

def save_exchange_rate(session: Session, base: str, target: str, rate: float):
  
  history = ExchangeRateHistory(
    base=base,
    target=target,
    rate=rate,
    recorded_at=datetime.now(timezone.utc)
  )
    
  session.add(history)
  session.commit()

  return history

def get_exchange_rate_history(session: Session, base: str, target: str):
  
  exchange_rate_history = session.query(ExchangeRateHistory).filter(ExchangeRateHistory.base == base, ExchangeRateHistory.target == target).order_by(ExchangeRateHistory.recorded_at.asc()).all()

  return exchange_rate_history 

def delete_old_exchange_rate_history(session: Session, days: int=30):
  
  limit_date = datetime.now(timezone.utc) - timedelta(days)

  session.query(ExchangeRateHistory).filter(ExchangeRateHistory.recorded_at < limit_date).delete()
  session.commit()