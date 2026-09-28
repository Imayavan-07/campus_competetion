import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { initDb, syncDatabase, clearDatabase } from './db';
import { ENV } from './config/env';

const seed = async () => {
  console.log('\n=============================================================');
  console.log('         UniSync Campus Platform - Database Seeder          ');
  console.log('=============================================================\n');
  console.log(`[Config] Target Host:     ${ENV.DB.HOST}:${ENV.DB.PORT}`);
  console.log(`[Config] Target Database: ${ENV.DB.NAME}`);
  console.log(`[Config] Admin Email:     ${ENV.ADMIN.EMAIL}`);
  console.log(`[Config] Student Email:   ${ENV.STUDENT.EMAIL}`);
  console.log(`[Config] Club Lead Email: ${ENV.CLUB_LEAD.EMAIL}\n`);

  try {
    console.log('🔄 Initializing database connection & schema tables...');
    await initDb();

    console.log('🧹 Clearing old data for fresh seed (no member seed)...');
    await clearDatabase();

    console.log('🔄 Seeding ONLY official login credentials and venues list...');
    await syncDatabase();

    console.log('\n=============================================================');
    console.log('✅ Fresh Database Seed Completed Successfully!');
    console.log('   - Old data wiped cleanly');
    console.log('   - 0 Member seeds');
    console.log('   - Only 3 official login credentials seeded');
    console.log('   - Campus venues list seeded');
    console.log('=============================================================\n');
    console.log('Configured Default Login Credentials:');
    console.log('-------------------------------------------------------------');
    console.log(`1. Administrator:`);
    console.log(`   Email:    ${ENV.ADMIN.EMAIL}`);
    console.log(`   Password: ${ENV.ADMIN.PASSWORD}\n`);
    console.log(`2. Student Participant:`);
    console.log(`   Email:    ${ENV.STUDENT.EMAIL}`);
    console.log(`   Password: ${ENV.STUDENT.PASSWORD}\n`);
    console.log(`3. Club Coordinator:`);
    console.log(`   Email:    ${ENV.CLUB_LEAD.EMAIL}`);
    console.log(`   Password: ${ENV.CLUB_LEAD.PASSWORD}`);
    console.log('-------------------------------------------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed with error:', err);
    process.exit(1);
  }
};

seed();
