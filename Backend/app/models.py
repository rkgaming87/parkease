from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="admin")

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_no = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, nullable=False)
    owner_name = Column(String)
    owner_contact = Column(String)

class ParkingSlot(Base):
    __tablename__ = "parking_slots"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    type_id = Column(String, nullable=False)  # Usually corresponds to Vehicle type
    is_available = Column(Boolean, default=True)

class Fee(Base):
    __tablename__ = "fees"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_type = Column(String, unique=True, nullable=False)
    rate_per_hour = Column(Float, nullable=False)

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(String, primary_key=True, index=True) # e.g., TKT-0091
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("parking_slots.id"), nullable=False)
    entry_time = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    exit_time = Column(DateTime(timezone=True), nullable=True)
    amount = Column(Float, nullable=True)
    status = Column(String, default="active", nullable=False) # active, paid, unpaid

    vehicle = relationship("Vehicle")
    slot = relationship("ParkingSlot")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, ForeignKey("tickets.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_mode = Column(String, nullable=False)
    payment_time = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    status = Column(String, default="completed", nullable=False)
    
    ticket = relationship("Ticket")
