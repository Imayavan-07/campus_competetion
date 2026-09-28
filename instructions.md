# UniSync Campus Event & Venue Booking Management System
## Complete Setup, Architecture & Operation Guide (`instructions.md`)

UniSync is a fullstack campus competition, event management, and venue booking platform built with **TypeScript**, **Node.js (Express)**, **MySQL**, and **React (Vite + Tailwind CSS)**.

---

## 1. Quick Start: Single Command Execution

From the root project directory (`/campus_competetion`), you can run both the backend and frontend simultaneously with a single command:

```bash
# 1. Install root dependencies (concurrently)
npm install

# 2. Run both Backend (Port 5000) & Frontend (Port 5173) concurrently
npm run dev
```

### What this does:
- Starts **Backend API Server** at: `http://localhost:5000` (with hot reloading via `tsx watch`)
- Starts **Frontend Vite Client** at: `http://localhost:5173` (with instant HMR)

---

## 2. System Prerequisites

1. **Node.js**: v18.0.0 or higher (v20 or v24 recommended)
2. **npm**: v9.0.0 or higher
3. **MySQL**: 8.0 or higher (*Optional for initial preview: the backend automatically detects if MySQL is offline and activates a built-in in-memory fallback store so development is never blocked*).

---

## 3. Project Structure

```
campus_competetion/
├── package.json                 # Root script runner (concurrently)
├── instructions.md              # Complete setup and developer reference
├── README.md                    # Project summary
│
├── backend/                     # Node.js + Express + TypeScript Backend
│   ├── .env                     # Backend environment configuration
│   ├── .env.example             # Template for environment variables
│   ├── package.json             # Backend dependencies & scripts
│   ├── tsconfig.json            # TypeScript compiler configuration
│   ├── uploads/                 # Local directory for file uploads
│   │   ├── images/              # Uploaded posters, banners, and profile images
│   │   └── documents/           # Uploaded PDFs, approval letters, proposals
│   └── src/
│       ├── index.ts             # Express server entry point & middleware
│       ├── config/
│       │   └── env.ts           # Type-safe environment loader
│       ├── db/
│       │   ├── schema.sql       # MySQL DDL table schemas & relationships
│       │   ├── connection.ts    # MySQL connection pool & automatic mock fallback
│       │   ├── seed.ts          # Database seed runner script
│       │   └── seedData.ts      # Initial venues, clubs, events, reviews, and users
│       ├── controllers/         # Business logic for all modules
│       │   ├── authController.ts
│       │   ├── eventsController.ts
│       │   ├── venuesController.ts
│       │   ├── clubsController.ts
│       │   ├── registrationsController.ts
│       │   ├── reviewsController.ts
│       │   ├── uploadController.ts
│       │   └── dashboardController.ts
│       ├── routes/              # Express API route declarations
│       └── middleware/          # JWT auth, role validation, file upload validation
│
└── frontend/                    # React 18 + Vite + TypeScript Frontend
    ├── .env                     # Frontend environment configuration (VITE_API_BASE_URL)
    ├── .env.example             # Frontend template
    ├── package.json             # Frontend dependencies
    ├── vite.config.ts           # Vite configuration & proxy settings
    └── src/
        ├── App.tsx              # Router & layout architecture
        ├── context/
        │   └── AuthContext.tsx  # JWT authentication & session state
        ├── services/            # Axios API service clients
        │   ├── api.ts           # Base Axios client with auth interceptor
        │   ├── authService.ts   # Login / Register / Profile API
        │   ├── eventsService.ts # Event management & filter API
        │   ├── venuesService.ts # Venue catalog & clash check API
        │   ├── clubsService.ts  # Club profile & member API
        │   ├── reviewsService.ts# Post-event review & feedback API
        │   └── uploadService.ts # Multipart file uploader
        └── pages/               # Role-based pages and views
            ├── Login.tsx        # Manual password entry + quick persona presets
            ├── admin/           # Admin dashboard, approvals, clash resolution
            ├── club/            # Club lead console, event builder, forms, reviews
            └── student/         # Student portal, event browsing, ticket pass
```

---

## 4. Environment Variables Configuration

