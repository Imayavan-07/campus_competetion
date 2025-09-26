import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">🏆</div>
        <h1 className="title">Campus Competition Hub</h1>
        <nav className="nav">
          <Link to="/hub">Hub</Link>
          <Link to="/competitions">Competitions</Link>
          <Link to="/team-registration">Team Reg.</Link>
          <Link to="/student-form">Student Form</Link>
          <Link to="/search">Search</Link>
        </nav>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn" onClick={() => navigate("/")}>Logout</button>
        </div>
      </header>

      <main className="container">{children}</main>
      <footer className="footer">Campus Competition Hub • Demo App</footer>
    </div>
  );
}
