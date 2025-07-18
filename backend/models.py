from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    gender = Column(String)
    dob = Column(Date)
    country = Column(String)
    hashed_password = Column(String, nullable=False)
    journals = relationship('JournalEntry', back_populates='user')
    appointments = relationship('Appointment', back_populates='user')

class Therapist(Base):
    __tablename__ = 'therapists'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    intro = Column(String)
    specialization = Column(String)
    country = Column(String)
    appointments = relationship('Appointment', back_populates='therapist')

class Appointment(Base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    therapist_id = Column(Integer, ForeignKey('therapists.id'))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    duration = Column(Integer)  # in minutes
    status = Column(String, default='upcoming')
    user = relationship('User', back_populates='appointments')
    therapist = relationship('Therapist', back_populates='appointments')

class JournalEntry(Base):
    __tablename__ = 'journal_entries'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    content = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship('User', back_populates='journals') 