# AIRA FastAPI Backend with PostgreSQL Database Integration

This directory contains the Python FastAPI backend server for **AIRA (AI-Powered Retail Analytics)**, integrated with PostgreSQL / SQLAlchemy ORM.

## 🐘 PostgreSQL Connection Configuration

The backend is configured to connect to PostgreSQL using standard connection environment variables or local fallback.

### Default PostgreSQL Connection String:
```
postgresql://postgres:postgres@localhost:5432/aira_db
```

### Environment Variables:
Set the `DATABASE_URL` or `POSTGRES_URL` environment variable to connect to your PostgreSQL instance:

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://username:password@localhost:5432/aira_db"

# Linux / macOS
export DATABASE_URL="postgresql://username:password@localhost:5432/aira_db"
```

---

## 🛠️ PostgreSQL Database Setup

1. **Install & Start PostgreSQL Server:**
   Ensure PostgreSQL is installed on your machine or cloud provider (e.g. Supabase, ElephantSQL, AWS RDS, Heroku Postgres).

2. **Create PostgreSQL Database:**
   ```sql
   CREATE DATABASE aira_db;
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run FastAPI Server:**
   ```bash
   python -m app.main
   # OR
   uvicorn app.main:app --reload --port 8000
   ```

5. **Access Interactive API Docs:**
   Open [http://localhost:8000/docs](http://localhost:8000/docs) to view Swagger OpenAPI documentation.

---

## 📑 Database Schema & Tables
- `users`: User authentication, store details, and role permissions.
- `products`: Product catalogue, SKU, cost price, selling price, unit profit, profit margin, ROI %, and stock telemetry.
- `sales_records`: Sales log transactions, timestamped units sold, and pricing.
- `alerts`: Real-time critical, warning, opportunity, and informational alerts.
