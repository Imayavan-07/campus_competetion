export const CAMPUS_VENUES = [
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

export const DIRECTORY_EVENTS = [
  { 
    id: 1, 
    title: 'Annual Hackathon 2026', 
    club: 'Computer Science Club', 
    date: 'Oct 14, 2026', 
    timeSlot: '09:00 AM - 09:00 PM',
    month: 'OCT', 
    day: '14', 
    venue: 'Engineering Hall A', 
    attendees: 240, 
    budget: '$2,800',
    status: 'Upcoming', 
    timeframe: 'Future',
    leadCoordinator: 'Alice Johnson',
    coordinatorEmail: 'alice.johnson@university.edu',
    description: 'Flagship inter-collegiate programming hackathon spanning 24 hours of rapid prototyping, API sandboxes, sponsor challenges, and grand varsity awards.',
    agenda: [
      { time: '09:00 AM', title: 'Registration & Team Check-In' },
      { time: '10:30 AM', title: 'Opening Keynote & Problem Statements' },
      { time: '01:00 PM', title: 'Sprint Phase 1 & Mentorship Hours' },
      { time: '05:30 PM', title: 'Architecture Review Checkpoint' },
      { time: '08:00 PM', title: 'Final Pitch Demos & Awards Gala' }
    ],
    sampleDelegates: [
      { name: 'Alex Vance', reg: '2024CS01', status: 'Attending' },
      { name: 'Maya Lin', reg: '2024EC14', status: 'Attending' },
      { name: 'Evan Wright', reg: '2023ME88', status: 'Waitlisted' }
    ]
  },
  { 
    id: 2, 
    title: 'Photography Masterclass', 
    club: 'Campus Photography Club', 
    date: 'Sept 15, 2026', 
    timeSlot: '10:00 AM - 04:00 PM',
    month: 'SEP', 
    day: '15', 
    venue: 'Arts Center 102', 
    attendees: 52, 
    budget: '$450',
    status: 'Ongoing', 
    timeframe: 'Present',
    leadCoordinator: 'Bob Smith',
    coordinatorEmail: 'bob.smith@university.edu',
    description: 'Practical darkroom chemistry, manual aperture control, and portraiture composition workshop with visiting photojournalists.',
    agenda: [
      { time: '10:00 AM', title: 'Studio Lighting Setup & Metering' },
      { time: '12:30 PM', title: 'Courtyard Model Shoot' },
      { time: '02:30 PM', title: 'Darkroom Chemistry & Developing' },
      { time: '03:45 PM', title: 'Peer Review & Print Selection' }
    ],
    sampleDelegates: [
      { name: 'Chloe Price', reg: '2025AR09', status: 'Attending' },
      { name: 'David Madsen', reg: '2024AR18', status: 'Attending' },
      { name: 'Max Caulfield', reg: '2025AR02', status: 'Attending' }
    ]
  },
  { 
    id: 3, 
    title: 'Fall Tech Career Fair', 
    club: 'University Placement Cell', 
    date: 'Sept 10, 2026', 
    timeSlot: '11:00 AM - 06:00 PM',
    month: 'SEP', 
    day: '10', 
    venue: 'Exhibition Ground', 
    attendees: 1100, 
    budget: '$4,500',
    status: 'Past', 
    timeframe: 'Past',
    leadCoordinator: 'Diana Prince',
    coordinatorEmail: 'diana.prince@university.edu',
    description: 'Biannual campus employment convention hosting 45 corporate partners, recruiters, and engineering research fellows.',
    agenda: [
      { time: '11:00 AM', title: 'Exhibition Hall Opens to Seniors' },
      { time: '01:30 PM', title: 'General Student Admission' },
      { time: '03:30 PM', title: 'Industry Panel: 2027 Engineering Horizons' },
      { time: '05:30 PM', title: 'Recruiter Networking Mixer' }
    ],
    sampleDelegates: [
      { name: 'Jordan Hayes', reg: '2023CS55', status: 'Attended' },
      { name: 'Samantha Wu', reg: '2023EE12', status: 'Attended' },
      { name: 'Liam Davies', reg: '2024ME04', status: 'Attended' }
    ]
  },
  { 
    id: 4, 
    title: 'Inter-College Chess Championship', 
    club: 'Chess Club', 
    date: 'Oct 05, 2026', 
    timeSlot: '01:00 PM - 07:00 PM',
    month: 'OCT', 
    day: '05', 
    venue: 'Student Lounge', 
    attendees: 64, 
    budget: '$350',
    status: 'Upcoming', 
    timeframe: 'Future',
    leadCoordinator: 'Fiona Gallagher',
    coordinatorEmail: 'fiona.gallagher@university.edu',
    description: 'FIDE-rated Swiss system tournament for varsity champions with digital clocks and live broadcast boards.',
    agenda: [
      { time: '01:00 PM', title: 'Swiss System Rounds 1-3' },
      { time: '03:45 PM', title: 'Intermission & Strategy Analysis' },
      { time: '04:30 PM', title: 'Quarterfinals & Blitz Tiebreaks' },
      { time: '06:15 PM', title: 'Championship Board & Awards' }
    ],
    sampleDelegates: [
      { name: 'Beth Harmon', reg: '2024MA01', status: 'Attending' },
      { name: 'Benny Watts', reg: '2023CS99', status: 'Attending' },
      { name: 'Harry Beltik', reg: '2024PH22', status: 'Attending' }
    ]
  },
  { 
    id: 5, 
    title: 'Renewable Tech Symposium', 
    club: 'Green Energy Forum', 
    date: 'Nov 18, 2026', 
    timeSlot: '10:00 AM - 03:30 PM',
    month: 'NOV', 
    day: '18', 
    venue: 'Science Block C', 
    attendees: 180, 
    budget: '$1,200',
    status: 'Upcoming', 
    timeframe: 'Future',
    leadCoordinator: 'George Miller',
    coordinatorEmail: 'george.miller@university.edu',
    description: 'Interdisciplinary research forum focusing on solar micro-inverter designs and student sustainability initiatives on campus.',
    agenda: [
      { time: '10:00 AM', title: 'Keynote: Microgrid Resilience' },
      { time: '11:45 AM', title: 'Undergraduate Poster Exhibition' },
      { time: '01:30 PM', title: 'Green Grant Pitch Competition' },
      { time: '03:00 PM', title: 'Faculty Consensus Summary' }
    ],
    sampleDelegates: [
      { name: 'Nora Hall', reg: '2025EN11', status: 'Attending' },
      { name: 'Marcus Bell', reg: '2024CE45', status: 'Attending' },
      { name: 'Elena Rostova', reg: '2025EE30', status: 'Attending' }
    ]
  },
  { 
    id: 6, 
    title: 'Autonomous Rover Showcase', 
    club: 'Robotics & Automation Society', 
    date: 'Dec 02, 2026', 
    timeSlot: '02:00 PM - 06:30 PM',
    month: 'DEC', 
    day: '02', 
    venue: 'Advanced Robotics Lab', 
    attendees: 145, 
    budget: '$1,950',
    status: 'Upcoming', 
    timeframe: 'Future',
    leadCoordinator: 'Bob Smith',
    coordinatorEmail: 'bob.smith@university.edu',
    description: 'Public exhibition of autonomous terrain exploration rovers built by engineering undergrads with computer vision navigation.',
    agenda: [
      { time: '02:00 PM', title: 'Sensor Calibration & Obstacle Track' },
      { time: '03:30 PM', title: 'Autonomous Slalom Trials' },
      { time: '05:00 PM', title: 'Hardware Q&A & Design Review' },
      { time: '06:00 PM', title: 'Engineering Trophies Conferred' }
    ],
    sampleDelegates: [
      { name: 'Devin Cole', reg: '2024RO01', status: 'Attending' },
      { name: 'Priya Patel', reg: '2025CS15', status: 'Attending' },
      { name: 'Arthur Dent', reg: '2023ME19', status: 'Attending' }
    ]
  }
];

export const APPROVAL_PROPOSALS = [
  {
    id: 100,
    title: 'Annual Robotics Grand Prix 2026',
    club: 'Robotics Society',
    date: 'Oct 12, 2026',
    timeSlot: '02:00 PM - 08:00 PM',
    month: 'OCT',
    day: '12',
    venue: 'Main Innovation Arena',
    budget: '$1,500',
    attendees: 240,
    status: 'Pending Review',
    timeframe: 'Future',
    leadCoordinator: 'Bob Smith',
    coordinatorEmail: 'bob.smith@university.edu',
    description: 'Premier inter-college autonomous bot competition featuring 36 engineering teams, live arena obstacles, and faculty evaluation panels.',
    justification: 'Grant covers arena obstacle modular staging, autonomous laser timing gates, and guest faculty judge honorariums.',
    agenda: [
      { time: '02:00 PM', title: 'Arena Calibration & Sensor Verification' },
      { time: '03:30 PM', title: 'Preliminary Autonomous Slalom Heats' },
      { time: '05:45 PM', title: 'Championship Obstacle Arena Finals' },
      { time: '07:30 PM', title: 'Faculty Awards & Trophy Presentation' }
    ],
    sampleDelegates: [
      { name: 'Devin Cole', reg: '2024RO01', status: 'Pre-Registered' },
      { name: 'Priya Patel', reg: '2025CS15', status: 'Pre-Registered' },
      { name: 'Arthur Dent', reg: '2023ME19', status: 'Pre-Registered' }
    ]
  },
  {
    id: 101,
    title: 'Annual Tech Symposium 2026',
    club: 'Computer Science Club',
    date: 'Oct 12, 2026',
    timeSlot: '09:30 AM - 05:00 PM',
    month: 'OCT',
    day: '12',
    venue: 'Main Auditorium',
    budget: '$1,500',
    attendees: 350,
    status: 'Pending Review',
    timeframe: 'Future',
    leadCoordinator: 'Alice Johnson',
    coordinatorEmail: 'alice.johnson@university.edu',
    description: 'A full-day symposium featuring guest speakers from premier tech industry labs, deep learning workshops, and student paper tracks.',
    justification: 'Grant will cover keynote speaker honorariums, live-stream audio-visual equipment rental, and delegate accreditation materials.',
    agenda: [
      { time: '09:30 AM', title: 'Inaugural Keynote & Campus Welcome' },
      { time: '11:00 AM', title: 'Deep Learning Workshop Session' },
      { time: '02:00 PM', title: 'Student Research Paper Presentations' },
      { time: '04:15 PM', title: 'Industry Panel & Closing Remarks' }
    ],
    sampleDelegates: [
      { name: 'Victor Stone', reg: '2024CS08', status: 'Pre-Registered' },
      { name: 'Barbara Gordon', reg: '2024CS11', status: 'Pre-Registered' }
    ]
  },
  {
    id: 102,
    title: 'Dawn Photography Walk & Showcase',
    club: 'Campus Photography Club',
    date: 'Sept 25, 2026',
    timeSlot: '06:00 AM - 12:00 PM',
    month: 'SEP',
    day: '25',
    venue: 'Botanical Gardens & Quad',
    budget: '$250',
    attendees: 60,
    status: 'Pending Review',
    timeframe: 'Future',
    leadCoordinator: 'Bob Smith',
    coordinatorEmail: 'bob.smith@university.edu',
    description: 'An early morning photography excursion followed by an open-air student photo gallery in the central courtyard.',
    justification: 'Seed allocation for mounting boards, archival print paper, and outdoor display easels.',
    agenda: [
      { time: '06:00 AM', title: 'Sunrise Golden Hour Expedition' },
      { time: '08:30 AM', title: 'Breakfast & RAW Image Selection' },
      { time: '10:00 AM', title: 'Public Quad Exhibition Mounting' }
    ],
    sampleDelegates: [
      { name: 'Peter Parker', reg: '2025AR01', status: 'Pre-Registered' },
      { name: 'Gwen Stacy', reg: '2025AR05', status: 'Pre-Registered' }
    ]
  },
  {
    id: 103,
    title: 'National Collegiate Hackathon Sprint',
    club: 'Engineering Society',
    date: 'Nov 02, 2026',
    timeSlot: '08:00 AM - Nov 03 08:00 PM',
    month: 'NOV',
    day: '02',
    venue: 'Innovation Hub Labs',
    budget: '$3,200',
    attendees: 200,
    status: 'Pending Review',
    timeframe: 'Future',
    leadCoordinator: 'Diana Prince',
    coordinatorEmail: 'diana.prince@university.edu',
    description: '36-hour overnight programming marathon with corporate mentorship, hardware dev kits, and varsity accreditation.',
    justification: 'High-speed switch infrastructure, overnight security personnel, meal vouchers, and mentor transportation stipends.',
    agenda: [
      { time: '08:00 AM', title: 'Badge Issuance & Lab Station Allocation' },
      { time: '10:00 AM', title: '36-Hour Hackathon Timer Begins' },
      { time: 'Day 2 04:00 PM', title: 'Code Freeze & Judging Rounds' }
    ],
    sampleDelegates: [
      { name: 'Tony Stark', reg: '2023EE01', status: 'Pre-Registered' },
      { name: 'Bruce Banner', reg: '2023PH03', status: 'Pre-Registered' }
    ]
  }
];

export function getStoredApprovals() {
  try {
    const saved = localStorage.getItem('unisync_approval_proposals');
    const processed = JSON.parse(localStorage.getItem('unisync_processed_proposals') || '[]');
    const processedSet = new Set(processed);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const existingIds = new Set(parsed.map(p => p.id));
        const missing = APPROVAL_PROPOSALS.filter(p => !existingIds.has(p.id) && !processedSet.has(p.id));
        return [...parsed, ...missing];
      }
    }
  } catch (e) {
    console.error('Error reading approvals from localStorage:', e);
  }
  return APPROVAL_PROPOSALS;
}

