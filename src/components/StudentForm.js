import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function StudentForm() {
  const { data, addStudent } = useApp();
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const st = { studentId, name, teamId, contact, email, dept, year };
    addStudent(st);
    setStudentId(""); setName(""); setTeamId(""); setContact(""); setEmail(""); setDept(""); setYear("");
  };

  return (
    <div className="card">
      <h3>Student Registration Form</h3>
      <form onSubmit={submit} className="form">
        <input placeholder="Student ID" value={studentId} onChange={(e)=>setStudentId(e.target.value)} required />
        <input placeholder="Student Name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input placeholder="Team ID (optional)" value={teamId} onChange={(e)=>setTeamId(e.target.value)} />
        <input placeholder="Contact Info" value={contact} onChange={(e)=>setContact(e.target.value)} />
        <input placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Dept" value={dept} onChange={(e)=>setDept(e.target.value)} />
        <input placeholder="Year" value={year} onChange={(e)=>setYear(e.target.value)} />
        <div className="form-row">
          <button className="btn primary" type="submit">Submit</button>
        </div>
      </form>

      <h4 style={{marginTop:12}}>Registered Students</h4>
      {data.students.length === 0 ? <div>No students yet.</div> :
        <table className="search-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Team</th><th>Dept</th></tr>
          </thead>
          <tbody>
            {data.students.map(s => (
              <tr key={s.studentId}><td>{s.studentId}</td><td>{s.name}</td><td>{s.teamId}</td><td>{s.dept}</td></tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}
