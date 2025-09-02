import React, { useState } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);

  const projects = ["AI Data Extraction", "Machine Learning Enablement", "Project C", "Project D"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/applications", formData);
      alert(res.data.msg);
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        degree: "",
        experience: "",
        email: "",
        project: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Make sure the form returns JSX!
  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <h2>Application Form</h2>
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

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default ApplicationForm;
