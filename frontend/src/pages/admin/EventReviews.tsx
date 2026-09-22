import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  SearchIcon, 
  StarIcon, 
  MailIcon, 
  ClubsIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ArrowRightIcon, 
  CheckIcon,
  AcademicCapIcon,
  ShieldIcon,
  EditIcon
} from '../../components/common/Icons';
import { useToast } from '../../components/common/Toast';
import { reviewsService, EventReviewGroup } from '../../services/reviewsService';

export default function EventReviews() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<EventReviewGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewsService.getReviews();
      setEvents(res);
      if (res && res.length > 0 && selectedEventId === null) {
        setSelectedEventId(res[0].id);
      }
    } catch (e: any) {
      console.error('Failed to load reviews:', e);
      showToast('Could not load reviews from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);
  
  // State for administrative event feedback editor
  const [isEditingAdminFeedback, setIsEditingAdminFeedback] = useState(false);
  const [adminFeedbackInput, setAdminFeedbackInput] = useState('');

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // Sync editor text whenever selected event changes or opens
  useEffect(() => {
    if (selectedEvent && selectedEvent.adminEventFeedback) {
      setAdminFeedbackInput(selectedEvent.adminEventFeedback.feedback);
    } else {
      setAdminFeedbackInput('');
    }
    setIsEditingAdminFeedback(false);
  }, [selectedEventId]);

  const filteredEvents = events.filter(e => {
    return e.title.toLowerCase().includes(search.toLowerCase()) ||
           e.club.toLowerCase().includes(search.toLowerCase());
  });

  const handleSaveAdminFeedback = () => {
    if (!adminFeedbackInput.trim()) {
      showToast('Please enter administrative feedback before publishing.', 'error');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const updatedEvents = events.map(evt => {
      if (evt.id !== selectedEventId) return evt;
      return {
        ...evt,
        adminEventFeedback: {
          feedback: adminFeedbackInput.trim(),
          adminName: 'Office of Campus Administration',
          date: todayStr
        }
      };
    });

    setEvents(updatedEvents);
    setIsEditingAdminFeedback(false);
    showToast('Official administrative event feedback published successfully!', 'success');
  };

  const renderStars = (rating) => {
    return (
      <div className="rating-stars-row" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map(star => (
          <StarIcon 
            key={star} 
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-500' : 'text-slate-300 dark:text-neutral-700'}`} 
            filled={star <= Math.round(rating)} 
          />
        ))}
      </div>
    );
  };

  // -------------------------------------------------------------
  // VIEW 1: DETAILED VIEW (WHEN AN EVENT CARD IS CLICKED)
  // -------------------------------------------------------------
  if (selectedEvent) {
    const totalReviews = selectedEvent.reviews.length;
    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
      const count = selectedEvent.reviews.filter(r => r.rating === stars).length;
      const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
      return { stars, count, percentage };
    });

    return (
      <div className="event-directory-wrapper pb-12">
        {/* Top Navigation Row */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-2">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSelectedEventId(null);
              setIsEditingAdminFeedback(false);
            }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to All Completed Events</span>
          </button>

          <div className="text-xs text-muted flex items-center gap-1.5 font-medium">
            <span>Administrator Console</span>
            <span>/</span>
            <span className="text-main font-semibold">Event Reviews</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{selectedEvent.title}</span>
          </div>
        </div>

        {/* Detailed Event Header Showcase Card (No top gradient line) */}
        <div className="review-event-card cursor-default">
          <div className="flex justify-between items-start flex-wrap gap-6">
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-success">Concluded Fixture</span>
              </div>

              <h1 className="page-title text-2xl md:text-3xl mb-2">{selectedEvent.title}</h1>
              
              <div className="flex items-center gap-3 text-sm text-muted flex-wrap">
                <span className="flex items-center gap-1.5 font-semibold text-main">
                  <ClubsIcon className="w-4 h-4 text-blue-600" />
                  <span>{selectedEvent.club}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-emerald-600" />
                  <span>{selectedEvent.date}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-slate-500" />
                  <span>{selectedEvent.venue}</span>
                </span>
              </div>
            </div>

            {/* Overall Event Rating Card */}
            <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/80 border border-gray-100 dark:border-neutral-800 min-w-[260px]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-main">{selectedEvent.overallRating.toFixed(1)}</span>
                <span className="text-xs font-bold text-muted">/ 5.0</span>
                <div className="ml-auto">
                  {renderStars(selectedEvent.overallRating)}
                </div>
              </div>

              <p className="text-xs text-muted mb-3 font-medium">
                Overall score from <strong>{totalReviews}</strong> verified attendee reviews
              </p>

              {/* Rating Breakdown */}
              <div className="flex flex-col gap-1.5">
                {ratingBreakdown.slice(0, 3).map(b => (
                  <div key={b.stars} className="rating-breakdown-row">
                    <span className="w-10 text-[11px] font-bold">{b.stars} Stars</span>
                    <div className="rating-progress-track">
                      <div className="rating-progress-fill" style={{ width: `${b.percentage}%` }} />
                    </div>
                    <span className="w-6 text-right text-[11px] text-muted">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* OFFICIAL ADMINISTRATIVE REVIEW & FEEDBACK (The whole feedback to the event) */}
        <div className="event-glass-card">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                <ShieldIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-main m-0">Official Campus Administration Feedback</h3>
                <p className="text-xs text-muted">Institutional review and comprehensive evaluation for this event</p>
              </div>
            </div>

            <button 
              className="btn btn-outline btn-sm"
              onClick={() => {
                if (!isEditingAdminFeedback) {
                  setAdminFeedbackInput(selectedEvent.adminEventFeedback ? selectedEvent.adminEventFeedback.feedback : '');
                }
                setIsEditingAdminFeedback(!isEditingAdminFeedback);
              }}
            >
              <EditIcon className="w-3.5 h-3.5" />
              <span>{selectedEvent.adminEventFeedback ? 'Edit Admin Feedback' : 'Post Admin Feedback'}</span>
            </button>
          </div>

          {isEditingAdminFeedback ? (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
              <label className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-2 block">
                Administrative Evaluation & Concluding Institutional Feedback:
              </label>
              <textarea
                className="form-textarea w-full text-sm"
                rows={4}
                placeholder="Record official administrative feedback regarding student turnout, logistics compliance, budget adherence, and recommendations for future fixtures..."
                value={adminFeedbackInput}
                onChange={(e) => setAdminFeedbackInput(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end items-center gap-2 mt-3">
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsEditingAdminFeedback(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveAdminFeedback}
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>Publish Official Feedback</span>
                </button>
              </div>
            </div>
          ) : selectedEvent.adminEventFeedback ? (
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <div className="flex justify-between items-center text-xs text-blue-900 dark:text-blue-300 font-bold mb-2">
                <span>Published by {selectedEvent.adminEventFeedback.adminName}</span>
                <span className="font-mono text-[11px] text-muted">{selectedEvent.adminEventFeedback.date}</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                {selectedEvent.adminEventFeedback.feedback}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800 text-center text-muted text-xs">
              <p className="mb-2">No official administrative evaluation has been logged for this event yet.</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditingAdminFeedback(true)}
              >
                Post Administrative Event Review
              </button>
            </div>
          )}
        </div>

        {/* Section Heading: Delegate Reviews */}
        <div className="flex justify-between items-center flex-wrap gap-4 mt-2">
          <div>
            <h2 className="text-xl font-bold text-main">Delegate & Attendee Reviews ({totalReviews})</h2>
            <p className="text-xs text-muted">
              Individual attendee ratings, college names, student emails, and specific feedback comments.
            </p>
          </div>
        </div>

        {/* Delegate Reviews List */}
        <div className="flex flex-col gap-4">
          {selectedEvent.reviews.map(review => (
            <div key={review.id} className="review-delegate-card">
              {/* Reviewer Header Row */}
              <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                <div className="flex items-start gap-3">
                  {/* Monogram avatar */}
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-extrabold flex items-center justify-center text-sm shrink-0">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-main m-0">{review.name}</h3>
                      <span className="text-xs text-muted">• {review.date}</span>
                    </div>
                    
                    {/* College Name */}
                    <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                      <AcademicCapIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{review.collegeName}</span>
                    </div>

                    {/* Mail ID */}
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                      <MailIcon className="w-3.5 h-3.5 shrink-0" />
                      <a href={`mailto:${review.mailId}`} className="hover:underline font-mono text-[11px]">
                        {review.mailId}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    {review.rating}.0
                  </span>
                </div>
              </div>

              {/* Feedback Body */}
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-0 md:pl-13">
                {review.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ALL COMPLETED EVENTS CARDS GRID
  // -------------------------------------------------------------
  return (
    <div className="event-directory-wrapper">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Event Performance & Institutional Reviews</h1>
          <p className="page-description">
            Inspect verified attendee feedback, overall event ratings, and official administrative evaluations for concluded fixtures.
          </p>
        </div>
      </div>

      {/* Floating Glassmorphic Control Bar */}
      <div className="event-control-bar">
        <div className="event-search-box">
          <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search reviews by event title or organizing club..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="text-xs font-semibold text-muted">
          Showing <strong>{filteredEvents.length}</strong> Concluded Events
        </div>
      </div>

      {/* Grid of Completed Event Cards (Strictly NO gradient top lines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEvents.map(event => {
          return (
            <div 
              key={event.id}
              className="review-event-card"
              onClick={() => setSelectedEventId(event.id)}
            >
              <div>
                {/* Top Row: Overall Rating Badge */}
                <div className="flex justify-end items-start mb-2">
                  <div className="review-rating-pill">
                    <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>{event.overallRating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="event-card-title text-lg mb-1">{event.title}</h3>

                {/* Club & Date */}
                <div className="flex items-center gap-3 text-xs text-muted mb-3 flex-wrap">
                  <span className="flex items-center gap-1.5 font-semibold text-main">
                    <ClubsIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{event.club}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{event.date}</span>
                  </span>
                </div>

                <div className="event-card-divider" />

                {/* Official Administrative Feedback Preview or Status */}
                {event.adminEventFeedback ? (
                  <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs mb-4">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 mb-1">
                      <ShieldIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Official Administration Feedback:</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      "{event.adminEventFeedback.feedback}"
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 text-xs text-muted mb-4">
                    Pending administrative post-event evaluation note.
                  </div>
                )}
              </div>

              {/* Card Footer: Total Reviews & Action Trigger */}
              <div className="event-card-footer">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {event.reviews.length} Delegate Reviews
                </span>
                
                <span className="event-card-action">
                  <span>Inspect & Post Review</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted">
            No completed events matching current search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