export function saveStoredApprovals(list) {
  try {
    localStorage.setItem('unisync_approval_proposals', JSON.stringify(list));
  } catch (e) {
    console.error('Error saving approvals to localStorage:', e);
  }
}

export function enrichEventData(event) {
  if (!event) return null;

  const rawBudget = typeof event.budget === 'string' 
    ? parseInt(event.budget.replace(/[^0-9]/g, ''), 10) || 1500 
    : (event.budget || 1500);

  const defaultBreakdown = {
    prizeMoney: Math.round(rawBudget * 0.40),
    refreshments: Math.round(rawBudget * 0.25),
    decors: Math.round(rawBudget * 0.18),
    miscPurchases: Math.round(rawBudget * 0.10),
    customItems: [
      { id: 'c1', name: 'Audio/Visual Gear Rental', amount: Math.round(rawBudget * 0.04) },
      { id: 'c2', name: 'Accreditation Badges & Kits', amount: Math.round(rawBudget * 0.03) }
    ]
  };

  const delegatesList = event.sampleDelegates || [
    { name: 'Alex Vance', reg: '2024CS01', email: 'alex.vance@university.edu', track: 'Autonomous Systems', status: 'Confirmed', checkedIn: true, ticketId: 'TCK-8801' },
    { name: 'Maya Lin', reg: '2024EC14', email: 'maya.lin@university.edu', track: 'Combat Robotics', status: 'Confirmed', checkedIn: true, ticketId: 'TCK-8802' },
    { name: 'Evan Wright', reg: '2023ME88', email: 'evan.w@university.edu', track: 'Drone Obstacle', status: 'Waitlisted', checkedIn: false, ticketId: 'TCK-8803' },
    { name: 'Sarah Jenkins', reg: '2024EC12', email: 'sarah.j@university.edu', track: 'Autonomous Systems', status: 'Confirmed', checkedIn: false, ticketId: 'TCK-8804' },
    { name: 'Devin Cole', reg: '2024RO01', email: 'devin.cole@university.edu', track: 'Combat Robotics', status: 'Confirmed', checkedIn: true, ticketId: 'TCK-8805' },
    { name: 'Priya Patel', reg: '2025CS15', email: 'priya.patel@university.edu', track: 'Autonomous Systems', status: 'Confirmed', checkedIn: false, ticketId: 'TCK-8806' }
  ];

  const attendeesCount = typeof event.attendees === 'number'
    ? event.attendees
    : (event.registration?.totalRegistered || delegatesList.length || 120);

  const maxCapacity = event.registration?.maxCapacity || Math.round(Math.max(attendeesCount * 1.25, 200));

  const rawStatus = event.status || 'Pending Review';
  let approvalStatus = event.approvalStatus || rawStatus;
  if (rawStatus === 'Ongoing' || rawStatus === 'Upcoming' || rawStatus === 'Past') {
    approvalStatus = 'Approved';
  }

  const defaultRegForm = {
    formTitle: `${event.title} Delegate Registration & Accreditation Form`,
    instructions: 'Please fill out your verified university details and specialization tracks accurately.',
    collectTeamInfo: true,
    collectDietary: true,
    collectTshirt: false,
    customQuestions: [
      {
        id: 'q_track',
        label: 'Competition Track / Specialization',
        type: 'select',
        options: ['Autonomous Slalom Rover', 'Combat Bot 15kg', 'Drone Aerial Obstacle', 'General Track'],
        required: true
      },
      {
        id: 'q_repo',
        label: 'Project Portfolio / GitHub Repository URL',
        type: 'text',
        required: false
      }
    ]
  };

  return {
    ...event,
    academicYear: event.academicYear || 'AY 2026 - 2027',
    session: event.session || (event.timeSlot?.toLowerCase().includes('pm') && !event.timeSlot?.toLowerCase().includes('09:') ? 'Afternoon Session' : 'Morning Session'),
    approvalStatus: approvalStatus,
    hosts: event.hosts || [
      `${event.leadCoordinator || 'Bob Smith'} (Lead Coordinator)`,
      'Dr. Robert Chen (Faculty Advisor)',
      'Priya Patel (Student Host)'
    ],
    budgetBreakdown: event.budgetBreakdown || defaultBreakdown,
    hasRegForm: event.hasRegForm !== undefined ? event.hasRegForm : true,
    regFormConfig: event.regFormConfig || defaultRegForm,
    sampleDelegates: delegatesList,
    registration: event.registration || {
      totalRegistered: attendeesCount,
      maxCapacity: maxCapacity,
      deadline: event.date ? `Oct 10, 2026` : 'Oct 10, 2026',
      status: attendeesCount >= maxCapacity ? 'Waitlist Active' : 'Registration Open',
      targetAudience: 'Undergraduate & Postgraduate Students, Club Delegates & Faculty'
    },
    aiSummary: event.aiSummary || {
      feasibilityScore: '98% Optimal',
      riskAssessment: 'Low Risk',
      executiveSummary: `${event.title} is an institutional fixture organized by ${event.club || 'Robotics Guild'}. It demonstrates strong alignment with varsity co-curricular goals, structured faculty supervision, and high student engagement.`,
      recommendation: `Recommended for administrative approval. The designated venue (${event.venue || 'Main Innovation Arena'}) safely accommodates the expected ${attendeesCount} delegates with adequate safety margins, and cost per attendee ($${(rawBudget / Math.max(1, attendeesCount)).toFixed(2)}) is well within institutional guidelines.`,
      highlights: [
        `Venue capacity utilization is ${Math.round((attendeesCount / (maxCapacity || 250)) * 100)}% with zero current timetable conflicts.`,
        `Budget proposal of $${rawBudget.toLocaleString()} averages $${(rawBudget / Math.max(1, attendeesCount)).toFixed(2)} per registered delegate.`,
        `Coordinated with academic departments with certified faculty oversight.`
      ],
      tags: ['Safety Compliant', 'Budget Optimized', 'Faculty Supervised', 'High Engagement']
    }
  };
}

