import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/Dashboard.css";
import axios from "axios";

const AdminDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    degree: "",
    experience: "",
    email: "",
    project: "",
  });
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/login");
    } else {
      fetchApplicants();
    }
  }, [navigate]);

  // Fetch all applicants
  const fetchApplicants = () => {
    axios
      .get("http://localhost:5000/api/applications")
      .then((res) => setApplicants(res.data))
      .catch((err) => console.error("Error fetching applicants:", err));
  };

  // Accept applicant
  const handleAccept = (id) => {
    axios
      .put(`http://localhost:5000/api/applications/${id}/accept`)
      .then((res) => {
        const updatedApplicant = res.data.application;
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app._id === id ? updatedApplicant : app
          )
        );
        alert("Applicant accepted and email sent!");
      })
      .catch((err) => console.error("Error accepting applicant:", err));
  };

  // Decline applicant
  const handleDecline = (id) => {
    if (window.confirm("Are you sure you want to decline this application?")) {
      axios
        .put(`http://localhost:5000/api/applications/${id}/decline`)
        .then((res) => {
          const updatedApplicant = res.data.application;
          setApplicants((prevApplicants) =>
            prevApplicants.map((app) =>
              app._id === id ? updatedApplicant : app
            )
          );
          alert("Applicant declined and email sent!");
        })
        .catch((err) => console.error("Error declining applicant:", err));
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  // Edit modal
  const handleEdit = (applicant) => {
    setEditingApplicant(applicant._id);
    setFormData(applicant);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/applications/${editingApplicant}`, formData)
      .then((res) => {
        const updatedApplicant = res.data;
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === editingApplicant ? updatedApplicant : app
          )
        );
        setEditingApplicant(null);
      })
      .catch((err) => console.error("Error updating:", err));
  };

  const pendingApplicants = applicants.filter((app) => app.status === "pending");
  const acceptedApplicants = applicants.filter((app) => app.status === "accepted");

  return (
    <div className="dashboard">
      <header className="navbar">
        <img src="/images/lifewood-logo.png" alt="Lifewood Logo" className="logo" />
        <nav>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        <section className="table-container">
          <h2>Pending Applications ({pendingApplicants.length})</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplicants.map((app) => (
                <tr key={app._id}>
                  <td>{app.firstName} {app.lastName}</td>
                  <td>{app.email}</td>
                  <td>{app.project}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleAccept(app._id)}>Accept</button>
                    <button className="btn btn-danger" onClick={() => handleDecline(app._id)}>Decline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="table-container">
          <h2>Accepted Applicants ({acceptedApplicants.length})</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Age</th>
                <th>Degree</th>
                <th>Email</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {acceptedApplicants.map((app) => (
                <tr key={app._id}>
                  <td>{app.firstName} {app.lastName}</td>
                  <td>{app.age}</td>
                  <td>{app.degree}</td>
                  <td>{app.email}</td>
                  <td>{app.project}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(app)}>Edit</button>
                    <button className="btn" onClick={() => handleDecline(app._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {editingApplicant && (
        <div className="modal-overlay" onClick={() => setEditingApplicant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setEditingApplicant(null)}>
              &times;
            </button>
            <h3>Edit Applicant</h3>
            <form onSubmit={handleUpdate} className="edit-form">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} />
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="project" value={formData.project} onChange={handleChange} required />
              <button type="submit" className="btn">Update</button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2024 Lifewood Training Program. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
