import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import contextlib

from .database import engine, Base, AsyncSessionLocal
from .models import User, Fee, ParkingSlot
from .security import get_password_hash
from .routers import auth, dashboard, parking, tickets, reports

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Seed data if necessary — idempotent: each record only inserted if missing
    async with AsyncSessionLocal() as session:
        from sqlalchemy.future import select

        # Admin user
        res = await session.execute(select(User).filter(User.email == "admin@parkease.com"))
        if not res.scalars().first():
            session.add(User(email="admin@parkease.com", password_hash=get_password_hash("admin123"), role="admin"))
            await session.commit()

        # Fee rates
        for vtype, rate in [("Car", 40.0), ("Bike", 20.0), ("SUV", 60.0), ("Truck", 100.0), ("Auto", 30.0)]:
            res = await session.execute(select(Fee).filter(Fee.vehicle_type == vtype))
            if not res.scalars().first():
                session.add(Fee(vehicle_type=vtype, rate_per_hour=rate))
        await session.commit()

        # Parking slots — insert each one only if it doesn't already exist
        for tpe, prefix in [("Car", "A"), ("Bike", "B"), ("SUV", "C"), ("Truck", "D")]:
            for i in range(1, 11):
                slot_name = f"{prefix}-{i:02d}"
                res = await session.execute(select(ParkingSlot).filter(ParkingSlot.name == slot_name))
                if not res.scalars().first():
                    session.add(ParkingSlot(name=slot_name, type_id=tpe, is_available=True))
        await session.commit()
            
    yield
    # Cleanup
    await engine.dispose()

app = FastAPI(title="Park Ease API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Specific origin for credentials
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(parking.router)
app.include_router(tickets.router)
app.include_router(reports.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Park Ease Backend API"}
