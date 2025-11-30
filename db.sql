    -- Milstone 1
   -- Assignment 1 database

-- //authentication tables 
-- auth_group stores group of user
CREATE TABLE `auth_group` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(150) NOT NULL UNIQUE);
-- auth_group_permissions track which users belong to which
CREATE TABLE `auth_group_permissions` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `group_id` integer NOT NULL REFERENCES `auth_group` (`id`) DEFERRABLE INITIALLY DEFERRED, `permission_id` integer NOT NULL REFERENCES `auth_permission` (`id`) DEFERRABLE INITIALLY DEFERRED);
-- auth_permission  track directly
CREATE TABLE `auth_permission` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `content_type_id` integer NOT NULL REFERENCES `django_content_type` (`id`) DEFERRABLE INITIALLY DEFERRED, `codename` varchar(100) NOT NULL, `name` varchar(255) NOT NULL);
INSERT INTO `auth_permission` VALUES(1,1,'add_logentry','Can add log entry');
INSERT INTO `auth_permission` VALUES(2,1,'change_logentry','Can change log entry');
INSERT INTO `auth_permission` VALUES(3,1,'delete_logentry','Can delete log entry');
INSERT INTO `auth_permission` VALUES(4,1,'view_logentry','Can view log entry');
INSERT INTO `auth_permission` VALUES(5,2,'add_permission','Can add permission');

-- Admin table
CREATE TABLE `django_admin_log` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `action_time` datetime NOT NULL, `object_id` text NULL, `object_repr` varchar(200) NOT NULL, `change_message` text NOT NULL, `content_type_id` integer NULL REFERENCES `django_content_type` (`id`) DEFERRABLE INITIALLY DEFERRED, `user_id` integer NOT NULL REFERENCES `flight_user` (`id`) DEFERRABLE INITIALLY DEFERRED, `action_flag` smallint unsigned NOT NULL CHECK (`action_flag` >= 0));
INSERT INTO `django_admin_log` VALUES(1,'2022-07-09 00:17:36.101000','6152','6152: Atlanta, United States (ATL) to London, United Kingdom (LHR)','',7,1,3);
INSERT INTO `django_admin_log` VALUES(2,'2022-07-09 00:17:36.127295','6151','6151: Atlanta, United States (ATL) to London, United Kingdom (LHR)','',7,1,3);
INSERT INTO `django_admin_log` VALUES(3,'2022-07-09 00:17:36.146246','6150','6150: Atlanta, United States (ATL) to London, United Kingdom (LHR)','',7,1,3);

-- django_content_type   keep track of all tables
CREATE TABLE `django_content_type` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `app_label` varchar(100) NOT NULL, `model` varchar(100) NOT NULL);
INSERT INTO `django_content_type` VALUES(1,'admin','logentry');
INSERT INTO `django_content_type` VALUES(2,'auth','permission');
INSERT INTO `django_content_type` VALUES(3,'auth','group');
INSERT INTO `django_content_type` VALUES(4,'contenttypes','contenttype');
INSERT INTO `django_content_type` VALUES(5,'sessions','session');
INSERT INTO `django_content_type` VALUES(6,'flight','user');
INSERT INTO `django_content_type` VALUES(7,'flight','flight');
INSERT INTO `django_content_type` VALUES(8,'flight','passenger');
INSERT INTO `django_content_type` VALUES(9,'flight','place');
INSERT INTO `django_content_type` VALUES(10,'flight','week');
INSERT INTO `django_content_type` VALUES(11,'flight','ticket');


