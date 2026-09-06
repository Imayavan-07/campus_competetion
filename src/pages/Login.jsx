import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { data } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const found = data.users.find((u) => u.username === username && u.password === password);
    if (found) {
      setErr("");
      nav("/hub");
    } else {
      setErr("Invalid credentials. Try admin/admin.");
    }
  };

  return (
    <div className="card center-card">
      <h2>WELCOME</h2>
      <form onSubmit={handleLogin} className="form">
        <input required placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="form-row">
          <button className="btn primary" type="submit">LOGIN</button>
          <button className="btn" type="button" onClick={() => { setUsername("admin"); setPassword("admin"); }}>Fill demo</button>
        </div>
      </form>
      {err && <div className="error">{err}</div>}
      <div style={{marginTop:12}}>Don't have an account? Use admin/admin for demo.</div>
    </div>
  );
}
