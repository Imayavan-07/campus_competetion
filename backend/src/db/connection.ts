// Re-export from root db.ts to maintain backward compatibility across existing controllers
export {
  db,
  getDb,
  mockStore,
  initDb,
  initDatabase,
  syncDatabase,
} from '../db';