-- Flight booking table
CREATE TABLE `flight_flight` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `depart_time` time NOT NULL, `duration` bigint NULL, `arrival_time` time NOT NULL, `plane` varchar(24) NOT NULL, `airline` varchar(64) NOT NULL, `economy_fare` real NULL, `business_fare` real NULL, `first_fare` real NULL, `destination_id` integer NOT NULL REFERENCES `flight_place` (`id`) DEFERRABLE INITIALLY DEFERRED, `origin_id` integer NOT NULL REFERENCES `flight_place` (`id`) DEFERRABLE INITIALLY DEFERRED);
INSERT INTO `flight_flight` VALUES(1,'08:00:00',7800000000,'10:10:00','G8334','Go First',4589.0,0.0,0.0,29,16);
INSERT INTO `flight_flight` VALUES(2,'10:55:00',8100000000,'13:10:00','G8338','Go First',4589.0,0.0,0.0,29,16);
INSERT INTO `flight_flight` VALUES(3,'19:45:00',8100000000,'22:00:00','G8346','Go First',4589.0,0.0,0.0,29,16);
INSERT INTO `flight_flight` VALUES(4,'20:50:00',8100000000,'23:05:00','G8330','Go First',4589.0,0.0,0.0,29,16);
INSERT INTO `flight_flight` VALUES(5,'07:20:00',8100000000,'09:35:00','SG8701','SpiceJet',4813.0,0.0,0.0,29,16);
INSERT INTO `flight_flight` VALUES(6,'19:45:00',8100000000,'22:00:00','SG8169','SpiceJet',4882.0,0.0,0.0,29,16);

-- Depature table
CREATE TABLE `flight_flight_depart_day` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `flight_id` integer NOT NULL REFERENCES `flight_flight` (`id`) DEFERRABLE INITIALLY DEFERRED, `week_id` integer NOT NULL REFERENCES `flight_week` (`id`) DEFERRABLE INITIALLY DEFERRED);
INSERT INTO `flight_flight_depart_day` VALUES(1,1,3);
INSERT INTO `flight_flight_depart_day` VALUES(2,2,3);
INSERT INTO `flight_flight_depart_day` VALUES(3,3,3);

-- flight_passenger Table
CREATE TABLE `flight_passenger` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `first_name` varchar(64) NOT NULL, `last_name` varchar(64) NOT NULL, `gender` varchar(20) NOT NULL);
INSERT INTO `flight_passenger` VALUES(1,'Ayush','Kumar','male');
INSERT INTO `flight_passenger` VALUES(2,'Ayush','Kumar','male');
INSERT INTO `flight_passenger` VALUES(3,'Ayush','Kumar','male');

-- Ticket booked Table
CREATE TABLE `flight_ticket` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `ref_no` varchar(6) NOT NULL UNIQUE, `flight_ddate` date NULL, `flight_adate` date NULL, `flight_fare` real NULL, `other_charges` real NULL, `coupon_used` varchar(15) NOT NULL, `coupon_discount` real NOT NULL, `total_fare` real NULL, `seat_class` varchar(20) NOT NULL, `booking_date` datetime NOT NULL, `mobile` varchar(20) NOT NULL, `email` varchar(45) NOT NULL, `status` varchar(45) NOT NULL, `flight_id` integer NULL REFERENCES `flight_flight` (`id`) DEFERRABLE INITIALLY DEFERRED, `user_id` integer NULL REFERENCES `flight_user` (`id`) DEFERRABLE INITIALLY DEFERRED);
INSERT INTO `flight_ticket` VALUES(1,'4717A2','2022-07-21','2022-07-21',11139.0,100.0,'WELCOME20',0.0,11239.0,'economy','2022-07-10 22:12:50.531478','+91 7777777777','anuu@mail.com','CANCELLED',5837,1);
INSERT INTO `flight_ticket` VALUES(2,'F058E0','2022-07-29','2022-07-30',90755.0,100.0,'',0.0,90855.0,'economy','2022-07-10 22:18:15.125400','+91 7777777777','chinn@mail.com','CONFIRMED',10287,1);

-- Ticket Passenger Table
CREATE TABLE `flight_ticket_passengers` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `ticket_id` integer NOT NULL REFERENCES `flight_ticket` (`id`) DEFERRABLE INITIALLY DEFERRED, `passenger_id` integer NOT NULL REFERENCES `flight_passenger` (`id`) DEFERRABLE INITIALLY DEFERRED);
INSERT INTO `flight_ticket_passengers` VALUES(1,1,1);
INSERT INTO `flight_ticket_passengers` VALUES(2,2,2);

