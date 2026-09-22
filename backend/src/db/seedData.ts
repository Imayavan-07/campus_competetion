import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';

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

export const INITIAL_CLUBS = [
  { id: 1, name: 'Campus Photography Club', dept: 'Arts & Culture', president: 'Evan Wright', coordinator: 'Alice Johnson', email: 'photography@university.edu', phone: '+1 (555) 234-8765', description: 'Practical darkroom chemistry, manual aperture control, and portraiture composition workshop with visiting photojournalists.', category: 'Arts & Culture', members_count: 45, events_count: 3, logo_url: null, constitution_pdf_url: null },
  { id: 2, name: 'Robotics Society', dept: 'Engineering', president: 'Jane Doe', coordinator: 'Bob Smith', email: 'robotics@university.edu', phone: '+1 (555) 678-1290', description: 'Premier inter-college autonomous bot competition featuring engineering teams, live arena obstacles, and faculty evaluation panels.', category: 'Engineering', members_count: 120, events_count: 4, logo_url: null, constitution_pdf_url: null },
  { id: 3, name: 'Debate & Oratory Team', dept: 'Arts & Culture', president: 'Michael Scott', coordinator: 'Alice Johnson', email: 'debate@university.edu', phone: '+1 (555) 342-8910', description: 'Inter-collegiate parliamentary debate, moot court trials, and public speaking championships.', category: 'Arts & Culture', members_count: 30, events_count: 5, logo_url: null, constitution_pdf_url: null },
  { id: 4, name: 'Quantum & Chess Guild', dept: 'Science', president: 'Beth Harmon', coordinator: 'Fiona Gallagher', email: 'chess@university.edu', phone: '+1 (555) 456-7890', description: 'FIDE-rated Swiss system tournaments and algorithmic board problem sets.', category: 'Science', members_count: 25, events_count: 2, logo_url: null, constitution_pdf_url: null },
  { id: 5, name: 'Collegiate Esports Society', dept: 'Sports', president: 'Tenzing Norgay', coordinator: 'George Miller', email: 'esports@university.edu', phone: '+1 (555) 789-0123', description: 'Varsity LAN tournaments, competitive ladders, and shoutcasting production clinics.', category: 'Sports', members_count: 88, events_count: 4, logo_url: null, constitution_pdf_url: null },
  { id: 6, name: 'Renewable Energies Club', dept: 'Engineering', president: 'Claire Bennett', coordinator: 'Diana Prince', email: 'renewables@university.edu', phone: '+1 (555) 890-3456', description: 'Solar micro-inverter designs and student sustainability initiatives on campus.', category: 'Engineering', members_count: 54, events_count: 2, logo_url: null, constitution_pdf_url: null }
];

export const INITIAL_MEMBERS = [
  { id: 1, name: "Alice Johnson", role: "club", email: "alice@university.edu", phone: "+1 (555) 342-8910", dept: "Computer Science", assigned_club: "Computer Science Society", status: "Active" },
  { id: 2, name: "Bob Smith", role: "club", email: "bob@university.edu", phone: "+1 (555) 678-1290", dept: "Electronics", assigned_club: "Robotics Society", status: "Active" },
  { id: 3, name: "Charlie Davis", role: "admin", email: "charlie@university.edu", phone: "+1 (555) 987-4321", dept: "Registrar Office", assigned_club: "Central Governance", status: "Active" },
  { id: 4, name: "Diana Prince", role: "club", email: "diana@university.edu", phone: "+1 (555) 890-3456", dept: "Civil Engineering", assigned_club: "Sustainable Habitat Guild", status: "Inactive" },
  { id: 5, name: "Evan Wright", role: "admin", email: "evan@university.edu", phone: "+1 (555) 234-8765", dept: "Robotics Facility", assigned_club: "Drone Society", status: "Active" },
  { id: 6, name: "Fiona Gallagher", role: "club", email: "fiona@university.edu", phone: "+1 (555) 456-7890", dept: "Data Science", assigned_club: "AI & ML Guild", status: "Active" },
  { id: 7, name: "George Miller", role: "club", email: "george@university.edu", phone: "+1 (555) 789-0123", dept: "Mechanical Engineering", assigned_club: "Formula Student Racing", status: "Active" },
  { id: 8, name: "Hannah Abbott", role: "admin", email: "hannah@university.edu", phone: "+1 (555) 654-3210", dept: "Biotechnology Labs", assigned_club: "Bio-Safety Council", status: "Inactive" }
];