export function getCustomizedEvents() {
  try {
    const saved = localStorage.getItem('unisync_event_customizations');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading event customizations:', e);
  }
  return {};
}

export function saveCustomizedEvents(map) {
  try {
    localStorage.setItem('unisync_event_customizations', JSON.stringify(map));
  } catch (e) {
    console.error('Error saving event customizations:', e);
  }
}

export function updateEventBudget(id, newBreakdown, newTotal) {
  const numId = Number(id);
  const custom = getCustomizedEvents();
  const current = custom[numId] || {};
  custom[numId] = {
    ...current,
    budgetBreakdown: newBreakdown,
    budget: typeof newTotal === 'number' ? `$${newTotal.toLocaleString()}` : newTotal
  };
  saveCustomizedEvents(custom);
  return getEventById(numId);
}

export function updateEventVenue(id, newVenue) {
  const numId = Number(id);
  const custom = getCustomizedEvents();
  const current = custom[numId] || {};
  custom[numId] = {
    ...current,
    venue: newVenue
  };
  saveCustomizedEvents(custom);
  return getEventById(numId);
}

export function updateEventStatus(id, newStatus) {
  const numId = Number(id);
  const custom = getCustomizedEvents();
  const current = custom[numId] || {};
  custom[numId] = {
    ...current,
    status: newStatus,
    approvalStatus: newStatus
  };
  saveCustomizedEvents(custom);

  // If approved or rejected, track in proposals
  if (newStatus === 'Approved') {
    approveProposal(numId);
  } else if (newStatus === 'Rejected') {
    rejectProposal(numId, 'Administrative decision');
  }

  return getEventById(numId);
}

