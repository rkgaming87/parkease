import asyncio
from app.database import engine, Base

async def clean_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        print("Database tables dropped completely. They will be recreated on next startup.")

if __name__ == "__main__":
    asyncio.run(clean_db())
