import React from 'react';

export default function PostNotice() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>Post a Notice</h1>
      <p className="text-muted mb-8">Broadcast an announcement to the student notice board.</p>

      <div className="card">
        <form className="flex flex-col gap-4">
          <div className="form-group">
            <label>Notice Title</label>
            <input type="text" className="form-control" placeholder="Enter a descriptive title" />
          </div>
          
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label>Category</label>
              <select className="form-control">
                <option>General</option>
                <option>Event Announcement</option>
                <option>Important Update</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control">
                <option>Normal</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notice Content</label>
            <textarea className="form-control" rows="6" placeholder="Write your announcement here..."></textarea>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-outline">Save Draft</button>
            <button type="button" className="btn btn-primary">Publish Notice</button>
          </div>
        </form>
      </div>
    </div>
  );
}