export async function getInitialUsers() {
  const adminPassword = ENV.ADMIN.PASSWORD || 'Admin@123456';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const clubHash = await bcrypt.hash(ENV.CLUB_LEAD.PASSWORD || 'Club@123456', 10);
  const studentHash = await bcrypt.hash(ENV.STUDENT.PASSWORD || 'Student@123456', 10);

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
    },
    // Add Alice Johnson
    {
      id: 4,
      name: 'Alice Johnson',
      email: 'alice@university.edu',
      password_hash: clubHash,
      role: 'club',
      phone: '+1 (555) 342-8910',
      dept: 'Computer Science',
      assigned_club: 'Campus Photography Club',
      status: 'Active'
    }
  ];
}

export const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Annual Hackathon 2026',
    club: 'Computer Science Club',
    category: 'Competition',
    date: 'Oct 14, 2026',
    time_slot: '09:00 AM - 09:00 PM',
    month: 'OCT',
    day: '14',
    venue: 'Engineering Hall A',
    budget: '$2,800',
    attendees: 240,
    status: 'Upcoming',
    approval_status: 'Approved',
    timeframe: 'Future',
    lead_coordinator: 'Alice Johnson',
    coordinator_email: 'alice.johnson@university.edu',
    description: 'Flagship inter-collegiate programming hackathon spanning 24 hours of rapid prototyping, API sandboxes, sponsor challenges, and grand varsity awards.',
    justification: 'Covers cloud compute credits, mentor honorariums, and grand prize pool.',
    agenda_json: [
      { time: '09:00 AM', title: 'Registration & Team Check-In' },
      { time: '10:30 AM', title: 'Opening Keynote & Problem Statements' },
      { time: '01:00 PM', title: 'Sprint Phase 1 & Mentorship Hours' },
      { time: '05:30 PM', title: 'Architecture Review Checkpoint' },
      { time: '08:00 PM', title: 'Final Pitch Demos & Awards Gala' }
    ],
    budget_breakdown_json: {
      prizeMoney: 1200,
      refreshments: 700,
      decors: 400,
      miscPurchases: 300,
      customItems: [{ id: 'c1', name: 'Server Compute Credits', amount: 200 }]
    },
    has_reg_form: true,
    reg_form_config_json: {
      formTitle: 'Annual Hackathon 2026 Registration Form',
      instructions: 'Please enter verified GitHub handles and track specialization.',
      collectTeamInfo: true,
      collectDietary: true,
      collectTshirt: true,
      customQuestions: [
        { id: 'q_track', label: 'Development Track', type: 'select', options: ['AI & Neural Nets', 'Full Stack Web3', 'Cybersecurity', 'Open Innovation'], required: true },
        { id: 'q_repo', label: 'GitHub Profile URL', type: 'text', required: false }
      ]
    },
    registration_json: {
      totalRegistered: 240,
      maxCapacity: 300,
      deadline: 'Oct 10, 2026',
      status: 'Registration Open',
      targetAudience: 'Undergraduate & Postgraduate Students, Club Delegates'
    },
    ai_summary_json: {
      feasibilityScore: '98% Optimal',
      riskAssessment: 'Low Risk',
      executiveSummary: 'Annual Hackathon 2026 demonstrates strong alignment with varsity co-curricular goals, structured faculty supervision, and high student engagement.',
      recommendation: 'Recommended for administrative approval. The designated venue safely accommodates the expected 240 delegates.',
      tags: ['Safety Compliant', 'Budget Optimized', 'High Engagement']
    },
    poster_url: null,
    guidelines_pdf_url: null
  },
  {
    id: 2,
    title: 'Photography Masterclass',
    club: 'Campus Photography Club',
    category: 'Workshop',
    date: 'Sept 15, 2026',
    time_slot: '10:00 AM - 04:00 PM',
    month: 'SEP',
    day: '15',
    venue: 'Arts Center 102',
    budget: '$450',
    attendees: 52,
    status: 'Ongoing',
    approval_status: 'Approved',
    timeframe: 'Present',
    lead_coordinator: 'Bob Smith',
    coordinator_email: 'bob.smith@university.edu',
    description: 'Practical darkroom chemistry, manual aperture control, and portraiture composition workshop with visiting photojournalists.',
    justification: 'Seed allocation for mounting boards, archival print paper, and chemical reagents.',
    agenda_json: [
      { time: '10:00 AM', title: 'Studio Lighting Setup & Metering' },
      { time: '12:30 PM', title: 'Courtyard Model Shoot' },
      { time: '02:30 PM', title: 'Darkroom Chemistry & Developing' },
      { time: '03:45 PM', title: 'Peer Review & Print Selection' }
    ],
    budget_breakdown_json: {
      prizeMoney: 100,
      refreshments: 150,
      decors: 100,
      miscPurchases: 100,
      customItems: []
    },
    has_reg_form: true,
    reg_form_config_json: {
      formTitle: 'Photography Masterclass Registration',
      instructions: 'Bring your own DSLR or 35mm film camera.',
      collectTeamInfo: false,
      collectDietary: false,
      collectTshirt: false,
      customQuestions: [
        { id: 'q_cam', label: 'Camera Model / System', type: 'text', required: true }
      ]
    },
    registration_json: {
      totalRegistered: 52,
      maxCapacity: 80,
      deadline: 'Sept 14, 2026',
      status: 'Registration Open',
      targetAudience: 'All Photography Enthusiasts'
    },
    ai_summary_json: {
      feasibilityScore: '96% Optimal',
      riskAssessment: 'Low Risk',
      executiveSummary: 'Hands-on darkroom workshop with excellent student-to-mentor ratio.',
      recommendation: 'Approved for Arts Center facility usage.',
      tags: ['Creative', 'Practical Skills']
    },
    poster_url: null,
    guidelines_pdf_url: null
  },
  {
    id: 3,
    title: 'Fall Tech Career Fair',
    club: 'University Placement Cell',
    category: 'Exhibition',
    date: 'Sept 10, 2026',
    time_slot: '11:00 AM - 06:00 PM',
    month: 'SEP',
    day: '10',
    venue: 'Exhibition Ground',
    budget: '$4,500',
    attendees: 1100,
    status: 'Past',
    approval_status: 'Approved',
    timeframe: 'Past',
    lead_coordinator: 'Diana Prince',
    coordinator_email: 'diana.prince@university.edu',
    description: 'Biannual campus employment convention hosting 45 corporate partners, recruiters, and engineering research fellows.',
    justification: 'Outdoor canopy staging, power generation, and employer hospitality.',
    agenda_json: [
      { time: '11:00 AM', title: 'Exhibition Hall Opens to Seniors' },
      { time: '01:30 PM', title: 'General Student Admission' },
      { time: '03:30 PM', title: 'Industry Panel: 2027 Engineering Horizons' },
      { time: '05:30 PM', title: 'Recruiter Networking Mixer' }
    ],
    budget_breakdown_json: {
      prizeMoney: 0,
      refreshments: 2000,
      decors: 1500,
      miscPurchases: 1000,
      customItems: []
    },
    has_reg_form: false,
    reg_form_config_json: null,
    registration_json: {
      totalRegistered: 1100,
      maxCapacity: 2500,
      deadline: 'Sept 09, 2026',
      status: 'Completed',
      targetAudience: 'Graduating Seniors and Alumni'
    },
    ai_summary_json: {
      feasibilityScore: '99% Optimal',
      riskAssessment: 'Low Risk',
      executiveSummary: 'Large-scale career convention executed smoothly with zero incidents.',
      recommendation: 'Archived for seasonal placement benchmarks.',
      tags: ['Career Growth', 'Corporate Relations']
    },
    poster_url: null,
    guidelines_pdf_url: null
  },
  // Pending Approval proposals
  {
    id: 100,
    title: 'Annual Robotics Grand Prix 2026',
    club: 'Robotics Society',
    category: 'Competition',
    date: 'Oct 12, 2026',
    time_slot: '02:00 PM - 08:00 PM',
    month: 'OCT',
    day: '12',
    venue: 'Main Innovation Arena',
    budget: '$1,500',
    attendees: 240,
    status: 'Pending Review',
    approval_status: 'Pending Review',
    timeframe: 'Future',
    lead_coordinator: 'Bob Smith',
    coordinator_email: 'bob.smith@university.edu',
    description: 'Premier inter-college autonomous bot competition featuring 36 engineering teams, live arena obstacles, and faculty evaluation panels.',
    justification: 'Grant covers arena obstacle modular staging, autonomous laser timing gates, and guest faculty judge honorariums.',
    agenda_json: [
      { time: '02:00 PM', title: 'Arena Calibration & Sensor Verification' },
      { time: '03:30 PM', title: 'Preliminary Autonomous Slalom Heats' },
      { time: '05:45 PM', title: 'Championship Obstacle Arena Finals' },
      { time: '07:30 PM', title: 'Faculty Awards & Trophy Presentation' }
    ],
    budget_breakdown_json: {
      prizeMoney: 600,
      refreshments: 375,
      decors: 270,
      miscPurchases: 150,
      customItems: [{ id: 'c1', name: 'Laser Gate Sensors', amount: 105 }]
    },
    has_reg_form: true,
    reg_form_config_json: {
      formTitle: 'Annual Robotics Grand Prix 2026 Team Registration',
      instructions: 'Submit team roster and bot weight class specifications.',
      collectTeamInfo: true,
      collectDietary: true,
      collectTshirt: false,
      customQuestions: [
        { id: 'q_class', label: 'Weight Category', type: 'select', options: ['Antweight 450g', 'Beetleweight 1.5kg', 'Combat 15kg', 'Autonomous Slalom'], required: true },
        { id: 'q_cad', label: 'CAD Design Drive Link', type: 'text', required: false }
      ]
    },
    registration_json: {
      totalRegistered: 48,
      maxCapacity: 250,
      deadline: 'Oct 08, 2026',
      status: 'Registration Open',
      targetAudience: 'Engineering and Computer Science Undergraduates'
    },
    ai_summary_json: {
      feasibilityScore: '98% Optimal',
      riskAssessment: 'Low Risk',
      executiveSummary: 'Annual Robotics Grand Prix 2026 demonstrates strong alignment with varsity goals and rigorous safety protocols.',
      recommendation: 'Recommended for administrative approval. Innovation Arena provides sufficient electrical drop-downs and safety netting.',
      tags: ['Safety Compliant', 'Budget Optimized', 'Faculty Supervised']
    },
    poster_url: null,
    guidelines_pdf_url: null
  },
  {
    id: 101,
    title: 'Annual Tech Symposium 2026',
    club: 'Computer Science Club',
    category: 'Symposium',
    date: 'Oct 12, 2026',
    time_slot: '09:30 AM - 05:00 PM',
    month: 'OCT',
    day: '12',
    venue: 'Main Auditorium',
    budget: '$1,500',
    attendees: 350,
    status: 'Pending Review',
    approval_status: 'Pending Review',
    timeframe: 'Future',
    lead_coordinator: 'Alice Johnson',
    coordinator_email: 'alice.johnson@university.edu',
    description: 'A full-day symposium featuring guest speakers from premier tech industry labs, deep learning workshops, and student paper tracks.',
    justification: 'Grant will cover keynote speaker honorariums, live-stream audio-visual equipment rental, and delegate accreditation materials.',
    agenda_json: [
      { time: '09:30 AM', title: 'Inaugural Keynote & Campus Welcome' },
      { time: '11:00 AM', title: 'Deep Learning Workshop Session' },
      { time: '02:00 PM', title: 'Student Research Paper Presentations' },
      { time: '04:15 PM', title: 'Industry Panel & Closing Remarks' }
    ],
    budget_breakdown_json: {
      prizeMoney: 500,
      refreshments: 500,
      decors: 250,
      miscPurchases: 250,
      customItems: []
    },
    has_reg_form: true,
    reg_form_config_json: null,
    registration_json: {
      totalRegistered: 120,
      maxCapacity: 350,
      deadline: 'Oct 09, 2026',
      status: 'Registration Open',
      targetAudience: 'Open Campus Invitation'
    },
    ai_summary_json: {
      feasibilityScore: '97% Optimal',
      riskAssessment: 'Low Risk',
      executiveSummary: 'High-impact technical symposium with strong external research partner participation.',
      recommendation: 'Recommended for approval with Main Auditorium scheduling.',
      tags: ['Academic Excellence', 'Keynote Panels']
    },
    poster_url: null,
    guidelines_pdf_url: null
  }
];

