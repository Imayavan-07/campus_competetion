import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrashIcon,
  CheckIcon,
  PlusIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  UsersIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  AcademicCapIcon,
  ShieldIcon,
  CalendarIcon,
  AlertCircleIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

const DEFAULT_CLUBS = [
  { id: 1, name: 'Campus Photography Club', dept: 'Arts & Culture', category: 'Cultural & Arts', members: 45, events: 3, president: 'Evan Wright', presidentEmail: 'evan.wright@university.edu', presidentPhone: '+1 (555) 234-8765', presidentYear: '3rd Year', coordinator: 'Alice Johnson', coordinatorDept: 'Computer Science', coordinatorEmail: 'alice.johnson@university.edu', coordinatorPhone: '+1 (555) 342-8910', email: 'photography@university.edu', description: 'The premier student creative photography guild dedicated to visual journalism, darkroom development, and campus exhibitions.' },
  { id: 2, name: 'Robotics Society', dept: 'Engineering', category: 'Technical Society', members: 120, events: 1, president: 'Jane Doe', presidentEmail: 'jane.doe@university.edu', presidentPhone: '+1 (555) 345-6789', presidentYear: '4th Year', coordinator: 'Bob Smith', coordinatorDept: 'Electronics', coordinatorEmail: 'bob.smith@university.edu', coordinatorPhone: '+1 (555) 678-1290', email: 'robotics@university.edu', description: 'Autonomous systems design, battle-bot fabrication, and national robotics league varsity preparation team.' },
  { id: 3, name: 'Debate & Oratory Team', dept: 'Arts & Culture', category: 'Cultural & Arts', members: 30, events: 5, president: 'Michael Scott', presidentEmail: 'michael.scott@university.edu', presidentPhone: '+1 (555) 456-7890', presidentYear: '3rd Year', coordinator: 'Alice Johnson', coordinatorDept: 'Computer Science', coordinatorEmail: 'alice.johnson@university.edu', coordinatorPhone: '+1 (555) 342-8910', email: 'debate@university.edu', description: 'Parliamentary and policy debate society hosting intercollegiate speech tournaments and civic forums.' },
  { id: 4, name: 'Quantum & Chess Guild', dept: 'Science', category: 'Academic & Research', members: 25, events: 2, president: 'Beth Harmon', presidentEmail: 'beth.harmon@university.edu', presidentPhone: '+1 (555) 567-8901', presidentYear: '2nd Year', coordinator: 'Fiona Gallagher', coordinatorDept: 'Data Science', coordinatorEmail: 'fiona.gallagher@university.edu', coordinatorPhone: '+1 (555) 456-7890', email: 'chess@university.edu', description: 'Strategic analysis, blitz tournament organization, and quantum computation discussion seminars.' },
  { id: 5, name: 'Collegiate Esports League', dept: 'Sports', category: 'Sports & Athletics', members: 88, events: 4, president: 'Tenzing Norgay', presidentEmail: 'tenzing@university.edu', presidentPhone: '+1 (555) 678-9012', presidentYear: '3rd Year', coordinator: 'George Miller', coordinatorDept: 'Mechanical Engineering', coordinatorEmail: 'george.miller@university.edu', coordinatorPhone: '+1 (555) 789-0123', email: 'esports@university.edu', description: 'Varsity gaming league organizing campus LAN competitions, strategy coaching, and collegiate broadcasts.' },
  { id: 6, name: 'Renewable Energies Club', dept: 'Engineering', category: 'Technical Society', members: 54, events: 2, president: 'Claire Bennett', presidentEmail: 'claire@university.edu', presidentPhone: '+1 (555) 789-0123', presidentYear: '4th Year', coordinator: 'Diana Prince', coordinatorDept: 'Civil Engineering', coordinatorEmail: 'diana.prince@university.edu', coordinatorPhone: '+1 (555) 890-3456', email: 'renewables@university.edu', description: 'Clean technology research collective building solar campus charging kiosks and micro-wind prototypes.' }
];

const DEFAULT_COORDINATORS = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@university.edu', dept: 'Computer Science', phone: '+1 (555) 342-8910', role: 'Club Coordinator' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@university.edu', dept: 'Electronics', phone: '+1 (555) 678-1290', role: 'Club Coordinator' },
  { id: 4, name: 'Diana Prince', email: 'diana.prince@university.edu', dept: 'Civil Engineering', phone: '+1 (555) 890-3456', role: 'Club Coordinator' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona.gallagher@university.edu', dept: 'Data Science', phone: '+1 (555) 456-7890', role: 'Club Coordinator' },
  { id: 7, name: 'George Miller', email: 'george.miller@university.edu', dept: 'Mechanical Engineering', phone: '+1 (555) 789-0123', role: 'Club Coordinator' }
];