export function getEventById(id) {
  const numId = Number(id);
  const approvals = getStoredApprovals();
  const allEvents = [...DIRECTORY_EVENTS, ...approvals, ...APPROVAL_PROPOSALS];
  const found = allEvents.find(e => e.id === numId);
  if (!found) return null;

  const custom = getCustomizedEvents();
  const customized = custom[numId] ? { ...found, ...custom[numId] } : found;
  return enrichEventData(customized);
}

export function approveProposal(id) {
  const numId = Number(id);
  const approvals = getStoredApprovals();
  const updated = approvals.filter(e => e.id !== numId);
  saveStoredApprovals(updated);
  try {
    const processed = JSON.parse(localStorage.getItem('unisync_processed_proposals') || '[]');
    if (!processed.includes(numId)) {
      processed.push(numId);
      localStorage.setItem('unisync_processed_proposals', JSON.stringify(processed));
    }
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function rejectProposal(id, reason = '') {
  const numId = Number(id);
  const approvals = getStoredApprovals();
  const updated = approvals.filter(e => e.id !== numId);
  saveStoredApprovals(updated);
  try {
    const processed = JSON.parse(localStorage.getItem('unisync_processed_proposals') || '[]');
    if (!processed.includes(numId)) {
      processed.push(numId);
      localStorage.setItem('unisync_processed_proposals', JSON.stringify(processed));
    }
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function getStoredReviews() {
  try {
    const saved = localStorage.getItem('unisync_event_reviews');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading event reviews:', e);
  }
  return DEFAULT_CLUB_REVIEWS;
}

export function saveStoredReviews(reviewsList) {
  try {
    localStorage.setItem('unisync_event_reviews', JSON.stringify(reviewsList));
  } catch (e) {
    console.error('Error saving event reviews:', e);
  }
}

export function saveClubOrganizerReply(eventId, replyText, organizerName = 'Robotics Guild Executive') {
  const reviews = getStoredReviews();
  const updated = reviews.map(evt => {
    if (evt.id === Number(eventId)) {
      return {
        ...evt,
        organizerReply: {
          reply: replyText,
          organizerName,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      };
    }
    return evt;
  });
  saveStoredReviews(updated);
  return updated;
}

export function getAllClubEvents() {
  const approvals = getStoredApprovals();
  const all = [...DIRECTORY_EVENTS, ...approvals];
  const custom = getCustomizedEvents();
  return all.map(evt => {
    const customized = custom[evt.id] ? { ...evt, ...custom[evt.id] } : evt;
    return enrichEventData(customized);
  });
}

export function createClubProposal(newEvent) {
  const id = Date.now();
  const rawAttendees = Number(newEvent.attendees || newEvent.registration?.totalRegistered) || 120;
  const rawMaxCap = Number(newEvent.maxCapacity || newEvent.registration?.maxCapacity) || Math.round(rawAttendees * 1.25);

  const defaultRegForm = {
    formTitle: `${newEvent.title || 'Club Event'} Delegate Registration Form`,
    instructions: 'Please fill out your verified university details and team preferences accurately.',
    collectTeamInfo: true,
    collectDietary: true,
    collectTshirt: false,
    customQuestions: [
      {
        id: 'q_1',
        label: 'Competition Track / Specialization',
        type: 'select',
        options: ['Autonomous Slalom Rover', 'Combat Bot 15kg', 'Drone Aerial Obstacle'],
        required: true
      },
      {
        id: 'q_2',
        label: 'GitHub / CAD Project Repository Link',
        type: 'text',
        required: false
      }
    ]
  };

  const sampleDelegates = newEvent.sampleDelegates || [
    { name: 'Alex Vance', reg: '2024CS01', email: 'alex.vance@university.edu', track: 'Autonomous Rover', status: 'Confirmed', checkedIn: true, ticketId: 'TCK-9101' },
    { name: 'Maya Lin', reg: '2024EC14', email: 'maya.lin@university.edu', track: 'Combat Bot', status: 'Confirmed', checkedIn: true, ticketId: 'TCK-9102' },
    { name: 'Evan Wright', reg: '2023ME88', email: 'evan.w@university.edu', track: 'Drone Obstacle', status: 'Waitlisted', checkedIn: false, ticketId: 'TCK-9103' },
    { name: 'Sarah Jenkins', reg: '2024EC12', email: 'sarah.j@university.edu', track: 'Autonomous Rover', status: 'Confirmed', checkedIn: false, ticketId: 'TCK-9104' },
    { name: 'Devin Cole', reg: '2024RO01', email: 'devin.cole@university.edu', track: 'Combat Bot', status: 'Confirmed', checkedIn: true, ticketId: 'TCK-9105' }
  ];

  const proposal = {
    id,
    title: newEvent.title || 'Untitled Club Fixture',
    club: newEvent.club || 'Robotics & Autonomous Systems Guild',
    academicYear: newEvent.academicYear || 'AY 2026 - 2027',
    session: newEvent.session || 'Afternoon Session',
    date: newEvent.date || 'Oct 20, 2026',
    timeSlot: newEvent.timeSlot || '10:00 AM - 04:00 PM',
    month: newEvent.month || 'OCT',
    day: newEvent.day || '20',
    venue: newEvent.venue || 'Main Innovation Arena',
    budget: newEvent.budget || '$1,500',
    attendees: rawAttendees,
    status: 'Pending Review',
    approvalStatus: 'Under Review',
    timeframe: 'Future',
    leadCoordinator: newEvent.leadCoordinator || 'Bob Smith',
    facultyAdvisor: newEvent.facultyAdvisor || 'Dr. Aris Thorne',
    studentHost: newEvent.studentHost || 'Maya Lin',
    coordinatorEmail: newEvent.coordinatorEmail || 'bob.smith@university.edu',
    hosts: newEvent.hosts || [
      `${newEvent.leadCoordinator || 'Bob Smith'} (Lead Coordinator)`,
      `${newEvent.facultyAdvisor || 'Dr. Aris Thorne'} (Faculty Advisor)`,
      `${newEvent.studentHost || 'Maya Lin'} (Student Host)`
    ],
    description: newEvent.description || 'Inter-collegiate varsity engineering and robotics competition.',
    justification: newEvent.justification || 'Allocation requested for obstacle arena fabrication and prize pool.',
    agenda: newEvent.agenda && newEvent.agenda.length > 0 ? newEvent.agenda : [
      { time: '10:00 AM', title: 'Delegate Check-In & Arena Calibration' },
      { time: '11:30 AM', title: 'Preliminary Autonomous Heats' },
      { time: '02:00 PM', title: 'Grand Finals & Trophy Ceremony' }
    ],
    hasRegForm: newEvent.hasRegForm !== undefined ? newEvent.hasRegForm : true,
    regFormConfig: newEvent.regFormConfig || defaultRegForm,
    sampleDelegates: sampleDelegates,
    budgetBreakdown: newEvent.budgetBreakdown || {
      prizeMoney: Math.round((parseInt(String(newEvent.budget).replace(/[^0-9]/g, ''), 10) || 1200) * 0.45),
      refreshments: Math.round((parseInt(String(newEvent.budget).replace(/[^0-9]/g, ''), 10) || 1200) * 0.25),
      decors: Math.round((parseInt(String(newEvent.budget).replace(/[^0-9]/g, ''), 10) || 1200) * 0.15),
      miscPurchases: Math.round((parseInt(String(newEvent.budget).replace(/[^0-9]/g, ''), 10) || 1200) * 0.15),
      customItems: []
    },
    registration: newEvent.registration || {
      totalRegistered: rawAttendees,
      maxCapacity: rawMaxCap,
      deadline: newEvent.registrationDeadline || 'Oct 15, 2026',
      status: newEvent.registrationStatus || 'Registration Open',
      targetAudience: newEvent.targetAudience || 'Undergraduate & Postgraduate Students, Club Delegates & Faculty'
    },
    aiSummary: newEvent.aiSummary || {
      feasibilityScore: newEvent.feasibilityScore || '98% Optimal',
      riskAssessment: 'Low Risk',
      executiveSummary: `${newEvent.title || 'Club Event'} is an institutional fixture organized by ${newEvent.club || 'Robotics Guild'}. It demonstrates strong alignment with varsity co-curricular goals, structured faculty supervision, and high student engagement.`,
      recommendation: `Recommended for administrative approval. The designated venue (${newEvent.venue || 'Main Innovation Arena'}) safely accommodates the expected ${rawAttendees} delegates, and requested budget is aligned with department guidelines.`,
      tags: newEvent.tags || ['Safety Compliant', 'Budget Optimized', 'Faculty Supervised', 'High Engagement']
    }
  };

  const storedApprovals = getStoredApprovals();
  const updated = [proposal, ...storedApprovals];
  saveStoredApprovals(updated);
  return proposal;
}

export function updateEventDelegates(eventId, updatedDelegates) {
  const numId = Number(eventId);
  const custom = getCustomizedEvents();
  const current = custom[numId] || {};
  const currentEvent = getEventById(numId);
  const currentReg = currentEvent?.registration || {};

  custom[numId] = {
    ...current,
    sampleDelegates: updatedDelegates,
    attendees: updatedDelegates.length,
    registration: {
      ...currentReg,
      totalRegistered: updatedDelegates.length
    }
  };
  saveCustomizedEvents(custom);
  return getEventById(numId);
}

export function updateEventRegForm(eventId, regFormConfig, hasRegForm = true) {
  const numId = Number(eventId);
  const custom = getCustomizedEvents();
  const current = custom[numId] || {};

  custom[numId] = {
    ...current,
    hasRegForm,
    regFormConfig
  };
  saveCustomizedEvents(custom);
  return getEventById(numId);
}

export const DEFAULT_CLUB_REVIEWS = [
  {
    id: 1,
    title: 'Autonomous Robotics Grand Prix 2026',
    club: 'Robotics & Autonomous Systems Guild',
    date: 'Sept 15, 2026',
    venue: 'Main Innovation Arena',
    overallRating: 4.9,
    turnoutRate: '98%',
    totalReviews: 4,
    adminEventFeedback: {
      feedback: 'Exemplary execution by the Robotics Guild. Obstacle track laser timing gates operated with zero latency. Arena safety enclosures adhered strictly to varsity regulations. Seed grant was fully accounted for with zero fiscal overrun.',
      adminName: 'Office of Campus Administration',
      date: 'Sept 18, 2026'
    },
    organizerReply: {
      reply: 'Thank you to the university administration and all delegates for an electrifying competition! Next semester, we will introduce a dedicated telemetry live-stream screen for spectators.',
      organizerName: 'Robotics Guild Lead',
      date: 'Sept 19, 2026'
    },
    reviews: [
      {
        id: 501,
        name: 'Alex Vance',
        collegeName: 'School of Computer Science & Robotics',
        mailId: 'alex.vance@university.edu',
        rating: 5,
        date: 'Sept 16, 2026',
        feedback: 'Incredible track design and responsive arbitration! The LiDAR calibration pits gave teams ample testing time before the final obstacle round.'
      },
      {
        id: 502,
        name: 'Sarah Jenkins',
        collegeName: 'Dept of Electrical & Electronics Eng',
        mailId: 'sarah.j@university.edu',
        rating: 5,
        date: 'Sept 16, 2026',
        feedback: 'The power distribution hubs at each workbench were well organized. Great mentorship from the faculty evaluators.'
      },
      {
        id: 503,
        name: 'Liam O Connor',
        collegeName: 'Faculty of Mechanical Engineering',
        mailId: 'liam.oc@university.edu',
        rating: 4,
        date: 'Sept 17, 2026',
        feedback: 'Very competitive tournament atmosphere. It would be helpful to have extra high-torque servo replacement kits available at the tool stall.'
      },
      {
        id: 504,
        name: 'Maya Lin',
        collegeName: 'Autonomous Systems Research Annex',
        mailId: 'maya.lin@university.edu',
        rating: 5,
        date: 'Sept 17, 2026',
        feedback: 'Top-tier collegiate competition. Our autonomous maze rover set a new campus record. Looking forward to the national qualifiers!'
      }
    ]
  },
  {
    id: 2,
    title: 'Combat Bot Circuit Design Clinic',
    club: 'Robotics & Autonomous Systems Guild',
    date: 'Sept 04, 2026',
    venue: 'Makerspace Lab 2',
    overallRating: 4.7,
    turnoutRate: '95%',
    totalReviews: 3,
    adminEventFeedback: {
      feedback: 'Great educational clinic. 45 junior students completed their first motor controller PCB solder assemblies safely under mentor supervision.',
      adminName: 'Faculty of Engineering Review Board',
      date: 'Sept 07, 2026'
    },
    organizerReply: null,
    reviews: [
      {
        id: 505,
        name: 'Devin Cole',
        collegeName: 'Dept of Mechatronics & AI',
        mailId: 'devin.cole@university.edu',
        rating: 5,
        date: 'Sept 05, 2026',
        feedback: 'Hands-down the most practical hardware workshop this semester. Learned how to trace dual H-bridge driver schematics from scratch.'
      },
      {
        id: 506,
        name: 'Priya Patel',
        collegeName: 'School of Computer Science',
        mailId: 'priya.patel@university.edu',
        rating: 4,
        date: 'Sept 05, 2026',
        feedback: 'Super helpful slide deck and component cheat-sheets. Would love a part-2 session focused on wireless telemetry pairing.'
      },
      {
        id: 507,
        name: 'Chloe Price',
        collegeName: 'Design & Fabrication Guild',
        mailId: 'chloe.price@pacific.edu',
        rating: 5,
        date: 'Sept 06, 2026',
        feedback: 'The 3D printed chassis templates fit our micro motors seamlessly. Instructors were patient and knowledgeable.'
      }
    ]
  },
  {
    id: 3,
    title: 'Fall Tech Career Fair 2026',
    club: 'University Placement Cell',
    date: 'Sept 10, 2026',
    venue: 'Exhibition Ground',
    overallRating: 4.8,
    turnoutRate: '99%',
    totalReviews: 3,
    adminEventFeedback: {
      feedback: 'Exemplary institutional execution. Corporate engagement metrics exceeded department targets by 15%, with 45 partner firms actively recruiting.',
      adminName: 'Office of Campus Administration',
      date: 'Sept 14, 2026'
    },
    organizerReply: null,
    reviews: [
      {
        id: 508,
        name: 'Maya Lin',
        collegeName: 'School of Computing',
        mailId: 'maya.lin@apex.edu',
        rating: 5,
        date: 'Sept 11, 2026',
        feedback: 'Outstanding industry turnout! The resume critique booths helped our final year cohort tremendously.'
      },
      {
        id: 509,
        name: 'Evan Wright',
        collegeName: 'Dept of Mechanical Eng',
        mailId: 'evan.wright@gvsu.edu',
        rating: 4,
        date: 'Sept 11, 2026',
        feedback: 'Well-organized event halls and great queue management throughout the day.'
      },
      {
        id: 510,
        name: 'Chloe Price',
        collegeName: 'Pacific Coast Arts & Tech University',
        mailId: 'chloe.price@pacific.edu',
        rating: 5,
        date: 'Sept 12, 2026',
        feedback: 'Top-notch keynote panels and employer accessibility with quick badge scanning.'
      }
    ]
  }
];
