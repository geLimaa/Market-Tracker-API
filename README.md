# Market Tracker

Market Tracker is a market tracking dashboard for cryptocurrencies and foreign exchange rates.

The application collects market data from external APIs, stores historical information in PostgreSQL, exposes a REST API through FastAPI, and displays the data through a React dashboard.

**Live demo:** https://market-tracker-api.netlify.app/
**Repository:** https://github.com/geLimaa/Market-Tracker-API

> This project is deployed and does not need to be run locally to be used. The sections below describe the live architecture; local setup instructions are included at the end for anyone who wants to run their own instance.

## Features

* Cryptocurrency price tracking
  * Bitcoin (BTC)
  * Ethereum (ETH)
  * Solana (SOL)
* Cryptocurrency 24-hour price changes
* Foreign exchange rates
  * USD/BRL
  * EUR/BRL
* Historical market data
* In-memory API caching to reduce external API calls
* Responsive React dashboard
* REST API
* PostgreSQL persistence
* Database migrations with Alembic
* Automated tests with pytest

## Technologies

### Frontend

* React
* TypeScript
* Vite
* Deployed on Netlify

### Backend

* Python
* FastAPI
* HTTPX
* SQLAlchemy
* Pydantic
* Alembic
* Deployed on Render

### Database

* PostgreSQL, hosted on Neon

### External APIs

* CoinGecko (cryptocurrency prices)
* Frankfurter (exchange rates)

### Testing

* Pytest
* Pytest-asyncio

## Architecture

```text
                    ┌─────────────────┐
                    │   React + Vite  │
                    │   (Netlify)     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     FastAPI     │
                    │    (Render)     │
                    └───────┬─┬───────┘
                            │ │
              ┌─────────────┘ └─────────────┐
              ▼                             ▼
      ┌───────────────┐             ┌───────────────┐
      │  PostgreSQL   │             │ External APIs │
      │    (Neon)     │             │ CoinGecko /   │
      │               │             │  Frankfurter  │
      └───────────────┘             └───────────────┘
```

The backend periodically collects market data and stores it in PostgreSQL. The frontend consumes the REST API to display current and historical data.

## Project Structure

```text
Market-Tracker-API/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   ├── tests.py
│   ├── alembic.ini
│   ├── docker-compose.yml
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── .gitignore
```

## API Reference

Base URL: `https://market-tracker-api.onrender.com`

### Cryptocurrency

```text
GET /api/v1/crypto/
GET /api/v1/crypto/{coin_id}
GET /api/v1/crypto/{coin_id}/history
```

Example:

```text
GET /api/v1/crypto/bitcoin
```

### Exchange Rates

```text
GET /api/v1/currency/{base}/{target}
GET /api/v1/currency/{base}/{target}/history
```

Example:

```text
GET /api/v1/currency/USD/BRL
```

Interactive API documentation (Swagger UI) is available at `/docs` on the backend URL.

## Caching and Rate Limiting

The API uses an in-memory cache to avoid unnecessary requests to external APIs. Cached data has a limited lifetime and is refreshed automatically after expiration.

Requests to CoinGecko are authenticated with a Demo API key, which gives the backend a dedicated request quota instead of relying on shared-IP rate limits from the hosting provider.

## Testing

From the backend directory:

```bash
pytest
```

Tests cover components such as:

* Cache behavior
* CoinGecko API client
* Frankfurter API client

## Running Locally

The project is designed to run as deployed, but it can also be run locally for development.

### Backend

```bash
git clone https://github.com/geLimaa/Market-Tracker-API
cd Market-Tracker-API/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://markettracker:markettracker@localhost:5433/markettracker
COINGECKO_API_KEY=your-coingecko-demo-api-key
```

Start PostgreSQL with Docker and run migrations:

```bash
docker compose up -d
alembic upgrade head
```

Start the server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```
