import { Request, Response } from 'express';
import { z } from 'zod';
import { getDb, mockStore } from '../db/connection';
import { AuthenticatedRequest } from '../types';

export const createClubSchema = z.object({
  name: z.string().min(2, 'Club name is required'),
  dept: z.string().min(2, 'Department is required'),
  president: z.string().min(2, 'President name is required'),
  coordinator: z.string().min(2, 'Faculty coordinator is required'),
  email: z.string().email('Valid university club email is required'),
  phone: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  logo_url: z.string().nullable().optional(),
  constitution_pdf_url: z.string().nullable().optional(),
  members_count: z.number().optional().default(0),
  events_count: z.number().optional().default(0),
});

export const updateClubSchema = createClubSchema.partial();

export async function getClubs(req: Request, res: Response): Promise<void> {
  const { search, dept, sortBy, minMembers, minEvents } = req.query;
  const db = getDb();

  let clubs = [...mockStore.clubs];

  if (db.isMySQL && db.pool) {
    try {
      let sql = 'SELECT * FROM clubs WHERE 1=1';
      const params: any[] = [];

      if (dept && dept !== 'All') {
        sql += ' AND dept = ?';
        params.push(dept);
      }
      if (search) {
        sql += ' AND (name LIKE ? OR president LIKE ? OR coordinator LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }
      if (minMembers) {
        sql += ' AND members_count >= ?';
        params.push(Number(minMembers));
      }
      if (minEvents) {
        sql += ' AND events_count >= ?';
        params.push(Number(minEvents));
      }

      const [rows]: any = await db.pool.query(sql, params);
      if (rows && rows.length > 0) {
        clubs = rows.map((r: any) => ({
          ...r,
          members: r.members_count,
          events: r.events_count,
        }));
      }
    } catch (e) {
      console.error('[MySQL Get Clubs Error]', e);
    }
  }

  // Filter in memory for fallback or additional transforms
  let filtered = clubs.map((c) => ({
    ...c,
    members: c.members_count ?? (c as any).members ?? 0,
    events: c.events_count ?? (c as any).events ?? 0,
  }));

  if (dept && dept !== 'All') {
    filtered = filtered.filter((c) => c.dept.toLowerCase() === String(dept).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.president?.toLowerCase().includes(q) ||
        c.coordinator?.toLowerCase().includes(q) ||
        c.dept?.toLowerCase().includes(q)
    );
  }

  if (minMembers) {
    filtered = filtered.filter((c) => c.members >= Number(minMembers));
  }

  if (minEvents) {
    filtered = filtered.filter((c) => c.events >= Number(minEvents));
  }

  // Sorting
  if (sortBy === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'members-desc') {
    filtered.sort((a, b) => b.members - a.members);
  } else if (sortBy === 'members-asc') {
    filtered.sort((a, b) => a.members - b.members);
  } else if (sortBy === 'events-desc') {
    filtered.sort((a, b) => b.events - a.events);
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.status(200).json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

export async function getClubById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const db = getDb();

  let club: any = null;

  if (db.isMySQL && db.pool) {
    try {
      const [rows]: any = await db.pool.query('SELECT * FROM clubs WHERE id = ?', [id]);
      if (rows.length > 0) club = rows[0];
    } catch (e) {
      console.error('[MySQL Get Club By ID Error]', e);
    }
  }

  if (!club) {
    club = mockStore.clubs.find((c) => c.id === id);
  }

  if (!club) {
    res.status(404).json({ success: false, message: `Club with ID ${id} not found.` });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      ...club,
      members: club.members_count ?? club.members ?? 0,
      events: club.events_count ?? club.events ?? 0,
    },
  });
}

export async function createClub(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = req.body;
  const db = getDb();

  const newClub: any = {
    id: Date.now(),
    name: data.name,
    dept: data.dept,
    president: data.president,
    coordinator: data.coordinator,
    email: data.email,
    phone: data.phone || '',
    description: data.description || '',
    category: data.category || 'Academic',
    logo_url: data.logo_url || null,
    constitution_pdf_url: data.constitution_pdf_url || null,
    members_count: data.members_count || 0,
    events_count: data.events_count || 0,
    created_at: new Date().toISOString(),
  };

  if (db.isMySQL && db.pool) {
    try {
      const [result]: any = await db.pool.query(
        `INSERT INTO clubs (name, dept, president, coordinator, email, phone, description, category, logo_url, constitution_pdf_url, members_count, events_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newClub.name,
          newClub.dept,
          newClub.president,
          newClub.coordinator,
          newClub.email,
          newClub.phone,
          newClub.description,
          newClub.category,
          newClub.logo_url,
          newClub.constitution_pdf_url,
          newClub.members_count,
          newClub.events_count,
        ]
      );
      newClub.id = result.insertId;
    } catch (e: any) {
      console.error('[MySQL Insert Club Error]', e);
      if (e.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ success: false, message: 'A club with this name already exists.' });
        return;
      }
    }
  }

  mockStore.clubs.unshift(newClub);

  res.status(201).json({
    success: true,
    message: 'Club registered successfully.',
    data: {
      ...newClub,
      members: newClub.members_count,
      events: newClub.events_count,
    },
  });
}

export async function updateClub(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const data = req.body;
  const db = getDb();

  let clubIndex = mockStore.clubs.findIndex((c) => c.id === id);
  if (clubIndex === -1 && (!db.isMySQL || !db.pool)) {
    res.status(404).json({ success: false, message: `Club with ID ${id} not found.` });
    return;
  }

  if (db.isMySQL && db.pool) {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      Object.entries(data).forEach(([key, val]) => {
        if (key === 'members') key = 'members_count';
        if (key === 'events') key = 'events_count';
        fields.push(`\`${key}\` = ?`);
        values.push(val);
      });

      if (fields.length > 0) {
        values.push(id);
        await db.pool.query(`UPDATE clubs SET ${fields.join(', ')} WHERE id = ?`, values);
      }
    } catch (e) {
      console.error('[MySQL Update Club Error]', e);
    }
  }

  if (clubIndex !== -1) {
    mockStore.clubs[clubIndex] = {
      ...mockStore.clubs[clubIndex],
      ...data,
      members_count: data.members ?? mockStore.clubs[clubIndex].members_count,
      events_count: data.events ?? mockStore.clubs[clubIndex].events_count,
    };
  }

  res.status(200).json({
    success: true,
    message: 'Club updated successfully.',
    data: mockStore.clubs[clubIndex] || { id, ...data },
  });
}

export async function deleteClub(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const db = getDb();

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('DELETE FROM clubs WHERE id = ?', [id]);
    } catch (e) {
      console.error('[MySQL Delete Club Error]', e);
    }
  }

  mockStore.clubs = mockStore.clubs.filter((c) => c.id !== id);

  res.status(200).json({
    success: true,
    message: 'Club successfully deleted.',
  });
}
