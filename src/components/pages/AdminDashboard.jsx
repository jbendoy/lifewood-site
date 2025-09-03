import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/Dashboard.css";
import axios from "axios";

const AdminDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [addingApplicant, setAddingApplicant] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    degree: "",
    experience: "",
    email: "",
    project: "",
    resume: null,
  });
  const [notification, setNotification] = useState({ msg: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const projects = [
    "AI Data Extraction",
    "Machine Learning Enablement",
    "Project C",
    "Project D",
    "Web Development Initiative",
    "Mobile App Prototype",
    "Cloud Migration Project",
    "Cybersecurity Enhancement",
    "Data Analytics Dashboard",
    "IoT Smart Device Integration",
  ];

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/login");
    } else {
      fetchApplicants();
    }
  }, [navigate]);

  const fetchApplicants = () => {
    axios
      .get("http://localhost:5000/api/applications")
      .then((res) => setApplicants(res.data))
      .catch((err) => console.error("Error fetching applicants:", err));
  };

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification({ msg: "", type: "" }), 3000);
  };

  const handleAccept = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/applications/${id}/accept`);
      const updatedApplicant = res.data.application;
      setApplicants((prev) => prev.map((app) => (app._id === id ? updatedApplicant : app)));
      showNotification("Applicant accepted and email sent!");
    } catch (err) {
      console.error(err);
      showNotification("Error accepting applicant", "error");
    }
  };

  const handleDecline = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/applications/${id}/decline`);
      const updatedApplicant = res.data.application;
      setApplicants((prev) => prev.map((app) => (app._id === id ? updatedApplicant : app)));
      showNotification("Applicant declined and email sent!", "error");
    } catch (err) {
      console.error(err);
      showNotification("Error declining applicant", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`);
      setApplicants((prev) => prev.filter((app) => app._id !== id));
      showNotification("Applicant deleted successfully!", "error");
    } catch (err) {
      console.error(err);
      showNotification("Error deleting applicant", "error");
    }
  };

  const handleAddApplicant = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("age", formData.age);
      data.append("degree", formData.degree);
      data.append("experience", formData.experience);
      data.append("email", formData.email);
      data.append("project", formData.project);
      if (formData.resume) data.append("resume", formData.resume);

      const res = await axios.post(
        "http://localhost:5000/api/applications",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setApplicants([res.data.application, ...applicants]);
      showNotification(res.data.msg || "Applicant added successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        degree: "",
        experience: "",
        email: "",
        project: "",
        resume: null,
      });
      setAddingApplicant(false);
    } catch (err) {
      console.error(err);
      showNotification("Error adding user", "error");
    }
  };

  const handleEdit = (applicant) => {
    setEditingApplicant(applicant._id);
    setFormData({
      ...applicant,
      resume: null,
    });
    setAddingApplicant(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("age", formData.age);
      data.append("degree", formData.degree);
      data.append("experience", formData.experience);
      data.append("email", formData.email);
      data.append("project", formData.project);
      if (formData.resume) data.append("resume", formData.resume);

      const res = await axios.put(
        `http://localhost:5000/api/applications/${editingApplicant}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedApplicant = res.data;
      setApplicants((prev) =>
        prev.map((app) => (app._id === editingApplicant ? updatedApplicant : app))
      );
      setEditingApplicant(null);
      setAddingApplicant(false);
      showNotification("Applicant updated successfully!");
    } catch (err) {
      console.error(err);
      showNotification("Error updating applicant", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const filteredApplicants = applicants.filter((app) => {
    const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const pendingApplicants = filteredApplicants.filter((app) => app.status === "pending");
  const acceptedApplicants = filteredApplicants.filter((app) => app.status === "accepted");

  return (
    <div className="dashboard">
{/* Navbar */}
<header className="navbar">
  <img src="/images/lifewood-logo.png" alt="Lifewood Logo" className="logo" />
  <nav>
    <a href="/">Home</a>
    <a href="/about-us">About Us</a>
 
    <button onClick={handleLogout} className="logout-btn">Logout</button>
  </nav>
</header>


      {/* Upper-center Notification */}
      {notification.msg && (
        <div className={`popup-notification ${notification.type}`}>
          <p>{notification.msg}</p>
        </div>
      )}

      <main className="dashboard-content">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by applicant name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ width: "400px" }}
        />

        {/* Pending Table */}
        <section className="table-container">
          <button className="btn add-user-btn" onClick={() => setAddingApplicant(true)}>+ Add Applicant</button>
          <h2>Pending Applications ({pendingApplicants.length})</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Project</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplicants.map((app) => (
                <tr key={app._id}>
                  <td>{app.firstName}</td>
                  <td>{app.lastName}</td>
                  <td>{app.email}</td>
                  <td>{app.project}</td>
                  <td>{app.resume ? <a href={`http://localhost:5000/uploads/${app.resume}`} target="_blank" rel="noreferrer">View Resume</a> : "N/A"}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleAccept(app._id)}>Accept</button>
                    <button className="btn btn-danger" onClick={() => handleDecline(app._id)}>Decline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Accepted Table */}
        <section className="table-container">
          <h2>Accepted Applications ({acceptedApplicants.length})</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Degree</th>
                <th>Email</th>
                <th>Project</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {acceptedApplicants.map((app) => (
                <tr key={app._id}>
                  <td>{app.firstName}</td>
                  <td>{app.lastName}</td>
                  <td>{app.age}</td>
                  <td>{app.degree}</td>
                  <td>{app.email}</td>
                  <td>{app.project}</td>
                  <td>{app.resume ? <a href={`http://localhost:5000/uploads/${app.resume}`} target="_blank" rel="noreferrer">View Resume</a> : "N/A"}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(app)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(app._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Add/Edit Modal */}
      {(addingApplicant || editingApplicant) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-button"
              onClick={() => { setAddingApplicant(false); setEditingApplicant(null); }}
            >
              &times;
            </button>
            <h3>{editingApplicant ? "Edit Applicant" : "Add New Applicant"}</h3>
<form
  onSubmit={editingApplicant ? handleUpdate : handleAddApplicant}
  className="application-form"
>
  <input
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
    placeholder="First Name"
    required
  />
  <input
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
    placeholder="Last Name"
    required
  />
  <input
    type="number"
    name="age"
    value={formData.age}
    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
    placeholder="Age"
    required
  />
  <input
    type="text"
    name="degree"
    value={formData.degree}
    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
    placeholder="Degree"
  />
  <input
    type="text"
    name="experience"
    value={formData.experience}
    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
    placeholder="Experience"
  />
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="Email"
    required
  />
  <select
    name="project"
    value={formData.project}
    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
    required
  >
    <option value="">Select Project</option>
    {projects.map((proj, idx) => (
      <option key={idx} value={proj}>
        {proj}
      </option>
    ))}
  </select>

  {/* File upload styled as a button */}
<div className="resume-upload-field">
  <label htmlFor="resume">Upload Resume (PDF only):</label>
  <input
    id="resume"
    type="file"
    name="resume"
    accept=".pdf"
    onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
    required={!editingApplicant}
  />
</div>


  <button type="submit" className="btn">
    {editingApplicant ? "Update Applicant" : "Add Applicant"}
  </button>
</form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Lifewood. All rights reserved.</p>
          <nav>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
