import asyncio
import asyncpg
import sys

async def create_database():
    # Connect to default postgres db to create a new one
    try:
        conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/postgres')
        # We cannot run CREATE DATABASE inside a transaction block in postgresql
        # asyncpg runs commands inside a transaction by default if we use execute().
        # However, conn.execute handles it if we don't start a transaction explicitly.
        # But specifically, CREATE DATABASE cannot execute inside a transaction block.
        # we bypass this by simply using driver-provided methods or conn.execute
        await conn.execute('CREATE DATABASE parkease')
        print("Database 'parkease' created successfully.")
        await conn.close()
    except asyncpg.exceptions.DuplicateDatabaseError:
        print("Database 'parkease' already exists.")
    except Exception as e:
        print(f"Error creating database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(create_database())
