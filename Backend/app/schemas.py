from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str

    model_config = {"from_attributes": True}

class VehicleBase(BaseModel):
    vehicle_no: str
    type: str
    owner_name: Optional[str] = None
    owner_contact: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int

    model_config = {"from_attributes": True}

class ParkingSlotBase(BaseModel):
    name: str
    type_id: str
    is_available: bool = True

class ParkingSlotResponse(ParkingSlotBase):
    id: int

    model_config = {"from_attributes": True}

class TicketCreate(BaseModel):
    vehicleNo: str
    vehicleType: str
    ownerName: Optional[str] = None
    ownerContact: Optional[str] = None
    slot: str  # slot name

class TicketResponse(BaseModel):
    id: str
    vehicle_id: int
    slot_id: int
    entry_time: datetime
    exit_time: Optional[datetime] = None
    amount: Optional[float] = None
    status: str
    vehicle: VehicleResponse
    slot: ParkingSlotResponse

    model_config = {"from_attributes": True}

class TicketFE(BaseModel):
    id: str
    vehicleNo: str
    vehicleType: str
    slot: str
    entryTime: str
    exitTime: Optional[str] = None
    duration: Optional[str] = None
    amount: Optional[str] = None
    status: str
    owner: str

class DashboardStats(BaseModel):
    totalTickets: int
    activeTickets: int
    paidTickets: int
    unpaidTickets: int
    totalRevenue: float

class CheckoutRequest(BaseModel):
    paymentMode: str
