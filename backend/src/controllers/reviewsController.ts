import { Request, Response } from 'express';
import { z } from 'zod';
import { getDb, mockStore } from '../db/connection';
import { AuthenticatedRequest } from '../types';

export const submitReviewSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  collegeName: z.string().optional().default('University Department'),
  mailId: z.string().email('Valid email is required'),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(5, 'Feedback must be at least 5 characters'),
});

export async function getReviews(req: Request, res: Response): Promise<void> {
  const { eventId, club } = req.query;
  const db = getDb();

  let reviews: any[] = [...mockStore.reviews];

  if (db.isMySQL && db.pool) {
    try {
      let sql = 'SELECT * FROM event_reviews WHERE 1=1';
      const params: any[] = [];
      if (eventId) {
        sql += ' AND event_id = ?';
        params.push(Number(eventId));
      }
      if (club) {
        sql += ' AND club = ?';
        params.push(club);
      }
      sql += ' ORDER BY id DESC';

      const [rows]: any = await db.pool.query(sql, params);
      if (rows && rows.length > 0) {
        reviews = rows;
      }
    } catch (e) {
      console.error('[MySQL Get Reviews Error]', e);
    }
  }

  const parseJson = (val: any) => {
    if (!val) return null;
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (e) {
        return null;
      }
    }
    return val;
  };

  const formatted = reviews.map((r: any) => ({
    id: r.id,
    eventId: r.event_id || r.id,
    title: r.title,
    club: r.club,
    date: r.date,
    venue: r.venue,
    overallRating: Number(r.overall_rating || r.overallRating || 5),
    turnoutRate: r.turnout_rate || r.turnoutRate || '95%',
    totalReviews: r.total_reviews || r.totalReviews || 0,
    adminEventFeedback: parseJson(r.admin_feedback_json || r.adminEventFeedback),
    organizerReply: parseJson(r.organizer_reply_json || r.organizerReply),
    reviews: parseJson(r.reviews_json || r.reviews) || [],
  }));

  res.status(200).json({
    success: true,
    data: formatted,
    total: formatted.length,
  });
}

export async function addStudentReview(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const data = req.body;
  const db = getDb();

  const newReviewItem = {
    id: Date.now(),
    name: data.name,
    collegeName: data.collegeName || 'School of Engineering',
    mailId: data.mailId,
    rating: Number(data.rating),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    feedback: data.feedback,
  };

  const reviewGroup: any = mockStore.reviews.find((r: any) => r.id === id || r.event_id === id);
  if (reviewGroup) {
    if (!Array.isArray(reviewGroup.reviews_json)) {
      reviewGroup.reviews_json = reviewGroup.reviews || [];
    }
    reviewGroup.reviews_json.unshift(newReviewItem);
    reviewGroup.total_reviews = reviewGroup.reviews_json.length;
  }

  if (db.isMySQL && db.pool && reviewGroup) {
    try {
      await db.pool.query(
        'UPDATE event_reviews SET reviews_json = ?, total_reviews = ? WHERE id = ?',
        [JSON.stringify(reviewGroup.reviews_json), reviewGroup.total_reviews, id]
      );
    } catch (e) {
      console.error('[MySQL Add Student Review Error]', e);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Feedback review submitted successfully.',
    data: newReviewItem,
  });
}

export async function addAdminFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { feedback, adminName } = req.body;
  const db = getDb();

  const feedbackObj = {
    feedback,
    adminName: adminName || req.user?.name || 'Office of Campus Administration',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const reviewGroup = mockStore.reviews.find((r) => r.id === id || r.event_id === id);
  if (reviewGroup) {
    reviewGroup.admin_feedback_json = feedbackObj;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('UPDATE event_reviews SET admin_feedback_json = ? WHERE id = ?', [
        JSON.stringify(feedbackObj),
        id,
      ]);
    } catch (e) {
      console.error('[MySQL Add Admin Feedback Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Administrative review feedback posted.',
    data: feedbackObj,
  });
}

export async function addOrganizerReply(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { reply, organizerName } = req.body;
  const db = getDb();

  const replyObj = {
    reply,
    organizerName: organizerName || req.user?.name || 'Club Lead Executive',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const reviewGroup = mockStore.reviews.find((r) => r.id === id || r.event_id === id);
  if (reviewGroup) {
    reviewGroup.organizer_reply_json = replyObj;
  }

  if (db.isMySQL && db.pool) {
    try {
      await db.pool.query('UPDATE event_reviews SET organizer_reply_json = ? WHERE id = ?', [
        JSON.stringify(replyObj),
        id,
      ]);
    } catch (e) {
      console.error('[MySQL Add Organizer Reply Error]', e);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Club organizer reply posted.',
    data: replyObj,
  });
}
