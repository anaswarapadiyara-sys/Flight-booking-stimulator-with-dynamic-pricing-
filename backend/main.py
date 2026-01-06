from fastapi import FastAPI, HTTPException, Query, Form, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi import Body
from jinja2 import Template

from jinja2 import Environment, FileSystemLoader
from io import BytesIO

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
from sqlalchemy.orm import Session

from pydantic import BaseModel
from datetime import datetime, timedelta
import random
import uuid
import threading
import time
import os
import pdfkit


conf = ConnectionConfig(
    MAIL_USERNAME="your_email@gmail.com",
    MAIL_PASSWORD="your_app_password",
    MAIL_FROM="your_email@gmail.com",
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


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


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    pnr = Column(String(20), unique=True)
    flight_id = Column(Integer, ForeignKey("flights.flight_id"))
    passenger_name = Column(String(100))
    email = Column(String(100))
    seat_count = Column(Integer)
    total_price = Column(Float)
    status = Column(String(30))  # Confirmed/Paid/Cancelled
    booked_at = Column(DateTime, default=datetime.utcnow)


class BookingRequest(BaseModel):
    seats: int
    passenger: str
    email: str


def build_ticket_html(booking, flight):
    passengers_html = ""
    passengers = booking.passenger.split(",") if booking.passenger else []

    for i, p in enumerate(passengers, start=1):
        passengers_html += f"""
        <tr>
            <td>{i}</td>
            <td>{p.strip()}</td>
            <td>ECONOMY</td>
        </tr>
        """

    return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {{ font-family: Arial; }}
table {{ width: 100%; border-collapse: collapse; }}
th, td {{ border: 1px solid #000; padding: 6px; }}
h2 {{ text-align: center; }}
</style>
</head>

<body>

<h2>E-Ticket</h2>

<p><b>PNR:</b> {booking.pnr}</p>
<p><b>Status:</b> {booking.status}</p>
<p><b>Total Amount:</b> ₹{booking.total_price}</p>

<h3>Passengers</h3>
<table>
<tr><th>#</th><th>Name</th><th>Class</th></tr>
{passengers_html}
</table>

<h3>Flight Details</h3>
<p><b>From:</b> {flight.origin}</p>
<p><b>To:</b> {flight.destination}</p>
<p><b>Departure:</b> {flight.departure_time}</p>
<p><b>Arrival:</b> {flight.arrival_time}</p>

</body>
</html>
"""


# Create tables if not exist
Base.metadata.create_all(bind=engine)


from fastapi.responses import RedirectResponse


# Model for User (add this to your existing models)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)


# =============================
#  FASTAPI APP
# =============================
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def home():
    return FileResponse("static/index.html")


# Search page (UI)
@app.get("/search")
def search_page():
    return FileResponse("static/search.html")


@app.get("/book")
def book_page():
    return FileResponse("static/book.html")


@app.get("/booking")
def booking_page():
    return FileResponse("static/booking.html")


@app.get("/payment")
def payment_page():
    return FileResponse("static/payment.html")


@app.get("/paymentprocess")
def paymentprocess_page():
    return FileResponse("static/paymentprocess.html")


@app.get("/ticket")
def ticket_page():
    return FileResponse("static/e-ticket.html")


@app.get("/login")
def login_page():
    return FileResponse("static/login.html")


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
    # Get last fare history record
    last_record = (
        db.query(FareHistory)
        .filter(FareHistory.flight_id == flight.flight_id)
        .order_by(FareHistory.changed_at.desc())
        .first()
    )
    old_price = (
        last_record.new_fare if last_record else flight.base_fare
    )  # use last new_price or base fare

    # Only record if price changed
    if old_price != new_price:
        history = FareHistory(
            flight_id=flight.flight_id,
            old_fare=old_price,
            new_fare=new_price,
            change_reason=reason,
            changed_at=datetime.now(),
        )
        db.add(history)
        db.commit()


def generate_pnr():
    return "PNR" + str(random.randint(100000, 999999))


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


@app.get("/flight/{flight_id}")
def get_flight_by_id(flight_id: int):
    db = SessionLocal()
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()

    if not flight:
        raise HTTPException(404, "Flight not found")

    return {
        "flight_id": flight.flight_id,
        "flight_number": flight.flight_number,
        "origin": flight.origin,
        "destination": flight.destination,
        "departure_time": flight.departure_time.isoformat(),
        "arrival_time": flight.arrival_time.isoformat(),
        "price": calculate_dynamic_price(flight),
        "available_seats": flight.available_seats,
        "airline": "Demo Airlines",
    }


from sqlalchemy import cast, Date


@app.get("/api/search")
def search_flights(
    origin: str = Query(...),
    destination: str = Query(...),
    date: str = Query(...),
    sort_by: str = Query(None),
):
    db = SessionLocal()
    try:
        # 1. Convert the string date from JS into a Python date object
        try:
            search_date = datetime.strptime(date, "%Y-%m-%d").date()
        except Exception:
            raise HTTPException(
                status_code=400, detail="Invalid date format. Use YYYY-MM-DD"
            )

        # 2. Query with CAST to ensure we compare DATE to DATE (ignoring timestamp)
        flights = (
            db.query(Flight)
            .filter(
                Flight.origin == origin,
                Flight.destination == destination,
                cast(Flight.departure_time, Date) == search_date,
            )
            .all()
        )

        if not flights:
            return []

        # 3. Build result list
        result = []
        for f in flights:
            result.append(
                {
                    "flight_id": f.flight_id,
                    "flight_number": f.flight_number,
                    "origin": f.origin,
                    "destination": f.destination,
                    "departure_time": f.departure_time.isoformat(),
                    "arrival_time": f.arrival_time.isoformat(),
                    "duration": (f.arrival_time - f.departure_time).total_seconds()
                    / 3600,
                    "price": calculate_dynamic_price(f),
                    "available_seats": f.available_seats,
                }
            )

        # 4. Apply Sorting
        if sort_by == "price":
            result.sort(key=lambda x: x["price"])
        elif sort_by == "duration":
            result.sort(key=lambda x: x["duration"])

        return result
    finally:
        db.close()


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


# @app.post("/create-booking/{flight_id}")
# def create_booking(flight_id: int, request: BookingRequest = Body(...)):
#     db = SessionLocal()
#     print("Received request body:", request.dict())
#     try:
#         flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()

#         if not flight:
#             raise HTTPException(status_code=404, detail="Flight not found")

#         if flight.available_seats < request.seats:
#             raise HTTPException(status_code=400, detail="Not enough seats available")

#         # =============================
#         # DYNAMIC PRICING
#         # =============================
#         price_per_seat = calculate_dynamic_price(flight)
#         total_amount = round(price_per_seat * request.seats, 2)

#         # =============================
#         # UPDATE SEATS
#         # =============================
#         flight.available_seats -= request.seats

#         # =============================
#         # RECORD FARE HISTORY
#         # =============================
#         history = FareHistory(
#             flight_id=flight.flight_id,
#             old_fare=flight.base_fare,
#             new_fare=price_per_seat,
#             change_reason="Booking",
#             changed_at=datetime.utcnow(),
#         )
#         db.add(history)

#         # =============================
#         # CREATE BOOKING
#         # =============================
#         pnr_code = generate_pnr()

#         booking = Booking(
#             pnr=pnr_code,
#             flight_id=flight.flight_id,
#             passenger_name=request.passenger,
#             email=request.email,
#             seat_count=request.seats,
#             total_price=total_amount,
#             status="Confirmed",
#         )

#         db.add(booking)
#         db.commit()
#         db.refresh(booking)

#         return {
#             "message": "Booking created successfully",
#             "pnr": pnr_code,
#             "total_price": total_amount,
#             "seats": request.seats,
#             "status": "Confirmed",
#         }

#     finally:
#         db.close()


@app.post("/create-booking/{flight_id}")
def create_booking(flight_id: int, request: BookingRequest = Body(...)):
    db = SessionLocal()
    try:
        print(" RECEIVED BODY:", request.model_dump())  # DEBUG (VERY IMPORTANT)

        flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
        if not flight:
            raise HTTPException(status_code=404, detail="Flight not found")

        if flight.available_seats < request.seats:
            raise HTTPException(status_code=400, detail="Not enough seats")

        price_per_seat = calculate_dynamic_price(flight)
        total_amount = round(price_per_seat * request.seats, 2)

        flight.available_seats -= request.seats

        pnr_code = generate_pnr()

        booking = Booking(
            pnr=pnr_code,
            flight_id=flight.flight_id,
            passenger_name=request.passenger,
            email=request.email,
            seat_count=request.seats,
            total_price=total_amount,
            status="Confirmed",
        )

        db.add(booking)
        db.commit()
        db.refresh(booking)

        return {"pnr": pnr_code, "total_price": total_amount, "seats": request.seats}

    finally:
        db.close()


@app.post("/pay/{pnr}")
async def process_payment(pnr: str):
    db = SessionLocal()
    booking = db.query(Booking).filter(Booking.pnr == pnr).first()

    if not booking:
        raise HTTPException(404, "Invalid PNR")

    if booking.status == "Paid":
        return {"message": "Payment already completed", "status": "Paid"}

    booking.status = "Paid"
    db.commit()

    message = MessageSchema(
        subject="Your Flight Ticket",
        recipients=[booking.email],
        body=f"""
Your booking is confirmed 🎉

PNR: {booking.pnr}

Download your ticket:
http://127.0.0.1:8000/ticket-pdf/{booking.pnr}
""",
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return {"message": "Payment successful", "pnr": pnr, "status": "Paid"}


@app.get("/booking/{pnr}")
def get_booking(pnr: str):
    db = SessionLocal()
    booking = db.query(Booking).filter(Booking.pnr == pnr).first()

    if not booking:
        raise HTTPException(404, "PNR Not Found")

    return {
        "pnr": booking.pnr,
        "flight_id": booking.flight_id,
        "passenger": booking.passenger_name,
        "seats": booking.seat_count,
        "total_price": booking.total_price,
        "status": booking.status,
        "booked_at": booking.booked_at,
    }


@app.delete("/cancel/{pnr}")
def cancel_booking(pnr: str):
    db = SessionLocal()  # Manual start
    try:
        booking = db.query(Booking).filter(Booking.pnr == pnr).first()

        if not booking:
            raise HTTPException(status_code=404, detail="PNR not found")

        if booking.status.lower() == "cancelled":
            return {"message": "Already cancelled"}

        flight = db.query(Flight).filter(Flight.flight_id == booking.flight_id).first()
        if flight:
            # Matches 'seats' from your JS
            flight.available_seats += booking.seat_count

        booking.status = "Cancelled"
        db.commit()
        return {"message": f"Booking {pnr} cancelled successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@app.get("/bookings")
def list_all_bookings():
    db = SessionLocal()
    bookings = db.query(Booking).all()

    return [
        {
            "pnr": b.pnr,
            "passenger": b.passenger_name,
            "flight_id": b.flight_id,
            "seats": b.seat_count,
            "total_price": b.total_price,
            "status": b.status,
            "booked_at": b.booked_at.isoformat(),
        }
        for b in bookings
    ]


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...)):
    db = SessionLocal()
    try:
        # 1. Debug Print (Check your terminal to see if data arrives)
        print(f"Login attempt for: {username}")

        # 2. Query the user
        user = db.query(User).filter(User.username == username).first()

        # 3. Validation
        if not user:
            print("User not found in database")
            return JSONResponse(
                status_code=401,
                content={"status": "error", "message": "User does not exist"},
            )

        if user.password != password:
            print("Password mismatch")
            return JSONResponse(
                status_code=401,
                content={"status": "error", "message": "Incorrect password"},
            )

        return {"status": "success", "message": "Login successful"}

    except Exception as e:
        # This catch block prevents the 500 error from being silent
        print(f"DATABASE ERROR: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Internal Server Database Error"},
        )
    finally:
        db.close()


@app.get("/ticket-pdf/{pnr}")
async def generate_ticket_pdf(pnr: str):
    path_to_wkhtmltopdf = r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
    config = pdfkit.configuration(wkhtmltopdf=path_to_wkhtmltopdf)

    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.pnr == pnr).first()
        flight = db.query(Flight).filter(Flight.flight_id == booking.flight_id).first()

        # 1. Build the rows for the passengers table
        passengers_list = booking.passenger_name.split(",")
        rows = ""
        for i, name in enumerate(passengers_list):
            row_class = "tr-odd" if i % 2 == 0 else "tr-even"
            rows += f'<tr class="{row_class}"><td>{i+1}</td><td>{name.strip()}</td><td>ECONOMY</td></tr>'

        # 2. THE DESIGN (The html_template variable)
        # We use f-strings to put flight.origin, pnr, etc., into the HTML
        html_template = f"""
        <html>
        <head>
            <style>
                body {{ font-family: sans-serif; padding: 20px; color: #333; }}
                .header {{ display: block; border-bottom: 2px solid red; padding-bottom: 10px; }}
                .logo {{ color: red; font-size: 24px; font-weight: bold; }}
                .ticket-title {{ float: right; font-size: 24px; color: #666; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                th, td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
                .caption {{ background-color: #a9a9a9; color: white; font-weight: bold; }}
                .tr-even {{ background-color: #f9f9f9; }}
                .total-section {{ text-align: right; margin-top: 20px; font-size: 18px; }}
            </style>
        </head>
        <body>
            <div class="header">
                <span class="logo">FLIGHT INC.</span>
                <span class="ticket-title">E-TICKET</span>
            </div>

            <table>
                <tr class="caption"><td colspan="4">BOOKING DETAILS</td></tr>
                <tr>
                    <th>PNR</th><td><strong>{pnr}</strong></td>
                    <th>STATUS</th><td>CONFIRMED</td>
                </tr>
                <tr class="tr-even">
                    <th>FLIGHT DATE</th><td>{flight.departure_time.strftime('%Y-%m-%d')}</td>
                    <th>BOOKED AT</th><td>{booking.booked_at.strftime('%Y-%m-%d')}</td>
                </tr>
            </table>

            <table>
                <tr class="caption"><td colspan="3">PASSENGERS</td></tr>
                <tr><th>#</th><th>Name</th><th>Class</th></tr>
                {rows}
            </table>

            <table>
                <tr class="caption"><td colspan="2">FLIGHT ITINERARY</td></tr>
                <tr>
                    <td><strong>FROM:</strong> {flight.origin}</td>
                    <td><strong>DEPARTURE:</strong> {flight.departure_time.strftime('%H:%M')}</td>
                </tr>
                <tr class="tr-even">
                    <td><strong>TO:</strong> {flight.destination}</td>
                    <td><strong>ARRIVAL:</strong> {flight.arrival_time.strftime('%H:%M')}</td>
                </tr>
            </table>

            <div class="total-section">
                <strong>TOTAL AMOUNT PAID: ₹ {booking.total_price}</strong>
            </div>
        </body>
        </html>
        """

        # 3. Convert that HTML string into a PDF
        pdf_content = pdfkit.from_string(html_template, False, configuration=config)

        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Ticket_{pnr}.pdf"},
        )

    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(status_code=500, content={"message": str(e)})
    finally:
        db.close()


# =============================
#  Background simulation
# =============================
def simulate_demand():
    while True:
        db = SessionLocal()
        try:
            flights = db.query(Flight).all()
            for f in flights:
                # if f.available_seats > 0:
                #     # Randomly reduce seats to simulate demand
                #     seats_to_reduce = random.randint(0, 3)
                #     f.available_seats = max(0, f.available_seats - seats_to_reduce)

                # Calculate new dynamic price
                new_price = calculate_dynamic_price(f)

                # Check latest fare history
                last_record = (
                    db.query(FareHistory)
                    .filter(FareHistory.flight_id == f.flight_id)
                    .order_by(FareHistory.changed_at.desc())
                    .first()
                )

                # Record only if price changed or no record exists
                if not last_record or last_record.new_fare != new_price:
                    record_fare_history(db, f, new_price, reason="Demand Simulation")

            db.commit()
        finally:
            db.close()
        time.sleep(60)  # repeat every 60 seconds


@app.on_event("startup")
def start_background_tasks():
    threading.Thread(target=simulate_demand, daemon=True).start()
