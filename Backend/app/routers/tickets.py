from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
import uuid
import math

from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])

@router.post("/entry")
async def create_ticket(ticket_data: schemas.TicketCreate, db: AsyncSession = Depends(get_db)):
    # Create or update vehicle
    v_res = await db.execute(select(models.Vehicle).filter(models.Vehicle.vehicle_no == ticket_data.vehicleNo))
    vehicle = v_res.scalars().first()
    if not vehicle:
        vehicle = models.Vehicle(
            vehicle_no=ticket_data.vehicleNo,
            type=ticket_data.vehicleType,
            owner_name=ticket_data.ownerName,
            owner_contact=ticket_data.ownerContact
        )
        db.add(vehicle)
        await db.flush() # get ID
    
    # Get slot
    s_res = await db.execute(select(models.ParkingSlot).filter(models.ParkingSlot.name == ticket_data.slot))
    slot = s_res.scalars().first()
    if not slot or not slot.is_available:
        raise HTTPException(status_code=400, detail="Slot unavailable or invalid")
    
    # Update slot
    slot.is_available = False

    # Create ticket
    new_ticket_id = f"TKT-{uuid.uuid4().hex[:6].upper()}"
    ticket = models.Ticket(
        id=new_ticket_id,
        vehicle_id=vehicle.id,
        slot_id=slot.id,
        entry_time=datetime.now(timezone.utc),
        status="active"
    )
    db.add(ticket)
    await db.commit()
    
    return {"message": "Ticket created successfully", "ticket_id": ticket.id}


@router.get("/active/{ticket_id}")
async def get_active_ticket(ticket_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.Ticket).filter(models.Ticket.id == ticket_id))
    ticket = res.scalars().first()
    if not ticket or ticket.status != "active":
        raise HTTPException(status_code=404, detail="Active ticket not found")

    # Get Vehicle
    v_res = await db.execute(select(models.Vehicle).filter(models.Vehicle.id == ticket.vehicle_id))
    vehicle = v_res.scalars().first()
    
    # Get Slot
    s_res = await db.execute(select(models.ParkingSlot).filter(models.ParkingSlot.id == ticket.slot_id))
    slot = s_res.scalars().first()

    # Get fee rate
    f_res = await db.execute(select(models.Fee).filter(models.Fee.vehicle_type == vehicle.type))
    fee_obj = f_res.scalars().first()
    rate = fee_obj.rate_per_hour if fee_obj else 40.0

    # Calculate duration
    now = datetime.now(timezone.utc)
    entry_time = ticket.entry_time.replace(tzinfo=timezone.utc) if not ticket.entry_time.tzinfo else ticket.entry_time
    duration_delta = now - entry_time
    hours = math.ceil(duration_delta.total_seconds() / 3600)
    if hours < 1: hours = 1
    
    current_amount = hours * rate
    
    # Formatting for frontend exactly as ticket details view expects 
    return {
         "id": ticket.id,
         "vehicleNo": vehicle.vehicle_no,
         "vehicleType": vehicle.type,
         "slot": slot.name,
         "entryTime": entry_time.strftime("%I:%M %p"),
         "duration": f"{int(duration_delta.total_seconds() // 3600)}h {int((duration_delta.total_seconds() % 3600) // 60)}m",
         "amount": str(current_amount),
         "owner": vehicle.owner_name,
         "status": ticket.status
    }

@router.post("/checkout/{ticket_id}")
async def checkout_ticket(ticket_id: str, payment_req: schemas.CheckoutRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.Ticket).filter(models.Ticket.id == ticket_id))
    ticket = res.scalars().first()
    if not ticket or ticket.status != "active":
        raise HTTPException(status_code=400, detail="Ticket not active or found")
        
    v_res = await db.execute(select(models.Vehicle).filter(models.Vehicle.id == ticket.vehicle_id))
    vehicle = v_res.scalars().first()

    f_res = await db.execute(select(models.Fee).filter(models.Fee.vehicle_type == vehicle.type))
    fee_obj = f_res.scalars().first()
    rate = fee_obj.rate_per_hour if fee_obj else 40.0

    now = datetime.now(timezone.utc)
    entry_time = ticket.entry_time.replace(tzinfo=timezone.utc) if not ticket.entry_time.tzinfo else ticket.entry_time
    duration_delta = now - entry_time
    hours = math.ceil(duration_delta.total_seconds() / 3600)
    if hours < 1: hours = 1
    amount = hours * rate

    ticket.exit_time = now
    ticket.amount = amount
    ticket.status = "paid"
    
    s_res = await db.execute(select(models.ParkingSlot).filter(models.ParkingSlot.id == ticket.slot_id))
    slot = s_res.scalars().first()
    if slot:
        slot.is_available = True
        
    payment = models.Payment(
        ticket_id=ticket.id,
        amount=amount,
        payment_mode=payment_req.paymentMode,
        payment_time=now,
        status="completed"
    )
    db.add(payment)
    await db.commit()
    return {"message": "Checkout successful", "amount": amount}

@router.get("/")
async def get_all_tickets(status: str = "all", db: AsyncSession = Depends(get_db)):
    query = select(models.Ticket)
    if status != "all":
        query = query.filter(models.Ticket.status == status)
    
    res = await db.execute(query)
    tickets = res.scalars().all()
    
    result = []
    for t in tickets:
        v_res = await db.execute(select(models.Vehicle).filter(models.Vehicle.id == t.vehicle_id))
        vehicle = v_res.scalars().first()
        s_res = await db.execute(select(models.ParkingSlot).filter(models.ParkingSlot.id == t.slot_id))
        slot = s_res.scalars().first()
        
        entry_time = t.entry_time.replace(tzinfo=timezone.utc) if t.entry_time and not t.entry_time.tzinfo else t.entry_time
        exit_time = t.exit_time.replace(tzinfo=timezone.utc) if t.exit_time and not t.exit_time.tzinfo else t.exit_time
        
        duration_str = None
        if t.status != "active" and exit_time:
             duration_delta = exit_time - entry_time
             duration_str = f"{int(duration_delta.total_seconds() // 3600)}h {int((duration_delta.total_seconds() % 3600) // 60)}m"
        
        result.append({
            "id": t.id,
            "vehicleNo": vehicle.vehicle_no if vehicle else "Unknown",
            "vehicleType": vehicle.type if vehicle else "Unknown",
            "slot": slot.name if slot else "Unknown",
            "entryTime": entry_time.strftime("%I:%M %p"),
            "exitTime": exit_time.strftime("%I:%M %p") if exit_time else None,
            "duration": duration_str,
            "amount": str(t.amount) if t.amount else None,
            "status": t.status,
            "owner": vehicle.owner_name if vehicle else None
        })
    return result
