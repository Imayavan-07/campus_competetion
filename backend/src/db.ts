import mysql, { Pool } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { ENV } from './config/env';
import {
  INITIAL_VENUES,
  getInitialUsers,
} from './db/seedData';

let pool: Pool | null = null;
let isConnectedToMySQL = false;

// Resilient In-Memory store fallback
// Seeded ONLY with the 3 login credentials and venues list; no members or mock events
export const mockStore = {
  users: [] as any[],
  venues: [...INITIAL_VENUES],
  clubs: [] as any[],
  members: [] as any[],
  events: [] as any[],
  registrations: [] as any[],
  reviews: [] as any[],
  notifications: [] as any[],
};

/**
 * Access the active database instance or connection state
 */
export function getDb() {
  return {
    pool,
    isMySQL: isConnectedToMySQL,
  };
}

export const db = {
  get pool() {
    return pool;
  },
  execute: async (sql: string, params?: any[]) => {
    if (!pool) throw new Error('Database pool not initialized');
    return pool.execute(sql, params);
  },
  query: async (sql: string, params?: any[]) => {
    if (!pool) throw new Error('Database pool not initialized');
    return pool.query(sql, params);
  },
};

/**
 * Create connection pool to MySQL target database
 */
function createConnectionPool() {
  return mysql.createPool({
    host: ENV.DB.HOST,
    port: ENV.DB.PORT,
    user: ENV.DB.USER,
    password: ENV.DB.PASSWORD,
    database: ENV.DB.NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}

/**
 * Initialize MySQL Database:
 * 1. Verifies connection & auto-creates database schema if missing.
 * 2. Autocreates all tables (users, venues, clubs, events, registrations, reviews, notifications).
 * 3. Applies safe inline migrations.
 * 4. Synchronizes only the 3 login credentials and venues list.
 */
export async function initDb() {
  console.log('🔄 Initializing MySQL Database Connection...');

  // Initialize in-memory fallback with only the 3 credentials
  mockStore.users = await getInitialUsers();
  mockStore.venues = [...INITIAL_VENUES];
  mockStore.clubs = [];
  mockStore.members = [];
  mockStore.events = [];
  mockStore.registrations = [];
  mockStore.reviews = [];
  mockStore.notifications = [];

  try {
    // 1. Direct connection attempt to target database
    try {
      pool = createConnectionPool();
      const testConn = await pool.getConnection();
      testConn.release();
    } catch (directErr: any) {
      // If target database does not exist, connect to server without database and create it
      if (directErr.code === 'ER_BAD_DB_ERROR' || directErr.errno === 1049) {
        console.log(`📦 Database \`${ENV.DB.NAME}\` does not exist. Creating schema...`);
        const rootConn = await mysql.createConnection({
          host: ENV.DB.HOST,
          port: ENV.DB.PORT,
          user: ENV.DB.USER,
          password: ENV.DB.PASSWORD,
        });
        await rootConn.query(
          `CREATE DATABASE IF NOT EXISTS \`${ENV.DB.NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
        );
        await rootConn.end();

        pool = createConnectionPool();
        const testConn = await pool.getConnection();
        testConn.release();
      } else {
        throw directErr;
      }
    }

    isConnectedToMySQL = true;
    console.log(`📂 Database connected successfully: ${ENV.DB.NAME} on ${ENV.DB.HOST}:${ENV.DB.PORT}`);

    // 2. Autocreate all required tables
    await createTablesIfNotExist();

    // 3. Apply safe inline column migrations
    await runMigrations();

    // 4. Synchronize default credentials from .env and seed venues
    await syncDatabase();

  } catch (err: any) {
    isConnectedToMySQL = false;
    pool = null;
    console.warn(`\n⚠️  [Database Warning] Could not connect to MySQL server (${err.code || err.message}).`);
    console.warn(`⚠️  [Database Notice] Operating in Resilient Mock DB mode for local development.`);
    console.warn(`💡 [Database Tip] To connect to MySQL, verify host, port, user, password in backend/.env.\n`);
  }
}

/**
 * Autocreate all application tables if not exist (structured like leave backend)
 */
async function createTablesIfNotExist() {
  if (!pool) return;

  // 1. Users Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(191) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'club', 'student') NOT NULL DEFAULT 'student',
      phone VARCHAR(50) DEFAULT NULL,
      dept VARCHAR(100) DEFAULT NULL,
      assigned_club VARCHAR(150) DEFAULT NULL,
      status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_role (role),
      INDEX idx_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Venues Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS venues (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      capacity INT NOT NULL DEFAULT 100,
      building VARCHAR(150) NOT NULL,
      facilities TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Clubs Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clubs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL UNIQUE,
      dept VARCHAR(100) NOT NULL,
      president VARCHAR(150) NOT NULL,
      coordinator VARCHAR(150) NOT NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(50) DEFAULT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'Academic',
      logo_url VARCHAR(255) DEFAULT NULL,
      constitution_pdf_url VARCHAR(255) DEFAULT NULL,
      members_count INT NOT NULL DEFAULT 0,
      events_count INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_clubs_dept (dept)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Events & Proposals Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      club VARCHAR(150) NOT NULL,
      category VARCHAR(100) DEFAULT 'Competition',
      description TEXT,
      justification TEXT,
      date VARCHAR(100) NOT NULL,
      time_slot VARCHAR(100) NOT NULL,
      month VARCHAR(20) DEFAULT NULL,
      day VARCHAR(20) DEFAULT NULL,
      venue VARCHAR(150) NOT NULL,
      budget VARCHAR(50) NOT NULL DEFAULT '$1,000',
      attendees INT NOT NULL DEFAULT 100,
      status VARCHAR(50) NOT NULL DEFAULT 'Upcoming',
      approval_status VARCHAR(50) NOT NULL DEFAULT 'Approved',
      timeframe VARCHAR(50) NOT NULL DEFAULT 'Future',
      lead_coordinator VARCHAR(150) DEFAULT NULL,
      coordinator_email VARCHAR(191) DEFAULT NULL,
      faculty_advisor VARCHAR(150) DEFAULT NULL,
      student_host VARCHAR(150) DEFAULT NULL,
      hosts_json JSON DEFAULT NULL,
      agenda_json JSON DEFAULT NULL,
      budget_breakdown_json JSON DEFAULT NULL,
      ai_summary_json JSON DEFAULT NULL,
      has_reg_form BOOLEAN NOT NULL DEFAULT TRUE,
      reg_form_config_json JSON DEFAULT NULL,
      registration_json JSON DEFAULT NULL,
      poster_url VARCHAR(255) DEFAULT NULL,
      guidelines_pdf_url VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_events_club (club),
      INDEX idx_events_status (status),
      INDEX idx_events_approval (approval_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. Event Registrations Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      student_name VARCHAR(150) NOT NULL,
      student_reg_no VARCHAR(50) NOT NULL,
      email VARCHAR(191) NOT NULL,
      track VARCHAR(100) DEFAULT 'General Track',
      team_name VARCHAR(150) DEFAULT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
      checked_in BOOLEAN NOT NULL DEFAULT FALSE,
      ticket_id VARCHAR(50) NOT NULL UNIQUE,
      form_responses_json JSON DEFAULT NULL,
      resume_or_doc_url VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_reg_event (event_id),
      INDEX idx_reg_email (email),
      CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 6. Event Reviews Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT DEFAULT NULL,
      title VARCHAR(200) NOT NULL,
      club VARCHAR(150) NOT NULL,
      date VARCHAR(100) NOT NULL,
      venue VARCHAR(150) NOT NULL,
      overall_rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
      turnout_rate VARCHAR(20) DEFAULT '95%',
      total_reviews INT NOT NULL DEFAULT 0,
      admin_feedback_json JSON DEFAULT NULL,
      organizer_reply_json JSON DEFAULT NULL,
      reviews_json JSON DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 7. Notifications Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      title VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'info',
      is_read TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_notif_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ Verified & created application database tables.');
}

/**
 * Safe inline schema migrations (pattern from leave backend)
 */
async function runMigrations() {
  if (!pool) return;

  // Migration: Ensure assigned_club in users
  try {
    await pool.query('ALTER TABLE users ADD COLUMN assigned_club VARCHAR(150) NULL AFTER dept');
    console.log('📦 Migration: Added assigned_club to users table');
  } catch (err: any) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      // Field already exists
    }
  }

  // Migration: Ensure phone in users
  try {
    await pool.query('ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL AFTER role');
    console.log('📦 Migration: Added phone to users table');
  } catch (err: any) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      // Field already exists
    }
  }
}

/**
 * Clear/Truncate all database tables (clears old data upon re-seeding)
 */
export async function clearDatabase() {
  console.log('🧹 Clearing old database data for fresh seed...');

  // Reset in-memory mock store
  mockStore.clubs = [];
  mockStore.members = [];
  mockStore.events = [];
  mockStore.registrations = [];
  mockStore.reviews = [];
  mockStore.notifications = [];

  if (pool && isConnectedToMySQL) {
    try {
      await pool.query('SET FOREIGN_KEY_CHECKS = 0');
      await pool.query('TRUNCATE TABLE event_reviews');
      await pool.query('TRUNCATE TABLE event_registrations');
      await pool.query('TRUNCATE TABLE events');
      await pool.query('TRUNCATE TABLE clubs');
      await pool.query('TRUNCATE TABLE notifications');
      await pool.query('TRUNCATE TABLE venues');
      await pool.query('TRUNCATE TABLE users');
      await pool.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('✅ Truncated MySQL tables cleanly.');
    } catch (e: any) {
      console.error('❌ Error clearing MySQL tables:', e.message);
    }
  }
}

/**
 * Synchronize environment credentials & venues list only.
 * NO member seed, NO mock clubs, NO mock events.
 */
export async function syncDatabase() {
  if (!pool || !isConnectedToMySQL) {
    console.log('ℹ️  MySQL server offline/unreachable; synchronized in-memory resilient store with 3 logins and venues.');
    return;
  }

  console.log('🔄 Synchronizing environment credentials (3 logins) & venues list with MySQL...');

  // 1. Sync Default Administrator Account from .env
  const adminEmail = ENV.ADMIN.EMAIL;
  const adminPassword = ENV.ADMIN.PASSWORD;
  const adminName = ENV.ADMIN.NAME;

  if (adminEmail && adminPassword) {
    const [existingAdmin]: any = await pool.query('SELECT id, role FROM users WHERE email = ?', [adminEmail]);
    const adminHash = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, phone, dept, assigned_club, status)
         VALUES (?, ?, ?, 'admin', '+1 (555) 987-4321', 'Central Governance', 'Executive Council', 'Active')`,
        [adminName, adminEmail, adminHash]
      );
      console.log(`🔱 Seeded Default Admin: ${adminEmail}`);
    } else {
      await pool.query(
        `UPDATE users SET name = ?, password_hash = ?, role = 'admin', status = 'Active' WHERE email = ?`,
        [adminName, adminHash, adminEmail]
      );
      console.log(`🔱 Synchronized Admin credentials from .env: ${adminEmail}`);
    }
  }

  // 2. Sync Default Student Account from .env
  const studentEmail = ENV.STUDENT.EMAIL;
  const studentPassword = ENV.STUDENT.PASSWORD;
  const studentName = ENV.STUDENT.NAME;

  if (studentEmail && studentPassword) {
    const [existingStudent]: any = await pool.query('SELECT id, role FROM users WHERE email = ?', [studentEmail]);
    const studentHash = await bcrypt.hash(studentPassword, 10);

    if (existingStudent.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, phone, dept, assigned_club, status)
         VALUES (?, ?, ?, 'student', '+1 (555) 123-4567', 'Computer Science', NULL, 'Active')`,
        [studentName, studentEmail, studentHash]
      );
      console.log(`🎓 Seeded Default Student: ${studentEmail}`);
    } else {
      await pool.query(
        `UPDATE users SET name = ?, password_hash = ?, role = 'student', status = 'Active' WHERE email = ?`,
        [studentName, studentHash, studentEmail]
      );
      console.log(`🎓 Synchronized Student credentials from .env: ${studentEmail}`);
    }
  }

  // 3. Sync Default Club Coordinator Account from .env
  const clubEmail = ENV.CLUB_LEAD.EMAIL;
  const clubPassword = ENV.CLUB_LEAD.PASSWORD;
  const clubName = ENV.CLUB_LEAD.NAME;

  if (clubEmail && clubPassword) {
    const [existingClub]: any = await pool.query('SELECT id, role FROM users WHERE email = ?', [clubEmail]);
    const clubHash = await bcrypt.hash(clubPassword, 10);

    if (existingClub.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, phone, dept, assigned_club, status)
         VALUES (?, ?, ?, 'club', '+1 (555) 678-1290', 'Electronics & Robotics', 'Robotics Society', 'Active')`,
        [clubName, clubEmail, clubHash]
      );
      console.log(`🏛️ Seeded Default Club Lead: ${clubEmail}`);
    } else {
      await pool.query(
        `UPDATE users SET name = ?, password_hash = ?, role = 'club', assigned_club = 'Robotics Society', status = 'Active' WHERE email = ?`,
        [clubName, clubHash, clubEmail]
      );
      console.log(`🏛️ Synchronized Club Lead credentials from .env: ${clubEmail}`);
    }
  }

  // 4. Seed Venues if empty (Only venues list is pre-seeded)
  const [venueCount]: any = await pool.query('SELECT COUNT(*) as count FROM venues');
  if (venueCount[0].count === 0) {
    for (const v of INITIAL_VENUES) {
      await pool.query(
        `INSERT INTO venues (id, name, capacity, building, facilities)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), capacity = VALUES(capacity)`,
        [v.id, v.name, v.capacity, v.building, v.facilities]
      );
    }
    console.log(`🏟️ Seeded ${INITIAL_VENUES.length} campus venues.`);
  }

  console.log('✅ Database credentials and venues synchronization complete.\n');
}

// Backward-compatible export
export const initDatabase = initDb;