export default function ClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeModal, setActiveModal] = useState(null); // 'deleteClub' | null
  const [coordinators, setCoordinators] = useState(DEFAULT_COORDINATORS);

  // Load available club coordinators
  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem('unisync_members');
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        const coords = parsed.filter(m => m.role === 'Club Coordinator');
        if (coords.length > 0) {
          setCoordinators(coords);
        }
      }
    } catch (e) {
      console.warn('Could not read saved members', e);
    }
  }, []);

  // Form editable states
  const [clubName, setClubName] = useState('');
  const [dept, setDept] = useState('Engineering');
  const [category, setCategory] = useState('Technical Society');
  const [email, setEmail] = useState('');
  const [membersCount, setMembersCount] = useState(15);
  const [eventsCount, setEventsCount] = useState(0);
  const [description, setDescription] = useState('');
  
  // Coordinator selection & contact
  const [coordinatorName, setCoordinatorName] = useState('Alice Johnson');
  const [coordinatorDept, setCoordinatorDept] = useState('Computer Science');
  const [coordinatorEmail, setCoordinatorEmail] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');

  // President Details
  const [president, setPresident] = useState('');
  const [presidentEmail, setPresidentEmail] = useState('');
  const [presidentPhone, setPresidentPhone] = useState('');
  const [presidentYear, setPresidentYear] = useState('3rd Year');

  // Vice President Details
  const [vpName, setVpName] = useState('');
  const [vpEmail, setVpEmail] = useState('');
  const [vpPhone, setVpPhone] = useState('');
  const [vpYear, setVpYear] = useState('3rd Year');

  // Logo State
  const [logoPreview, setLogoPreview] = useState(null);

  // Dynamic Cabinet Positions
  const [positions, setPositions] = useState([
    { id: 1, title: 'Secretary', memberName: '' },
    { id: 2, title: 'Treasurer', memberName: '' }
  ]);

  // Load and populate club details whenever the ID changes
  useEffect(() => {
    let currentClub = null;
    try {
      const saved = localStorage.getItem('unisync_clubs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentClub = parsed.find(c => String(c.id) === String(id));
        }
      }
    } catch (e) {
      console.warn('Could not read saved clubs', e);
    }

    if (!currentClub) {
      currentClub = DEFAULT_CLUBS.find(c => String(c.id) === String(id)) || DEFAULT_CLUBS[0];
    }

    if (currentClub) {
      setClubName(currentClub.name || '');
      setDept(currentClub.dept || 'Engineering');
      setCategory(currentClub.category || 'Technical Society');
      setEmail(currentClub.email || '');
      setMembersCount(currentClub.members || 15);
      setEventsCount(currentClub.events || 0);
      setDescription(currentClub.description || '');
      setLogoPreview(currentClub.logo || null);

      // Coordinator
      const matchedCoord = coordinators.find(c => c.name === currentClub.coordinator) || DEFAULT_COORDINATORS[0];
      setCoordinatorName(currentClub.coordinator || matchedCoord.name);
      setCoordinatorDept(currentClub.coordinatorDept || matchedCoord.dept);
      setCoordinatorEmail(currentClub.coordinatorEmail || matchedCoord.email);
      setCoordinatorPhone(currentClub.coordinatorPhone || matchedCoord.phone);

      // President
      setPresident(currentClub.president || '');
      setPresidentEmail(currentClub.presidentEmail || `${(currentClub.president || 'president').toLowerCase().replace(/\s+/g, '.')}@university.edu`);
      setPresidentPhone(currentClub.presidentPhone || '+1 (555) 234-8765');
      setPresidentYear(currentClub.presidentYear || '3rd Year');

      // Vice President
      setVpName(currentClub.vicePresident?.name || 'Sarah Jenkins');
      setVpEmail(currentClub.vicePresident?.email || 'sarah.jenkins@university.edu');
      setVpPhone(currentClub.vicePresident?.phone || '+1 (555) 876-5432');
      setVpYear(currentClub.vicePresident?.year || '3rd Year');

      // Cabinet positions
      if (currentClub.executivePositions && Array.isArray(currentClub.executivePositions) && currentClub.executivePositions.length > 0) {
        setPositions(currentClub.executivePositions.map((p, idx) => ({
          id: p.id || idx + 1,
          title: p.title || '',
          memberName: p.memberName || ''
        })));
      } else {
        setPositions([
          { id: 1, title: 'Secretary', memberName: 'Emily Chen' },
          { id: 2, title: 'Treasurer', memberName: 'Mark Lee' }
        ]);
      }
    }
  }, [id, coordinators]);

  // When coordinator changes from dropdown, sync department, email, and phone
  const handleCoordinatorChange = (selectedName) => {
    setCoordinatorName(selectedName);
    const matched = coordinators.find(c => c.name === selectedName);
    if (matched) {
      setCoordinatorDept(matched.dept);
      setCoordinatorEmail(matched.email);
      setCoordinatorPhone(matched.phone);
    }
  };

  // Logo upload handler
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidExt = ['png', 'jpg', 'jpeg', 'svg'].includes(extension);

    if (!validTypes.includes(file.type) && !isValidExt) {
      showToast('Please upload an image in PNG, JPEG, JPG, or SVG format.', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      showToast('Club logo updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    showToast('Club logo removed.', 'info');
  };

  // Dynamic Positions helpers
  const handleAddPosition = () => {
    const newPos = {
      id: Date.now(),
      title: '',
      memberName: ''
    };
    setPositions([...positions, newPos]);
  };

  const handleRemovePosition = (posId) => {
    if (positions.length <= 1) {
      showToast('A club must maintain at least one leadership position.', 'warning');
      return;
    }
    setPositions(positions.filter(p => p.id !== posId));
  };

  const handlePositionChange = (posId, field, value) => {
    setPositions(positions.map(p => {
      if (p.id === posId) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Save changes handler
  const handleSaveChanges = (e) => {
    e.preventDefault();

    if (!clubName.trim()) {
      showToast('Official Club Name cannot be empty.', 'warning');
      return;
    }
    if (!email.trim()) {
      showToast('Official Club Email is required.', 'warning');
      return;
    }
    if (!president.trim()) {
      showToast('President name is required.', 'warning');
      return;
    }

    const updatedClub = {
      id: Number(id) || id,
      name: clubName.trim(),
      dept,
      category,
      email: email.trim(),
      members: Number(membersCount) || 1,
      events: Number(eventsCount) || 0,
      description: description.trim(),
      logo: logoPreview,
      coordinator: coordinatorName,
      coordinatorDept,
      coordinatorEmail,
      coordinatorPhone,
      president: president.trim(),
      presidentEmail: presidentEmail.trim(),
      presidentPhone: presidentPhone.trim(),
      presidentYear,
      vicePresident: {
        name: vpName.trim(),
        email: vpEmail.trim(),
        phone: vpPhone.trim(),
        year: vpYear
      },
      executivePositions: positions.filter(p => p.title.trim() !== '')
    };

    try {
      const saved = localStorage.getItem('unisync_clubs');
      let clubList = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) clubList = parsed;
      } else {
        clubList = [...DEFAULT_CLUBS];
      }

      const existingIndex = clubList.findIndex(c => String(c.id) === String(id));
      if (existingIndex >= 0) {
        clubList[existingIndex] = { ...clubList[existingIndex], ...updatedClub };
      } else {
        clubList.push(updatedClub);
      }

      localStorage.setItem('unisync_clubs', JSON.stringify(clubList));
      showToast(`Club profile for "${clubName}" updated successfully!`, 'success');
    } catch (err) {
      console.error('Error saving club changes', err);
      showToast('Error saving changes to local storage', 'error');
    }
  };

  // Delete Club handler
  const handleDeleteClub = () => {
    try {
      const saved = localStorage.getItem('unisync_clubs');
      let clubList = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          clubList = parsed.filter(c => String(c.id) !== String(id));
        }
      } else {
        clubList = DEFAULT_CLUBS.filter(c => String(c.id) !== String(id));
      }

      localStorage.setItem('unisync_clubs', JSON.stringify(clubList));
      showToast(`Club "${clubName}" has been deleted successfully!`, 'success');
      setActiveModal(null);
      navigate('/admin/clubs');
    } catch (err) {
      console.error('Error deleting club', err);
      showToast('Error deleting club record.', 'error');
    }
  };

  return (
    <div className="pb-16">
      {/* Back & Page Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/clubs')}
            className="btn btn-outline btn-sm flex items-center gap-1.5"
          >
            <span>← Back to Clubs</span>
          </button>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.6rem' }}>Edit Club Details</h1>
            <p className="page-description" style={{ marginTop: '2px' }}>
              Modify identity, leadership assignments, and governance records for organization #{id}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <form onSubmit={handleSaveChanges} className="flex flex-col gap-6">

          {/* 1. BRANDING & BASIC PROFILE CARD */}
          <div className="card" style={{ padding: '24px 28px' }}>
            <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-gray-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-extrabold text-main">Club Branding & Primary Identity</h3>
                <p className="text-xs text-muted">Organization logo, official name, faculty department, and category</p>
              </div>
              <span className="badge badge-blue">Editable Record</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              {/* Logo Showcase & Upload Box */}
              <div className="flex flex-col items-center gap-2.5 shrink-0">
                <div
                  className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden shadow-sm hover:border-blue-500 transition-colors"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={`${clubName} Logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                      <PhotoIcon className="w-9 h-9 text-gray-400 dark:text-neutral-500 mb-1" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        No Logo
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay with Change Trigger */}
                  <label
                    htmlFor="club-logo-upload"
                    className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold p-2 text-center"
                    title="Upload or change logo"
                  >
                    <ArrowUpTrayIcon className="w-5 h-5 mb-1" />
                    <span>Change Logo</span>
                  </label>
                </div>

                {/* Upload & Remove Controls */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="club-logo-upload"
                    className="btn btn-outline btn-sm text-xs py-1 px-2.5 cursor-pointer flex items-center gap-1"
                  >
                    <PhotoIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{logoPreview ? 'Change' : 'Upload Logo'}</span>
                  </label>
                  <input
                    id="club-logo-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="btn btn-outline btn-sm text-xs py-1 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Remove uploaded logo"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Organization Name & Core Details Inputs */}
              <div className="flex-1 w-full flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label font-bold text-xs">Official Organization Name</label>
                  <input
                    type="text"
                    className="form-input text-base font-extrabold text-main"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="e.g. Robotics Society"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Faculty Department</label>
                    <select
                      className="form-select font-semibold text-sm"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Arts & Culture">Arts & Culture</option>
                      <option value="Science">Science</option>
                      <option value="Sports">Sports</option>
                      <option value="Management">Management</option>
                      <option value="Biotechnology">Biotechnology</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Society Category</label>
                    <select
                      className="form-select font-semibold text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Technical Society">Technical Society</option>
                      <option value="Cultural & Arts">Cultural & Arts</option>
                      <option value="Academic & Research">Academic & Research</option>
                      <option value="Sports & Athletics">Sports & Athletics</option>
                      <option value="Social Impact">Social Impact</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Numbers & Contact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <div className="form-group">
                <label className="form-label font-bold text-xs flex items-center gap-1.5">
                  <MailIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Official Club Email</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="club@university.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold text-xs flex items-center gap-1.5">
                  <UsersIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Total Members Count</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-input font-bold"
                  value={membersCount}
                  onChange={(e) => setMembersCount(Number(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold text-xs flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active Events Hosted</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input font-bold"
                  value={eventsCount}
                  onChange={(e) => setEventsCount(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="form-group">
              <label className="form-label font-bold text-xs">Mission Statement & Club Description</label>
              <textarea
                rows={3}
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the club's objectives, projects, meetings, and student engagement scope..."
              ></textarea>
            </div>
          </div>

          {/* 2. CLUB COORDINATOR DETAILS CARD */}
          <div className="card" style={{ padding: '24px 28px' }}>
            <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-main">Club Coordinator Oversight</h3>
                  <p className="text-xs text-muted">Faculty governance, mentor liaison, and administrative supervisor</p>
                </div>
              </div>
              <span className="badge badge-blue">Official Liaison</span>
            </div>

            {/* Coordinator Selector & Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="form-group">
                <label className="form-label font-bold text-xs">Assign Club Coordinator</label>
                <select
                  className="form-select font-semibold text-sm"
                  value={coordinatorName}
                  onChange={(e) => handleCoordinatorChange(e.target.value)}
                >
                  {coordinators.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.dept})
                    </option>
                  ))}
                </select>
                <p className="form-helper text-[11px] text-muted mt-1">
                  Changing the coordinator updates the primary approval officer for club activities.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label font-bold text-xs flex items-center gap-1.5">
                  <BuildingIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Academic Department</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={coordinatorDept}
                  onChange={(e) => setCoordinatorDept(e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            {/* Coordinator Contact Details (Fully Editable) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800/80">
              <div className="form-group">
                <label className="form-label font-bold text-xs flex items-center gap-1.5">
                  <MailIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Coordinator Official Email</span>
                </label>
                <input
                  type="email"
                  className="form-input text-xs"
                  value={coordinatorEmail}
                  onChange={(e) => setCoordinatorEmail(e.target.value)}
                  placeholder="coordinator@university.edu"
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold text-xs flex items-center gap-1.5">
                  <PhoneIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coordinator Direct Phone</span>
                </label>
                <input
                  type="text"
                  className="form-input text-xs"
                  value={coordinatorPhone}
                  onChange={(e) => setCoordinatorPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* 3. STUDENT LEADERSHIP & CABINET POSITIONS */}
          <div className="card" style={{ padding: '24px 28px' }}>
            <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-extrabold text-main">Executive Board & Student Leadership</h3>
                <p className="text-xs text-muted">Appointed president, vice president, and custom cabinet officers</p>
              </div>
              <span className="badge badge-blue">Cabinet</span>
            </div>

            {/* President Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400">
                  Appointed President
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-group">
                  <label className="form-label text-xs">Full Name</label>
                  <input
                    type="text"
                    className="form-input font-bold"
                    value={president}
                    onChange={(e) => setPresident(e.target.value)}
                    placeholder="e.g. Evan Wright"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={presidentEmail}
                    onChange={(e) => setPresidentEmail(e.target.value)}
                    placeholder="president@university.edu"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={presidentPhone}
                    onChange={(e) => setPresidentPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Year of Study</label>
                  <select
                    className="form-select"
                    value={presidentYear}
                    onChange={(e) => setPresidentYear(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vice President Section */}
            <div className="mb-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-3">
                <AcademicCapIcon className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">
                  Vice President
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-group">
                  <label className="form-label text-xs">Full Name</label>
                  <input
                    type="text"
                    className="form-input font-bold"
                    value={vpName}
                    onChange={(e) => setVpName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={vpEmail}
                    onChange={(e) => setVpEmail(e.target.value)}
                    placeholder="vp@university.edu"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={vpPhone}
                    onChange={(e) => setVpPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Year of Study</label>
                  <select
                    className="form-select"
                    value={vpYear}
                    onChange={(e) => setVpYear(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Cabinet Positions List */}
            <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted">
                    Custom Cabinet Positions & Leads
                  </h4>
                  <p className="text-[11px] text-muted">
                    Specify titles and assign member names for custom leadership positions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPosition}
                  className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 py-1 px-3"
                >
                  <PlusIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Add Position</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {positions.map((pos) => (
                  <div
                    key={pos.id}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800"
                  >
                    <div>
                      <label className="form-label text-[11px] font-bold text-muted">Position / Role Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Secretary, Treasurer, Media Lead"
                        className="form-input text-xs font-semibold"
                        value={pos.title}
                        onChange={(e) => handlePositionChange(pos.id, 'title', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="form-label text-[11px] font-bold text-muted">Assigned Member Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Alex Morgan"
                          className="form-input text-xs font-semibold"
                          value={pos.memberName}
                          onChange={(e) => handlePositionChange(pos.id, 'memberName', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePosition(pos.id)}
                        className="btn btn-icon-sm self-end mb-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 p-2 rounded-lg transition-colors"
                        title="Remove position"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. ACTION CONTROLS ROW */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
            <button
              type="button"
              className="btn btn-danger btn-sm flex items-center gap-2 px-4 py-2 font-bold shadow-xs hover:shadow-md transition-all"
              onClick={() => setActiveModal('deleteClub')}
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete Club</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2 px-6 py-2.5 font-bold shadow-md hover:shadow-lg transition-all"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Save Club Changes</span>
            </button>
          </div>

        </form>
      </div>

      {/* MODAL: DELETE CLUB */}
      <Modal
        isOpen={activeModal === 'deleteClub'}
        onClose={() => setActiveModal(null)}
        title="Delete Organization Record?"
        subtitle="Permanent removal of this club from campus registry"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger flex items-center gap-1.5"
              onClick={handleDeleteClub}
            >
              <TrashIcon className="w-4 h-4" />
              <span>Confirm Deletion</span>
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
            <AlertCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
              <strong>Warning:</strong> This action cannot be undone. Deleting <strong>{clubName}</strong> will remove all membership rosters, leadership allocations, and assigned permissions.
            </div>
          </div>
          <p className="text-sm text-muted">
            Are you sure you want to permanently delete this organization from the active university directory?
          </p>
        </div>
      </Modal>

    </div>
  );
}