export const INITIAL_REGISTRATIONS = [
  { id: 1, event_id: 1, student_name: 'Alex Vance', student_reg_no: '2024CS01', email: 'alex.vance@university.edu', track: 'AI & Neural Nets', team_name: 'Neural Pioneers', status: 'Confirmed', checked_in: true, ticket_id: 'TCK-8801', form_responses_json: {}, resume_or_doc_url: null },
  { id: 2, event_id: 1, student_name: 'Maya Lin', student_reg_no: '2024EC14', email: 'maya.lin@university.edu', track: 'Cybersecurity', team_name: 'CipherGuard', status: 'Confirmed', checked_in: true, ticket_id: 'TCK-8802', form_responses_json: {}, resume_or_doc_url: null },
  { id: 3, event_id: 1, student_name: 'Evan Wright', student_reg_no: '2023ME88', email: 'evan.w@university.edu', track: 'Full Stack Web3', team_name: 'BlockSmiths', status: 'Waitlisted', checked_in: false, ticket_id: 'TCK-8803', form_responses_json: {}, resume_or_doc_url: null },
  { id: 4, event_id: 2, student_name: 'Chloe Price', student_reg_no: '2025AR09', email: 'chloe.p@university.edu', track: 'General Track', team_name: null, status: 'Confirmed', checked_in: true, ticket_id: 'TCK-9101', form_responses_json: {}, resume_or_doc_url: null },
  { id: 5, event_id: 2, student_name: 'Max Caulfield', student_reg_no: '2025AR02', email: 'max.c@university.edu', track: 'General Track', team_name: null, status: 'Confirmed', checked_in: true, ticket_id: 'TCK-9102', form_responses_json: {}, resume_or_doc_url: null }
];

