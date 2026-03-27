import asyncio
import sys
from app.database import engine

async def main():
    try:
        async with engine.begin() as conn:
            print("Successfully connected to the PostgreSQL database.")
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