-- User Table
CREATE TABLE `flight_user` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `password` varchar(128) NOT NULL, `last_login` datetime NULL, `is_superuser` bool NOT NULL, `username` varchar(150) NOT NULL UNIQUE, `first_name` varchar(150) NOT NULL, `last_name` varchar(150) NOT NULL, `email` varchar(254) NOT NULL, `is_staff` bool NOT NULL, `is_active` bool NOT NULL, `date_joined` datetime NOT NULL);
INSERT INTO `flight_user` VALUES(1,'pbkdf2_sha256$216000$zKucc8N0a1Fi$grPOXsmsLutx7YMUqL5jYPEbaGkD0UobWghSufSr+dA=','2022-07-11 17:35:26.842732',1,'annu','Ayush','Kumar','ayush@mail.com',1,1,'2022-07-08 23:25:48');


-- Place Table
CREATE TABLE `flight_place` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `city` varchar(64) NOT NULL, `airport` varchar(64) NOT NULL, `code` varchar(3) NOT NULL, `country` varchar(64) NOT NULL);
INSERT INTO `flight_place` VALUES(1,'Atlanta','Hartsfieldâ€“Jackson Atlanta International Airport','ATL','United States');
INSERT INTO `flight_place` VALUES(2,'Beijing','Beijing Capital International Airport','PEK','China');
INSERT INTO `flight_place` VALUES(3,'Dubai','Dubai International Airport','DXB','United Arab Emirates');

-- User group Table
CREATE TABLE `flight_user_groups` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `user_id` integer NOT NULL REFERENCES `flight_user` (`id`) DEFERRABLE INITIALLY DEFERRED, `group_id` integer NOT NULL REFERENCES `auth_group` (`id`) DEFERRABLE INITIALLY DEFERRED);
-- User Permission Table
CREATE TABLE `flight_user_user_permissions` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `user_id` integer NOT NULL REFERENCES `flight_user` (`id`) DEFERRABLE INITIALLY DEFERRED, `permission_id` integer NOT NULL REFERENCES `auth_permission` (`id`) DEFERRABLE INITIALLY DEFERRED);

-- Week Table
CREATE TABLE `flight_week` (`id` integer NOT NULL PRIMARY KEY AUTO_INCREMENT, `number` integer NOT NULL, `name` varchar(16) NOT NULL);
INSERT INTO `flight_week` VALUES(1,0,'Monday');
INSERT INTO `flight_week` VALUES(2,1,'Tuesday');
INSERT INTO `flight_week` VALUES(3,2,'Wednesday');



CREATE UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq` ON `django_content_type` (`app_label`, `model`);
CREATE UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` ON `auth_group_permissions` (`group_id`, `permission_id`);
CREATE INDEX `auth_group_permissions_group_id_b120cbf9` ON `auth_group_permissions` (`group_id`);
CREATE INDEX `flight_user_user_permissions_permission_id_9b905af4` ON `flight_user_user_permissions` (`permission_id`);
CREATE INDEX `flight_ticket_flight_id_a15cbce3` ON `flight_ticket` (`flight_id`);
CREATE INDEX `flight_ticket_user_id_1bab6eb7` ON `flight_ticket` (`user_id`);
CREATE UNIQUE INDEX `flight_ticket_passengers_ticket_id_passenger_id_f199800b_uniq` ON `flight_ticket_passengers` (`ticket_id`, `passenger_id`);
CREATE INDEX `flight_ticket_passengers_ticket_id_73070d17` ON `flight_ticket_passengers` (`ticket_id`);
CREATE INDEX `flight_ticket_passengers_passenger_id_7ca7abe9` ON `flight_ticket_passengers` (`passenger_id`);
