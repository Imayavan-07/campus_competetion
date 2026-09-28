import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';

/**
 * Standard Campus Venues
 * Only the venues list is pre-seeded so facilities and calendar bookings can resolve locations.
 */
export const INITIAL_VENUES = [
  { id: 'v1', name: 'Main Innovation Arena', capacity: 450, building: 'Tech Quad Arena', facilities: 'Dual Projectors, Laser Timing Sensors, PA Audio, Bleacher Seating' },
  { id: 'v2', name: 'Main Auditorium', capacity: 1200, building: 'Central Academic Complex', facilities: 'Stage Lighting, Proscenium Stage, Broadcast Studio, Multi-Mic Array' },
  { id: 'v3', name: 'Engineering Hall A', capacity: 300, building: 'Faculty of Engineering', facilities: 'Tiered Lecture Seating, Gigabit LAN, Presentation Screens' },
  { id: 'v4', name: 'Arts Center 102', capacity: 80, building: 'Fine Arts Wing', facilities: 'Adjustable Spotlights, Display Easels, Darkroom Access, Acoustic Panels' },
  { id: 'v5', name: 'Exhibition Ground', capacity: 2500, building: 'Open Campus Grounds', facilities: 'Outdoor Canopy Staging, High-Power Generators, Food Stall Bays' },
  { id: 'v6', name: 'Advanced Robotics Lab', capacity: 120, building: 'Research Annex', facilities: '3D Printers, Soldering Benches, ESD-Safe Mats, Power Supplies' },
  { id: 'v7', name: 'Science Block C', capacity: 200, building: 'Natural Sciences Complex', facilities: 'Fume Hoods, Demonstration Bench, Dual 4K Displays' },
  { id: 'v8', name: 'Botanical Gardens & Quad', capacity: 150, building: 'Outdoor Campus Grounds', facilities: 'Open-Air Lawn, Solar Lighting, Gazebo Stage' },
  { id: 'v9', name: 'Innovation Hub Labs', capacity: 250, building: 'Student Innovation Center', facilities: 'Hardware Dev Kits, High-Speed Mesh Wi-Fi, Breakout Pods' },
  { id: 'v10', name: 'Student Union Lounge', capacity: 100, building: 'Student Life Center', facilities: 'Modular Sofas, AV Monitors, Coffee Bar Station' },
  { id: 'v11', name: 'Sports Oval', capacity: 1500, building: 'Athletics & Recreation Center', facilities: 'Floodlights, Track Markings, Scoreboard, First-Aid Station' },
  { id: 'v12', name: 'Debate Hall B', capacity: 90, building: 'Humanities Wing', facilities: 'Podium Mics, Tiered Gallery, Video Recording Suite' }
];

/**
 * Empty Initial Seed Collections
 * Per requirements: NO member seed, NO mock clubs, NO mock events/reviews.
 * Only the three official login credentials and the venues list are seeded.
 */
export const INITIAL_CLUBS: any[] = [];
export const INITIAL_MEMBERS: any[] = [];
export const INITIAL_EVENTS: any[] = [];
export const INITIAL_REGISTRATIONS: any[] = [];
export const INITIAL_REVIEWS: any[] = [];

/**
 * Official Three Login Personas (Configured strictly via .env)
 * 1. Administrator
 * 2. Club Coordinator
 * 3. Student Participant
 */
export async function getInitialUsers() {
  const adminPassword = ENV.ADMIN.PASSWORD || 'Admin@123456';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const clubPassword = ENV.CLUB_LEAD.PASSWORD || 'Club@123456';
  const clubHash = await bcrypt.hash(clubPassword, 10);

  const studentPassword = ENV.STUDENT.PASSWORD || 'Student@123456';
  const studentHash = await bcrypt.hash(studentPassword, 10);

  return [
    {
      id: 1,
      name: ENV.ADMIN.NAME || 'Chief Administrator',
      email: ENV.ADMIN.EMAIL || 'admin@university.edu',
      password_hash: adminHash,
      role: 'admin',
      phone: '+1 (555) 987-4321',
      dept: 'Central Governance',
      assigned_club: 'Executive Council',
      status: 'Active'
    },
    {
      id: 2,
      name: ENV.CLUB_LEAD.NAME || 'Bob Smith',
      email: ENV.CLUB_LEAD.EMAIL || 'club.lead@university.edu',
      password_hash: clubHash,
      role: 'club',
      phone: '+1 (555) 678-1290',
      dept: 'Electronics & Robotics',
      assigned_club: 'Robotics Society',
      status: 'Active'
    },
    {
      id: 3,
      name: ENV.STUDENT.NAME || 'Alex Vance',
      email: ENV.STUDENT.EMAIL || 'student@university.edu',
      password_hash: studentHash,
      role: 'student',
      phone: '+1 (555) 123-4567',
      dept: 'Computer Science',
      assigned_club: null,
      status: 'Active'
    }
  ];
}
