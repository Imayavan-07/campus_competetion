import { Request, Response } from 'express';
import { z } from 'zod';
import { getDb, mockStore } from '../db/connection';
import { AuthenticatedRequest } from '../types';

export const createMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  role: z.string().default('Club Coordinator'),
  dept: z.string().default('Computer Science'),
  assignedClub: z.string().optional(),
  assigned_club: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const updateMemberSchema = createMemberSchema.partial();

export async function getMembers(req: Request, res: Response): Promise<void> {
  const { search, role, dept, status, sortBy } = req.query;
  const db = getDb();

  let members: any[] = [...mockStore.members];

  if (db.isMySQL && db.pool) {
    try {
      const [rows]: any = await db.pool.query(
        'SELECT id, name, role, email, phone, dept, assigned_club, status FROM users'
      );
      if (rows && rows.length > 0) {
        members = rows.map((r: any) => ({
          ...r,
          assignedClub: r.assigned_club,
        }));
      }
    } catch (e) {
      console.error('[MySQL Get Members Error]', e);
    }
  }

  let filtered = members.map((m: any) => ({
    ...m,
    assignedClub: m.assignedClub || m.assigned_club || 'General Faculty',
  }));

  if (role && role !== 'All') {
    filtered = filtered.filter((m) => m.role.toLowerCase() === String(role).toLowerCase());
  }

  if (dept && dept !== 'All') {
    filtered = filtered.filter((m) => m.dept.toLowerCase() === String(dept).toLowerCase());
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((m) => m.status.toLowerCase() === String(status).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.dept?.toLowerCase().includes(q) ||
        m.assignedClub?.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'dept-asc') {
    filtered.sort((a, b) => (a.dept || '').localeCompare(b.dept || ''));
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.status(200).json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

export async function createMember(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = req.body;
  const db = getDb();

  const newMember: any = {
    id: Date.now(),
    name: data.name,
    role: data.role || 'Club Coordinator',
    email: data.email,
    phone: data.phone || '+1 (555) 000-0000',
    dept: data.dept || 'Computer Science',
    assigned_club: data.assignedClub || data.assigned_club || 'Robotics Society',
    assignedClub: data.assignedClub || data.assigned_club || 'Robotics Society',
    status: data.status || 'Active',
  };

  if (db.isMySQL && db.pool) {
    try {
      const [result]: any = await db.pool.query(
        `INSERT INTO users (name, email, password_hash, role, phone, dept, assigned_club, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newMember.name,
          newMember.email,
          '$2a$10$e89qPkWl1wN9E0Z8l8g3IeR1K6p0j5d3a3m4b5c6d7e8f9a0b1c2', // default bcrypt hash
          newMember.role.toLowerCase().includes('admin') ? 'admin' : 'club',
          newMember.phone,
          newMember.dept,
          newMember.assigned_club,
          newMember.status,
        ]
      );
      newMember.id = result.insertId;
    } catch (e) {
      console.error('[MySQL Insert Member Error]', e);
    }
  }

  mockStore.members.unshift(newMember);

  res.status(201).json({
    success: true,
    message: 'Member successfully added.',
    data: newMember,
  });
}

export async function updateMember(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const data = req.body;
  const db = getDb();

  if (db.isMySQL && db.pool) {
    try {
      const assignedClubVal = data.assignedClub || data.assigned_club;
      await db.pool.query(
        `UPDATE users SET name = COALESCE(?, name),
                          email = COALESCE(?, email),
                          phone = COALESCE(?, phone),
                          role = COALESCE(?, role),
                          dept = COALESCE(?, dept),
                          assigned_club = COALESCE(?, assigned_club),
                          status = COALESCE(?, status)
         WHERE id = ?`,
        [
          data.name || null,
          data.email || null,
          data.phone || null,
          data.role ? (data.role.toLowerCase().includes('admin') ? 'admin' : 'club') : null,
          data.dept || null,
          assignedClubVal || null,
          data.status || null,
          id,
        ]
      );
    } catch (e) {
      console.error('[MySQL Update Member Error]', e);
    }
  }

  const idx = mockStore.members.findIndex((m) => m.id === id);
  if (idx !== -1) {
    const prev: any = mockStore.members[idx];
    mockStore.members[idx] = {
      ...prev,
      ...data,
      assignedClub: data.assignedClub || data.assigned_club || prev.assignedClub || prev.assigned_club,
    };
  }

  res.status(200).json({
    success: true,
    message: 'Member successfully updated.',
    data: mockStore.members[idx] || { id, ...data },
  });
}

export async function toggleMemberStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const db = getDb();

  let newStatus = 'Active';
  const idx = mockStore.members.findIndex((m) => m.id === id);
  if (idx !== -1) {
    newStatus = mockStore.members[idx].status === 'Active' ? 'Inactive' : 'Active';
    mockStore.members[idx].status = newStatus;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
    } catch (e) {
      console.error('[MySQL Toggle Member Status Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: `Member status updated to ${newStatus}.`,
    data: { id, status: newStatus },
  });
}

export async function deleteMember(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const db = getDb();

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('DELETE FROM users WHERE id = ?', [id]);
    } catch (e) {
      console.error('[MySQL Delete Member Error]', e);
    }
  }

  mockStore.members = mockStore.members.filter((m) => m.id !== id);

  res.status(200).json({
    success: true,
    message: 'Member removed successfully.',
  });
}
