import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function TeamRegistration() {
  const { data, addTeam, registerTeamToCompetition } = useApp();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [leader, setLeader] = useState("");
  const [members, setMembers] = useState("");
  const [email, setEmail] = useState("");
  const [selectedComp, setSelectedComp] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!id || !name) return alert("Provide team id and name");
    const team = { id, name, leader, members: members.split(",").map(s=>s.trim()).filter(Boolean), email };
    addTeam(team);
    if (selectedComp) registerTeamToCompetition(selectedComp, id);
    setId(""); setName(""); setLeader(""); setMembers(""); setEmail(""); setSelectedComp("");
  };

  return (
    <div className="card">
      <h3>Team Registration</h3>
      <form onSubmit={handleCreate} className="form">
        <input placeholder="Team ID (eg. T001)" value={id} onChange={(e)=>setId(e.target.value)} required />
        <input placeholder="Team Name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input placeholder="Team Leader" value={leader} onChange={(e)=>setLeader(e.target.value)} />
        <input placeholder="Members (comma separated)" value={members} onChange={(e)=>setMembers(e.target.value)} />
        <input placeholder="Team E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label>Auto Register to competition (optional)</label>
        <select value={selectedComp} onChange={(e)=>setSelectedComp(e.target.value)}>
          <option value="">-- none --</option>
          {data.competitions.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
        </select>
        <div className="form-row">
          <button className="btn primary" type="submit">Create & Register</button>
        </div>
      </form>

      <h4 style={{marginTop:12}}>Existing Teams</h4>
      {data.teams.length === 0 ? <div>No teams yet.</div> :
        <ul>
          {data.teams.map(t => <li key={t.id}>{t.id} — {t.name} ({t.leader})</li>)}
        </ul>
      }
    </div>
  );
}
