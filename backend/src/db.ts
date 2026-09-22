import mysql, { Pool } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { ENV } from './config/env';
import {
  INITIAL_VENUES,
  INITIAL_CLUBS,
  INITIAL_MEMBERS,
  getInitialUsers,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_REVIEWS,
} from './db/seedData';

let pool: Pool | null = null;
let isConnectedToMySQL = false;

// Resilient In-Memory store fallback
export const mockStore = {
  users: [] as any[],
  venues: [...INITIAL_VENUES],
  clubs: [...INITIAL_CLUBS],
  members: [...INITIAL_MEMBERS],
  events: [...INITIAL_EVENTS],
  registrations: [...INITIAL_REGISTRATIONS],
  reviews: [...INITIAL_REVIEWS],
};

/**
 * Access the database instance or connection state
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
  }
};

/**
 * Create connection pool to MySQL
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
 * Initialize MySQL Database tables, inline migrations, and synchronize default credentials
 */
export async function initDb() {
  console.log('🔄 Initializing MySQL Database Connection...');

  // Ensure in-memory mock store has bcrypt passwords
  mockStore.users = await getInitialUsers();

  try {
    // 1. Direct connection attempt to target database
    try {
      pool = createConnectionPool();
      const testConn = await pool.getConnection();
      testConn.release();
    } catch (directErr: any) {
      // If DB does not exist, connect without database to create it
      if (directErr.code === 'ER_BAD_DB_ERROR' || directErr.errno === 1049) {
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

    // 2. Ensure all core tables exist
    await createTablesIfNotExist();

    // 3. Auto-sync credentials from .env and seed initial data
    await syncDatabase();

  } catch (err: any) {
    isConnectedToMySQL = false;
    console.warn(`\n⚠️  [Database Warning] Could not connect to MySQL server (${err.code || err.message}).`);
    console.warn(`⚠️  [Database Notice] Operating in Resilient Mock DB mode for local development.`);
    console.warn(`💡 [Database Tip] To connect to MySQL, verify host, port, user, password in backend/.env.\n`);
  }
}

/**
 * Core table creation schema
 */
async function createTablesIfNotExist() {
  if (!pool) return;

  const schemaPath = path.resolve(__dirname, 'db/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const statements = schemaSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (e: any) {
        console.warn(`⚠️  Schema statement notice: ${e.message}`);
      }
    }
    console.log('✅ Verified schema tables in database.');
  }
}

/**
 * Synchronize DB default credentials and seed sample data whenever backend is connected
 */
export async function syncDatabase() {
  if (!pool) return;

  console.log('🔄 Synchronizing environment credentials & seed data with MySQL...');

  // 1. Sync Default Administrator Account
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

  // 2. Sync Default Student Account
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

  // 3. Sync Default Club Organizer Account
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

  // 4. Seed Venues if empty
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

  // 5. Seed Clubs if empty
  const [clubCount]: any = await pool.query('SELECT COUNT(*) as count FROM clubs');
  if (clubCount[0].count === 0) {
    for (const c of INITIAL_CLUBS) {
      await pool.query(
        `INSERT INTO clubs (id, name, dept, president, coordinator, email, phone, description, category, members_count, events_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), president = VALUES(president)`,
        [c.id, c.name, c.dept, c.president, c.coordinator, c.email, c.phone, c.description, c.category, c.members_count, c.events_count]
      );
    }
    console.log(`🎪 Seeded ${INITIAL_CLUBS.length} student clubs.`);
  }

  // 6. Seed Events if empty
  const [eventCount]: any = await pool.query('SELECT COUNT(*) as count FROM events');
  if (eventCount[0].count === 0) {
    for (const e of INITIAL_EVENTS) {
      await pool.query(
        `INSERT INTO events (id, title, club, category, description, justification, date, time_slot, month, day, venue, budget, attendees, status, approval_status, timeframe, lead_coordinator, coordinator_email, agenda_json, budget_breakdown_json, ai_summary_json, has_reg_form, reg_form_config_json, registration_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [
          e.id,
          e.title,
          e.club,
          e.category,
          e.description,
          e.justification,
          e.date,
          e.time_slot,
          e.month,
          e.day,
          e.venue,
          e.budget,
          e.attendees,
          e.status,
          e.approval_status,
          e.timeframe,
          e.lead_coordinator,
          e.coordinator_email,
          JSON.stringify(e.agenda_json),
          JSON.stringify(e.budget_breakdown_json),
          JSON.stringify(e.ai_summary_json),
          e.has_reg_form ? 1 : 0,
          JSON.stringify(e.reg_form_config_json),
          JSON.stringify(e.registration_json),
        ]
      );
    }
    console.log(`📅 Seeded ${INITIAL_EVENTS.length} campus events.`);
  }

  // 7. Seed Registrations if empty
  const [regCount]: any = await pool.query('SELECT COUNT(*) as count FROM event_registrations');
  if (regCount[0].count === 0) {
    for (const r of INITIAL_REGISTRATIONS) {
      await pool.query(
        `INSERT INTO event_registrations (id, event_id, student_name, student_reg_no, email, track, team_name, status, checked_in, ticket_id, form_responses_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [
          r.id,
          r.event_id,
          r.student_name,
          r.student_reg_no,
          r.email,
          r.track,
          r.team_name,
          r.status,
          r.checked_in ? 1 : 0,
          r.ticket_id,
          JSON.stringify(r.form_responses_json),
        ]
      );
    }
    console.log(`🎟️ Seeded ${INITIAL_REGISTRATIONS.length} event registrations.`);
  }

  // 8. Seed Reviews if empty
  const [revCount]: any = await pool.query('SELECT COUNT(*) as count FROM event_reviews');
  if (revCount[0].count === 0) {
    for (const rev of INITIAL_REVIEWS) {
      await pool.query(
        `INSERT INTO event_reviews (id, event_id, title, club, date, venue, overall_rating, turnout_rate, total_reviews, admin_feedback_json, organizer_reply_json, reviews_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [
          rev.id,
          rev.event_id,
          rev.title,
          rev.club,
          rev.date,
          rev.venue,
          rev.overall_rating,
          rev.turnout_rate,
          rev.total_reviews,
          JSON.stringify(rev.admin_feedback_json),
          JSON.stringify(rev.organizer_reply_json),
          JSON.stringify(rev.reviews_json),
        ]
      );
    }
    console.log(`⭐ Seeded ${INITIAL_REVIEWS.length} event reviews.`);
  }

  console.log('✅ Database synchronization complete.\n');
}

// Backward-compatible export
export const initDatabase = initDb;
