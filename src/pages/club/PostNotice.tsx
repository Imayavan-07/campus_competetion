import React, { useState } from 'react';
import { NoticeIcon, SparklesIcon, CheckIcon, EyeIcon } from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function PostNotice() {
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(null); // 'preview'
  const [form, setForm] = useState({
    title: '',
    category: 'Event Announcement',
    priority: 'Normal',
    content: ''
  });

  const handlePublish = (e) => {
    if (e) e.preventDefault();
    if (!form.title || !form.content) {
      showToast('Please specify both a notice title and message content!', 'error');
      return;
    }
    showToast(`Notice "${form.title}" published to campus board!`, 'success');
    setActiveModal(null);
    setForm({ title: '', category: 'Event Announcement', priority: 'Normal', content: '' });
  };

  const handleSaveDraft = () => {
    showToast('Notice drafted and stored in local club storage.', 'success');
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Broadcast Club Announcement</h1>
          <p className="page-description">Publish accredited circulars to all student mobile and portal dashboards.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handlePublish} className="flex flex-col gap-5">
          <div className="form-group">
            <label className="form-label">Notice Headline</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Mandatory Briefing for Combat Bot Drivers"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Classification Category</label>
              <select 
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Event Announcement</option>
                <option>Workshop Schedules</option>
                <option>General News</option>
                <option>Competition Rules</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Alert Level</label>
              <select 
                className="form-select"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Normal">Normal Priority</option>
                <option value="High">Urgent / High Priority (Red Banner)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Official Announcement Message</label>
            <textarea 
              className="form-textarea" 
              rows={6} 
              placeholder="Draft your announcement message clearly..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-neutral-800">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setActiveModal('preview')}
            >
              <EyeIcon className="w-4 h-4" />
              <span>Live Bulletin Preview</span>
            </button>

            <div className="flex gap-2">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Publish to Student Body</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL: Live Preview */}
      <Modal
        isOpen={activeModal === 'preview'}
        onClose={() => setActiveModal(null)}
        title="Live Bulletin Board Preview"
        subtitle="How your circular appears on student and admin feeds"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Back to Edit</button>
            <button className="btn btn-primary" onClick={handlePublish}>Looks Perfect, Publish!</button>
          </>
        }
      >
        <div className="p-5 rounded-3xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-900/10">
          <div className="flex justify-between items-start mb-2">
            <span className={`badge ${form.priority === 'High' ? 'badge-danger' : 'badge-blue'}`}>
              {form.category}
            </span>
            {form.priority === 'High' && (
              <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider">Priority Alert</span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-1">{form.title || 'Untitled Notice'}</h3>
          <p className="text-xs text-muted mb-4">
            Published by <strong>Robotics Guild</strong> • Just now
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {form.content || 'Your announcement text will appear here...'}
          </p>
        </div>
      </Modal>
    </div>
  );
}
