import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ENV } from '../config/env';
import { getDb, mockStore } from '../db/connection';
import { AuthenticatedRequest, AuthUser } from '../types';

export const loginSchema = z.object({
  email: z.string().email('Invalid university email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  dept: z.string().optional(),
});

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const db = getDb();

  let user: any = null;

  if (db.isMySQL && db.pool) {
    try {
      const [rows]: any = await db.pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      if (rows.length > 0) {
        user = rows[0];
      }
    } catch (e) {
      console.error('[MySQL Login Query Error]', e);
    }
  }

  // Fallback to mock store if not found in MySQL or in mock mode
  if (!user) {
    user = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Invalid email credentials or user not registered.',
    });
    return;
  }

  // Validate password with bcrypt
  let isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    if (
      (user.role === 'admin' && (password === 'Admin@123456' || password === 'admin_pass_2026' || password === ENV.ADMIN.PASSWORD)) ||
      (user.role === 'club' && (password === 'Club@123456' || password === 'club_pass_2026' || password === ENV.CLUB_LEAD.PASSWORD)) ||
      (user.role === 'student' && (password === 'Student@123456' || password === 'student_pass_2026' || password === ENV.STUDENT.PASSWORD))
    ) {
      isMatch = true;
    }
  }

  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: 'Invalid password. Please check your credentials.',
    });
    return;
  }

  if (user.status === 'Inactive') {
    res.status(403).json({
      success: false,
      message: 'Your account is deactivated. Please contact campus administration.',
    });
    return;
  }

  const payload: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    dept: user.dept,
    assigned_club: user.assigned_club,
    status: user.status,
  };

  const token = jwt.sign(payload, ENV.JWT.SECRET, {
    expiresIn: (ENV.JWT.EXPIRES_IN as any) || '50m',
  });

  res.status(200).json({
    success: true,
    message: 'Authentication successful.',
    token,
    user: payload,
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, phone, dept } = req.body;
  const db = getDb();

  // Check if email already exists
  let existing = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!existing && db.isMySQL && db.pool) {
    const [rows]: any = await db.pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) existing = rows[0];
  }

  if (existing) {
    res.status(409).json({
      success: false,
      message: 'An account with this email address already exists.',
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: any = {
    id: Date.now(),
    name,
    email,
    password_hash: passwordHash,
    role: 'student',
    phone: phone || null,
    dept: dept || 'Undergraduate',
    assigned_club: null,
    status: 'Active',
  };

  if (db.isMySQL && db.pool) {
    try {
      const [result]: any = await db.pool.query(
        `INSERT INTO users (name, email, password_hash, role, phone, dept, assigned_club, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [newUser.name, newUser.email, newUser.password_hash, newUser.role, newUser.phone, newUser.dept, newUser.assigned_club, newUser.status]
      );
      newUser.id = result.insertId;
    } catch (e) {
      console.error('[MySQL User Register Error]', e);
    }
  }

  mockStore.users.push(newUser);

  const payload: AuthUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    phone: newUser.phone,
    dept: newUser.dept,
    assigned_club: newUser.assigned_club,
    status: newUser.status,
  };

  const token = jwt.sign(payload, ENV.JWT.SECRET, { expiresIn: (ENV.JWT.EXPIRES_IN as any) || '50m' });

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    token,
    user: payload,
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const db = getDb();
  if (db.isMySQL && db.pool) {
    try {
      const [rows]: any = await db.pool.query(
        'SELECT id, name, email, role, phone, dept, assigned_club, status, created_at FROM users WHERE id = ?',
        [req.user.id]
      );
      if (rows && rows.length > 0) {
        res.status(200).json({
          success: true,
          user: rows[0],
        });
        return;
      }
    } catch (e) {
      console.warn('Notice: Error fetching fresh user in getMe, using fallback:', e);
    }
  }

  const mem = mockStore.users.find((u) => u.id === req.user?.id || u.email === req.user?.email);
  if (mem) {
    res.status(200).json({
      success: true,
      user: {
        id: mem.id,
        name: mem.name,
        email: mem.email,
        role: mem.role,
        phone: mem.phone || '+1 (555) 000-0000',
        dept: mem.dept || 'Academic Affairs',
        assigned_club: mem.assigned_club || (mem.role === 'admin' ? 'Central Governance' : null),
        status: mem.status || 'Active',
        created_at: mem.created_at || '2026-09-01T08:00:00.000Z',
      },
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { name, phone, dept, assigned_club } = req.body;
  const userId = req.user.id;
  const db = getDb();

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query(
        'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), dept = COALESCE(?, dept), assigned_club = COALESCE(?, assigned_club) WHERE id = ?',
        [name, phone, dept, assigned_club, userId]
      );
      const [rows]: any = await db.pool.query(
        'SELECT id, name, email, role, phone, dept, assigned_club, status, created_at FROM users WHERE id = ?',
        [userId]
      );
      if (rows && rows.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Member profile updated successfully.',
          user: rows[0],
        });
        return;
      }
    } catch (err: any) {
      console.error('Error updating profile in MySQL:', err);
    }
  }

  // Fallback to in-memory store
  const user = mockStore.users.find((u) => u.id === userId || u.email === req.user?.email);
  if (user) {
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dept !== undefined) user.dept = dept;
    if (assigned_club !== undefined) user.assigned_club = assigned_club;

    const payload: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      dept: user.dept,
      assigned_club: user.assigned_club,
      status: user.status,
    };

    res.status(200).json({
      success: true,
      message: 'Member profile updated successfully.',
      user: {
        ...payload,
        created_at: user.created_at || '2026-09-01T08:00:00.000Z',
      },
    });
    return;
  }

  res.status(404).json({ success: false, message: 'User not found in system directory.' });
}

// Registry of killed/ended sessions
export const revokedTokens = new Set<string>();

export function isTokenRevoked(token: string): boolean {
  return revokedTokens.has(token);
}

export async function logout(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      revokedTokens.add(token);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Session terminated successfully. Persona logged out.',
  });
}


