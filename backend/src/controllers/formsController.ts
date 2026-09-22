import { Request, Response } from 'express';
import { getDb, mockStore } from '../db/connection';
import { AuthenticatedRequest } from '../types';

export async function getEventFormConfig(req: Request, res: Response): Promise<void> {
  const eventId = Number(req.params.eventId);
  const db = getDb();

  let event: any = null;
  if (db.isMySQL && db.pool) {
    try {
      const [rows]: any = await db.pool.query('SELECT has_reg_form, reg_form_config_json FROM events WHERE id = ?', [eventId]);
      if (rows.length > 0) event = rows[0];
    } catch (e) {
      console.error('[MySQL Get Form Config Error]', e);
    }
  }

  if (!event) {
    event = mockStore.events.find((e) => e.id === eventId);
  }

  if (!event) {
    res.status(404).json({ success: false, message: 'Event not found.' });
    return;
  }

  let config = event.reg_form_config_json || event.regFormConfig;
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch (e) {}
  }

  res.status(200).json({
    success: true,
    data: {
      hasRegForm: event.has_reg_form !== undefined ? Boolean(event.has_reg_form) : true,
      config: config || {
        formTitle: 'Event Registration Form',
        instructions: 'Please fill out your verified details.',
        collectTeamInfo: true,
        collectDietary: true,
        collectTshirt: false,
        customQuestions: [],
      },
    },
  });
}

export async function updateEventFormConfig(req: AuthenticatedRequest, res: Response): Promise<void> {
  const eventId = Number(req.params.eventId);
  const { hasRegForm, config } = req.body;
  const db = getDb();

  const idx = mockStore.events.findIndex((e) => e.id === eventId);
  if (idx !== -1) {
    mockStore.events[idx].has_reg_form = hasRegForm !== undefined ? hasRegForm : true;
    mockStore.events[idx].reg_form_config_json = config;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query(
        'UPDATE events SET has_reg_form = ?, reg_form_config_json = ? WHERE id = ?',
        [hasRegForm !== undefined ? (hasRegForm ? 1 : 0) : 1, JSON.stringify(config), eventId]
      );
    } catch (e) {
      console.error('[MySQL Update Form Config Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Event registration form configuration saved.',
    data: { hasRegForm, config },
  });
}
