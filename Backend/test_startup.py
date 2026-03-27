import asyncio
import sys
from app.main import lifespan
from fastapi import FastAPI
from sqlalchemy.future import select
from app.models import User, ParkingSlot, Fee
from app.database import AsyncSessionLocal

async def test_startup():
    app = FastAPI()
    try:
        async with lifespan(app):
            print("Lifespan executed successfully. DB Tables should be created and seeded.")
            
            async with AsyncSessionLocal() as session:
                users = await session.execute(select(User))
                slots = await session.execute(select(ParkingSlot))
                fees = await session.execute(select(Fee))
                
                user_count = len(users.scalars().all())
                slot_count = len(slots.scalars().all())
                fee_count = len(fees.scalars().all())
                
                print(f"Users: {user_count}, Slots: {slot_count}, Fees: {fee_count}")
                if user_count > 0 and slot_count > 0 and fee_count > 0:
                    print("Seeding verified successfully.")
                else:
                    print("Seeding failed or returned 0 records.")
                    sys.exit(1)
    except Exception as e:
        print(f"Startup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_startup())
