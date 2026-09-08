import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.services.collector import collect_market_data
from app.routes.crypto_routes import crypto_router
from app.routes.currency_routes import currency_router

@asynccontextmanager
async def lifespan(app: FastAPI):
  
  task = asyncio.create_task(collect_market_data())
  yield
  task.cancel()

app = FastAPI(lifespan=lifespan)

app.include_router(crypto_router)
app.include_router(currency_router)

@app.get("/")
def get_root():
  return {
    "message": "Hello FastAPI!"
  }