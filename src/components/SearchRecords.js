import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SearchRecords() {
  const { data } = useApp();
  const [q, setQ] = useState("");
  const [type, setType] = useState("team");

  const results = () => {
    if (!q) return [];
    if (type === "team") return data.teams.filter(t => t.id.includes(q) || t.name.toLowerCase().includes(q.toLowerCase()));
    if (type === "competition") return data.competitions.filter(c => c.id.includes(q) || c.name.toLowerCase().includes(q.toLowerCase()));
    if (type === "student") return data.students.filter(s => s.studentId.includes(q) || s.name.toLowerCase().includes(q.toLowerCase()));
    return [];
  };

  return (
    <div className="card">
      <h3>Search Records</h3>
      <div className="form-row">
        <select value={type} onChange={(e)=>setType(e.target.value)}>
          <option value="team">Team</option>
          <option value="competition">Competition</option>
          <option value="student">Student</option>
        </select>
        <input placeholder="Search..." value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>

      <div style={{marginTop:12}}>
        {results().length === 0 ? <div>No results</div> :
          <ul>
            {results().map((r, idx) => <li key={idx}>{type === "team" ? `${r.id} — ${r.name}` : type === "competition" ? `${r.id} — ${r.name}` : `${r.studentId} — ${r.name}`}</li>)}
          </ul>
        }
      </div>

      <h4 style={{marginTop:12}}>Competition Results (overview)</h4>
      <table className="search-table">
        <thead><tr><th>Team ID</th><th>Competition ID</th><th>Position</th></tr></thead>
        <tbody>
          {data.competitions.flatMap(c => c.results.map(r => ({ compId: c.id, teamId: r.teamId, pos: r.position }))).map((row, i) => (
            <tr key={i}><td>{row.teamId}</td><td>{row.compId}</td><td>{row.pos}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