### Backend: `backend/.env`
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Express HTTP server port |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`) |
| `DB_HOST` | `127.0.0.1` | MySQL server host |
| `DB_PORT` | `3306` | MySQL server port |
| `DB_USER` | `root` | MySQL user account |
| `DB_PASSWORD` | *(empty string)* | MySQL user password |
| `DB_NAME` | `unisync_campus` | Target database name |
| `JWT_SECRET` | `unisync_super_secret_jwt_encryption_key_2026!` | Secret key for JWT signature |
| `JWT_EXPIRES_IN` | `50m` | Token & Session lifetime (50 minutes auto-expiration) |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin for Vite client |
| `RATE_LIMIT_MAX` | `1500` | IP rate limit maximum requests per 15 minutes window |
| `UPLOAD_DIR` | `uploads` | Relative directory path for saved uploads |
| `MAX_FILE_SIZE_MB`| `15` | Maximum upload file size in megabytes |
| `ADMIN_NAME` | `Chief Administrator` | Admin account name |
| `ADMIN_EMAIL` | `admin@university.edu` | Admin account login email |
| `ADMIN_PASSWORD` | `Admin@123456` | Admin account initial password |
| `STUDENT_NAME` | `Alex Vance` | Student account name |
| `STUDENT_EMAIL` | `student@university.edu` | Student account login email |
| `STUDENT_PASSWORD` | `Student@123456` | Student account password |
| `CLUB_LEAD_NAME` | `Bob Smith` | Club organizer account name |
| `CLUB_LEAD_EMAIL` | `club.lead@university.edu` | Club organizer login email |
| `CLUB_LEAD_PASSWORD` | `Club@123456` | Club organizer password |

### Frontend: `frontend/.env`
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL of the backend API endpoints |

---

## 5. Database Setup, Auto-Sync & Seeding

### Architecture (Structured like `/home/ares/Projects/leave backend`):
Following the robust enterprise Node.js/MySQL standard:
1. `initDb()`: Verifies MySQL connection, creates the database schema (`CREATE DATABASE IF NOT EXISTS`) if missing, autocreates all core tables (`users`, `venues`, `clubs`, `events`, `event_registrations`, `event_reviews`, `notifications`), and applies safe inline column migrations.
2. `syncDatabase()`: Reads the default Admin, Student, and Club Lead credentials directly from `backend/.env` and upserts them into `users` with bcrypt password hashes. Pre-populates only the campus `venues` list.
3. **No Member or Mock Events Seed**: Initial seeds are strictly restricted to the **three official login credentials** and the **venues list**. There is zero dummy member seeding.

### Manual Seeding & Clean Reset Script:
Whenever `npm run db:seed` is executed, it **clears and truncates all existing tables** before re-seeding the 3 login credentials and venues list:

```bash
# From the root directory:
npm run seed     # or npm run db:seed

# Or directly from the backend directory:
cd backend && npm run db:seed
```

**Seed Results**:
- Wipes all old data from `event_reviews`, `event_registrations`, `events`, `clubs`, `notifications`, `venues`, `users`.
- Seeds **0 Members**.
- Seeds **3 Login Personas**:
  1. Chief Administrator (`admin@university.edu` / `Admin@123456`)
  2. Club Coordinator (`club.lead@university.edu` / `Club@123456`)
  3. Student Participant (`student@university.edu` / `Student@123456`)
- Seeds **12 Campus Venues** for event and calendar bookings.

---

## 6. Authentication & User Roles

UniSync supports full **login-based authentication** with manual password entry, password visibility toggles, bcrypt verification, and JWT session handling.

### Default Login Accounts (Configured in `backend/.env`)

| Role | Email Address | Password | Landing Page |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@university.edu` | `Admin@123456` | `/admin` |
| **Club Organizer** | `club.lead@university.edu` | `Club@123456` | `/club` |
| **Student** | `student@university.edu` | `Student@123456` | `/student` |

### Login Features:
- **Secure Manual Entry**: Pure manual email and password entry with no unsafe client-side credential click triggers or password auto-fill buttons.
- **Show/Hide Password**: Password visibility toggle button to review typed characters.
- **Role-Based Redirection**: Users are automatically routed to their corresponding role portal upon successful JWT token issuance.
- **Protected Route Guards**: Direct access via URL paths (such as `localhost:3000/club` or `/admin`) is strictly guarded. Unauthenticated access immediately redirects to `/login` with return intent preserved. Attempting to access an unauthorized portal with a different role redirects to the user's authorized home.
- **50-Minute Automatic Session Timeout**: All sessions are strictly limited to 50 minutes. If 50 minutes elapse or the backend returns 401 Unauthorized, an institutional modal dialog appears informing the user that their session has expired, providing an **"OK"** button to log out and return to the login screen.
- **IP Traffic & Rate Limiting**: The backend enforces an IP rate limit of **1,500 requests per 15 minutes** for general traffic, alongside strict brute-force limiting on `/api/auth/login` (max 50 attempts per 15 minutes) to protect against credential stuffing.
- **Persona Session Kill & Immediate Logout**: When a user logs out from any persona (Admin, Club Lead, or Student), their active session is marked ended, their JWT token is added to the backend revocation registry (`revokedTokens`) to kill the session immediately, client storage is cleared, and the application LRU cache is completely wiped.
- **LRU Method Caching (Max 15 items, 30 Minutes TTL)**: Implemented high-performance Least Recently Used (LRU) caching on API GET endpoints. Retains a maximum of 15 response objects with an automatic 30-minute Time-To-Live. Least recently accessed items are evicted when the 15-item limit is reached. The cache is entirely cleared upon persona logout or session expiration.
- **Polite & Formatted Error Messages**: Technical error codes (e.g. `Request failed with status 500`, `400`, `401`, `403`, `404`, `429`, database codes) are never displayed directly to users. All errors are sanitized through `formatErrorMessage`, providing clear, institutional explanations and actionable guidance.
- **Cleaned Dynamic Portals**: Removed mock telemetry numbers, hardcoded names, and static placeholders across all login and portal dashboards. Data is dynamically queried from MySQL/database connection.

