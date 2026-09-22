import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon, 
  EditIcon, 
  EyeIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  ShieldIcon 
} from '../../components/common/Icons';
import { useToast } from '../../components/common/Toast';
import { getAllClubEvents, getEventById, updateEventRegForm } from '../../data/eventsData';

export interface FormQuestion {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'file';
  options?: string[];
  required: boolean;
}

export interface RegFormConfig {
  formTitle: string;
  instructions: string;
  collectTeamInfo: boolean;
  collectDietary: boolean;
  collectTshirt: boolean;
  customQuestions: FormQuestion[];
}

export default function ClubRegistrationForms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'custom' | 'standard'>('all');

  // Form Builder State for currently selected event
  const [formConfig, setFormConfig] = useState<RegFormConfig>({
    formTitle: '',
    instructions: '',
    collectTeamInfo: true,
    collectDietary: true,
    collectTshirt: false,
    customQuestions: []
  });
  const [hasRegForm, setHasRegForm] = useState<boolean>(true);
  const [previewTestSubmitted, setPreviewTestSubmitted] = useState<boolean>(false);

  // Load all events
  const loadEvents = () => {
    const list = getAllClubEvents();
    setEvents(list);
    return list;
  };

  useEffect(() => {
    const list = loadEvents();
    const paramId = searchParams.get('eventId');
    if (paramId) {
      const num = Number(paramId);
      const found = list.find(e => e.id === num);
      if (found) {
        selectEvent(found);
      }
    }
  }, [searchParams]);

  const selectEvent = (evt: any) => {
    setSelectedEventId(evt.id);
    setSearchParams({ eventId: String(evt.id) });
    setHasRegForm(evt.hasRegForm !== false);
    
    if (evt.regFormConfig) {
      setFormConfig({
        formTitle: evt.regFormConfig.formTitle || `${evt.title} Registration Form`,
        instructions: evt.regFormConfig.instructions || 'Please complete all required fields accurately for event accreditation.',
        collectTeamInfo: evt.regFormConfig.collectTeamInfo !== undefined ? evt.regFormConfig.collectTeamInfo : true,
        collectDietary: evt.regFormConfig.collectDietary !== undefined ? evt.regFormConfig.collectDietary : true,
        collectTshirt: evt.regFormConfig.collectTshirt !== undefined ? evt.regFormConfig.collectTshirt : false,
        customQuestions: evt.regFormConfig.customQuestions ? JSON.parse(JSON.stringify(evt.regFormConfig.customQuestions)) : []
      });
    } else {
      setFormConfig({
        formTitle: `${evt.title} Registration Form`,
        instructions: 'Please complete all required fields accurately for event accreditation.',
        collectTeamInfo: true,
        collectDietary: true,
        collectTshirt: false,
        customQuestions: [
          {
            id: 'q_' + Date.now(),
            label: 'Competition Track / Specialization',
            type: 'select',
            options: ['Main Sprint Track', 'Open Category Track', 'Junior League'],
            required: true
          },
          {
            id: 'q_' + (Date.now() + 1),
            label: 'GitHub / Project Portfolio Link',
            type: 'text',
            required: false
          }
        ]
      });
    }
    setPreviewTestSubmitted(false);
  };

  const handleBackToList = () => {
    setSelectedEventId(null);
    setSearchParams({});
    loadEvents();
  };

  // Form Builder handlers
  const handleAddQuestion = () => {
    const newQ: FormQuestion = {
      id: 'q_' + Date.now(),
      label: 'New Question Prompt',
      type: 'text',
      required: false
    };
    setFormConfig(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, newQ]
    }));
    showToast('Added new custom questionnaire prompt.', 'info');
  };

  const handleRemoveQuestion = (id: string) => {
    setFormConfig(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.filter(q => q.id !== id)
    }));
    showToast('Question removed from form.', 'info');
  };

  const handleUpdateQuestion = (id: string, field: keyof FormQuestion, value: any) => {
    setFormConfig(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.map(q => {
        if (q.id === id) {
          return { ...q, [field]: value };
        }
        return q;
      })
    }));
  };

  const handleSaveForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedEventId) return;

    if (!formConfig.formTitle.trim()) {
      showToast('Please enter a valid form title', 'error');
      return;
    }

    updateEventRegForm(selectedEventId, formConfig, true);
    setHasRegForm(true);
    loadEvents();
    showToast(`Registration form for "${selectedEvent?.title}" saved & deployed!`, 'success');
  };

  const handleResetToDefault = () => {
    if (!selectedEvent) return;
    const defaultConfig: RegFormConfig = {
      formTitle: `${selectedEvent.title} Registration Form`,
      instructions: 'Please complete all required fields accurately for event accreditation.',
      collectTeamInfo: true,
      collectDietary: true,
      collectTshirt: false,
      customQuestions: [
        {
          id: 'q_default_1',
          label: 'Competition Track / Specialization',
          type: 'select',
          options: ['Main Sprint Track', 'Open Category Track'],
          required: true
        }
      ]
    };
    setFormConfig(defaultConfig);
    showToast('Reset form configuration to default template.', 'info');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterMode === 'custom') return evt.hasRegForm && evt.regFormConfig?.customQuestions?.length > 0;
    if (filterMode === 'standard') return !evt.hasRegForm || !evt.regFormConfig?.customQuestions?.length;
    return true;
  });

  const totalCustomForms = events.filter(e => e.hasRegForm && e.regFormConfig?.customQuestions?.length > 0).length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="pb-16 flex flex-col gap-6">
      
      {/* 1. Header Navigation Row */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-primary text-[10px] font-extrabold uppercase tracking-wider">Club Portal</span>
            <span className="badge badge-purple text-[10px] font-extrabold">Form Designer Hub</span>
          </div>
          <h1 className="page-title text-2xl md:text-3xl font-black text-main tracking-tight mb-1">
            Event Registration Form Builder
          </h1>
          <p className="page-description text-xs text-muted">
            Design tailored registration questionnaires, team criteria, and custom participant attributes for club events.
          </p>
        </div>

        {selectedEventId && (
          <div className="flex items-center gap-3">
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleBackToList}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>All Events List</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm font-bold shadow-md shadow-emerald-600/20"
              onClick={() => handleSaveForm()}
            >
              <CheckIcon className="w-4 h-4" />
              <span>Deploy Form Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. MODE A: Browse & Select Event List */}
      {!selectedEventId ? (
        <div className="flex flex-col gap-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Total Club Fixtures</span>
                <span className="text-xl font-black text-main">{events.length} Events</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-primary flex items-center justify-center font-bold">
                <CalendarIcon className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Custom Forms Deployed</span>
                <span className="text-xl font-black text-purple-600 dark:text-purple-400">{totalCustomForms} Active</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                <DocumentTextIcon className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Standard Passes</span>
                <span className="text-xl font-black text-muted">{events.length - totalCustomForms} Standard</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-muted flex items-center justify-center font-bold">
                <UsersIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Header */}
          <div className="card p-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="search-input-wrapper flex-1 min-w-[260px]">
                <input 
                  type="text" 
                  placeholder="Search club events by title or venue to configure registration form..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-pills-bar">
                <button 
                  className={`filter-pill ${filterMode === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterMode('all')}
                >
                  All Fixtures ({events.length})
                </button>
                <button 
                  className={`filter-pill ${filterMode === 'custom' ? 'active' : ''}`}
                  onClick={() => setFilterMode('custom')}
                >
                  Custom Forms ({totalCustomForms})
                </button>
                <button 
                  className={`filter-pill ${filterMode === 'standard' ? 'active' : ''}`}
                  onClick={() => setFilterMode('standard')}
                >
                  Standard Entry ({events.length - totalCustomForms})
                </button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => {
              const hasCustom = evt.hasRegForm && (evt.regFormConfig?.customQuestions?.length > 0 || evt.regFormConfig?.collectTeamInfo);
              const customCount = evt.regFormConfig?.customQuestions?.length || 0;

              return (
                <div 
                  key={evt.id}
                  onClick={() => selectEvent(evt)}
                  className="fixture-glass-card cursor-pointer flex flex-col justify-between"
                  style={{ minHeight: '230px' }}
                >
                  <div>
                    {/* Top Row: Date & Status */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="event-date-tile" style={{ minWidth: '46px', padding: '4px 8px' }}>
                        <span className="event-date-month text-[10px]">{evt.month || 'OCT'}</span>
                        <span className="event-date-day text-base">{evt.day || '20'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className={`badge text-[10px] font-extrabold ${
                          evt.status === 'Ongoing' ? 'badge-success' :
                          evt.status === 'Approved' ? 'badge-blue' : 'badge-warning'
                        }`}>
                          {evt.status || 'Approved'}
                        </span>
                        
                        <span className={`badge text-[10px] font-black ${
                          hasCustom ? 'badge-purple' : 'badge-neutral'
                        }`}>
                          {hasCustom ? `Custom Form (${customCount} Qs)` : 'Standard Pass'}
                        </span>
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-base font-black text-main leading-tight mb-2 hover:text-primary transition-colors">
                      {evt.title}
                    </h3>

                    {/* Venue & Time */}
                    <div className="flex flex-col gap-1 text-xs text-muted mb-4">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPinIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{evt.timeSlot || '10:00 AM - 04:00 PM'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-muted">
                      {evt.registration?.totalRegistered || 120} Delegates
                    </span>
                    <button 
                      type="button"
                      className="btn btn-secondary btn-xs font-bold shadow-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectEvent(evt);
                      }}
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                      <span>{hasCustom ? 'Edit Form' : 'Create Form'} →</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="card py-16 text-center">
              <DocumentTextIcon className="w-10 h-10 text-muted mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-black text-main mb-1">No Matching Events Found</h3>
              <p className="text-xs text-muted">Try adjusting your search keywords or filter pills.</p>
            </div>
          )}
        </div>
      ) : (
        /* 3. MODE B: Active Form Builder Workspace for Selected Event */
        selectedEvent && (
          <div className="flex flex-col gap-6">
            {/* Selected Event Context Banner */}
            <div className="card p-5 bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-emerald-50/30 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-emerald-950/20 border border-blue-100 dark:border-blue-900/40">
              <div className="flex justify-between items-start md:items-center flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="event-date-tile mt-0.5">
                    <span className="event-date-month">{selectedEvent.month || 'OCT'}</span>
                    <span className="event-date-day">{selectedEvent.day || '20'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="badge badge-primary text-[10px] font-extrabold">{selectedEvent.academicYear || 'AY 2026 - 2027'}</span>
                      <span className="badge badge-purple text-[10px] font-extrabold">Form Editing Mode</span>
                    </div>
                    <h2 className="text-xl font-black text-main tracking-tight">{selectedEvent.title}</h2>
                    <p className="text-xs text-muted flex items-center gap-2 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-secondary">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        {selectedEvent.venue}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-main">
                        <ClockIcon className="w-3.5 h-3.5 text-primary" />
                        {selectedEvent.timeSlot || '10:00 AM - 04:00 PM'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Event Switching Dropdown */}
                <div className="flex items-center gap-2">
                  <select 
                    className="form-select text-xs py-1.5 font-bold"
                    value={selectedEventId}
                    onChange={(e) => {
                      const found = events.find(ev => ev.id === Number(e.target.value));
                      if (found) selectEvent(found);
                    }}
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.month} {ev.day})
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-outline btn-xs"
                    onClick={() => navigate(`/club/events/${selectedEvent.id}`)}
                    title="View complete event fixture details"
                  >
                    Event Details →
                  </button>
                </div>
              </div>
            </div>

            {/* Builder Layout: Left Configurator & Right Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Builder Controls (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* 1. Form Header & Guidelines */}
                <div className="card p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                    <h3 className="text-base font-black text-main flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4 text-primary" />
                      <span>1. Form Title & Delegate Guidance</span>
                    </h3>
                    <span className="text-[10px] font-bold uppercase text-muted">Core Fields</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label font-bold text-xs text-main">Form Title *</label>
                    <input 
                      type="text" 
                      className="form-input text-sm font-bold" 
                      placeholder="e.g. Autonomous Maze Rover Registration Form"
                      value={formConfig.formTitle}
                      onChange={(e) => setFormConfig({ ...formConfig, formTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label font-bold text-xs text-main">Instructions for Students</label>
                    <textarea 
                      className="form-input text-xs" 
                      rows={3}
                      placeholder="Provide registration criteria, team eligibility rules, deadline notices, or equipment prerequisites..."
                      value={formConfig.instructions}
                      onChange={(e) => setFormConfig({ ...formConfig, instructions: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. Standard Participant Attributes */}
                <div className="card p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                    <h3 className="text-base font-black text-main flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-secondary" />
                      <span>2. Standard Delegate Attributes</span>
                    </h3>
                    <span className="badge badge-success text-[10px]">Toggles</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 cursor-pointer hover:border-gray-200 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-main">Collect Team Information (Multi-Member Mode)</span>
                        <span className="text-[11px] text-muted">Prompts delegates for team name and teammate roll numbers</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                        checked={formConfig.collectTeamInfo}
                        onChange={(e) => setFormConfig({ ...formConfig, collectTeamInfo: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 cursor-pointer hover:border-gray-200 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-main">Dietary Requirements (Catering & Food Stalls)</span>
                        <span className="text-[11px] text-muted">Collects vegetarian, non-vegetarian, or vegan dietary preferences</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                        checked={formConfig.collectDietary}
                        onChange={(e) => setFormConfig({ ...formConfig, collectDietary: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 cursor-pointer hover:border-gray-200 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-main">T-Shirt / Kit Sizing (Event Merchandise)</span>
                        <span className="text-[11px] text-muted">Collects delegate shirt sizes (S, M, L, XL, XXL)</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                        checked={formConfig.collectTshirt}
                        onChange={(e) => setFormConfig({ ...formConfig, collectTshirt: e.target.checked })}
                      />
                    </label>
                  </div>
                </div>

                {/* 3. Custom Questionnaire Prompts */}
                <div className="card p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                      <h3 className="text-base font-black text-main flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-purple-600" />
                        <span>3. Custom Questionnaire Prompts</span>
                      </h3>
                      <p className="text-xs text-muted mt-0.5">
                        Add tailored fields such as competition track, repo links, prior hardware experience, or project abstracts.
                      </p>
                    </div>

                    <button 
                      type="button"
                      className="btn btn-outline btn-xs text-primary font-bold"
                      onClick={handleAddQuestion}
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {formConfig.customQuestions.map((q, idx) => (
                      <div 
                        key={q.id || idx} 
                        className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 flex flex-col gap-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input 
                            type="text" 
                            className="form-input text-xs py-1.5 flex-1 font-bold text-main"
                            placeholder="Question Prompt Label (e.g. Track Selection, GitHub Repo URL)..."
                            value={q.label}
                            onChange={(e) => handleUpdateQuestion(q.id, 'label', e.target.value)}
                          />
                          <select 
                            className="form-select text-xs py-1.5 w-36 font-semibold"
                            value={q.type}
                            onChange={(e) => handleUpdateQuestion(q.id, 'type', e.target.value as any)}
                          >
                            <option value="text">Text Input</option>
                            <option value="select">Dropdown Select</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="file">File / Project Link</option>
                          </select>
                          <button 
                            type="button"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            onClick={() => handleRemoveQuestion(q.id)}
                            title="Delete question prompt"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs flex-wrap">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-muted">
                            <input 
                              type="checkbox" 
                              checked={q.required}
                              onChange={(e) => handleUpdateQuestion(q.id, 'required', e.target.checked)}
                            />
                            <span>Required Field *</span>
                          </label>

                          {q.type === 'select' && (
                            <div className="flex-1 min-w-[200px]">
                              <input 
                                type="text" 
                                className="form-input text-xs py-1"
                                placeholder="Dropdown options (comma-separated: Option A, Option B, Option C)"
                                value={(q.options || []).join(', ')}
                                onChange={(e) => handleUpdateQuestion(q.id, 'options', e.target.value.split(',').map(s => s.trim()))}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {formConfig.customQuestions.length === 0 && (
                      <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl text-xs text-muted">
                        <DocumentTextIcon className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
                        <p className="font-bold text-main mb-1">No custom questions added yet</p>
                        <p className="mb-3">Click "+ Add Question" above to configure custom delegate prompts.</p>
                        <button 
                          type="button"
                          className="btn btn-outline btn-xs text-primary mx-auto"
                          onClick={handleAddQuestion}
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>Add First Question</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="card p-4 flex justify-between items-center flex-wrap gap-3">
                  <button 
                    type="button" 
                    className="btn btn-outline btn-xs"
                    onClick={handleResetToDefault}
                  >
                    Reset to Default Template
                  </button>

                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={handleBackToList}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm font-bold shadow-md shadow-emerald-600/20"
                      onClick={() => handleSaveForm()}
                    >
                      <CheckIcon className="w-4 h-4" />
                      <span>Save & Deploy Form</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Live Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="card sticky top-24 p-6">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <EyeIcon className="w-4 h-4 text-purple-600" />
                      <h3 className="text-base font-black text-main">Live Student Form Preview</h3>
                    </div>
                    <span className="badge badge-purple text-[10px]">Realtime Preview</span>
                  </div>

                  {/* Student View Mock Form */}
                  <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 flex flex-col gap-4 text-xs">
                    <div>
                      <span className="badge badge-primary text-[10px] mb-1.5 font-extrabold uppercase">University Entry Form</span>
                      <h4 className="text-base font-black text-main leading-tight">
                        {formConfig.formTitle || `${selectedEvent.title} Registration Form`}
                      </h4>
                      <p className="text-[11px] text-muted mt-1 leading-relaxed">
                        {formConfig.instructions || 'Please complete all required fields accurately.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-3 border-t border-gray-200 dark:border-neutral-800">
                      {/* Standard Student Read-Only Fields */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="form-label font-bold text-[10px] text-muted">Full Name *</label>
                          <input type="text" className="form-input text-xs py-1.5 bg-white dark:bg-neutral-800" placeholder="Alex Vance" disabled />
                        </div>
                        <div>
                          <label className="form-label font-bold text-[10px] text-muted">Roll / Student ID *</label>
                          <input type="text" className="form-input text-xs py-1.5 bg-white dark:bg-neutral-800 font-mono" placeholder="2024CS01" disabled />
                        </div>
                      </div>

                      {/* Team Mode Field */}
                      {formConfig.collectTeamInfo && (
                        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                          <label className="form-label font-bold text-[10px] text-blue-900 dark:text-blue-200">
                            Team Name & Teammates (Roll IDs) *
                          </label>
                          <input type="text" className="form-input text-xs py-1.5 bg-white dark:bg-neutral-800" placeholder="e.g. RoboHawks (2024CS01, 2024EC14)" />
                        </div>
                      )}

                      {/* Dietary Preferences */}
                      {formConfig.collectDietary && (
                        <div>
                          <label className="form-label font-bold text-[10px] text-muted">Dietary Preference</label>
                          <select className="form-select text-xs py-1.5 bg-white dark:bg-neutral-800">
                            <option>Standard / Non-Vegetarian</option>
                            <option>Vegetarian</option>
                            <option>Vegan</option>
                          </select>
                        </div>
                      )}

                      {/* T-Shirt Size */}
                      {formConfig.collectTshirt && (
                        <div>
                          <label className="form-label font-bold text-[10px] text-muted">Official Event T-Shirt Size</label>
                          <select className="form-select text-xs py-1.5 bg-white dark:bg-neutral-800">
                            <option>Medium (M)</option>
                            <option>Small (S)</option>
                            <option>Large (L)</option>
                            <option>Extra Large (XL)</option>
                          </select>
                        </div>
                      )}

                      {/* Dynamic Custom Questions */}
                      {formConfig.customQuestions.map((q, idx) => (
                        <div key={q.id || idx}>
                          <label className="form-label font-bold text-[10px] text-main">
                            {q.label} {q.required && <span className="text-rose-500">*</span>}
                          </label>

                          {q.type === 'select' ? (
                            <select className="form-select text-xs py-1.5 bg-white dark:bg-neutral-800">
                              {(q.options && q.options.length > 0 ? q.options : ['Option 1', 'Option 2']).map((opt, oIdx) => (
                                <option key={oIdx}>{opt}</option>
                              ))}
                            </select>
                          ) : q.type === 'checkbox' ? (
                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                              <input type="checkbox" className="rounded" />
                              <span className="text-[11px] text-muted">I agree and confirm requirement</span>
                            </label>
                          ) : (
                            <input 
                              type="text" 
                              className="form-input text-xs py-1.5 bg-white dark:bg-neutral-800" 
                              placeholder={q.type === 'file' ? 'https://github.com/org/project-repo' : 'Enter your response...'} 
                            />
                          )}
                        </div>
                      ))}

                      {/* Mock Submit Action */}
                      <div className="pt-3 mt-1 border-t border-gray-200 dark:border-neutral-800">
                        {previewTestSubmitted ? (
                          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                            ✓ Preview Test: Form validation verified successfully!
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            className="btn btn-secondary w-full justify-center text-xs py-2 font-bold shadow-xs"
                            onClick={() => {
                              setPreviewTestSubmitted(true);
                              setTimeout(() => setPreviewTestSubmitted(false), 3000);
                            }}
                          >
                            <span>Test Student Submit →</span>
                          </button>
                        )}
                        <span className="text-[10px] text-muted text-center block mt-1.5">
                          Changes update in realtime as you edit the builder
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )
      )}

    </div>
  );
}
