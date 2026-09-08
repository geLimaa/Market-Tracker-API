# MarketTracker

MarketTracker is a market tracking dashboard for cryptocurrencies and foreign exchange rates.

The application collects market data from external APIs, stores historical information in PostgreSQL, provides a REST API through FastAPI, and displays the data through a React dashboard.

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
* Automatic data collection every 15 minutes
* In-memory API caching
* Automatic deletion of data older than 30 days
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

### Backend

* Python
* FastAPI
* HTTPX
* SQLAlchemy
* Pydantic
* Alembic
* PostgreSQL

### APIs

* CoinGecko
* Frankfurter

### Testing

* Pytest
* Pytest-asyncio

## Architecture

```text
                    ┌─────────────────┐
                    │   React + Vite  │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     FastAPI     │
                    │     Backend     │
                    └───────┬─┬───────┘
                            │ │
              ┌─────────────┘ └─────────────┐
              ▼                             ▼
      ┌───────────────┐             ┌───────────────┐
      │  PostgreSQL   │             │ External APIs │
      │   Database    │             │ CoinGecko /   │
      │               │             │ Frankfurter   │
      └───────────────┘             └───────────────┘
```

The backend periodically collects market data and stores it in PostgreSQL. The frontend consumes the REST API to display current and historical data.

## Project Structure

```text
MarketTracker/
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

## Backend Setup

Clone the repository:

```bash
git clone <repository-url>
cd MarketTracker/backend
```

Create a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://markettracker:markettracker@localhost:5433/markettracker
```

## Database

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Run the database migrations:

```bash
alembic upgrade head
```

## Running the Backend

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

## API Endpoints

### Cryptocurrency

```text
GET /crypto/{coin_id}
GET /crypto/{coin_id}/history
```

Example:

```text
GET /crypto/bitcoin
```

### Exchange Rates

```text
GET /currency/{base}/{target}
GET /currency/{base}/{target}/history
```

Example:

```text
GET /currency/USD/BRL
```

## Automatic Data Collection

The backend includes a background collector that runs every 15 minutes.

It collects:

* Bitcoin
* Ethereum
* Solana
* USD/BRL
* EUR/BRL

Collected data is stored in PostgreSQL and can later be retrieved through the historical endpoints.

Records older than 30 days are automatically removed.

## Cache

The API uses an in-memory cache to avoid unnecessary requests to external APIs.

Cached data has a limited lifetime and is automatically refreshed after expiration.

## Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
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

The frontend will be available at the URL provided by Vite.

## Testing

From the backend directory:

```bash
pytest
```

The tests cover components such as:

* Cache behavior
* CoinGecko API client
* Frankfurter API client

## Deployment

The application is designed to be deployed as separate frontend and backend services.

Environment variables should be configured through the hosting provider rather than committed to the repository.

The production frontend should use the deployed backend URL:

```env
VITE_API_URL=https://your-backend-url
```

The production backend should use the PostgreSQL connection string provided by the hosting provider:

```env
DATABASE_URL=your-production-database-url
```

## License

This project is for educational and portfolio purposes.
