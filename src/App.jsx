import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import ApplicationForm from "./components/pages/ApplicationForm";
import Login from "./components/pages/LoginForm";
import AdminDashboard from "./components/pages/AdminDashboard";
import AboutPage from "./components/pages/AboutPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/about-us" element={<AboutPage />} />

      </Routes>
    </Router>
  );
}

export default App;
