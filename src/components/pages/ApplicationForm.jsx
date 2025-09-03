import React, { useState } from "react";
import axios from "axios";
import "../../assets/ApplicationForm.css"; // Make sure this CSS file exists

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    degree: "",
    experience: "",
    email: "",
    project: "",
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      showNotification("Please upload your resume (PDF).", "error");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("resume", resume);

      const res = await axios.post("http://localhost:5000/api/applications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotification(res.data.msg || "Application submitted. Please wait for approval.", "success");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        degree: "",
        experience: "",
        email: "",
        project: "",
      });
      setResume(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      showNotification("Error submitting application", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Notification Popup */}
      {notification.message && (
        <div className={`notification-popup ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form className="application-form" onSubmit={handleSubmit}>
        <h2>Join our team!</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={formData.degree}
          onChange={handleChange}
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
        >
          <option value="">Select a Project</option>
          {projects.map((proj, i) => (
            <option key={i} value={proj}>{proj}</option>
          ))}
        </select>

        <label>Upload Resume (PDF only):</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </>
  );
};

export default ApplicationForm;
