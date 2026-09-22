-- UniSync Campus OS Database Schema (MySQL)
-- Tables are created in the database specified by DB_NAME in .env

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'club', 'student') NOT NULL DEFAULT 'student',
  `phone` VARCHAR(50) DEFAULT NULL,
  `dept` VARCHAR(100) DEFAULT NULL,
  `assigned_club` VARCHAR(150) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Campus Venues Table
CREATE TABLE IF NOT EXISTS `venues` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `capacity` INT NOT NULL DEFAULT 100,
  `building` VARCHAR(150) NOT NULL,
  `facilities` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Clubs Table
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `dept` VARCHAR(100) NOT NULL,
  `president` VARCHAR(150) NOT NULL,
  `coordinator` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `description` TEXT,
  `category` VARCHAR(100) DEFAULT 'Academic',
  `logo_url` VARCHAR(255) DEFAULT NULL,
  `constitution_pdf_url` VARCHAR(255) DEFAULT NULL,
  `members_count` INT NOT NULL DEFAULT 0,
  `events_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_clubs_dept` (`dept`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Events & Proposals Table
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `club` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Competition',
  `description` TEXT,
  `justification` TEXT,
  `date` VARCHAR(100) NOT NULL,
  `time_slot` VARCHAR(100) NOT NULL,
  `month` VARCHAR(20) DEFAULT NULL,
  `day` VARCHAR(20) DEFAULT NULL,
  `venue` VARCHAR(150) NOT NULL,
  `budget` VARCHAR(50) NOT NULL DEFAULT '$1,000',
  `attendees` INT NOT NULL DEFAULT 100,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Upcoming',
  `approval_status` VARCHAR(50) NOT NULL DEFAULT 'Approved',
  `timeframe` VARCHAR(50) NOT NULL DEFAULT 'Future',
  `lead_coordinator` VARCHAR(150) DEFAULT NULL,
  `coordinator_email` VARCHAR(191) DEFAULT NULL,
  `faculty_advisor` VARCHAR(150) DEFAULT NULL,
  `student_host` VARCHAR(150) DEFAULT NULL,
  `hosts_json` JSON DEFAULT NULL,
  `agenda_json` JSON DEFAULT NULL,
  `budget_breakdown_json` JSON DEFAULT NULL,
  `ai_summary_json` JSON DEFAULT NULL,
  `has_reg_form` BOOLEAN NOT NULL DEFAULT TRUE,
  `reg_form_config_json` JSON DEFAULT NULL,
  `registration_json` JSON DEFAULT NULL,
  `poster_url` VARCHAR(255) DEFAULT NULL,
  `guidelines_pdf_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_events_club` (`club`),
  INDEX `idx_events_status` (`status`),
  INDEX `idx_events_approval` (`approval_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Event Registrations Table
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `student_reg_no` VARCHAR(50) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `track` VARCHAR(100) DEFAULT 'General Track',
  `team_name` VARCHAR(150) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
  `checked_in` BOOLEAN NOT NULL DEFAULT FALSE,
  `ticket_id` VARCHAR(50) NOT NULL UNIQUE,
  `form_responses_json` JSON DEFAULT NULL,
  `resume_or_doc_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_reg_event` (`event_id`),
  INDEX `idx_reg_email` (`email`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Event Reviews Table
CREATE TABLE IF NOT EXISTS `event_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `club` VARCHAR(150) NOT NULL,
  `date` VARCHAR(100) NOT NULL,
  `venue` VARCHAR(150) NOT NULL,
  `overall_rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `turnout_rate` VARCHAR(20) DEFAULT '95%',
  `total_reviews` INT NOT NULL DEFAULT 0,
  `admin_feedback_json` JSON DEFAULT NULL,
  `organizer_reply_json` JSON DEFAULT NULL,
  `reviews_json` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
