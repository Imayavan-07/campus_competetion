import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function CompetitionList() {
  const { data } = useApp();

  return (
    <div className="card">
      <h3>Competition Listings</h3>
      {data.competitions.map(c => (
        <div key={c.id} className="competition-card-list">
          <h4>{c.name}</h4>
          <div>Date: {c.date} • Time: {c.time} • Venue: {c.venue} • Prize: {c.prize}</div>
          <div style={{marginTop:8}}>
            <Link to={`/competition/${c.id}`} className="btn">View Details</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