export const INITIAL_REVIEWS = [
  {
    id: 1,
    event_id: 1,
    title: 'Autonomous Robotics Grand Prix 2026',
    club: 'Robotics & Autonomous Systems Guild',
    date: 'Sept 15, 2026',
    venue: 'Main Innovation Arena',
    overall_rating: 4.9,
    turnout_rate: '98%',
    total_reviews: 4,
    admin_feedback_json: {
      feedback: 'Exemplary execution by the Robotics Guild. Obstacle track laser timing gates operated with zero latency. Arena safety enclosures adhered strictly to varsity regulations. Seed grant was fully accounted for with zero fiscal overrun.',
      adminName: 'Office of Campus Administration',
      date: 'Sept 18, 2026'
    },
    organizer_reply_json: {
      reply: 'Thank you to the university administration and all delegates for an electrifying competition! Next semester, we will introduce a dedicated telemetry live-stream screen for spectators.',
      organizerName: 'Robotics Guild Lead',
      date: 'Sept 19, 2026'
    },
    reviews_json: [
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
    event_id: 2,
    title: 'Combat Bot Circuit Design Clinic',
    club: 'Robotics & Autonomous Systems Guild',
    date: 'Sept 04, 2026',
    venue: 'Makerspace Lab 2',
    overall_rating: 4.7,
    turnout_rate: '95%',
    total_reviews: 2,
    admin_feedback_json: {
      feedback: 'Great educational clinic. 45 junior students completed their first motor controller PCB solder assemblies safely under mentor supervision.',
      adminName: 'Faculty of Engineering Review Board',
      date: 'Sept 07, 2026'
    },
    organizer_reply_json: null,
    reviews_json: [
      {
        id: 505,
        name: 'Devin Cole',
        collegeName: 'Dept of Mechatronics & AI',
        mailId: 'devin.c@university.edu',
        rating: 5,
        date: 'Sept 05, 2026',
        feedback: 'Learned H-bridge troubleshooting and thermal management for high-amperage drive motors.'
      },
      {
        id: 506,
        name: 'Priya Patel',
        collegeName: 'School of Computer Science',
        mailId: 'priya.p@university.edu',
        rating: 4.5,
        date: 'Sept 06, 2026',
        feedback: 'Clear step-by-step guidance on surface-mount soldering.'
      }
    ]
  }
];
