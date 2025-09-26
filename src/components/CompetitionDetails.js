import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function CompetitionDetails() {
  const { id } = useParams();
  const { data, registerTeamToCompetition, addResult } = useApp();
  const comp = data.competitions.find((c) => c.id === id);
  const [teamToAdd, setTeamToAdd] = useState("");
  const [positionTeam, setPositionTeam] = useState("");
  const [position, setPosition] = useState("");

  if (!comp) return <div className="card">Competition not found.</div>;

  const availableTeams = data.teams.filter((t) => !comp.teams.includes(t.id));

  return (
    <div className="card">
      <h3>{comp.name} — {comp.id}</h3>
      <ul className="details-list">
        <li>Type: {comp.type}</li>
        <li>Date: {comp.date}</li>
        <li>Time: {comp.time}</li>
        <li>Venue: {comp.venue}</li>
        <li>Prize: {comp.prize}</li>
      </ul>

      <h4>Registered Teams</h4>
      {comp.teams.length === 0 ? <div>No teams registered.</div> :
        <ul>
          {comp.teams.map((tid) => {
            const t = data.teams.find((x) => x.id === tid);
            return <li key={tid}>{tid} — {t ? t.name : "(deleted)"} </li>;
          })}
        </ul>
      }

      <div style={{marginTop:10}}>
        <label>Add existing team to competition</label>
        <select value={teamToAdd} onChange={(e) => setTeamToAdd(e.target.value)}>
          <option value="">-- select team --</option>
          {availableTeams.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.name}</option>)}
        </select>
        <button className="btn" disabled={!teamToAdd} onClick={() => {registerTeamToCompetition(comp.id, teamToAdd); setTeamToAdd("");}}>Register</button>
      </div>

      <h4 style={{marginTop:12}}>Add Result</h4>
      <div className="form-row">
        <select value={positionTeam} onChange={(e)=>setPositionTeam(e.target.value)}>
          <option value="">-- team --</option>
          {comp.teams.map((tid)=> {
            const t = data.teams.find(x=>x.id===tid);
            return <option key={tid} value={tid}>{tid} — {t? t.name : tid}</option>;
          })}
        </select>
        <input placeholder="Position (1/2/3...)" value={position} onChange={(e)=>setPosition(e.target.value)} />
        <button className="btn" disabled={!positionTeam || !position} onClick={() => { addResult(comp.id, { teamId: positionTeam, position }); setPosition(""); setPositionTeam("");}}>Add</button>
      </div>

      <h4 style={{marginTop:12}}>Results</h4>
      {comp.results.length === 0 ? <div>No results yet.</div> :
        <ul>
          {comp.results.map((r, idx) => <li key={idx}>#{r.position} — {r.teamId}</li>)}
        </ul>
      }
    </div>
  );
}
