import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "campus_competition_data_v1";

const defaultData = {
  users: [{ username: "admin", password: "admin" }],
  competitions: [
    {
      id: "C001",
      name: "AI Hackathon",
      type: "Hackathon",
      date: "2025-10-05",
      time: "10:00",
      venue: "Main Auditorium",
      prize: "₹50,000",
      teams: [],
      results: []
    }
  ],
  teams: [],
  students: []
};

const AppContext = createContext();

export function AppProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultData;
    } catch (e) {
      return defaultData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // actions
  const addCompetition = (comp) => {
    setData((d) => ({ ...d, competitions: [...d.competitions, comp] }));
  };

  const addTeam = (team) => {
    setData((d) => ({ ...d, teams: [...d.teams, team] }));
  };

  const registerTeamToCompetition = (competitionId, teamId) => {
    setData((d) => {
      const competitions = d.competitions.map((c) =>
        c.id === competitionId ? { ...c, teams: Array.from(new Set([...c.teams, teamId])) } : c
      );
      return { ...d, competitions };
    });
  };

  const addStudent = (student) => {
    setData((d) => ({ ...d, students: [...d.students, student] }));
  };

  const addResult = (competitionId, result) => {
    setData((d) => {
      const competitions = d.competitions.map((c) =>
        c.id === competitionId ? { ...c, results: [...c.results, result] } : c
      );
      return { ...d, competitions };
    });
  };

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        addCompetition,
        addTeam,
        addStudent,
        registerTeamToCompetition,
        addResult
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
