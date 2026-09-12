import React, { useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  UserPlusIcon,
  FilterIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function Members() {
  const { showToast } = useToast();

  const [members, setMembers] = useState([
    { id: 1, name: "Alice Johnson", role: "Club Coordinator", email: "alice@university.edu", phone: "+1 (555) 342-8910", dept: "Computer Science", assignedClub: "Computer Science Society", status: "Active" },
    { id: 2, name: "Bob Smith", role: "Club Coordinator", email: "bob@university.edu", phone: "+1 (555) 678-1290", dept: "Electronics", assignedClub: "Robotics Society", status: "Active" },
    { id: 3, name: "Charlie Davis", role: "Admin", email: "charlie@university.edu", phone: "+1 (555) 987-4321", dept: "Registrar Office", assignedClub: "Central Governance", status: "Active" },
    { id: 4, name: "Diana Prince", role: "Club Coordinator", email: "diana@university.edu", phone: "+1 (555) 890-3456", dept: "Civil Engineering", assignedClub: "Sustainable Habitat Guild", status: "Inactive" },
    { id: 5, name: "Evan Wright", role: "Admin", email: "evan@university.edu", phone: "+1 (555) 234-8765", dept: "Robotics Facility", assignedClub: "Drone League", status: "Active" },
    { id: 6, name: "Fiona Gallagher", role: "Club Coordinator", email: "fiona@university.edu", phone: "+1 (555) 456-7890", dept: "Data Science", assignedClub: "AI & ML Guild", status: "Active" },
    { id: 7, name: "George Miller", role: "Club Coordinator", email: "george@university.edu", phone: "+1 (555) 789-0123", dept: "Mechanical Engineering", assignedClub: "Formula Student Racing", status: "Active" },
    { id: 8, name: "Hannah Abbott", role: "Admin", email: "hannah@university.edu", phone: "+1 (555) 654-3210", dept: "Biotechnology Labs", assignedClub: "Bio-Safety Council", status: "Inactive" }
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [activeModal, setActiveModal] = useState(null); // 'addMember' | 'editMember' | 'viewMember' | 'deleteMember' | 'customFilter'
  const [selectedMember, setSelectedMember] = useState(null);

  // Add Member Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Club Coordinator',
    dept: 'Computer Science',
    assignedClub: 'Robotics Society',
    status: 'Active'
  });

  const handleToggleStatus = (id) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Member "${m.name}" set to ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('All');
    setDeptFilter('All');
    setStatusFilter('All');
    setSortBy('name-asc');
    showToast('Filters reset to default', 'info');
  };

  const activeFilterCount =
    (roleFilter !== 'All' ? 1 : 0) +
    (deptFilter !== 'All' ? 1 : 0) +
    (statusFilter !== 'All' ? 1 : 0) +
    (search.trim() !== '' ? 1 : 0) +
    (sortBy !== 'name-asc' ? 1 : 0);

  const filteredMembers = members.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.phone && m.phone.toLowerCase().includes(search.toLowerCase())) ||
      (m.assignedClub && m.assignedClub.toLowerCase().includes(search.toLowerCase())) ||
      m.dept.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || m.role === roleFilter;
    const matchDept = deptFilter === 'All' || m.dept === deptFilter;
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchRole && matchDept && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'role') return a.role.localeCompare(b.role);
    if (sortBy === 'dept') return a.dept.localeCompare(b.dept);
    if (sortBy === 'status') return a.status === 'Active' ? -1 : 1;
    return 0;
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Please fill in all mandatory fields (Name, Email, Phone)', 'warning');
      return;
    }
    const newMember = {
      id: Date.now(),
      ...formData
    };
    setMembers([newMember, ...members]);
    showToast(`Coordinator "${formData.name}" onboarded successfully!`, 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Club Coordinator',
      dept: 'Computer Science',
      assignedClub: 'Robotics Society',
      status: 'Active'
    });
    setActiveModal(null);
  };

  const handleEditMember = (e) => {
    e.preventDefault();
    setMembers(members.map(m => m.id === selectedMember.id ? selectedMember : m));
    showToast(`Updated member record for "${selectedMember.name}"`, 'success');
    setActiveModal(null);
  };

  const handleDeleteMember = () => {
    setMembers(members.filter(m => m.id !== selectedMember.id));
    showToast(`Revoked access for "${selectedMember.name}"`, 'error');
    setActiveModal(null);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Members & Identity</h1>
          <p className="page-description">Manage student delegates, club executives, and administrative access privileges.</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveModal('addMember')}
        >
          <UserPlusIcon className="w-4 h-4 text-black" />
          <span>Onboard New Member</span>
        </button>
      </div>

      <div className="card mb-8">
        {/* Search & Filter Controls Toolbar */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="flex-1" style={{ minWidth: '260px', maxWidth: '380px' }}>
            <div className="search-input-wrapper">
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or dept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Role Dropdown */}
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              title="Filter by Assigned Role"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Administrator</option>
              <option value="Club Coordinator">Club Coordinator</option>
            </select>

            {/* Department Dropdown */}
            <select
              className="filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              title="Filter by Academic Department"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Registrar Office">Registrar Office</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Robotics">Robotics</option>
              <option value="Data Science">Data Science</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>

            {/* Status Dropdown */}
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              title="Filter by Status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort Directory Records"
            >
              <option value="name-asc">Sort: Name (A → Z)</option>
              <option value="name-desc">Sort: Name (Z → A)</option>
              <option value="role">Sort: Role</option>
              <option value="dept">Sort: Department</option>
              <option value="status">Sort: Status (Active First)</option>
            </select>

            {/* Custom Filter Button */}
            <button
              className={`btn btn-sm ${activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveModal('customFilter')}
              title="Open Advanced Custom Filter Options"
            >
              <FilterIcon className="w-3.5 h-3.5" />
              <span>Custom Filter</span>
              {activeFilterCount > 0 && (
                <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick Reset Button */}
            {activeFilterCount > 0 && (
              <button
                className="btn btn-outline btn-sm text-xs"
                onClick={handleResetFilters}
                title="Reset All Filters"
              >
                <ArrowPathIcon className="w-3.5 h-3.5 text-muted" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-neutral-800 flex-wrap">
            <span className="text-xs text-muted font-semibold mr-1">Active:</span>
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
            {roleFilter !== 'All' && (
              <span className="filter-chip filter-chip-blue">
                <span>Role: {roleFilter}</span>
                <button
                  type="button"
                  onClick={() => setRoleFilter('All')}
                  className="filter-chip-remove"
                  title="Remove role filter"
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
                  onClick={() => setDeptFilter('All')}
                  className="filter-chip-remove"
                  title="Remove department filter"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="filter-chip filter-chip-blue">
                <span>Status: {statusFilter}</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('All')}
                  className="filter-chip-remove"
                  title="Remove status filter"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {sortBy !== 'name-asc' && (
              <span className="filter-chip filter-chip-purple">
                <span>{sortBy === 'name-desc' ? 'Sort: Z → A' : `Sort: ${sortBy}`}</span>
                <button
                  type="button"
                  onClick={() => setSortBy('name-asc')}
                  className="filter-chip-remove"
                  title="Reset sort"
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
              Clear All
            </button>
          </div>
        )}

        {/* Members Table */}
        <div className="table-container">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Assigned Role</th>
                <th>Academic Dept</th>
                <th>Contact Email</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedMember(member);
                        setActiveModal('viewMember');
                      }}
                      title="Click to view digital identity profile"
                    >
                      <div className="user-avatar-box" style={{ width: '32px', height: '32px', fontSize: '0.8rem', borderRadius: '8px' }}>
                        {member.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 700 }}>{member.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${member.role === 'Admin' ? 'badge-purple' : 'badge-blue'}`}>{member.role}</span>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">{member.dept}</div>
                    {member.assignedClub && (
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        {member.assignedClub}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="text-xs font-mono text-muted">{member.email}</div>
                    {member.phone && (
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">{member.phone}</div>
                    )}
                  </td>
                  <td>
                    {/* Interactive Status Toggle Switch */}
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={member.status === 'Active'}
                        onClick={() => handleToggleStatus(member.id)}
                        className={`toggle-switch ${member.status === 'Active' ? 'active' : 'inactive'}`}
                        title={`Click to switch status (currently ${member.status})`}
                      >
                        <span className="toggle-switch-handle" />
                      </button>
                      <span className={`text-xs font-bold ${member.status === 'Active'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-400 dark:text-neutral-500'
                        }`}>
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    {/* Actions without Eye Icon */}
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="btn btn-outline btn-icon-sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setActiveModal('editMember');
                        }}
                        title="Edit Member"
                      >
                        <EditIcon className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                      <button
                        className="btn btn-danger btn-icon-sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setActiveModal('deleteMember');
                        }}
                        title="Delete Member"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px' }} className="text-muted">
                    No members found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Onboard Member */}
      <Modal
        isOpen={activeModal === 'addMember'}
        onClose={() => setActiveModal(null)}
        title="Onboard College Club Coordinator"
        subtitle="Register coordinator credentials, direct phone, and assigned student club"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddMember}>Confirm Onboarding</button>
          </>
        }
      >
        <form onSubmit={handleAddMember}>
          {/* Row 1: Full Name & Role */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">Full Legal Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Samantha Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Assigned Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Club Coordinator">Club Coordinator</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>

          {/* Row 2: University Email & Phone Number */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">University Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="s.vance@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input font-mono"
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Row 3: Assigned Club & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Assigned Club</label>
              <select
                className="form-select"
                value={formData.assignedClub}
                onChange={(e) => setFormData({ ...formData, assignedClub: e.target.value })}
                required
              >
                <option value="Robotics Society">Robotics Society</option>
                <option value="Computer Science Society">Computer Science Society</option>
                <option value="AI & Machine Learning Guild">AI & Machine Learning Guild</option>
                <option value="Aeromodelling & Drone League">Aeromodelling & Drone League</option>
                <option value="Formula Student Racing">Formula Student Racing</option>
                <option value="Debating & Literary Society">Debating & Literary Society</option>
                <option value="Fine Arts & Media Collective">Fine Arts & Media Collective</option>
                <option value="Collegiate Esports & Gaming">Collegiate Esports & Gaming</option>
                <option value="Sustainable Habitat Guild">Sustainable Habitat Guild</option>
                <option value="Central Governance">Central Governance (Admin)</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Academic Department</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science"
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* MODAL: Edit Member */}
      {selectedMember && (
        <Modal
          isOpen={activeModal === 'editMember'}
          onClose={() => setActiveModal(null)}
          title={`Edit Member: ${selectedMember.name}`}
          subtitle="Update identity records, assigned club, and contact telemetry"
          size="md"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditMember}>Save Changes</button>
            </>
          }
        >
          <form onSubmit={handleEditMember}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="form-group mb-0">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedMember.name}
                  onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Assigned Role</label>
                <select
                  className="form-select"
                  value={selectedMember.role}
                  onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                >
                  <option value="Club Coordinator">Club Coordinator</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="form-group mb-0">
                <label className="form-label">University Email</label>
                <input
                  type="email"
                  className="form-input font-mono"
                  value={selectedMember.email}
                  onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input font-mono"
                  value={selectedMember.phone || ''}
                  onChange={(e) => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="form-group mb-0">
                <label className="form-label">Assigned Club</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedMember.assignedClub || ''}
                  onChange={(e) => setSelectedMember({ ...selectedMember, assignedClub: e.target.value })}
                />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedMember.dept}
                  onChange={(e) => setSelectedMember({ ...selectedMember, dept: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-select"
                value={selectedMember.status}
                onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: View Member Profile */}
      {selectedMember && (
        <Modal
          isOpen={activeModal === 'viewMember'}
          onClose={() => setActiveModal(null)}
          title="Digital Campus Identity"
          subtitle={`Profile ID: UNISYNC-USER-${selectedMember.id}`}
          size="sm"
          footer={
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Close Profile</button>
          }
        >
          <div className="flex flex-col gap-4 text-center items-center py-2">
            <div className="user-avatar-box" style={{ width: '64px', height: '64px', fontSize: '1.6rem', borderRadius: '20px' }}>
              {selectedMember.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedMember.name}</h3>
              <p className="text-sm text-muted">{selectedMember.email}</p>
            </div>
            <div className="w-full flex flex-col gap-2.5 text-left mt-2">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Department:</span>
                <span className="text-xs font-bold">{selectedMember.dept}</span>
              </div>
              {selectedMember.assignedClub && (
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Assigned Club:</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{selectedMember.assignedClub}</span>
                </div>
              )}
              {selectedMember.phone && (
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Phone:</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedMember.phone}</span>
                </div>
              )}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Role:</span>
                <span className={`badge ${selectedMember.role === 'Admin' ? 'badge-purple' : 'badge-blue'}`}>{selectedMember.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Account Status:</span>
                <span className={`badge ${selectedMember.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedMember.status}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Delete Member Confirmation */}
      {selectedMember && (
        <Modal
          isOpen={activeModal === 'deleteMember'}
          onClose={() => setActiveModal(null)}
          title="Revoke Member Credentials?"
          subtitle="This action will terminate system authorization"
          size="sm"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteMember}>Confirm Revocation</button>
            </>
          }
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Are you sure you want to deactivate and remove <strong>{selectedMember.name}</strong> ({selectedMember.email}) from the active campus directory?
          </p>
        </Modal>
      )}

      {/* MODAL: Custom Filter */}
      <Modal
        isOpen={activeModal === 'customFilter'}
        onClose={() => setActiveModal(null)}
        title="Custom Filters & Presets"
        subtitle="Multi-variable identity query builder and one-click presets"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                handleResetFilters();
                setActiveModal(null);
              }}
            >
              <ArrowPathIcon className="w-3.5 h-3.5 text-muted" />
              <span>Reset All</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                showToast(`Applied ${activeFilterCount} active filters`, 'success');
                setActiveModal(null);
              }}
            >
              Apply Filters
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-5 py-2">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              One-Click Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm text-xs justify-start"
                onClick={() => {
                  setRoleFilter('Club Coordinator');
                  setStatusFilter('All');
                  setDeptFilter('All');
                  showToast('Preset: Club Coordinators selected', 'info');
                }}
              >
                Club Coordinators
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm text-xs justify-start"
                onClick={() => {
                  setRoleFilter('Admin');
                  setStatusFilter('All');
                  setDeptFilter('All');
                  showToast('Preset: Administrators selected', 'info');
                }}
              >
                Administrative Staff
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm text-xs justify-start"
                onClick={() => {
                  setStatusFilter('Active');
                  setRoleFilter('All');
                  setDeptFilter('All');
                  showToast('Preset: Active Accounts selected', 'info');
                }}
              >
                Active Accounts
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm text-xs justify-start"
                onClick={() => {
                  setStatusFilter('Inactive');
                  setRoleFilter('All');
                  setDeptFilter('All');
                  showToast('Preset: Suspended / Inactive selected', 'info');
                }}
              >
                Suspended / Inactive Accounts
              </button>
            </div>
          </div>

          {/* Detailed Filter Variables */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Filter By Role</label>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Administrator</option>
                <option value="Club Coordinator">Club Coordinator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Department</label>
              <select
                className="form-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Registrar Office">Registrar Office</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Robotics">Robotics</option>
                <option value="Data Science">Data Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive / Suspended Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sort Records By</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="role">Assigned Role</option>
                <option value="dept">Academic Department</option>
                <option value="status">Status (Active First)</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
