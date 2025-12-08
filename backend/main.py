from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session
from datetime import datetime, timedelta
import random
import threading
import time

# =============================
#  DATABASE CONFIG (MySQL)
# =============================
DATABASE_URL = "mysql+mysqlconnector://root:WJ28%40DELI@localhost:3306/flight_booking"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)
Base = declarative_base()


# =============================
#  MODELS
# =============================
class Flight(Base):
    __tablename__ = "flights"
    flight_id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String(20))
    origin = Column(String(50))
    destination = Column(String(50))
    departure_time = Column(DateTime)
    arrival_time = Column(DateTime)
    base_fare = Column(Float)
    total_seats = Column(Integer)
    available_seats = Column(Integer)


class FareHistory(Base):
    __tablename__ = "fare_history"
    history_id = Column(Integer, primary_key=True, index=True)
    flight_id = Column(Integer, ForeignKey("flights.flight_id"))
    old_fare = Column(Float)
    new_fare = Column(Float)
    change_reason = Column(String(255))
    changed_at = Column(DateTime, default=datetime.utcnow)


# Create tables if not exist
Base.metadata.create_all(bind=engine)

# =============================
#  FASTAPI APP
# =============================
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def home():
    return FileResponse("static/index.html")


# =============================
#  Dynamic Pricing Formula
# =============================
def calculate_dynamic_price(flight: Flight):
    remaining_seats = flight.available_seats / flight.total_seats
    time_diff = (flight.departure_time - datetime.now()).total_seconds() / 3600

    demand_factor = random.uniform(0.8, 1.4)
    seat_factor = 1.5 - remaining_seats

    if time_diff < 6:
        time_factor = 1.2
    elif time_diff < 24:
        time_factor = 1.1
    else:
        time_factor = 1.0

    new_price = flight.base_fare * demand_factor * seat_factor * time_factor
    return round(max(new_price, flight.base_fare), 2)


def record_fare_history(db, flight: Flight, new_price, reason="Dynamic update"):
    old_price = calculate_dynamic_price(flight)
    history = FareHistory(
        flight_id=flight.flight_id,
        old_fare=old_price,
        new_fare=new_price,
        change_reason=reason,
        changed_at=datetime.utcnow(),
    )
    db.add(history)
    db.commit()


# =============================
#  API ENDPOINTS
# =============================
@app.get("/flights")
def get_all_flights():
    db = SessionLocal()
    flights = db.query(Flight).all()
    result = []
    for f in flights:
        dynamic_price = calculate_dynamic_price(f)
        result.append(
            {
                "flight_id": f.flight_id,
                "flight_number": f.flight_number,
                "origin": f.origin,
                "destination": f.destination,
                "departure_time": f.departure_time,
                "arrival_time": f.arrival_time,
                "price": dynamic_price,
                "available_seats": f.available_seats,
            }
        )
    return result


@app.get("/search")
def search_flights(
    origin: str = Query(...),
    destination: str = Query(...),
    date: str = Query(...),
    sort_by: str = Query(None),  # price or duration
):
    db = SessionLocal()
    try:
        travel_date = datetime.strptime(date, "%Y-%m-%d")
    except:
        raise HTTPException(
            status_code=400, detail="Invalid date format (Use YYYY-MM-DD)"
        )

    flights = (
        db.query(Flight)
        .filter(
            Flight.origin == origin,
            Flight.destination == destination,
            Flight.departure_time.between(
                datetime.combine(travel_date, datetime.min.time()),
                datetime.combine(travel_date, datetime.max.time()),
            ),
        )
        .all()
    )

    if not flights:
        raise HTTPException(status_code=404, detail="No flights found")

    result = []
    for f in flights:
        result.append(
            {
                "flight_id": f.flight_id,
                "flight_number": f.flight_number,
                "origin": f.origin,
                "destination": f.destination,
                "departure_time": f.departure_time,
                "arrival_time": f.arrival_time,
                "duration": (f.arrival_time - f.departure_time).total_seconds() / 3600,
                "price": calculate_dynamic_price(f),
                "available_seats": f.available_seats,
            }
        )

    # Sorting
    if sort_by == "price":
        result.sort(key=lambda x: x["price"])
    elif sort_by == "duration":
        result.sort(key=lambda x: x["duration"])

    return result


@app.post("/book/{flight_id}")
def book_flight(flight_id: int, seats: int = 1):
    db = SessionLocal()
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()

    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    if seats > flight.available_seats:
        raise HTTPException(status_code=400, detail="Not enough seats available")

    # Book seats
    flight.available_seats -= seats
    db.commit()

    price_per_seat = calculate_dynamic_price(flight)
    # Record fare history
    record_fare_history(db, flight, price_per_seat, reason="Booking")

    return {"message": f"{seats} seat(s) booked", "price_per_seat": price_per_seat}


@app.get("/fare-history/{flight_id}")
def get_fare_history(flight_id: int):
    db = SessionLocal()
    history = (
        db.query(FareHistory)
        .filter(FareHistory.flight_id == flight_id)
        .order_by(FareHistory.changed_at.desc())
        .all()
    )
    result = [
        {
            "old_fare": h.old_fare,
            "new_fare": h.new_fare,
            "change_reason": h.change_reason,
            "changed_at": h.changed_at,
        }
        for h in history
    ]
    return result


# =============================
#  Background simulation
# =============================
def simulate_demand():
    while True:
        db = SessionLocal()  # get a session
        try:
            flights = db.query(Flight).all()
            for f in flights:
                if f.available_seats > 0:
                    seats_to_reduce = random.randint(0, 3)
                    f.available_seats = max(0, f.available_seats - seats_to_reduce)
            db.commit()  # commit once after all updates
        finally:
            db.close()  # close the session properly
        time.sleep(60)
