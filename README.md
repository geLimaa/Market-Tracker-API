# MarketTracker

MarketTracker is a market dashboard for monitoring cryptocurrency prices and foreign exchange rates.

The project provides a FastAPI backend that collects market data from external APIs, stores historical data in PostgreSQL, and exposes REST endpoints for the frontend.

## Features

* Cryptocurrency prices

  * Bitcoin (BTC)
  * Ethereum (ETH)
  * Solana (SOL)
* 24-hour cryptocurrency price change
* Foreign exchange rates

  * USD/BRL
  * EUR/BRL
* Historical market data
* In-memory cache
* Automatic data collection every 15 minutes
* Automatic deletion of records older than 30 days
* REST API
* PostgreSQL database
* Database migrations with Alembic
* Automated tests with Pytest

## Technologies

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* PostgreSQL
* Alembic
* HTTPX
* Pytest
* Docker

## Architecture

```text
Frontend
    |
    v
FastAPI
    |
    +---- CoinGecko API
    |
    +---- Frankfurter API
    |
    +---- PostgreSQL
```

The backend is responsible for fetching external market data, storing historical records, and providing the data through REST endpoints.

## External APIs

### CoinGecko

Used to retrieve cryptocurrency prices and 24-hour price changes.

### Frankfurter

Used to retrieve foreign exchange rates.

## Project Structure

```text
backend/
├── app/
│   ├── database/
│   │   ├── base.py
│   │   └── connection.py
│   │
│   ├── models/
│   │   ├── crypto.py
│   │   └── currency.py
│   │
│   ├── routes/
│   │   ├── crypto_routes.py
│   │   └── currency_routes.py
│   │
│   ├── schemas/
│   │   ├── crypto.py
│   │   └── currency.py
│   │
│   ├── services/
│   │   ├── cache.py
│   │   ├── collector.py
│   │   ├── coingecko.py
│   │   ├── crypto_history.py
│   │   ├── frankfurter.py
│   │   └── currency_history.py
│   │
│   └── main.py
│
├── alembic/
├── tests.py
├── alembic.ini
└── docker-compose.yml
```

## Requirements

* Python 3.12+
* Docker
* Docker Compose

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd MarketTracker/backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Linux:

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the `backend` directory.

Example:

```env
DATABASE_URL=postgresql://markettracker:markettracker@localhost:5433/markettracker
```

The `.env` file should not be committed to the repository.

Add it to `.gitignore:

```gitignore
.env
.venv/
__pycache__/
.pytest_cache/
```

## Database

Start PostgreSQL with Docker Compose:

```bash
docker compose up -d
```

Run the database migrations:

```bash
alembic upgrade head
```

## Running the API

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --port 8001
```

The API will be available at:

```text
http://localhost:8001
```

Interactive API documentation:

```text
http://localhost:8001/docs
```

## API Endpoints

### Cryptocurrency

Get the current price of a cryptocurrency:

```text
GET /crypto/{coin_id}
```

Example:

```text
GET /crypto/bitcoin
```

Get cryptocurrency history:

```text
GET /crypto/{coin_id}/history
```

Example:

```text
GET /crypto/bitcoin/history
```

### Exchange Rates

Get the current exchange rate:

```text
GET /currency/{base}/{target}
```

Example:

```text
GET /currency/USD/BRL
```

Get exchange rate history:

```text
GET /currency/{base}/{target}/history
```

Example:

```text
GET /currency/USD/BRL/history
```

## Automatic Data Collection

The backend includes a background collector that runs every 15 minutes.

It collects:

* BTC, ETH and SOL prices
* USD/BRL exchange rate
* EUR/BRL exchange rate

The collected data is stored in PostgreSQL and can be accessed through the history endpoints.

Records older than 30 days are automatically removed.

## Cache

The API uses an in-memory cache to reduce unnecessary requests to external APIs.

Cached values expire after 60 seconds.

The cache is stored in application memory, so it is cleared whenever the backend is restarted.

## Running Tests

Run the tests with:

```bash
pytest tests.py -v
```

The tests cover the cache and the external API clients using mocked HTTP responses.

## Database Management

The project uses Alembic for database migrations.

Create a new migration after changing the models:

```bash
alembic revision --autogenerate -m "description"
```

Apply migrations:

```bash
alembic upgrade head
```

## License

This project was developed for educational and portfolio purposes.

````

### `.env`

No seu caso, **por enquanto é só isso**:

```env
DATABASE_URL=postgresql://markettracker:markettracker@localhost:5433/markettracker
````

Mas tem um detalhe importante: **seu código atual ainda tem a `DATABASE_URL` escrita diretamente no `connection.py`**. Se você vai colocar no GitHub, eu recomendo fazer essa pequena mudança antes.

Em vez de:

```python
DATABASE_URL = "postgresql://markettracker:markettracker@localhost:5433/markettracker"
```

usar:

```python
import os

DATABASE_URL = os.getenv("DATABASE_URL")
```

E aí o `.env` precisa ser carregado. Se você já usa `python-dotenv`, pode fazer:

```python
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
```

E instalar:

```bash
pip install python-dotenv
```

**Isso é importante antes de publicar no GitHub**, porque aí sua senha do PostgreSQL não fica exposta no código.

E coloca no `.gitignore`:

```gitignore
.env
.venv/
__pycache__/
.pytest_cache/
```

Se o repositório já tiver sido inicializado com Git, vale também conferir com:

```bash
git status
```

para garantir que o `.env` **não aparece** como arquivo para commit.
