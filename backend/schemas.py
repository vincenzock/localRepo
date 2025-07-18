from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    country: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

class TherapistBase(BaseModel):
    name: str
    intro: Optional[str] = None
    specialization: Optional[str] = None
    country: Optional[str] = None

class TherapistOut(TherapistBase):
    id: int
    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    date: datetime
    duration: int
    status: Optional[str] = 'upcoming'

class AppointmentCreate(AppointmentBase):
    therapist_id: int

class AppointmentOut(AppointmentBase):
    id: int
    user_id: int
    therapist_id: int
    class Config:
        orm_mode = True

class JournalEntryBase(BaseModel):
    content: str

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryOut(JournalEntryBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        orm_mode = True 