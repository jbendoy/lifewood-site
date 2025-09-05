import React, { useState } from "react";
import "../../assets/Homepage.css";
import ApplicationForm from "./ApplicationForm"; 
import { FaFacebookF, FaLinkedinIn , FaYoutube } from "react-icons/fa";

const Homepage = () => {
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="homepage">
      {/* Navbar */}
      <header className="navbar">
        <img src="/images/lifewood-logo.png" alt="Lifewood Logo" className="logo" />

        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="/about-us">About Us</a>
          <a href="/login" className="login-button">Login</a>
        </nav>

        {/* Hamburger for mobile */}
        <div
          className={`hamburger ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* Sidebar for mobile */}
      <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <a href="#" onClick={() => setSidebarOpen(false)}>Home</a>
        <a href="/about-us" onClick={() => setSidebarOpen(false)}>About Us</a>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content">
          <h1 className="animated-title">
            <span className="title-life">Life</span>
            <span className="title-wood">wood</span>
          </h1>
          <p className="interactive-quote">
            Empowering minds, shaping futures.
          </p>
          <button onClick={() => setShowForm(true)}>Apply Now!</button>
        </div>
      </main>

      {/* Popup Application Form */}
      {showForm && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button
              onClick={() => setShowForm(false)}
              style={{ float: "right", background: "black", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
            >
              X
            </button>
            <ApplicationForm />
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h2>Mission</h2>
          <p>To develop and deploy cutting edge Al technologies that solve real-world problems, empower communities, and advance sustainable practices. We are committed to fostering a culture of innovation, collaborating with stakeholders across sectors, and making a meaningful impact on society and the environment.</p>
        </div>
        <div className="feature-card">
          <h2>Design Team Value</h2>
          <p>Design is not just about how things look. It's about how they make you feel, how they solve problems, and how they inspire connection and innovation.</p>
        </div>
        <div className="feature-card">
          <h2>Vision</h2>
          <p>To be the global champion in Al data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2025 Lifewood. All rights reserved.</p>
          <div className="social-links">
            <a href="https://www.facebook.com/LifewoodPH/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://ph.linkedin.com/company/lifewood-data-technology-ltd." target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://www.youtube.com/@LifewoodDataTechnology" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Modal styles
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
  maxHeight: "90%",
  overflowY: "auto",
};

export default Homepage;
