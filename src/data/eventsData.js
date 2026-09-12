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
    category: 'Coding & AI', 
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
    category: 'Visual Arts', 
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
    category: 'Career & Networking', 
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
    category: 'Strategy League', 
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
    category: 'Clean Energy', 
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
    category: 'Hardware Engineering', 
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
    category: 'Robotics & Hardware',
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
    category: 'Academic & Tech',
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
    category: 'Visual Arts',
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
    category: 'Hackathon League',
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

export function getEventById(id) {
  const numId = Number(id);
  const approvals = getStoredApprovals();
  const allEvents = [...DIRECTORY_EVENTS, ...approvals, ...APPROVAL_PROPOSALS];
  return allEvents.find(e => e.id === numId) || null;
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

