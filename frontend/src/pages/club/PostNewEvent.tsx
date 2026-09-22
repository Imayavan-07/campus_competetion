import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CheckIcon,
  ClockIcon,
  ShieldIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon
} from '../../components/common/Icons';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { eventsService } from '../../services/eventsService';
import { venuesService, Venue } from '../../services/venuesService';
import { uploadService } from '../../services/uploadService';

export default function PostNewEvent() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const currentClubName = user?.club || 'Robotics Society';

  const [venues, setVenues] = useState<Venue[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // File Upload State
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [guidelinesPdfFile, setGuidelinesPdfFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await venuesService.getVenues();
        setVenues(data || []);
        if (data && data.length > 0) {
          setEventDetails(prev => ({ ...prev, venue: data[0].name }));
        }
      } catch (err: any) {
        console.error('Failed to load venues', err);
      }
    }
    loadVenues();
  }, []);

  // SECTION I: EVENT DETAILS
  const [eventDetails, setEventDetails] = useState({
    name: '',
    about: '',
    academicYear: 'AY 2026 - 2027',
    venue: 'Main Innovation Arena',
    hosts: 'Bob Smith (Lead Coordinator), Dr. Aris Thorne (Faculty Advisor)',
    date: '2026-10-24',
    timeSlot: '02:00 PM - 08:00 PM',
    session: 'Afternoon Session',
    agendaText: '10:00 AM - Registration & Pit Setup\n11:30 AM - Preliminary Heats\n02:30 PM - Obstacle Finals & Awards Gala'
  });

  // SECTION II: EVENT BUDGET
  const [budgetState, setBudgetState] = useState({
    prizeMoney: 650,
    refreshments: 350,
    decors: 250,
    miscPurchases: 150,
    others: [
      { id: 'oth_1', name: 'Laser Timing Gate Sensors & Cables', amount: 100 }
    ]
  });

  // Calculate Total Budget
  const calculateTotalBudget = () => {
    const base = (Number(budgetState.prizeMoney) || 0) +
      (Number(budgetState.refreshments) || 0) +
      (Number(budgetState.decors) || 0) +
      (Number(budgetState.miscPurchases) || 0);
    const othersTotal = budgetState.others.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    return base + othersTotal;
  };

  const totalBudget = calculateTotalBudget();

  // Handlers for Budget
  const handleBaseBudgetChange = (field: 'prizeMoney' | 'refreshments' | 'decors' | 'miscPurchases', val: string) => {
    const num = parseInt(val, 10);
    setBudgetState(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const handleAddOtherExpense = () => {
    const newId = 'oth_' + Date.now();
    setBudgetState(prev => ({
      ...prev,
      others: [
        ...prev.others,
        { id: newId, name: 'Special Facility / Equipment Line Item', amount: 100 }
      ]
    }));
    showToast('Added new custom expense field under Others.', 'info');
  };

  const handleUpdateOtherExpense = (id: string, field: 'name' | 'amount', value: string) => {
    setBudgetState(prev => ({
      ...prev,
      others: prev.others.map(item => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'amount' ? (parseInt(value, 10) || 0) : value
          };
        }
        return item;
      })
    }));
  };

  const handleDeleteOtherExpense = (id: string) => {
    setBudgetState(prev => ({
      ...prev,
      others: prev.others.filter(item => item.id !== id)
    }));
  };

  // Venue lookup
  const selectedVenueMeta = venues.find(v => v.name === eventDetails.venue) || venues[0] || {
    name: eventDetails.venue,
    building: 'Campus Complex',
    capacity: 300,
    facilities: 'Standard Multimedia AV'
  };

  // Submission Handler
  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDetails.name.trim()) {
      showToast('Please enter an event name!', 'error');
      return;
    }
    if (!eventDetails.about.trim()) {
      showToast('Please enter the event about / description!', 'error');
      return;
    }

    try {
      setSubmitting(true);
      let uploadedPosterUrl: string | null = null;
      let uploadedPdfUrl: string | null = null;

      if (posterFile) {
        showToast('Uploading event promotional poster...', 'info');
        const uploadRes = await uploadService.uploadImage(posterFile);
        uploadedPosterUrl = uploadRes.url;
      }

      if (guidelinesPdfFile) {
        showToast('Uploading event guidelines document...', 'info');
        const docRes = await uploadService.uploadDocument(guidelinesPdfFile);
        uploadedPdfUrl = docRes.url;
      }

      const dateObj = new Date(eventDetails.date);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = !isNaN(dateObj.getMonth()) ? months[dateObj.getMonth()] : 'OCT';
      const day = !isNaN(dateObj.getDate()) ? String(dateObj.getDate()).padStart(2, '0') : '24';

      // Parse agendaText into agenda items
      const parsedAgenda = eventDetails.agendaText.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split('-');
        if (parts.length >= 2) {
          return { time: parts[0].trim(), title: parts.slice(1).join('-').trim() };
        }
        return { time: 'Session', title: line.trim() };
      });

      const hostsList = eventDetails.hosts ? eventDetails.hosts.split(',').map(h => h.trim()) : ['Club Coordinator'];

      const created = await eventsService.createEvent({
        title: eventDetails.name,
        club: currentClubName,
        category: 'competition',
        description: eventDetails.about,
        venue: eventDetails.venue,
        date: eventDetails.date,
        timeSlot: eventDetails.timeSlot,
        month,
        day,
        leadCoordinator: hostsList[0] || 'Club Coordinator',
        facultyAdvisor: hostsList[1] || 'Faculty Advisor',
        agenda: parsedAgenda.length > 0 ? parsedAgenda : [
          { time: '10:00 AM', title: 'Registration & Check-In' },
          { time: '02:00 PM', title: 'Main Event Session & Awards' }
        ],
        budget: `$${totalBudget.toLocaleString()}`,
        budgetBreakdown: {
          prizeMoney: budgetState.prizeMoney,
          refreshments: budgetState.refreshments,
          decors: budgetState.decors,
          miscPurchases: budgetState.miscPurchases,
          customItems: budgetState.others.map(o => ({ id: o.id, name: o.name, amount: o.amount }))
        },
        hasRegForm: false,
        attendees: 0,
        status: 'Upcoming',
        approvalStatus: 'Pending',
        poster_url: uploadedPosterUrl,
        guidelines_pdf_url: uploadedPdfUrl
      });

      showToast(`Event "${created.title}" successfully submitted for administrative clearance!`, 'success');
      navigate('/club/events');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit event proposal to backend', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    showToast('Event proposal draft saved locally.', 'success');
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }} className="pb-16">
      {/* Top Header Row */}
      <div className="page-header-row mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-primary text-[10px] font-extrabold uppercase tracking-wider">Club Portal</span>
            <span className="badge badge-success text-[10px] font-extrabold">Event Authoring Console</span>
          </div>
          <h1 className="page-title text-2xl md:text-3xl font-black text-main tracking-tight mb-1">
            Post New Club Event
          </h1>
          <p className="page-description text-xs text-muted">
            Complete event specifications, venue reservation, financial breakdown, and custom line item requests.
          </p>
        </div>

        {/* Header Actions: Green (Post Event), Grey (Save Draft), Red (Cancel) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm font-bold"
            onClick={() => navigate('/club/events')}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm font-bold shadow-md shadow-emerald-600/20"
            onClick={handlePostEvent}
          >
            <CheckIcon className="w-4 h-4" />
            <span>Post Event</span>
          </button>
        </div>
      </div>

      <form onSubmit={handlePostEvent} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Sectional Cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* =================================================================
              I) EVENT DETAILS CARD
              1. Event Name
              2. Event About
              3. Academic Year
              4. Venue (Dropdown with all available venues)
              5. Hosts (Optional)
              6. Date, Timing
              7. Event Agenda Posting Text Field
              ================================================================= */}
          <div className="card">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-primary flex items-center justify-center font-bold">
                  I
                </div>
                <div>
                  <h3 className="text-base font-black text-main">Event Details</h3>
                  <p className="text-xs text-muted">Core fixture parameters, venue reservation, hosts, and schedule</p>
                </div>
              </div>
              <span className="badge badge-primary text-xs">Section 1</span>
            </div>

            <div className="flex flex-col gap-5">
              {/* 1. Event Name */}
              <div className="form-group">
                <label className="form-label font-bold text-xs text-main">1. Event Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Quadcopter Autonomous Navigation Sprint 2026"
                  value={eventDetails.name}
                  onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
                  required
                />
              </div>

              {/* 2. Event About */}
              <div className="form-group">
                <label className="form-label font-bold text-xs text-main">2. Event About *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Provide comprehensive details about the event, objectives, rules, competition tracks, and audience deliverables..."
                  value={eventDetails.about}
                  onChange={(e) => setEventDetails({ ...eventDetails, about: e.target.value })}
                  required
                />
              </div>

              {/* 3. Academic Year */}
              <div className="form-group">
                <label className="form-label font-bold text-xs text-main">3. Academic Year</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AY 2026 - 2027"
                  value={eventDetails.academicYear}
                  onChange={(e) => setEventDetails({ ...eventDetails, academicYear: e.target.value })}
                  required
                />
              </div>

              {/* 4. Venue (Dropdown showing all available venues) */}
              <div className="form-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="form-label font-bold text-xs text-main">
                    4. Venue (Campus Facility Database) *
                  </label>
                  <span className="badge badge-success text-[10px]">
                    Cap: {selectedVenueMeta.capacity} Seats
                  </span>
                </div>
                <select
                  className="form-select"
                  value={eventDetails.venue}
                  onChange={(e) => setEventDetails({ ...eventDetails, venue: e.target.value })}
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.name}>
                      {v.name} — ({v.building} • Max Cap: {v.capacity} Seats)
                    </option>
                  ))}
                </select>
                <div className="p-3 mt-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 text-[11px] text-muted flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-main">{selectedVenueMeta.name}</strong> ({selectedVenueMeta.building})
                    <p className="mt-0.5">Facilities: {selectedVenueMeta.facilities}</p>
                  </div>
                </div>
              </div>

              {/* 5. Hosts (Optional) */}
              <div className="form-group">
                <label className="form-label font-bold text-xs text-main">
                  5. Hosts (Optional)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bob Smith (Lead Coordinator), Dr. Aris Thorne (Faculty Advisor), Maya Lin (Student Host)"
                  value={eventDetails.hosts}
                  onChange={(e) => setEventDetails({ ...eventDetails, hosts: e.target.value })}
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Comma-separated names of coordinators, advisors, or keynote speakers.
                </span>
              </div>

              {/* 6. Date, Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label font-bold text-xs text-main">6. Proposed Event Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={eventDetails.date}
                    onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-bold text-xs text-main">Timing Slot Window *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 02:00 PM - 08:00 PM"
                    value={eventDetails.timeSlot}
                    onChange={(e) => setEventDetails({ ...eventDetails, timeSlot: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* 7. Event Agenda Posting Text Field */}
              <div className="form-group">
                <label className="form-label font-bold text-xs text-main">
                  7. Event Agenda Posting *
                </label>
                <textarea
                  className="form-input font-mono text-xs"
                  rows={4}
                  placeholder="10:00 AM - Delegate Registration & Kit Collection&#10;11:30 AM - Keynote & Technical Briefing&#10;02:00 PM - Track Slalom Heats&#10;05:30 PM - Championship Final & Awards"
                  value={eventDetails.agendaText}
                  onChange={(e) => setEventDetails({ ...eventDetails, agendaText: e.target.value })}
                  required
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Enter each agenda milestone on a new line in format: <code className="text-primary font-bold">HH:MM AM - Stage Title</code>
                </span>
              </div>

              {/* 8. Promotional Banner / Poster Image Upload */}
              <div className="form-group">
                <label className="form-label font-bold text-xs text-main">
                  8. Event Poster / Promotional Banner (Stored in Backend Uploads)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input text-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPosterFile(file);
                        setPosterPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {posterPreview && (
                    <img 
                      src={posterPreview} 
                      alt="Poster Preview" 
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-neutral-700" 
                    />
                  )}
                </div>
                <span className="text-[11px] text-muted mt-1 block">
                  Accepts PNG, JPG, WebP. File will be stored on local server storage.
                </span>
              </div>

              {/* 9. Rulebook / Guidelines PDF Document Upload */}
              <div className="form-group">
                <label className="form-label font-bold text-xs text-main">
                  9. Official Rulebook / Guidelines (PDF Document)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="form-input text-xs"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setGuidelinesPdfFile(file);
                    }
                  }}
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Upload competition rules or problem statement booklet (PDF up to 15MB).
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              II) EVENT BUDGET CARD
              1. Total Budget (Live calculated)
              2. Budget Breakdown:
                 - Prize amount
                 - Refreshments
                 - Decors
                 - Misc purchase
                 - Others button (adds deletable custom name & amount fields)
              ================================================================= */}
          <div className="card">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-secondary flex items-center justify-center font-bold">
                  II
                </div>
                <div>
                  <h3 className="text-base font-black text-main">Event Budget & Breakdown</h3>
                  <p className="text-xs text-muted">Itemized financial allocation across standard budget heads and custom expenses</p>
                </div>
              </div>

              {/* 1. Total Budget Header Display */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Budget</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${totalBudget.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* 4 Standard Breakdown Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-group">
                  <label className="form-label font-bold text-xs text-main">Prize Amount ($)</label>
                  <input
                    type="number"
                    min={0}
                    className="form-input font-bold text-main"
                    value={budgetState.prizeMoney}
                    onChange={(e) => handleBaseBudgetChange('prizeMoney', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-bold text-xs text-main">Refreshments ($)</label>
                  <input
                    type="number"
                    min={0}
                    className="form-input font-bold text-main"
                    value={budgetState.refreshments}
                    onChange={(e) => handleBaseBudgetChange('refreshments', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-bold text-xs text-main">Decors & Staging ($)</label>
                  <input
                    type="number"
                    min={0}
                    className="form-input font-bold text-main"
                    value={budgetState.decors}
                    onChange={(e) => handleBaseBudgetChange('decors', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-bold text-xs text-main">Misc Purchase ($)</label>
                  <input
                    type="number"
                    min={0}
                    className="form-input font-bold text-main"
                    value={budgetState.miscPurchases}
                    onChange={(e) => handleBaseBudgetChange('miscPurchases', e.target.value)}
                  />
                </div>
              </div>

              {/* Custom 'Others' Section with Add Button */}
              <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-xs font-extrabold text-main block">
                      Others / Custom Line Items
                    </span>
                    <span className="text-[11px] text-muted">
                      Add itemized expenses for specialized hardware, equipment rental, or honorariums
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-xs text-primary font-bold"
                    onClick={handleAddOtherExpense}
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Others (+ Add Expense)</span>
                  </button>
                </div>

                {/* List of custom deletable others items */}
                <div className="flex flex-col gap-2.5">
                  {budgetState.others.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 flex items-center gap-3"
                    >
                      <input
                        type="text"
                        className="form-input text-xs py-1.5 flex-1"
                        placeholder="Custom Expense Name (e.g. High-Speed Camera, AV Cables)"
                        value={item.name}
                        onChange={(e) => handleUpdateOtherExpense(item.id, 'name', e.target.value)}
                      />
                      <div className="w-36 relative">
                        <span className="absolute left-3 top-2 text-xs text-muted font-bold">$</span>
                        <input
                          type="number"
                          min={0}
                          className="form-input text-xs py-1.5 pl-6 font-bold"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => handleUpdateOtherExpense(item.id, 'amount', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        onClick={() => handleDeleteOtherExpense(item.id)}
                        title="Delete expense field"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {budgetState.others.length === 0 && (
                    <div className="p-3.5 text-center text-xs text-muted italic border border-dashed border-gray-200 dark:border-neutral-800 rounded-xl">
                      Click the "Others (+ Add Expense)" button above to add custom line items.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Sticky Summary & Action Controls */}
        <div className="flex flex-col gap-6">
          <div className="card sticky top-24">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100 dark:border-neutral-800">
              <h3 className="text-base font-black text-main">Event Proposal Preview</h3>
              <span className="badge badge-warning text-[10px]">Awaiting Publish</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 mb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="badge badge-success text-[10px] font-black">${totalBudget.toLocaleString()}</span>
                <span className="badge badge-primary text-[10px] font-bold">{eventDetails.academicYear}</span>
              </div>
              <h4 className="font-black text-sm text-main mb-2 leading-snug">
                {eventDetails.name || 'Untitled Club Event'}
              </h4>
              <p className="text-xs text-muted flex items-center gap-1.5 mb-1">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                {eventDetails.date} • {eventDetails.timeSlot}
              </p>
              <p className="text-xs text-muted flex items-center gap-1.5">
                <MapPinIcon className="w-3.5 h-3.5 text-secondary" />
                {eventDetails.venue}
              </p>
            </div>

            {/* Itemized Budget Quick Peek */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 text-xs mb-4">
              <span className="font-extrabold text-main block mb-2">Budget Allocations:</span>
              <div className="flex justify-between text-muted py-0.5">
                <span>Prize Money:</span>
                <strong className="text-main">${budgetState.prizeMoney}</strong>
              </div>
              <div className="flex justify-between text-muted py-0.5">
                <span>Refreshments:</span>
                <strong className="text-main">${budgetState.refreshments}</strong>
              </div>
              <div className="flex justify-between text-muted py-0.5">
                <span>Decors:</span>
                <strong className="text-main">${budgetState.decors}</strong>
              </div>
              <div className="flex justify-between text-muted py-0.5">
                <span>Misc:</span>
                <strong className="text-main">${budgetState.miscPurchases}</strong>
              </div>
              {budgetState.others.map((o) => (
                <div key={o.id} className="flex justify-between text-muted py-0.5">
                  <span className="truncate max-w-[130px]">{o.name}:</span>
                  <strong className="text-main">${o.amount}</strong>
                </div>
              ))}
              <div className="flex justify-between font-black text-emerald-600 dark:text-emerald-400 pt-2 mt-1 border-t border-gray-200 dark:border-neutral-700">
                <span>Total Budget:</span>
                <span>${totalBudget.toLocaleString()}</span>
              </div>
            </div>

            {/* Registration Form Note */}
            <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 mb-5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-950 dark:text-purple-200 mb-1">
                <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                <span>Custom Registration Forms:</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Design custom questionnaires, team rules, and accreditation criteria in the dedicated <strong>Registration Forms</strong> workspace after publishing.
              </p>
            </div>

            {/* Action Buttons: Green (Post Event), Grey (Save Draft), Red (Cancel) */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="btn btn-secondary w-full justify-center text-sm py-2.5 shadow-md shadow-emerald-600/20 font-bold"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Post Event Proposal</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline flex-1 justify-center text-xs"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  className="btn btn-danger flex-1 justify-center text-xs font-bold"
                  onClick={() => navigate('/club/events')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
