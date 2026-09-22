import { Request, Response } from 'express';
import { z } from 'zod';
import { getDb, mockStore } from '../db/connection';
import { AuthenticatedRequest } from '../types';

export const createEventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  club: z.string().min(2, 'Club name is required'),
  category: z.string().optional().default('Competition'),
  date: z.string().min(2, 'Date is required'),
  timeSlot: z.string().optional(),
  time_slot: z.string().optional(),
  month: z.string().optional(),
  day: z.string().optional(),
  venue: z.string().min(2, 'Venue is required'),
  budget: z.string().optional().default('$1,500'),
  attendees: z.number().optional().default(100),
  status: z.string().optional().default('Pending Review'),
  approvalStatus: z.string().optional(),
  approval_status: z.string().optional(),
  timeframe: z.string().optional().default('Future'),
  leadCoordinator: z.string().optional(),
  lead_coordinator: z.string().optional(),
  coordinatorEmail: z.string().optional(),
  coordinator_email: z.string().optional(),
  facultyAdvisor: z.string().optional(),
  faculty_advisor: z.string().optional(),
  studentHost: z.string().optional(),
  student_host: z.string().optional(),
  description: z.string().optional().default(''),
  justification: z.string().optional().default(''),
  agenda: z.array(z.any()).optional(),
  agenda_json: z.array(z.any()).optional(),
  budgetBreakdown: z.any().optional(),
  budget_breakdown_json: z.any().optional(),
  regFormConfig: z.any().optional(),
  reg_form_config_json: z.any().optional(),
  hasRegForm: z.boolean().optional().default(true),
  poster_url: z.string().nullable().optional(),
  guidelines_pdf_url: z.string().nullable().optional(),
});

function enrichEvent(event: any) {
  if (!event) return null;

  const rawBudget =
    typeof event.budget === 'string'
      ? parseInt(event.budget.replace(/[^0-9]/g, ''), 10) || 1500
      : event.budget || 1500;

  const defaultBreakdown = {
    prizeMoney: Math.round(rawBudget * 0.4),
    refreshments: Math.round(rawBudget * 0.25),
    decors: Math.round(rawBudget * 0.18),
    miscPurchases: Math.round(rawBudget * 0.1),
    customItems: [
      { id: 'c1', name: 'Audio/Visual Gear Rental', amount: Math.round(rawBudget * 0.04) },
      { id: 'c2', name: 'Accreditation Badges & Kits', amount: Math.round(rawBudget * 0.03) },
    ],
  };

  const attendeesCount =
    typeof event.attendees === 'number'
      ? event.attendees
      : event.registration?.totalRegistered || 120;

  const maxCapacity =
    event.registration?.maxCapacity || Math.round(Math.max(attendeesCount * 1.25, 200));

  const rawStatus = event.status || 'Pending Review';
  let approvalStatus = event.approval_status || event.approvalStatus || rawStatus;
  if (['Ongoing', 'Upcoming', 'Past'].includes(rawStatus)) {
    approvalStatus = 'Approved';
  }

  // Parse JSON fields if they are strings (from MySQL)
  const parseJson = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (e) {
        return fallback;
      }
    }
    return val;
  };

  const agenda = parseJson(event.agenda_json || event.agenda, [
    { time: '09:00 AM', title: 'Registration & Check-In' },
    { time: '11:00 AM', title: 'Keynote & Commencement' },
    { time: '02:00 PM', title: 'Tournament Heats & Judging' },
    { time: '05:00 PM', title: 'Award Ceremonies & Concluding Gala' },
  ]);

  const budgetBreakdown = parseJson(
    event.budget_breakdown_json || event.budgetBreakdown,
    defaultBreakdown
  );

  const regConfig = parseJson(event.reg_form_config_json || event.regFormConfig, {
    formTitle: `${event.title} Delegate Registration Form`,
    instructions: 'Please enter verified institutional credentials and specialization track.',
    collectTeamInfo: true,
    collectDietary: true,
    collectTshirt: false,
    customQuestions: [
      {
        id: 'q_track',
        label: 'Competition Track / Specialization',
        type: 'select',
        options: ['General Track', 'Advanced Prototype', 'Varsity League'],
        required: true,
      },
    ],
  });

  const aiSummary = parseJson(event.ai_summary_json || event.aiSummary, {
    feasibilityScore: '98% Optimal',
    riskAssessment: 'Low Risk',
    executiveSummary: `${event.title} is an institutional fixture organized by ${
      event.club || 'Campus Organization'
    }. It demonstrates strong alignment with varsity goals.`,
    recommendation: `Recommended for administrative approval. The designated venue (${
      event.venue || 'Main Innovation Arena'
    }) accommodates expected delegates safely.`,
    highlights: [
      `Venue capacity utilization is optimal with zero timetable conflicts.`,
      `Budget proposal averages reasonable allocation per delegate.`,
    ],
    tags: ['Safety Compliant', 'Budget Optimized', 'Faculty Supervised'],
  });

  return {
    ...event,
    timeSlot: event.time_slot || event.timeSlot || '09:00 AM - 05:00 PM',
    approvalStatus,
    leadCoordinator: event.lead_coordinator || event.leadCoordinator || 'Alice Johnson',
    coordinatorEmail: event.coordinator_email || event.coordinatorEmail || 'coordinator@university.edu',
    agenda,
    budgetBreakdown,
    regFormConfig: regConfig,
    hasRegForm: event.has_reg_form !== undefined ? Boolean(event.has_reg_form) : true,
    registration: parseJson(event.registration_json || event.registration, {
      totalRegistered: attendeesCount,
      maxCapacity,
      deadline: event.date || 'Oct 15, 2026',
      status: attendeesCount >= maxCapacity ? 'Waitlist Active' : 'Registration Open',
      targetAudience: 'Undergraduate & Postgraduate Students, Club Delegates & Faculty',
    }),
    aiSummary,
  };
}

