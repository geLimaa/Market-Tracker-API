from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.crypto import CryptoPriceHistory

def save_crypto_price(session: Session, symbol: str, price: float, change_24h: float, currency: str):

  history = CryptoPriceHistory(
    symbol=symbol,
    price=price,
    change_24h=change_24h,
    currency=currency,
    recorded_at=datetime.now(timezone.utc)
  )
    
  session.add(history)
  session.commit()

  return history

def get_crypto_history(session: Session, symbol: str):
  
  crypto_history = session.query(CryptoPriceHistory).filter(CryptoPriceHistory.symbol == symbol).order_by(CryptoPriceHistory.recorded_at.asc()).all()

  return crypto_history

def delete_old_crypto_history(session: Session, days: int=30):
  
  limit_date = datetime.now(timezone.utc) - timedelta(days)

  session.query(CryptoPriceHistory).filter(CryptoPriceHistory.recorded_at < limit_date).delete()
  session.commit()
