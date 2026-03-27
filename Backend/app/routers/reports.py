from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime, timedelta, timezone

from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/")
async def get_reports(period: str = "daily", db: AsyncSession = Depends(get_db)):
    now = datetime.now(timezone.utc)
    
    if period == "daily":
        start_date = now - timedelta(days=7)
        # date grouping 
        query = select(
             func.date(models.Payment.payment_time).label('date'),
             func.sum(models.Payment.amount).label('total_revenue')
        ).filter(models.Payment.payment_time >= start_date).group_by(func.date(models.Payment.payment_time))
        
        res = await db.execute(query)
        data = res.all()
        
        return {
             "chartData": [{"name": str(r.date), "revenue": r.total_revenue} for r in data]
        }
    elif period == "weekly":
        # Simplified: last 4 weeks
        start_date = now - timedelta(weeks=4)
        query = select(
             func.date_trunc('week', models.Payment.payment_time).label('week'),
             func.sum(models.Payment.amount).label('total_revenue')
        ).filter(models.Payment.payment_time >= start_date).group_by('week')
        res = await db.execute(query)
        data = res.all()
        return {
             "chartData": [{"name": f"Week of {str(r.week)[:10]}", "revenue": r.total_revenue} for r in data]
        }
    else: # monthly
        # Simplified: last 6 months
        start_date = now - timedelta(days=180)
        query = select(
             func.date_trunc('month', models.Payment.payment_time).label('month'),
             func.sum(models.Payment.amount).label('total_revenue')
        ).filter(models.Payment.payment_time >= start_date).group_by('month')
        res = await db.execute(query)
        data = res.all()
        return {
             "chartData": [{"name": str(r.month)[:7], "revenue": r.total_revenue} for r in data]
        }
