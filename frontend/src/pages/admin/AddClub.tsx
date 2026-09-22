import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ClubsIcon,
  UsersIcon,
  MailIcon,
  PhoneIcon,
  AcademicCapIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  XMarkIcon
} from '../../components/common/Icons';
import { useToast } from '../../components/common/Toast';
import { clubsService } from '../../services/clubsService';
import { membersService } from '../../services/membersService';
import { uploadService } from '../../services/uploadService';

export default function AddClub() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Load available club coordinators
  const [coordinators, setCoordinators] = useState<any[]>([]);

  useEffect(() => {
    async function loadCoordinators() {
      try {
        const res = await membersService.getMembers({ role: 'club' });
        if (res.data && res.data.length > 0) {
          setCoordinators(res.data);
          setFormData((prev) => ({
            ...prev,
            coordinator: res.data[0]?.name || 'Alice Johnson',
          }));
        }
      } catch (e) {
        console.warn('Could not load coordinators from server:', e);
      }
    }
    loadCoordinators();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    // Basic Details
    name: '',
    dept: 'Engineering',
    clubEmail: '',
    members: 15,
    description: '',

    // Coordinator & Governance
    coordinator: coordinators[0]?.name || 'Alice Johnson',

    // President Details
    presidentName: '',
    presidentEmail: '',
    presidentPhone: '',
    presidentYear: '3rd Year',

    // Vice President Details
    vpName: '',
    vpEmail: '',
    vpPhone: '',
    vpYear: '3rd Year'
  });

  // Logo State (PNG, JPEG, JPG, SVG)
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFileName, setLogoFileName] = useState('');

  // Handle Logo Upload
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidExt = ['png', 'jpg', 'jpeg', 'svg'].includes(extension);

    if (!validTypes.includes(file.type) && !isValidExt) {
      showToast('Please upload an image in PNG, JPEG, JPG, or SVG format.', 'warning');
      return;
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should not exceed 5MB.', 'warning');
      return;
    }

    setLogoFileName(file.name);
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      showToast('Logo image selected successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFileName('');
    setLogoFile(null);
  };

  // Dynamic Executive Positions
  const [positions, setPositions] = useState([
    { id: 1, title: 'Secretary', memberName: '' },
    { id: 2, title: 'Treasurer', memberName: '' }
  ]);

  const handleAddPosition = () => {
    const newPos = {
      id: Date.now(),
      title: '',
      memberName: ''
    };
    setPositions([...positions, newPos]);
  };

  const handleRemovePosition = (id) => {
    if (positions.length <= 1) {
      showToast('A club must maintain at least one leadership position.', 'warning');
      return;
    }
    setPositions(positions.filter(p => p.id !== id));
  };

  const handlePositionChange = (id, field, value) => {
    setPositions(positions.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Get selected coordinator's department
  const selectedCoordinatorObj = coordinators.find(c => c.name === formData.coordinator) || coordinators[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Club name is required', 'warning');
      return;
    }
    if (!formData.clubEmail.trim()) {
      showToast('Club official email is required', 'warning');
      return;
    }
    if (!formData.presidentName.trim()) {
      showToast('President full name is required', 'warning');
      return;
    }

    try {
      let uploadedLogoUrl: string | null = null;
      if (logoFile) {
        const uploadRes = await uploadService.uploadImage(logoFile);
        if (uploadRes.data?.url) {
          uploadedLogoUrl = uploadRes.data.url;
        }
      }

      const newClubData = {
        name: formData.name.trim(),
        dept: formData.dept,
        email: formData.clubEmail.trim(),
        members_count: Number(formData.members) || 10,
        events_count: 0,
        description: formData.description,
        logo_url: uploadedLogoUrl,
        coordinator: formData.coordinator,
        president: formData.presidentName.trim(),
        phone: formData.presidentPhone.trim(),
        category: formData.dept,
      };

      await clubsService.createClub(newClubData);

      showToast(`Club "${formData.name}" has been registered successfully!`, 'success');
      navigate('/admin/clubs');
    } catch (err: any) {
      console.error('Error registering club:', err);
      showToast(err.message || 'Failed to register club on server.', 'error');
    }
  };

  return (
    <div className="pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/clubs')}
            className="btn btn-outline btn-sm flex items-center gap-2"
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>←</span>
            <span>Back to Clubs</span>
          </button>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.65rem' }}>Register New Student Organization</h1>
            <p className="page-description">Institutional onboarding, leadership governance appointment, and club registration</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/clubs')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4 text-white" />
            <span>Register Club</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '980px', margin: '0 auto' }} className="flex flex-col gap-8">
        
        {/* SECTION 1: Club Identity & Affiliation */}
        <div className="card" style={{ padding: '28px' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ClubsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Club Identity & Affiliation</h2>
              <p className="text-muted text-xs">Official institutional identification and department registration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group md:col-span-2">
              <label className="form-label">
                Club / Society Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Artificial Intelligence & Robotics Society"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Department / Faculty Classification</label>
              <select
                className="form-select"
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
              >
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science & IT</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Science">Science & Mathematics</option>
                <option value="Sports">Sports & Athletics</option>
                <option value="Management">Business & Management</option>
                <option value="Biotechnology">Biotechnology & Life Sciences</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Official Club Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="form-input"
                  placeholder="society@university.edu"
                  value={formData.clubEmail}
                  onChange={(e) => setFormData({ ...formData, clubEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Members Enrolled</label>
              <input
                type="number"
                min="1"
                className="form-input"
                placeholder="15"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: Number(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Club Mission Statement & Purpose</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Describe the club's objectives, target audience, and planned year-round activities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Club Official Logo Upload (Position 2) */}
        <div className="card" style={{ padding: '28px' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PhotoIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Club Insignia & Official Logo</h2>
              <p className="text-muted text-xs">Upload the visual emblem for student directory branding (PNG, JPEG, JPG, SVG)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Logo Preview Container */}
            <div className="relative shrink-0">
              <div
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-center overflow-hidden transition-all shadow-sm"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Club Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-2 text-gray-400">
                    <PhotoIcon className="w-8 h-8 mb-1 opacity-60" />
                    <span className="text-[10px] font-semibold">No Logo</span>
                  </div>
                )}
              </div>

              {logoPreview && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  title="Remove uploaded logo"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Upload Controls & Guidelines */}
            <div className="flex-1">
              <input
                type="file"
                id="club-logo-file-input"
                accept=".png,.jpeg,.jpg,.svg,image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-3 mb-2">
                <label
                  htmlFor="club-logo-file-input"
                  className="btn btn-outline btn-sm cursor-pointer flex items-center gap-2 hover:border-blue-500/50"
                >
                  <ArrowUpTrayIcon className="w-4 h-4 text-blue-600" />
                  <span>{logoPreview ? 'Change Logo Image' : 'Select Logo Image'}</span>
                </label>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="btn btn-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>

              {logoFileName ? (
                <div className="text-xs text-main font-medium mt-1">
                  Selected file: <span className="font-bold">{logoFileName}</span>
                </div>
              ) : (
                <div className="text-xs text-muted">
                  Supported image formats: <strong className="text-main">PNG, JPEG, JPG, SVG</strong> (Max 5MB).
                </div>
              )}
              <div className="text-[11px] text-muted mt-0.5">
                Recommended dimensions: 400x400px square ratio for best clarity on campus mobile & web views.
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Department Governance (Coordinator & Department Only) */}
        <div className="card" style={{ padding: '28px' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Department Governance & Oversight</h2>
              <p className="text-muted text-xs">Assign a certified Club Coordinator from campus records and verify department affiliation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="form-label">
                Assigned Club Coordinator <span className="text-red-500">*</span>
              </label>
              <select
                className="form-select"
                value={formData.coordinator}
                onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                required
              >
                {coordinators.map(coord => (
                  <option key={coord.id} value={coord.name}>
                    {coord.name} ({coord.email})
                  </option>
                ))}
              </select>
              <span className="text-muted text-xs mt-1.5 block">
                Select from authorized university staff members tagged with the Club Coordinator role.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Coordinator Department</label>
              <input
                type="text"
                className="form-input bg-neutral-50 dark:bg-neutral-900/40 text-muted cursor-not-allowed"
                value={selectedCoordinatorObj?.dept || formData.dept}
                readOnly
              />
              <span className="text-muted text-xs mt-1.5 block">
                Official affiliated department associated with the selected coordinator.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Student President Details */}
        <div className="card" style={{ padding: '28px' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Student President Details</h2>
              <p className="text-muted text-xs">Primary student representative responsible for organizational decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="form-label">
                President Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Evan Wright"
                value={formData.presidentName}
                onChange={(e) => setFormData({ ...formData, presidentName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                University Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="president@student.university.edu"
                value={formData.presidentEmail}
                onChange={(e) => setFormData({ ...formData, presidentEmail: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 234-8765"
                value={formData.presidentPhone}
                onChange={(e) => setFormData({ ...formData, presidentPhone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select
                className="form-select"
                value={formData.presidentYear}
                onChange={(e) => setFormData({ ...formData, presidentYear: e.target.value })}
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior / Final Year)</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 5: Student Vice President Details */}
        <div className="card" style={{ padding: '28px' }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Student Vice President Details</h2>
              <p className="text-muted text-xs">Secondary leadership contact assisting club governance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="form-label">Vice President Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Jenkins"
                value={formData.vpName}
                onChange={(e) => setFormData({ ...formData, vpName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">University Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="vicepresident@student.university.edu"
                value={formData.vpEmail}
                onChange={(e) => setFormData({ ...formData, vpEmail: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 789-4321"
                value={formData.vpPhone}
                onChange={(e) => setFormData({ ...formData, vpPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select
                className="form-select"
                value={formData.vpYear}
                onChange={(e) => setFormData({ ...formData, vpYear: e.target.value })}
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior / Final Year)</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 6: Dynamic Executive Positions */}
        <div className="card" style={{ padding: '28px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Club Executive Positions</h2>
                <p className="text-muted text-xs">Define custom leadership roles and appoint active student members</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPosition}
              className="btn btn-secondary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusIcon className="w-4 h-4 text-black" />
              <span>Add Position</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {positions.map((pos, index) => (
              <div
                key={pos.id}
                className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-gray-200/80 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center gap-4 transition-all"
              >
                <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                      Position / Role Title
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Secretary, Treasurer, Tech Lead..."
                      value={pos.title}
                      onChange={(e) => handlePositionChange(pos.id, 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                      Appointed Member Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alex Morgan"
                      value={pos.memberName}
                      onChange={(e) => handlePositionChange(pos.id, 'memberName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Mild Red Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemovePosition(pos.id)}
                  title="Remove this position"
                  className="p-2.5 text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-lg transition-colors shrink-0 self-end md:self-center flex items-center justify-center shadow-xs"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-muted text-xs">
              Total appointed executive roles: <strong className="text-main">{positions.length}</strong>
            </span>
            <button
              type="button"
              onClick={handleAddPosition}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add another position</span>
            </button>
          </div>
        </div>

        {/* Form Bottom Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => navigate('/admin/clubs')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4 text-white" />
            <span>Register Organization</span>
          </button>
        </div>

      </form>
    </div>
  );
}
