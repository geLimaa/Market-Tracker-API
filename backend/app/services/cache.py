from datetime import datetime, timezone, timedelta

class Cache:
  # ttl = time to live = 60s
  def __init__(self, ttl: int=60):
    self.data = {}
    self.ttl = ttl

  def set(self, key: str, value):
    self.data[key] = (value, datetime.now(timezone.utc))

  def get(self, key:str):
    if key not in self.data:
      print(f"CACHE MISS: {key}")
      return None 
    
    value, created_at = self.data[key]

    if datetime.now(timezone.utc) - created_at > timedelta(seconds=self.ttl):
      print(f"CACHE EXPIRED: {key}")
      del self.data[key]
      return None 
      
    print(f"CACHE HIT: {key}")
    return value

cache = Cache(ttl=60)