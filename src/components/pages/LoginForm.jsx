import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/Login.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (res.status === 200) {
        // Login successful
        localStorage.setItem("isAuthenticated", "true");
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <img src="/images/lifewood-logo.png" alt="Lifewood Logo" className="logo" />
      <h2>Admin Login</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-btn">Login</button>
      </form>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default LoginForm;
