import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  username: string;
  password?: string;
  [key: string]: any;
}

export interface Competition {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  prize: string;
  teams: string[];
  results: any[];
  [key: string]: any;
}

export interface Team {
  id?: string;
  name?: string;
  members?: any[];
  [key: string]: any;
}

export interface Student {
  id?: string;
  name?: string;
  [key: string]: any;
}

export interface AppData {
  users: User[];
  competitions: Competition[];
  teams: Team[];
  students: Student[];
}

export interface AppContextType {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  addCompetition: (comp: Competition) => void;
  addTeam: (team: Team) => void;
  addStudent: (student: Student) => void;
  registerTeamToCompetition: (competitionId: string, teamId: string) => void;
  addResult: (competitionId: string, result: any) => void;
}

const STORAGE_KEY = "campus_competition_data_v1";

const defaultData: AppData = {
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [data, setData] = useState<AppData>(() => {
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
  const addCompetition = (comp: Competition) => {
    setData((d) => ({ ...d, competitions: [...d.competitions, comp] }));
  };

  const addTeam = (team: Team) => {
    setData((d) => ({ ...d, teams: [...d.teams, team] }));
  };

  const registerTeamToCompetition = (competitionId: string, teamId: string) => {
    setData((d) => {
      const competitions = d.competitions.map((c) =>
        c.id === competitionId ? { ...c, teams: Array.from(new Set([...c.teams, teamId])) } : c
      );
      return { ...d, competitions };
    });
  };

  const addStudent = (student: Student) => {
    setData((d) => ({ ...d, students: [...d.students, student] }));
  };

  const addResult = (competitionId: string, result: any) => {
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

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
