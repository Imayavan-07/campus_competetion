import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ArrowPathIcon,
  XMarkIcon,
  ClubsIcon,
  UsersIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckIcon,
  BuildingIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

const DEFAULT_CLUBS = [
  { id: 1, name: 'Campus Photography Club', dept: 'Arts & Culture', members: 45, events: 3, president: 'Evan Wright', coordinator: 'Alice Johnson', email: 'photography@university.edu' },
  { id: 2, name: 'Robotics Society', dept: 'Engineering', members: 120, events: 1, president: 'Jane Doe', coordinator: 'Bob Smith', email: 'robotics@university.edu' },
  { id: 3, name: 'Debate & Oratory Team', dept: 'Arts & Culture', members: 30, events: 5, president: 'Michael Scott', coordinator: 'Alice Johnson', email: 'debate@university.edu' },
  { id: 4, name: 'Quantum & Chess Guild', dept: 'Science', members: 25, events: 2, president: 'Beth Harmon', coordinator: 'Fiona Gallagher', email: 'chess@university.edu' },
  { id: 5, name: 'Collegiate Esports Society', dept: 'Sports', members: 88, events: 4, president: 'Tenzing Norgay', coordinator: 'George Miller', email: 'esports@university.edu' },
  { id: 6, name: 'Renewable Energies Club', dept: 'Engineering', members: 54, events: 2, president: 'Claire Bennett', coordinator: 'Diana Prince', email: 'renewables@university.edu' },
];