export async function getEvents(req: Request, res: Response): Promise<void> {
  const { status, approvalStatus, timeframe, club, search } = req.query;
  const db = getDb();

  let events = [...mockStore.events];

  if (db.isMySQL && db.pool) {
    try {
      let sql = 'SELECT * FROM events WHERE 1=1';
      const params: any[] = [];

      if (status && status !== 'All') {
        sql += ' AND status = ?';
        params.push(status);
      }
      if (approvalStatus && approvalStatus !== 'All') {
        sql += ' AND approval_status = ?';
        params.push(approvalStatus);
      }
      if (timeframe && timeframe !== 'All') {
        sql += ' AND timeframe = ?';
        params.push(timeframe);
      }
      if (club && club !== 'All') {
        sql += ' AND club = ?';
        params.push(club);
      }
      if (search) {
        sql += ' AND (title LIKE ? OR club LIKE ? OR venue LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      sql += ' ORDER BY id DESC';

      const [rows]: any = await db.pool.query(sql, params);
      if (rows && rows.length > 0) {
        events = rows;
      }
    } catch (e) {
      console.error('[MySQL Get Events Error]', e);
    }
  }

  let enriched = events.map(enrichEvent);

  if (status && status !== 'All') {
    enriched = enriched.filter((e) => e.status.toLowerCase() === String(status).toLowerCase());
  }
  if (approvalStatus && approvalStatus !== 'All') {
    enriched = enriched.filter(
      (e) => e.approvalStatus?.toLowerCase() === String(approvalStatus).toLowerCase()
    );
  }
  if (timeframe && timeframe !== 'All') {
    enriched = enriched.filter((e) => e.timeframe.toLowerCase() === String(timeframe).toLowerCase());
  }
  if (club && club !== 'All') {
    enriched = enriched.filter((e) => e.club.toLowerCase() === String(club).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    enriched = enriched.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.club.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    data: enriched,
    total: enriched.length,
  });
}

export async function getEventById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const db = getDb();

  let event: any = null;

  if (db.isMySQL && db.pool) {
    try {
      const [rows]: any = await db.pool.query('SELECT * FROM events WHERE id = ?', [id]);
      if (rows.length > 0) event = rows[0];
    } catch (e) {
      console.error('[MySQL Get Event By ID Error]', e);
    }
  }

  if (!event) {
    event = mockStore.events.find((e) => e.id === id);
  }

  if (!event) {
    res.status(404).json({ success: false, message: `Event with ID ${id} not found.` });
    return;
  }

  // Also fetch event registrations as sampleDelegates
  let delegates = mockStore.registrations.filter((r) => r.event_id === id);
  if (db.isMySQL && db.pool) {
    try {
      const [regRows]: any = await db.pool.query('SELECT * FROM event_registrations WHERE event_id = ?', [id]);
      if (regRows && regRows.length > 0) {
        delegates = regRows.map((r: any) => ({
          name: r.student_name,
          reg: r.student_reg_no,
          email: r.email,
          track: r.track,
          status: r.status,
          checkedIn: Boolean(r.checked_in),
          ticketId: r.ticket_id,
        }));
      }
    } catch (e) {
      console.error('[MySQL Get Event Delegates Error]', e);
    }
  }

  const enriched = enrichEvent({ ...event, sampleDelegates: delegates });

  res.status(200).json({
    success: true,
    data: enriched,
  });
}

