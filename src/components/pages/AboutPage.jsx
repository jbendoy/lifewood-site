import React from 'react';
import "../../assets/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="page-container">
      {/* Navbar */}
      <header className="navbar">
        <img src="/images/lifewood-logo.png" alt="Lifewood Logo" className="logo" />
        <nav>
          <a href="/">Home</a>
          <a href="/about-us">About Us</a>
          <a href="/login" className="login-button">Login</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="about-main-content">
        <section className="about-hero-section">
          {/* Title */}
          <div className="title-container">
            <h1 className="main-heading">ALWAYS ON NEVER OFF</h1>
            <div className="title-divider"></div>
          </div>

          {/* First section (text left, image right) */}
          <div className="content-layout">
            <div className="text-column">
              <p>
                Lifewood is more than a company that processes data at speed for the world’s largest organizations. Beyond these capabilities, our true essence lies in how we define and communicate our identity—internally to our global teams and externally to clients, investors, and partners worldwide.
              </p>
              <p>
                Our strategic positioning emphasizes Lifewood as a bridge between ASEAN, China, and the world—building harmony, trust, and cooperation across borders, cultures, and industries. With global offices and advanced technology like AI and GPT, we connect diverse people and ideas to create new opportunities.
              </p>
            </div>

            <div className="media-column">
              <img src="/images/lifewood-about-us-image.png" alt="Lifewood Team and Work" />
            </div>
          </div>

          {/* Second section (image left, text right) */}
          <div className="content-layout alternate-layout">
            <div className="media-column">
              <img src="/images/lifewood-ai-vision.png" alt="Lifewood AI Vision" />
            </div>

            <div className="text-column">
              <p>
                Based in Malaysia, Lifewood serves as a super-bridge between China and the world, driving progress across Asia and beyond. Our data expertise helps address social and environmental challenges in Malaysia, Singapore, and the wider region.
              </p>
              <p>
                We also prioritize ESG values—shown in initiatives like our Pottya team in Bangladesh, empowering women and people with disabilities in workplaces where they’re often underrepresented.
              </p>
              <p>
                As we grow, our mission is to showcase Lifewood’s potential through innovation and communication—highlighting our capabilities while fostering positive change across every region we serve.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Lifewood. All rights reserved.</p>
          <nav>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
