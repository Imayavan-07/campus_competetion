import React, { useState } from 'react';
import { 
  NoticeIcon, 
  DownloadIcon, 
  SparklesIcon, 
  CheckIcon,
  FireIcon,
  PaperClipIcon,
  DocumentTextIcon 
} from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function NoticeBoard() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const notices = [
    { 
      id: 1, 
      title: 'Campus High-Speed Optical Fiber Maintenance', 
      author: 'IT Network Operations', 
      date: 'Today, 10:00 AM', 
      priority: 'High', 
      content: 'Core university switches in the Science & Library blocks will undergo scheduled firmware upgrades tonight between 2:00 AM - 4:00 AM. Cloud LMS systems and cellular reception will remain unaffected.', 
      category: 'Infrastructure',
      attachment: 'Maintenance_Schedule_Signed.pdf'
    },
    { 
      id: 2, 
      title: 'Extended 24/7 Library Hours for Finals Week', 
      author: 'Office of the Dean of Libraries', 
      date: 'Yesterday', 
      priority: 'Normal', 
      content: 'Main reading halls, quiet study carrels, and computer kiosks will remain open non-stop for the remainder of the examination cycle. Late-night safe campus escort services operate every 30 minutes from the North Gate.', 
      category: 'Academic',
      attachment: 'Finals_Shuttle_Timetable.pdf'
    },
    { 
      id: 3, 
      title: 'Fall Career Fair Registration Final Call', 
      author: 'Placement & Industry Cell', 
      date: 'Oct 10', 
      priority: 'High', 
      content: 'Last call to submit verified resumes for on-campus interview slots with Google, Nvidia, and DeepMind. Registration portal locks this Friday midnight.', 
      category: 'Career',
      attachment: 'Employer_Slot_List.pdf'
    },
    { 
      id: 4, 
      title: 'Sustainable Dining Menu Launched in Student Union', 
      author: 'Campus Student Council', 
      date: 'Oct 12', 
      priority: 'Normal', 
      content: 'The campus cafeteria has partnered with regional organic growers to launch subsidized farm-to-table lunch specials and oat milk espresso stations.', 
      category: 'General',
      attachment: null
    }
  ];

  const filteredNotices = notices.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'High' || filter === 'Normal') return n.priority === filter;
    return n.category === filter;
  });

  const handleDownloadAttachment = (filename) => {
    showToast(`Downloading campus document: ${filename}`, 'success');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Campus Bulletin & Notices</h1>
          <p className="page-description">Official administrative circulars, scheduling announcements, and advisories.</p>
        </div>
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => showToast('Refreshed notice feed from campus server!')}
        >
          <span>Sync Live Feed</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['All', 'High', 'Infrastructure', 'Academic', 'Career', 'General'].map(tab => (
          <button
            key={tab}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'High' ? (
              <span className="flex items-center gap-1.5">
                <FireIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>High Priority</span>
              </span>
            ) : tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredNotices.map(notice => (
          <div 
            key={notice.id}
            onClick={() => {
              setSelectedNotice(notice);
              setActiveModal('viewNotice');
            }}
            className="card p-6 cursor-pointer hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`badge ${notice.priority === 'High' ? 'badge-danger' : 'badge-blue'}`}>
                  {notice.category}
                </span>
                {notice.priority === 'High' && (
                  <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider">Urgent</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{notice.title}</h3>
              <p className="text-xs text-muted mb-4">
                Published by <strong>{notice.author}</strong> • {notice.date}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {notice.content}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
              <span className="text-xs font-bold text-blue-600">Click to expand document →</span>
              {notice.attachment && (
                <span className="badge badge-purple flex items-center" style={{ fontSize: '0.65rem' }}>
                  <PaperClipIcon className="w-3 h-3 inline mr-1 text-purple-600 dark:text-purple-400" />
                  Has PDF Attachment
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: View Full Notice */}
      {selectedNotice && (
        <Modal
          isOpen={activeModal === 'viewNotice'}
          onClose={() => setActiveModal(null)}
          title={selectedNotice.title}
          subtitle={`Issued by ${selectedNotice.author} • ${selectedNotice.date}`}
          size="md"
          footer={
            <>
              {selectedNotice.attachment && (
                <button 
                  className="btn btn-outline" 
                  onClick={() => handleDownloadAttachment(selectedNotice.attachment)}
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download Attachment</span>
                </button>
              )}
              <button className="btn btn-primary" onClick={() => setActiveModal(null)}>
                Dismiss
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center gap-2">
              <span className={`badge ${selectedNotice.priority === 'High' ? 'badge-danger' : 'badge-blue'}`}>
                {selectedNotice.priority} Priority
              </span>
              <span className="badge badge-purple">{selectedNotice.category}</span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {selectedNotice.content}
            </p>

            {selectedNotice.attachment && (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold">{selectedNotice.attachment}</p>
                    <span className="text-[10px] text-muted">Official University Verification Hash Certified</span>
                  </div>
                </div>
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={() => handleDownloadAttachment(selectedNotice.attachment)}
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