---

## 7. Member Profile Dossier View & Telemetry

When clicking the **User Profile Pill** in the top navigation bar or the **Profile Dossier** link in the sidebar, the user is navigated to their dedicated **Member Profile Dossier** (`/admin/profile`, `/club/profile`, or `/student/profile`).

### Onboarding Information Displayed:
The profile view displays all institutional attributes captured during member onboarding:
- **Full Legal Name**: Institutional name on record with verified status.
- **Assigned Institutional Role**: Administrator, Club Coordinator, or Student Participant with clearance tier.
- **University Email Address**: Primary SSO destination.
- **Direct Contact Phone**: Direct phone number on record for communications.
- **Assigned Club / Organization**: Campus society affiliation or Central Governance unit.
- **Academic Department**: Faculty jurisdiction (e.g. Computer Science, Central Administration).
- **Account Membership Status**: Active institutional state.
- **Onboarding Enrollment Date**: Official registration timestamp.
- **Zero-Trust Security Policies**: Mandatory 50-minute session lifetime, 1500 req/15m rate limiting, and local LRU cache purge status.

### Profile Updating:
- Members can click **"Edit Profile"** to update their Legal Name, Direct Phone, Department, and Assigned Club.
- Calls `PUT /api/auth/profile` with JWT authentication, persists updates to MySQL (or in-memory mock store), and immediately syncs `AuthContext` and `Header` states.

---

## 8. Local File Upload Storage

Uploaded media files (posters, banners) and documents (event proposals, budget receipts, permissions) are stored on the local server filesystem:

- **Images**: `backend/uploads/images/`
- **Documents & PDFs**: `backend/uploads/documents/`

### Security & Serving Details:
- Files are saved with unique UUID-based filenames to avoid naming collisions (`crypto.randomUUID()`).
- File uploads are validated for allowed MIME types (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
- Uploads are served statically via Express at:
  - `http://localhost:5000/uploads/images/<filename>`
  - `http://localhost:5000/uploads/documents/<filename>`
- Configured with Helmet `crossOriginResourcePolicy: { policy: 'cross-origin' }` so the frontend can safely render uploaded assets.

---

## 8. All Available Scripts

### Root Directory (`/`)
- `npm run dev`: Runs both backend and frontend simultaneously in watch mode.
- `npm run build`: Type-checks and compiles both backend (via `tsc`) and frontend (via `vite build`).
- `npm run start`: Runs compiled backend server and Vite preview.
- `npm run db:seed`: Executes the database schema initialization and seed script.

### Backend Directory (`/backend`)
- `npm run dev`: Starts Express development server with `tsx watch`.
- `npm run build`: Compiles TypeScript files to JavaScript in `backend/dist`.
- `npm run start`: Runs production server `node dist/index.js`.
- `npm run db:seed`: Seeds MySQL database with demo data and bcrypt passwords.

### Frontend Directory (`/frontend`)
- `npm run dev`: Starts Vite local development server at `http://localhost:5173`.
- `npm run build`: Compiles production frontend bundle in `frontend/dist`.
- `npm run preview`: Previews the production build locally.

---

## 9. Troubleshooting

1. **MySQL connection error during startup**:
   - The backend includes an automated fallback: if MySQL is not running on port 3306 or password is incorrect, it issues a helpful notice and switches to an in-memory data store.
   - To connect to your real MySQL database, make sure MySQL is running (`sudo systemctl start mysql` or start your local MySQL server) and update `backend/.env` with your MySQL user/password.
2. **Ports already in use**:
   - If port 5000 or 5173 is in use, modify `PORT` in `backend/.env` or specify `--port <PORT>` in `frontend/package.json`.
3. **Uploading large files**:
   - Maximum upload size is configured via `MAX_FILE_SIZE_MB` in `backend/.env` (default is 15MB).
