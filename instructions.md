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
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin for Vite client |
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

### Automatic Synchronization on Connection:
Following the production standard of enterprise Node.js/MySQL backends, **every time the backend server starts or restarts**, it automatically executes:
1. `initDb()`: Verifies the MySQL connection and creates all missing tables (`users`, `venues`, `clubs`, `events`, `event_registrations`, `event_reviews`, `notifications`).
2. `syncDatabase()`: Reads the default Admin, Student, and Club Lead credentials directly from `backend/.env`. If the accounts already exist, it updates their bcrypt password hashes to match `.env`; if missing, it creates them. This guarantees your database credentials are always in sync with your `.env` file without requiring manual re-seeding!
3. Pre-populates default venues, clubs, and competition events if the database tables are empty.

### Manual Seeding Script:
You can also run a manual database seed at any time:

```bash
# From the root directory:
npm run seed     # or npm run db:seed

# Or directly from the backend directory:
cd backend && npm run seed
```

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

---

## 7. Local File Upload Storage

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
