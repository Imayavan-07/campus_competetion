import React from 'react';
import EventCard from '../../components/EventCard';

export default function StudentCompetitions() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Competitions & Events</h1>
          <p className="text-muted">Discover and register for campus events.</p>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Search events..." className="form-control" />
          <button className="btn btn-primary">Search</button>
        </div>
      </div>
      
      <div className="grid grid-cols-3">
        <EventCard 
          title="Annual Hackathon 2026" 
          club="Computer Science Club" 
          date="Sept 15, 2026" 
          tags={['Tech', 'Coding']}
          description="Build something amazing in 24 hours."
          linkTo="#"
        />
        <EventCard 
          title="Debate Championship" 
          club="Literary Society" 
          date="Sept 20, 2026" 
          tags={['Speaking']}
          description="Inter-college debate competition on current affairs."
          linkTo="#"
        />
        <EventCard 
          title="RoboWars" 
          club="Robotics Club" 
          date="Oct 05, 2026" 
          tags={['Engineering']}
          description="Design a robot and battle for glory."
          linkTo="#"
        />
      </div>
    </div>
  );
}
