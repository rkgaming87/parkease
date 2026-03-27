from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=schemas.DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # Total tickets
    total_q = await db.execute(select(func.count(models.Ticket.id)))
    totalTickets = total_q.scalar() or 0
    
    # Active tickets
    active_q = await db.execute(select(func.count(models.Ticket.id)).filter(models.Ticket.status == "active"))
    activeTickets = active_q.scalar() or 0
    
    # Paid tickets
    paid_q = await db.execute(select(func.count(models.Ticket.id)).filter(models.Ticket.status == "paid"))
    paidTickets = paid_q.scalar() or 0

    # Unpaid tickets
    unpaid_q = await db.execute(select(func.count(models.Ticket.id)).filter(models.Ticket.status == "unpaid"))
    unpaidTickets = unpaid_q.scalar() or 0

    # Total Revenue (sum of amounts in Payments table)
    rev_q = await db.execute(select(func.sum(models.Payment.amount)))
    totalRevenue = rev_q.scalar() or 0.0

    return schemas.DashboardStats(
        totalTickets=totalTickets,
        activeTickets=activeTickets,
        paidTickets=paidTickets,
        unpaidTickets=unpaidTickets,
        totalRevenue=totalRevenue
    )
