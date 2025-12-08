Flight Booking Simulator with Dynamic Pricing

A complete Flight Booking Simulation System using FastAPI + MySQL + HTML/CSS/JS that includes real-time dynamic pricing, flight search, booking system, and demand simulation.

🚀 Project Features
🔍 Flight Search

Search flights by origin, destination, and date

Sorting options: price, duration, departure time

Dynamic prices returned instantly through API

💸 Dynamic Pricing Engine

Uses multiple parameters to calculate real-time updated fares:

Remaining seat percentage

Time left until departure

Simulated demand

Base fare values

Automatic price tiers

📦 Booking System

Book seats using API

Updates available seats in database

Returns final calculated price

🔄 Demand Simulation

Background process auto-updates demand

Real-time changes in availability

Reflects realistic airline-style fare fluctuations

📊 Fare History (Optional)

Logs every price update

Useful for analytics or admin dashboard

🗂️ Project Structure
backend/
│── main.py
│── pricing.py
│── database.py
│── models.py
│── demand_simulator.py
│── routers/
│     ├── flights.py
│     ├── pricing.py
static/
│── index.html
│── script.js
│── style.css
README.md

🛢️ Database Schema (MySQL)
airports

airport_id

code

city

country

flights

flight_id

flight_number

origin

destination

departure_time

arrival_time

base_fare

total_seats

available_seats

demand

demand_id

flight_id

demand_level

fare_history (optional)

old_fare

new_fare

reason

bookings

booking_id

flight_id

passenger_name

seats_booked

price_paid

▶️ Run the Project Locally
1️⃣ Install dependencies
pip install fastapi uvicorn sqlalchemy mysql-connector-python

2️⃣ Start FastAPI server
uvicorn main:app --reload

3️⃣ Open frontend
http://127.0.0.1:8000