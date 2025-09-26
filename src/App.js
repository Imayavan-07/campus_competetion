import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Hub from "./components/Hub";
import CompetitionDetails from "./components/CompetitionDetails";
import TeamRegistration from "./components/TeamRegistration";
import StudentForm from "./components/StudentForm";
import SearchRecords from "./components/SearchRecords";
import CompetitionList from "./components/CompetitionList";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/competitions" element={<CompetitionList />} />
        <Route path="/competition/:id" element={<CompetitionDetails />} />
        <Route path="/team-registration" element={<TeamRegistration />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/search" element={<SearchRecords />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Layout>
  );
}

export default App;
