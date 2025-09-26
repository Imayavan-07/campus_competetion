import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Hub() {
  const { data } = useApp();
  const nav = useNavigate();

  return (
    <div>
      <div className="card">
        <h3>Upcoming Competitions</h3>
        {data.competitions.length === 0 && <div>No competitions yet.</div>}
        {data.competitions.map((c) => (
          <div key={c.id} className="competition-card-list">
            <h4>{c.name} ({c.id})</h4>
            <div>Date: {c.date} • Time: {c.time} • Venue: {c.venue}</div>
            <div className="tiny">{c.prize}</div>
            <div style={{marginTop:8}}>
              <button className="btn" onClick={() => nav(`/competition/${c.id}`)}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
