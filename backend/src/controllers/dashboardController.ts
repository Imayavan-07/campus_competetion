import { Request, Response } from 'express';
import { getDb, mockStore } from '../db/connection';

export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  const db = getDb();

  let totalClubs = mockStore.clubs.length;
  let totalEvents = mockStore.events.length;
  let totalStudents = 3450;
  let pendingApprovals = mockStore.events.filter(
    (e) => e.status === 'Pending Review' || e.approval_status === 'Pending Review'
  ).length;

  if (db.isMySQL && db.pool) {
    try {
      const [clubCount]: any = await db.pool.query('SELECT COUNT(*) as count FROM clubs');
      totalClubs = clubCount[0]?.count || totalClubs;

      const [eventCount]: any = await db.pool.query('SELECT COUNT(*) as count FROM events');
      totalEvents = eventCount[0]?.count || totalEvents;

      const [approvalCount]: any = await db.pool.query(
        "SELECT COUNT(*) as count FROM events WHERE status = 'Pending Review' OR approval_status = 'Pending Review'"
      );
      pendingApprovals = approvalCount[0]?.count || pendingApprovals;
    } catch (e) {
      console.error('[MySQL Get Dashboard Stats Error]', e);
    }
  }

  const upcomingEvents = mockStore.events
    .filter((e) => e.status === 'Upcoming' || e.timeframe === 'Future')
    .slice(0, 5);

  const pendingProposals = mockStore.events
    .filter((e) => e.status === 'Pending Review' || e.approval_status === 'Pending Review')
    .slice(0, 5);

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        totalClubs,
        totalEvents,
        totalStudents,
        pendingApprovals,
        activeTournaments: mockStore.events.filter((e) => e.status === 'Ongoing').length || 2,
      },
      upcomingEvents,
      pendingProposals,
      recentActivity: [
        { id: 1, title: 'Annual Robotics Grand Prix 2026 proposal submitted', time: '10 mins ago', type: 'proposal' },
        { id: 2, title: 'Photography Masterclass marked Ongoing in Arts Wing', time: '1 hour ago', type: 'status' },
        { id: 3, title: 'Annual Hackathon 2026 venue locked: Engineering Hall A', time: '3 hours ago', type: 'venue' },
      ],
    },
  });
}
