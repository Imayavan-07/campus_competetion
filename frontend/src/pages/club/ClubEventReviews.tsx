import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  SearchIcon, 
  StarIcon, 
  MailIcon, 
  CalendarIcon, 
  MapPinIcon, 
  CheckIcon, 
  ShieldIcon, 
  EditIcon,
  ReviewsIcon,
  SparklesIcon,
  UsersIcon,
  CurrencyDollarIcon
} from '../../components/common/Icons';
import { useToast } from '../../components/common/Toast';
import { getStoredReviews, saveStoredReviews, saveClubOrganizerReply } from '../../data/eventsData';

export default function ClubEventReviews() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const urlEventId = searchParams.get('eventId');
  const [reviewEvents, setReviewEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number>(urlEventId ? Number(urlEventId) : 1);
  const [searchFeedback, setSearchFeedback] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Organizer Reply state
  const [isEditingReply, setIsEditingReply] = useState<boolean>(false);
  const [replyInput, setReplyInput] = useState<string>('');

  const loadReviews = () => {
    const data = getStoredReviews();
    setReviewEvents(data);
    if (urlEventId && data.find((e: any) => e.id === Number(urlEventId))) {
      setSelectedEventId(Number(urlEventId));
    } else if (data.length > 0 && !data.find((e: any) => e.id === selectedEventId)) {
      setSelectedEventId(data[0].id);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const selectedEvent = reviewEvents.find(e => e.id === selectedEventId) || reviewEvents[0];

  useEffect(() => {
    if (selectedEvent && selectedEvent.organizerReply) {
      setReplyInput(selectedEvent.organizerReply.reply);
    } else {
      setReplyInput('');
    }
    setIsEditingReply(false);
  }, [selectedEventId, reviewEvents]);

  if (!selectedEvent) {
    return (
      <div className="card py-16 text-center">
        <p className="text-muted text-sm font-semibold">No post-event reviews logged in database.</p>
      </div>
    );
  }

  const handleSaveOrganizerReply = () => {
    if (!replyInput.trim()) {
      showToast('Please enter an organizer reply before saving', 'error');
      return;
    }

    const updated = saveClubOrganizerReply(selectedEvent.id, replyInput.trim(), 'Robotics Guild Executive');
    setReviewEvents(updated);
    setIsEditingReply(false);
    showToast('Official Club Organizer response published!', 'success');
  };

  const reviewsList = selectedEvent.reviews || [];
  const filteredReviews = reviewsList.filter((r: any) => {
    const matchesSearch = r.name.toLowerCase().includes(searchFeedback.toLowerCase()) ||
                          r.feedback.toLowerCase().includes(searchFeedback.toLowerCase()) ||
                          (r.collegeName || '').toLowerCase().includes(searchFeedback.toLowerCase());
    if (!matchesSearch) return false;
    if (ratingFilter === 'all') return true;
    return r.rating === ratingFilter;
  });

  const rating5Count = reviewsList.filter((r: any) => r.rating === 5).length;
  const rating4Count = reviewsList.filter((r: any) => r.rating === 4).length;
  const rating3Count = reviewsList.filter((r: any) => r.rating <= 3).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-primary text-[10px] font-extrabold uppercase">Post-Event Hub</span>
            <span className="badge badge-success text-[10px] font-extrabold">Delegate Feedback</span>
          </div>
          <h1 className="page-title">Post-Event Summary & Reviews</h1>
          <p className="page-description">Inspect attendee satisfaction, administration remarks, and author official organizer responses.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/club/events')}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Manage Events</span>
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => showToast(`Post-event summary report for "${selectedEvent.title}" exported!`, 'success')}
          >
            <span>Export Summary Report</span>
          </button>
        </div>
      </div>

      {/* Event Selector Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
        {reviewEvents.map(evt => (
          <button
            key={evt.id}
            onClick={() => setSelectedEventId(evt.id)}
            className={`px-4 py-3 rounded-2xl border transition-all text-left shrink-0 flex items-center gap-3 ${
              evt.id === selectedEventId
                ? 'border-primary bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                : 'border-gray-200 dark:border-neutral-800 bg-card-bg hover:border-gray-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
              evt.id === selectedEventId ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-muted'
            }`}>
              <StarIcon className="w-4 h-4 text-tertiary" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-main block">{evt.title}</span>
              <span className="text-[11px] text-muted">{evt.date} • Rating: {evt.overallRating}/5.0</span>
            </div>
          </button>
        ))}
      </div>

      {/* Top Post-Event Analytics Hero Card */}
      <div className="card">
        <div className="flex justify-between items-start gap-6 flex-wrap mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge badge-success">Completed Fixture</span>
            </div>
            <h2 className="text-xl font-black text-main">{selectedEvent.title}</h2>
            <p className="text-xs text-muted flex items-center gap-2 mt-1">
              <MapPinIcon className="w-3.5 h-3.5 text-secondary" />
              <span>{selectedEvent.venue}</span>
              <span>•</span>
              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
              <span>Conducted on {selectedEvent.date}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-3xl font-black text-main leading-none block">{selectedEvent.overallRating}</span>
              <div className="rating-stars-row mt-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-tertiary" />
                ))}
              </div>
              <span className="text-[11px] text-muted font-bold block mt-0.5">Based on {reviewsList.length} verified submissions</span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bars & Turnout */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-neutral-800 text-xs">
          <div className="budget-metric-box">
            <span className="text-[10px] font-bold text-muted uppercase block mb-1">Turnout Rate</span>
            <span className="text-lg font-black text-secondary">{selectedEvent.turnoutRate || '98%'} Capacity</span>
          </div>

          <div className="budget-metric-box">
            <span className="text-[10px] font-bold text-muted uppercase block mb-1">5-Star Ratings</span>
            <span className="text-lg font-black text-primary">{rating5Count} Submissions ({Math.round((rating5Count / Math.max(1, reviewsList.length)) * 100)}%)</span>
          </div>

          <div className="budget-metric-box">
            <span className="text-[10px] font-bold text-muted uppercase block mb-1">4-Star Ratings</span>
            <span className="text-lg font-black text-main">{rating4Count} Submissions</span>
          </div>

          <div className="budget-metric-box">
            <span className="text-[10px] font-bold text-muted uppercase block mb-1">Net Satisfaction</span>
            <span className="text-lg font-black text-tertiary">96% Positive</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Official Admin Evaluation + Organizer Response vs Attendee Feedback Feed */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2-Cols: Attendee Reviews List */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="card">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-black text-main">Delegate Feedback Submissions ({reviewsList.length})</h3>
                <p className="text-xs text-muted">Direct testimonials submitted by participating students</p>
              </div>

              <div className="filter-pills-bar">
                <button 
                  className={`filter-pill ${ratingFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setRatingFilter('all')}
                >
                  All ({reviewsList.length})
                </button>
                <button 
                  className={`filter-pill ${ratingFilter === 5 ? 'active' : ''}`}
                  onClick={() => setRatingFilter(5)}
                >
                  5 Stars ({rating5Count})
                </button>
                <button 
                  className={`filter-pill ${ratingFilter === 4 ? 'active' : ''}`}
                  onClick={() => setRatingFilter(4)}
                >
                  4 Stars ({rating4Count})
                </button>
              </div>
            </div>

            {/* Search feedback input */}
            <div className="search-input-wrapper mb-4">
              <SearchIcon className="w-4 h-4 text-muted shrink-0" />
              <input 
                type="text" 
                placeholder="Search delegate comments or student names..." 
                value={searchFeedback}
                onChange={(e) => setSearchFeedback(e.target.value)}
              />
            </div>

            {/* Reviews Cards List */}
            <div className="flex flex-col gap-3">
              {filteredReviews.map((rev: any) => (
                <div key={rev.id} className="review-delegate-card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-extrabold text-sm text-main">{rev.name}</span>
                      <p className="text-[11px] text-muted">{rev.collegeName} • {rev.mailId}</p>
                    </div>

                    <div className="flex items-center gap-1 text-tertiary">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <StarIcon key={i} className="w-3.5 h-3.5" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-main font-medium leading-relaxed bg-neutral-50 dark:bg-neutral-900/40 p-3 rounded-xl border border-gray-100 dark:border-neutral-800/60 mt-2">
                    "{rev.feedback}"
                  </p>
                  <span className="text-[10px] text-muted font-bold block mt-2 text-right">
                    Submitted on {rev.date}
                  </span>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="py-8 text-center text-muted text-xs font-semibold">
                No feedback entries match your active search or star filter.
              </div>
            )}
          </div>
        </div>

        {/* Right 1-Col: Official Administration Evaluation & Club Organizer Reply */}
        <div className="flex flex-col gap-6">
          {/* Administration Evaluation Card */}
          <div className="card">
            <div className="flex items-center gap-2 text-primary mb-3">
              <ShieldIcon className="w-4 h-4" />
              <h3 className="text-base font-black text-main">University Admin Evaluation</h3>
            </div>

            {selectedEvent.adminEventFeedback ? (
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs">
                <p className="text-main leading-relaxed mb-3">
                  "{selectedEvent.adminEventFeedback.feedback}"
                </p>
                <div className="pt-2 border-t border-blue-100 dark:border-blue-900/40 flex justify-between items-center text-[11px] text-muted">
                  <span className="font-bold text-primary">{selectedEvent.adminEventFeedback.adminName}</span>
                  <span>{selectedEvent.adminEventFeedback.date}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">Administrative evaluation will appear once varsity audit is finalized.</p>
            )}
          </div>

          {/* Official Club Organizer Reply Box */}
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-secondary">
                <CheckIcon className="w-4 h-4" />
                <h3 className="text-base font-black text-main">Club Organizer Reply</h3>
              </div>
              {selectedEvent.organizerReply && !isEditingReply && (
                <button 
                  className="btn btn-ghost btn-xs text-primary font-bold"
                  onClick={() => setIsEditingReply(true)}
                >
                  <EditIcon className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {selectedEvent.organizerReply && !isEditingReply ? (
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs">
                <p className="text-main leading-relaxed mb-3">
                  "{selectedEvent.organizerReply.reply}"
                </p>
                <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40 flex justify-between items-center text-[11px] text-muted">
                  <span className="font-bold text-secondary">{selectedEvent.organizerReply.organizerName}</span>
                  <span>{selectedEvent.organizerReply.date}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted">
                  Publish an official executive acknowledgement to thank delegates and summarize key learnings for the next edition.
                </p>
                <textarea 
                  className="form-input text-xs"
                  rows={4}
                  placeholder="Record official organizer reply to attendee feedback..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  {selectedEvent.organizerReply && (
                    <button 
                      className="btn btn-outline btn-xs"
                      onClick={() => setIsEditingReply(false)}
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    className="btn btn-primary btn-xs"
                    onClick={handleSaveOrganizerReply}
                  >
                    Save & Publish Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
