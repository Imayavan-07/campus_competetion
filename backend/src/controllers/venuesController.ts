import { Request, Response } from 'express';
import { getDb, mockStore } from '../db/connection';

export async function getVenues(req: Request, res: Response): Promise<void> {
  const db = getDb();
  let venues = mockStore.venues;

  if (db.isMySQL && db.pool) {
    try {
      const [rows]: any = await db.pool.query('SELECT * FROM venues ORDER BY id ASC');
      if (rows && rows.length > 0) {
        venues = rows;
      }
    } catch (e) {
      console.error('[MySQL Get Venues Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    data: venues,
    total: venues.length,
  });
}
