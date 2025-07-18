from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend import models, schemas, crud, deps
from backend.database import engine
from fastapi.middleware.cors import CORSMiddleware
from backend.database import SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DocVita Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def add_dummy_therapists():
    db = SessionLocal()
    if db.query(models.Therapist).count() == 0:
        dummy_therapists = [
            models.Therapist(name="Dr. Aanya Sharma", intro="Empathetic listener with 10+ years of experience.", specialization="Anxiety, Stress", country="India"),
            models.Therapist(name="Dr. John Smith", intro="Cognitive Behavioral Therapy expert.", specialization="Depression, CBT", country="USA"),
            models.Therapist(name="Dr. Mei Lin", intro="Mindfulness and holistic healing.", specialization="Mindfulness, Trauma", country="Singapore"),
            models.Therapist(name="Dr. Carlos Ruiz", intro="Family and relationship counseling.", specialization="Relationships, Family", country="Spain"),
        ]
        db.add_all(dummy_therapists)
        db.commit()
    db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to DocVita API!"}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/login", response_model=schemas.UserOut)
def login(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not crud.pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return db_user

@app.get("/therapists", response_model=list[schemas.TherapistOut])
def list_therapists(db: Session = Depends(deps.get_db)):
    return crud.get_therapists(db)

@app.post("/appointments", response_model=schemas.AppointmentOut)
def book_appointment(
    appointment: schemas.AppointmentCreate,
    user_id: int,
    db: Session = Depends(deps.get_db)
):
    return crud.create_appointment(db, appointment, user_id)

@app.get("/appointments", response_model=list[schemas.AppointmentOut])
def get_appointments(user_id: int, db: Session = Depends(deps.get_db)):
    return crud.get_appointments_by_user(db, user_id)

@app.post("/journal", response_model=schemas.JournalEntryOut)
def add_journal(entry: schemas.JournalEntryCreate, user_id: int, db: Session = Depends(deps.get_db)):
    return crud.create_journal_entry(db, entry, user_id)

@app.get("/journal", response_model=list[schemas.JournalEntryOut])
def get_journal(user_id: int, db: Session = Depends(deps.get_db)):
    return crud.get_journal_entries(db, user_id) 