from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/slots", tags=["Parking Slots"])

@router.get("/available")
async def get_available_slots(type: str = None, db: AsyncSession = Depends(get_db)):
    query = select(models.ParkingSlot).filter(models.ParkingSlot.is_available == True)
    if type:
        query = query.filter(models.ParkingSlot.type_id == type)
    
    result = await db.execute(query)
    slots = result.scalars().all()
    # Format according to frontend expectations or return names directly
    return [slot.name for slot in slots]