export async function createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = req.body;
  const db = getDb();

  const id = Date.now();
  const timeSlot = data.timeSlot || data.time_slot || '10:00 AM - 04:00 PM';
  const rawStatus = data.status || 'Pending Review';
  const approvalStatus = data.approvalStatus || data.approval_status || 'Pending Review';

  const newEvent: any = {
    id,
    title: data.title,
    club: data.club,
    category: data.category || 'Competition',
    description: data.description || '',
    justification: data.justification || '',
    date: data.date,
    time_slot: timeSlot,
    timeSlot,
    month: data.month || data.date?.split(' ')[0]?.slice(0, 3)?.toUpperCase() || 'OCT',
    day: data.day || data.date?.match(/\d+/)?.[0] || '15',
    venue: data.venue,
    budget: data.budget || '$1,500',
    attendees: data.attendees || 120,
    status: rawStatus,
    approval_status: approvalStatus,
    approvalStatus,
    timeframe: data.timeframe || 'Future',
    lead_coordinator: data.leadCoordinator || data.lead_coordinator || req.user?.name || 'Bob Smith',
    coordinator_email: data.coordinatorEmail || data.coordinator_email || req.user?.email || 'coordinator@university.edu',
    faculty_advisor: data.facultyAdvisor || data.faculty_advisor || 'Dr. Robert Chen',
    student_host: data.studentHost || data.student_host || 'Maya Lin',
    agenda_json: data.agenda || data.agenda_json || [],
    budget_breakdown_json: data.budgetBreakdown || data.budget_breakdown_json || null,
    reg_form_config_json: data.regFormConfig || data.reg_form_config_json || null,
    has_reg_form: data.hasRegForm !== undefined ? data.hasRegForm : true,
    poster_url: data.poster_url || null,
    guidelines_pdf_url: data.guidelines_pdf_url || null,
    created_at: new Date().toISOString(),
  };

  if (db.isMySQL && db.pool) {
    try {
      const [result]: any = await db.pool.query(
        `INSERT INTO events (title, club, category, description, justification, date, time_slot, month, day, venue, budget, attendees, status, approval_status, timeframe, lead_coordinator, coordinator_email, faculty_advisor, student_host, agenda_json, budget_breakdown_json, reg_form_config_json, has_reg_form, poster_url, guidelines_pdf_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newEvent.title,
          newEvent.club,
          newEvent.category,
          newEvent.description,
          newEvent.justification,
          newEvent.date,
          newEvent.time_slot,
          newEvent.month,
          newEvent.day,
          newEvent.venue,
          newEvent.budget,
          newEvent.attendees,
          newEvent.status,
          newEvent.approval_status,
          newEvent.timeframe,
          newEvent.lead_coordinator,
          newEvent.coordinator_email,
          newEvent.faculty_advisor,
          newEvent.student_host,
          JSON.stringify(newEvent.agenda_json),
          JSON.stringify(newEvent.budget_breakdown_json),
          JSON.stringify(newEvent.reg_form_config_json),
          newEvent.has_reg_form ? 1 : 0,
          newEvent.poster_url,
          newEvent.guidelines_pdf_url,
        ]
      );
      newEvent.id = result.insertId;
    } catch (e) {
      console.error('[MySQL Insert Event Error]', e);
    }
  }

  mockStore.events.unshift(newEvent);

  res.status(201).json({
    success: true,
    message: 'Event fixture / proposal registered successfully.',
    data: enrichEvent(newEvent),
  });
}

export async function updateEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const data = req.body;
  const db = getDb();

  const idx = mockStore.events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockStore.events[idx] = {
      ...mockStore.events[idx],
      ...data,
      time_slot: data.timeSlot || data.time_slot || mockStore.events[idx].time_slot,
      approval_status: data.approvalStatus || data.approval_status || mockStore.events[idx].approval_status,
    };
  }

  if (db.isMySQL && db.pool) {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.title) { updates.push('title = ?'); values.push(data.title); }
      if (data.venue) { updates.push('venue = ?'); values.push(data.venue); }
      if (data.date) { updates.push('date = ?'); values.push(data.date); }
      if (data.timeSlot || data.time_slot) { updates.push('time_slot = ?'); values.push(data.timeSlot || data.time_slot); }
      if (data.budget) { updates.push('budget = ?'); values.push(data.budget); }
      if (data.status) { updates.push('status = ?'); values.push(data.status); }
      if (data.approvalStatus || data.approval_status) { updates.push('approval_status = ?'); values.push(data.approvalStatus || data.approval_status); }
      if (data.budgetBreakdown) { updates.push('budget_breakdown_json = ?'); values.push(JSON.stringify(data.budgetBreakdown)); }
      if (data.regFormConfig) { updates.push('reg_form_config_json = ?'); values.push(JSON.stringify(data.regFormConfig)); }

      if (updates.length > 0) {
        values.push(id);
        await db.pool.query(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`, values);
      }
    } catch (e) {
      console.error('[MySQL Update Event Error]', e);
    }
  }

  const updated = mockStore.events[idx] || { id, ...data };

  res.status(200).json({
    success: true,
    message: 'Event updated successfully.',
    data: enrichEvent(updated),
  });
}

