import asyncio
from app.database import engine, AsyncSessionLocal, Base
from app.models import Vehicle, ParkingSlot, Ticket, Fee, User
from sqlalchemy.future import select
from datetime import datetime, timezone
import uuid

async def test_entry():
    # first drop and recreate to ensure timezone column changes apply
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # recreate a slot
    async with AsyncSessionLocal() as session:
        slot = ParkingSlot(name="A-10", type_id="Car", is_available=True)
        session.add(slot)
        await session.commit()
        
        # Test ticket creation logic directly to find the bug
        v_res = await session.execute(select(Vehicle).filter(Vehicle.vehicle_no == "MH12AB1234"))
        vehicle = v_res.scalars().first()
        if not vehicle:
            vehicle = Vehicle(
                vehicle_no="MH12AB1234",
                type="Car",
                owner_name="Nitin Bhati",
                owner_contact="999999999"
            )
            session.add(vehicle)
            await session.flush()
        
        s_res = await session.execute(select(ParkingSlot).filter(ParkingSlot.name == "A-10"))
        slot = s_res.scalars().first()
        
        slot.is_available = False
        
        ticket = Ticket(
            id=f"TKT-{uuid.uuid4().hex[:6].upper()}",
            vehicle_id=vehicle.id,
            slot_id=slot.id,
            entry_time=datetime.now(timezone.utc),
            status="active"
        )
        session.add(ticket)
        await session.commit()
        print("Ticket creation successful!")

if __name__ == "__main__":
    asyncio.run(test_entry())
