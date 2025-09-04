import React, { useState } from "react";
import "../../assets/Homepage.css";
import ApplicationForm from "./ApplicationForm"; 

const Homepage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="homepage">
      {/* Navbar */}
      <header className="navbar">
        <img src="/images/lifewood-logo.png" alt="Lifewood Logo" className="logo" />
        <nav>
          <a href="#">Home</a>
          <a href="/about-us">About Us</a>
          <a href="/login" className="login-button">Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content">
  <h1 className="animated-title">
  <span className="title-life">Life</span>
  <span className="title-wood">wood</span>
</h1>
          {/* UPDATED: Reverted to the original quote */}
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