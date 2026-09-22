import { Request, Response } from 'express';
import { z } from 'zod';
import { getDb, mockStore } from '../db/connection';
import { AuthenticatedRequest } from '../types';

export const registerEventSchema = z.object({
  eventId: z.number(),
  studentName: z.string().min(2, 'Student name is required'),
  studentRegNo: z.string().min(2, 'Registration / Roll Number is required'),
  email: z.string().email('Valid student email is required'),
  track: z.string().optional().default('General Track'),
  teamName: z.string().nullable().optional(),
  formResponses: z.any().optional(),
  resumeOrDocUrl: z.string().nullable().optional(),
});

export async function getEventRegistrations(req: Request, res: Response): Promise<void> {
  const eventId = Number(req.params.eventId || req.query.eventId);
  const db = getDb();

  let registrations: any[] = mockStore.registrations;

  if (eventId) {
    registrations = registrations.filter((r: any) => r.event_id === eventId);
  }

  if (db.isMySQL && db.pool) {
    try {
      let sql = 'SELECT * FROM event_registrations';
      const params: any[] = [];
      if (eventId) {
        sql += ' WHERE event_id = ?';
        params.push(eventId);
      }
      sql += ' ORDER BY id DESC';

      const [rows]: any = await db.pool.query(sql, params);
      if (rows && rows.length > 0) {
        registrations = rows;
      }
    } catch (e) {
      console.error('[MySQL Get Registrations Error]', e);
    }
  }

  const formatted = registrations.map((r: any) => ({
    id: r.id,
    eventId: r.event_id,
    name: r.student_name,
    reg: r.student_reg_no,
    email: r.email,
    track: r.track,
    teamName: r.team_name,
    status: r.status,
    checkedIn: Boolean(r.checked_in),
    ticketId: r.ticket_id,
    formResponses: typeof r.form_responses_json === 'string' ? JSON.parse(r.form_responses_json) : r.form_responses_json || {},
    resumeOrDocUrl: r.resume_or_doc_url,
    createdAt: r.created_at,
  }));

  res.status(200).json({
    success: true,
    data: formatted,
    total: formatted.length,
  });
}

export async function registerForEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = req.body;
  const db = getDb();

  const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
  const id = Date.now();

  const newReg: any = {
    id,
    event_id: data.eventId,
    student_name: data.studentName,
    student_reg_no: data.studentRegNo,
    email: data.email,
    track: data.track || 'General Track',
    team_name: data.teamName || null,
    status: 'Confirmed',
    checked_in: 0,
    ticket_id: ticketId,
    form_responses_json: data.formResponses || {},
    resume_or_doc_url: data.resumeOrDocUrl || null,
    created_at: new Date().toISOString(),
  };

  if (db.isMySQL && db.pool) {
    try {
      const [result]: any = await db.pool.query(
        `INSERT INTO event_registrations (event_id, student_name, student_reg_no, email, track, team_name, status, checked_in, ticket_id, form_responses_json, resume_or_doc_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newReg.event_id,
          newReg.student_name,
          newReg.student_reg_no,
          newReg.email,
          newReg.track,
          newReg.team_name,
          newReg.status,
          0,
          newReg.ticket_id,
          JSON.stringify(newReg.form_responses_json),
          newReg.resume_or_doc_url,
        ]
      );
      newReg.id = result.insertId;

      // Increment attendees count in events table
      await db.pool.query('UPDATE events SET attendees = attendees + 1 WHERE id = ?', [newReg.event_id]);
    } catch (e) {
      console.error('[MySQL Insert Registration Error]', e);
    }
  }

  // Update mockStore
  mockStore.registrations.unshift(newReg);
  const event: any = mockStore.events.find((e) => e.id === data.eventId);
  if (event) {
    event.attendees = (event.attendees || 0) + 1;
    if (event.registration) {
      event.registration.totalRegistered = (event.registration.totalRegistered || 0) + 1;
    }
  }

  res.status(201).json({
    success: true,
    message: 'Delegate registration verified and confirmed.',
    data: {
      id: newReg.id,
      ticketId,
      status: 'Confirmed',
      studentName: newReg.student_name,
      track: newReg.track,
    },
  });
}

export async function updateRegistrationStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { checkedIn, status } = req.body;
  const db = getDb();

  const idx = mockStore.registrations.findIndex((r) => r.id === id);
  if (idx !== -1) {
    if (checkedIn !== undefined) (mockStore.registrations[idx] as any).checked_in = checkedIn ? 1 : 0;
    if (status !== undefined) (mockStore.registrations[idx] as any).status = status;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query(
        'UPDATE event_registrations SET checked_in = COALESCE(?, checked_in), status = COALESCE(?, status) WHERE id = ?',
        [checkedIn !== undefined ? (checkedIn ? 1 : 0) : null, status || null, id]
      );
    } catch (e) {
      console.error('[MySQL Update Registration Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Delegate attendance / status updated.',
    data: { id, checkedIn, status },
  });
}
