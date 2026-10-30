import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL Connection String setup (Reads from DATABASE_URL or POSTGRES_URL environment variables)
# Default PostgreSQL URL format: postgresql://postgres:postgres@localhost:5432/aira_db
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/aira_db")
)

# SQLite Fallback URL if local PostgreSQL service is not active
SQLITE_FALLBACK_URL = "sqlite:///./aira_store.db"

db_connected = False

try:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={"connect_timeout": 1}
    )
    # Test connection
    connection = engine.connect()
    connection.close()
    db_connected = True
    print(f"[PostgreSQL] Connected successfully to database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
except Exception as e:
    print(f"[PostgreSQL] Local service not active or initializing ({e}).")
    print(f"[Database] Using local SQLite database engine fallback: {SQLITE_FALLBACK_URL}")
    DATABASE_URL = SQLITE_FALLBACK_URL
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