export default function Clubs() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [clubs, setClubs] = useState(() => {
    try {
      const saved = localStorage.getItem('unisync_clubs');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } else {
        localStorage.setItem('unisync_clubs', JSON.stringify(DEFAULT_CLUBS));
        return DEFAULT_CLUBS;
      }
    } catch (e) {
      console.warn('Could not read saved clubs', e);
    }
    return DEFAULT_CLUBS;
  });

  // Search & Filter state (status dropped)
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [customMinMembers, setCustomMinMembers] = useState('');
  const [customMinEvents, setCustomMinEvents] = useState('');

  // Custom Filter Modal Staging State
  const [isCustomFilterOpen, setIsCustomFilterOpen] = useState(false);
  const [modalDept, setModalDept] = useState('All');
  const [modalMinMembers, setModalMinMembers] = useState('');
  const [modalMinEvents, setModalMinEvents] = useState('');

  // Active filter count
  const activeFilterCount =
    (deptFilter !== 'All' ? 1 : 0) +
    (search.trim() !== '' ? 1 : 0) +
    (customMinMembers !== '' ? 1 : 0) +
    (customMinEvents !== '' ? 1 : 0) +
    (sortBy !== 'name-asc' ? 1 : 0);

  const handleOpenCustomFilter = () => {
    setModalDept(deptFilter);
    setModalMinMembers(customMinMembers);
    setModalMinEvents(customMinEvents);
    setIsCustomFilterOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('All');
    setModalDept('All');
    setCustomMinMembers('');
    setCustomMinEvents('');
    setModalMinMembers('');
    setModalMinEvents('');
    setSortBy('name-asc');
    showToast('Filters cleared', 'info');
  };

  const handleApplyCustomFilter = (e) => {
    if (e) e.preventDefault();
    setDeptFilter(modalDept);
    setCustomMinMembers(modalMinMembers);
    setCustomMinEvents(modalMinEvents);
    setIsCustomFilterOpen(false);
    showToast('Custom filters applied', 'success');
  };

  const handleQuickPreset = (preset) => {
    if (preset === 'large') {
      setModalMinMembers('50');
      setCustomMinMembers('50');
      setModalMinEvents('');
      setCustomMinEvents('');
      setModalDept('All');
      setDeptFilter('All');
    } else if (preset === 'active_events') {
      setModalMinEvents('3');
      setCustomMinEvents('3');
      setModalMinMembers('');
      setCustomMinMembers('');
      setModalDept('All');
      setDeptFilter('All');
    } else if (preset === 'engineering') {
      setModalDept('Engineering');
      setDeptFilter('Engineering');
      setModalMinMembers('');
      setCustomMinMembers('');
      setModalMinEvents('');
      setCustomMinEvents('');
    } else if (preset === 'arts') {
      setModalDept('Arts & Culture');
      setDeptFilter('Arts & Culture');
      setModalMinMembers('');
      setCustomMinMembers('');
      setModalMinEvents('');
      setCustomMinEvents('');
    }
    setIsCustomFilterOpen(false);
    showToast('Applied filter preset', 'info');
  };

  // Filtered and Sorted Clubs
  const filteredClubs = clubs.filter(club => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      club.name.toLowerCase().includes(q) ||
      (club.dept && club.dept.toLowerCase().includes(q)) ||
      (club.president && club.president.toLowerCase().includes(q)) ||
      (club.coordinator && club.coordinator.toLowerCase().includes(q));

    const matchDept = deptFilter === 'All' || club.dept === deptFilter;
    const matchMembers = customMinMembers === '' || club.members >= Number(customMinMembers);
    const matchEvents = customMinEvents === '' || (club.events || 0) >= Number(customMinEvents);

    return matchSearch && matchDept && matchMembers && matchEvents;
  }).sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'members-desc') return b.members - a.members;
    if (sortBy === 'members-asc') return a.members - b.members;
    if (sortBy === 'events-desc') return (b.events || 0) - (a.events || 0);
    return 0;
  });

  return (
    <div>
      {/* Top Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Clubs & Societies</h1>
          <p className="page-description">Oversee campus student organizations, allocate leadership, and monitor co-curricular programs.</p>
        </div>
        <button
          onClick={() => navigate('/admin/clubs/new')}
          className="btn btn-secondary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4 text-black" />
          <span>Add New Club</span>
        </button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="card mb-6" style={{ padding: '18px 20px' }}>
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by club name, department, president, or coordinator..."
              className="form-input pl-10 pr-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Department Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">Dept:</span>
              <select
                className="form-select py-1.5 px-3 text-xs w-auto min-w-[140px]"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Science">Science</option>
                <option value="Sports">Sports</option>
                <option value="Management">Management</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">Sort:</span>
              <select
                className="form-select py-1.5 px-3 text-xs w-auto min-w-[130px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="members-desc">Most Members</option>
                <option value="members-asc">Fewest Members</option>
                <option value="events-desc">Most Events</option>
              </select>
            </div>

            {/* Custom Filter Trigger */}
            <button
              onClick={handleOpenCustomFilter}
              className={`btn btn-sm flex items-center gap-1.5 ${
                activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'
              }`}
            >
              <FilterIcon className="w-3.5 h-3.5" />
              <span>Custom Filter</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-white text-blue-700 text-[10px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Reset Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="btn btn-outline btn-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
                title="Reset all filters"
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted font-semibold mr-1">Active filters:</span>

            {search && (
              <span className="filter-chip filter-chip-blue">
                <span>Search: "{search}"</span>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="filter-chip-remove"
                  title="Remove search filter"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {deptFilter !== 'All' && (
              <span className="filter-chip filter-chip-blue">
                <span>Dept: {deptFilter}</span>
                <button
                  type="button"
                  onClick={() => {
                    setDeptFilter('All');
                    setModalDept('All');
                  }}
                  className="filter-chip-remove"
                  title="Remove department filter"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {customMinMembers !== '' && (
              <span className="filter-chip filter-chip-amber">
                <span>Min Members: ≥{customMinMembers}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomMinMembers('');
                    setModalMinMembers('');
                  }}
                  className="filter-chip-remove"
                  title="Remove min members filter"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {customMinEvents !== '' && (
              <span className="filter-chip filter-chip-purple">
                <span>Min Events: ≥{customMinEvents}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomMinEvents('');
                    setModalMinEvents('');
                  }}
                  className="filter-chip-remove"
                  title="Remove min events filter"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="filter-clear-btn ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted text-xs font-semibold">
          Showing <strong className="text-main">{filteredClubs.length}</strong> of {clubs.length} registered organizations
        </span>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredClubs.map(club => (
          <div
            key={club.id}
            className="card hover:shadow-lg transition-all flex flex-col justify-between"
            style={{ padding: '26px' }}
          >
            <div>
              {/* Card Header: Logo, Name, Leads, and Department Badge (Status dropped) */}
              <div className="flex justify-between items-start mb-4 gap-3">
                <div className="flex items-start gap-3.5">
                  {club.logo ? (
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-neutral-700 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div
                      className="user-avatar-box shrink-0"
                      style={{
                        width: '48px',
                        height: '48px',
                        fontSize: '1.15rem',
                        borderRadius: '16px',
                        fontWeight: 800
                      }}
                    >
                      {club.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                      {club.name}
                    </h3>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="text-muted text-xs">
                        President: <strong className="text-main font-semibold">{club.president}</strong>
                      </span>
                      {club.coordinator && (
                        <span className="text-muted text-[11px]">
                          Coordinator: <span className="text-main font-medium">{club.coordinator}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clean Department Badge on Top Right */}
                <span className="badge badge-blue text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {club.dept}
                </span>
              </div>

              {club.description && (
                <p className="text-xs text-muted mb-4 line-clamp-2" style={{ lineHeight: 1.5 }}>
                  {club.description}
                </p>
              )}

              {/* Stats Bar */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800/80 mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <UsersIcon className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong className="text-main font-bold">{club.members}</strong> Members</span>
                </div>
                <div className="h-3 w-px bg-gray-200 dark:bg-neutral-700"></div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong className="text-main font-bold">{club.events || 0}</strong> Active Events</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Row: Unstretched Green Button */}
            <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-3">
              <div className="text-xs text-muted font-medium flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block" />
                <span className="truncate">{club.dept || club.email || 'Campus Society'}</span>
              </div>

              <button
                onClick={() => navigate(`/admin/clubs/${club.id}`)}
                className="btn btn-secondary btn-sm flex items-center gap-2 px-4 py-2 font-bold shrink-0 shadow-xs hover:shadow-md transition-all"
              >
                <span>View Club Profile</span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        ))}

        {filteredClubs.length === 0 && (
          <div className="col-span-1 md:col-span-2 card text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
              <ClubsIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold mb-1">No organizations match your criteria</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-5">
              Try adjusting your search query, department faculty, or clear custom filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
              <ArrowPathIcon className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Custom Filter Modal (Status removed) */}
      <Modal
        isOpen={isCustomFilterOpen}
        onClose={() => setIsCustomFilterOpen(false)}
        title="Custom Organization Filters"
        subtitle="Build multi-criteria queries and apply fast organizational presets"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-outline mr-auto"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={() => setIsCustomFilterOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCustomFilter}
              className="btn btn-primary"
            >
              Apply Filters
            </button>
          </>
        }
      >
        <div>
          {/* Quick Presets */}
          <div className="mb-6">
            <label className="form-label text-xs uppercase tracking-wider text-muted font-bold">
              Quick Filter Presets
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('large')}
                className="p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-xs"
              >
                <div className="font-bold text-main">Large Orgs</div>
                <div className="text-muted text-[11px]">&gt; 50 registered members</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('active_events')}
                className="p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-xs"
              >
                <div className="font-bold text-main">High Activity</div>
                <div className="text-muted text-[11px]">&ge; 3 active events</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('engineering')}
                className="p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-xs"
              >
                <div className="font-bold text-main">Engineering Societies</div>
                <div className="text-muted text-[11px]">Technical & lab clubs</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('arts')}
                className="p-2.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-xs"
              >
                <div className="font-bold text-main">Arts & Culture</div>
                <div className="text-muted text-[11px]">Creative & debate guilds</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleApplyCustomFilter} className="space-y-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={modalDept}
                onChange={(e) => setModalDept(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Science">Science</option>
                <option value="Sports">Sports</option>
                <option value="Management">Management</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Minimum Members</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  className="form-input"
                  value={modalMinMembers}
                  onChange={(e) => setModalMinMembers(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Events Hosted</label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  className="form-input"
                  value={modalMinEvents}
                  onChange={(e) => setModalMinEvents(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
