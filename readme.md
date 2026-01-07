Flight Booking Simulator with Dynamic Pricing
A web-based flight reservation system that mimics real-world airline operations. This project features a Dynamic Pricing Engine where fares fluctuate based on seat availability, demand, and time remaining until departure.



deploy link https://flight-booking-stimulator-with-dynamic.onrender.com

. Key Features
Dynamic Fare Calculation: Prices adjust in real-time based on simulated demand and seat inventory.
Smart Search: Filter and sort flights by origin, destination, date, price, or duration.
Wikipedia Integration: Click on destination names to view historical and travel information via the Wikipedia API.
Multi-step Booking: Seamless flow from flight selection to passenger details and PNR generation.
Concurrent Seat Management: Database transactions ensure no double-booking of the same seat.
Downloadable E-Tickets: Generate and download professional PDF booking receipts after confirmation.
Fare History: Visual tracking of how prices have changed for specific flights.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.
Backend: FastAPI (Python 3.x).
Database: MySQL / SQLAlchemy ORM.
PDF Generation: ReportLab or FPDF (Python).

📂 Project Structure

main.py: FastAPI server and API endpoints.

static/: CSS, frontend JS, images ,html files.


⚙️ How to Run
1. Prerequisites
Python 3.8+

MySQL Server

2. Installation
Bash

# Clone the repository
git clone https://github.com/yourusername/flight-booking-simulator.git
cd flight-booking-simulator

# Install dependencies
pip install fastapi uvicorn sqlalchemy mysql-connector-python reportlab
3. Database Setup
Create a MySQL database named flight_db.

Update the DATABASE_URL in main.py with your credentials.

Run the application once to automatically generate tables.

4. Start the Server
Bash

uvicorn main:app --reload
Open your browser and navigate to http://127.0.0.1:8000.

📈 Pricing Logic
The system implements a dynamic algorithm considering:



Base Fare: The starting price for the route.


Seat Inventory: Prices increase as the "Remaining Seat Percentage" drops.


Urgency: Prices rise as the "Time until Departure" decreases.


Demand: A background process simulates high-demand shifts.

📝 Implementation Milestones

Milestone 1: Core Search & Data Management (Weeks 1-2).


Milestone 2: Dynamic Pricing Engine Implementation (Weeks 3-4).


Milestone 3: Booking Workflow & PNR Generation (Weeks 5-6).


Milestone 4: Frontend Integration & PDF Receipts (Weeks 7-8).


Developed as part of the Infosys Internship Program.