CREATE DATABASE IF NOT EXISTS flight_booking;
USE flight_booking;

-- ================================
--  AIRPORTS TABLE
-- ================================
CREATE TABLE airports (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- ================================
--  FLIGHTS TABLE
-- ================================
CREATE TABLE flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    base_fare DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
--  DEMAND TABLE
-- (to simulate changing demand)
-- ================================
CREATE TABLE demand (
    demand_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    demand_level INT NOT NULL,   -- 1 to 10 scale
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- ================================
--  FARE HISTORY TABLE
-- (optional: log how prices change)
-- ================================
CREATE TABLE fare_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    old_fare DECIMAL(10,2),
    new_fare DECIMAL(10,2),
    change_reason VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- ================================
--  BOOKINGS TABLE
-- (for future: actual flight booking)
-- ================================
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    seats_booked INT NOT NULL,
    price_paid DECIMAL(10,2) NOT NULL,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- ================================
--  SAMPLE DATA INSERTION
-- ================================
INSERT INTO airports (code, city, country) VALUES
('DEL', 'Delhi', 'India'),
('BOM', 'Mumbai', 'India'),
('BLR', 'Bangalore', 'India'),
('MAA', 'Chennai', 'India');

INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, base_fare, total_seats, available_seats)
VALUES
('AI101', 'DEL', 'BOM', '2025-12-20 08:00:00', '2025-12-20 10:10:00', 5000, 180, 180),
('AI202', 'DEL', 'BLR', '2025-12-20 15:00:00', '2025-12-20 17:30:00', 6500, 200, 200),
('AI303', 'BOM', 'MAA', '2025-12-21 18:00:00', '2025-12-21 20:10:00', 5500, 150, 150);

INSERT INTO demand (flight_id, demand_level) VALUES
(1, 5),
(2, 3),
(3, 7);