export async function updateEventStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { status, approvalStatus } = req.body;
  const db = getDb();

  const newStatus = status || (approvalStatus === 'Approved' ? 'Upcoming' : 'Rejected');
  const newApproval = approvalStatus || (newStatus === 'Approved' ? 'Approved' : newStatus);

  const idx = mockStore.events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockStore.events[idx].status = newStatus;
    mockStore.events[idx].approval_status = newApproval;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('UPDATE events SET status = ?, approval_status = ? WHERE id = ?', [
        newStatus,
        newApproval,
        id,
      ]);
    } catch (e) {
      console.error('[MySQL Update Event Status Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: `Event status changed to ${newStatus}.`,
    data: { id, status: newStatus, approvalStatus: newApproval },
  });
}

export async function updateEventBudget(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { budgetBreakdown, budget } = req.body;
  const db = getDb();

  const idx = mockStore.events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockStore.events[idx].budget_breakdown_json = budgetBreakdown;
    if (budget) mockStore.events[idx].budget = typeof budget === 'number' ? `$${budget.toLocaleString()}` : budget;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query(
        'UPDATE events SET budget_breakdown_json = ?, budget = COALESCE(?, budget) WHERE id = ?',
        [JSON.stringify(budgetBreakdown), budget || null, id]
      );
    } catch (e) {
      console.error('[MySQL Update Event Budget Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Event budget breakdown updated.',
    data: { id, budgetBreakdown, budget },
  });
}

export async function updateEventVenue(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { venue } = req.body;
  const db = getDb();

  const idx = mockStore.events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockStore.events[idx].venue = venue;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('UPDATE events SET venue = ? WHERE id = ?', [venue, id]);
    } catch (e) {
      console.error('[MySQL Update Event Venue Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Event venue rescheduled.',
    data: { id, venue },
  });
}

export async function deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const db = getDb();

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('DELETE FROM events WHERE id = ?', [id]);
    } catch (e) {
      console.error('[MySQL Delete Event Error]', e);
    }
  }

  mockStore.events = mockStore.events.filter((e) => e.id !== id);

  res.status(200).json({
    success: true,
    message: 'Event removed successfully.',
  });
}
