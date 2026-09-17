import React, { useState } from 'react';
import { PlusIcon, EditIcon, UsersIcon, TrashIcon, CalendarIcon } from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function ManageEvents() {
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'roster' | 'cancel'
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([
    { id: 1, title: 'Annual Robotics Grand Prix 2026', date: 'Sept 25, 2026', venue: 'Innovation Arena', participants: 120, status: 'Active' },
    { id: 2, title: 'Combat Bot Circuit Design Clinic', date: 'Oct 10, 2026', venue: 'Makerspace Lab 2', participants: 45, status: 'Draft' },
    { id: 3, title: 'Autonomous Drone Navigation Keynote', date: 'Nov 02, 2026', venue: 'Auditorium Hall B', participants: 0, status: 'Pending Approval' }
  ]);

  const [form, setForm] = useState({
    title: '',
    date: '',
    venue: '',
    participants: 0,
    status: 'Active'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title) return;
    const newEvt = {
      id: Date.now(),
      ...form,
      participants: 0,
      status: 'Active'
    };
    setEvents([newEvt, ...events]);
    showToast(`New club event "${form.title}" published!`, 'success');
    setActiveModal(null);
    setForm({ title: '', date: '', venue: '', participants: 0, status: 'Active' });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEvents(events.map(ev => ev.id === selectedEvent.id ? selectedEvent : ev));
    showToast(`Updated fixture details for "${selectedEvent.title}"!`, 'success');
    setActiveModal(null);
  };

  const handleCancelConfirm = () => {
    setEvents(events.filter(ev => ev.id !== selectedEvent.id));
    showToast(`Cancelled event: "${selectedEvent.title}"`, 'error');
    setActiveModal(null);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Manage Club Fixtures & Events</h1>
          <p className="page-description">Author new competitions, track participant registers, and manage venues.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setActiveModal('create')}
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      <div className="table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date & Schedule</th>
              <th>Allocated Venue</th>
              <th>Participants</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td style={{ fontWeight: 800 }}>{event.title}</td>
                <td className="text-muted">{event.date}</td>
                <td className="text-muted">{event.venue}</td>
                <td>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                    {event.participants} registered
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    event.status === 'Active' ? 'badge-success' : 
                    event.status === 'Draft' ? 'badge-warning' : 'badge-blue'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setActiveModal('roster');
                      }}
                      title="Inspect Attendee Roster"
                    >
                      <UsersIcon className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setActiveModal('edit');
                      }}
                      title="Edit Event"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setActiveModal('cancel');
                      }}
                      title="Cancel Event"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: Create New Event */}
      <Modal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        title="Schedule New Club Event"
        subtitle="Provision registration slots for student members"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Publish Event</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Event Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Autonomous Maze Solver Sprint"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Scheduled Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reserved Venue</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Makerspace Bay 3"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required 
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* MODAL: Edit Event */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'edit'}
          onClose={() => setActiveModal(null)}
          title={`Edit: ${selectedEvent.title}`}
          subtitle="Modify scheduling parameters"
          size="md"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEdit}>Update Fixture</button>
            </>
          }
        >
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label className="form-label">Event Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={selectedEvent.title}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Venue</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={selectedEvent.venue}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, venue: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  value={selectedEvent.status}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Roster Inspect */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'roster'}
          onClose={() => setActiveModal(null)}
          title={`Delegate Roster: ${selectedEvent.title}`}
          subtitle={`${selectedEvent.participants} Total Enrolled Students`}
          size="md"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close Roster</button>
          }
        >
          <div className="flex flex-col gap-2 py-2">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between">
              <div>
                <span className="font-bold text-xs">Alex Vance</span>
                <p className="text-[11px] text-muted">Lead Pilot (Reg #2024CS01)</p>
              </div>
              <span className="badge badge-success">Confirmed</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between">
              <div>
                <span className="font-bold text-xs">Sarah Jenkins</span>
                <p className="text-[11px] text-muted">Electronics Lead (Reg #2024EC12)</p>
              </div>
              <span className="badge badge-success">Confirmed</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex justify-between">
              <div>
                <span className="font-bold text-xs">Liam O'Connor</span>
                <p className="text-[11px] text-muted">Mechanical Specialist (Reg #2023ME44)</p>
              </div>
              <span className="badge badge-warning">Waitlisted</span>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Cancel Confirm */}
      {selectedEvent && (
        <Modal
          isOpen={activeModal === 'cancel'}
          onClose={() => setActiveModal(null)}
          title="Cancel and Strike Event?"
          subtitle="All delegates will receive automated refund and notice"
          size="sm"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Retain Event</button>
              <button className="btn btn-danger" onClick={handleCancelConfirm}>Cancel Event</button>
            </>
          }
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Are you sure you want to cancel <strong>{selectedEvent.title}</strong>? This cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}
