import React from 'react';
import Link from 'next/link';
import '../home.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-custom">
        <span className="hero-badge-top">🚀 AI-powered municipal intelligence</span>
        <h1>AI that sees and solves city problems</h1>
        <p>
          CiviVision is a world-class civic portal enabling citizens to report sanitation, roads, and water issues. 
          Our computer vision AI automatically detects, prioritizes, and routes dispatches to ward crews.
        </p>

        <div className="hero-buttons-custom">
          <Link href="/select-role" className="btn-custom primary-custom">Launch Portal</Link>
          <Link href="/how-to-use" className="btn-custom outline-custom">See How It Works</Link>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>12,400+</h3>
            <p>Verified Resolutions</p>
          </div>
          <div className="metric-card">
            <h3>4.2 Hrs</h3>
            <p>Avg Response SLA</p>
          </div>
          <div className="metric-card">
            <h3>98.4%</h3>
            <p>Sanitation Dispatch Accuracy</p>
          </div>
          <div className="metric-card">
            <h3>18</h3>
            <p>Active GMC Wards</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-custom" id="why">
        <h2>Why CiviVision?</h2>
        <p className="section-subtitle">Empowering local municipal governance through next-generation AI automation</p>

        <div className="feature-grid-custom">
          <div className="card-custom">
            <div className="feature-icon">📸</div>
            <h3>Computer Vision Diagnostics</h3>
            <p>Auto-categorizes uploaded photographs of waste piles, road cave-ins, and leaks, determining size and impact severity instantly.</p>
          </div>

          <div className="card-custom">
            <div className="feature-icon">⚡</div>
            <h3>Smart Priority Dispatches</h3>
            <p>Critical civic hazards are automatically flagged for immediate 2-hour rescue dispatches, optimizing ward crew resources.</p>
          </div>

          <div className="card-custom">
            <div className="feature-icon">🗺️</div>
            <h3>Real-time GPS Heatmaps</h3>
            <p>Generates active sanitation and structural hazard map overlays, aiding urban planners in making proactive improvements.</p>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section className="workflow-section">
        <h2>How CiviVision Resolves Problems</h2>
        <p className="section-subtitle">A seamless process from report to verification</p>

        <div className="workflow-timeline">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <h4>Citizen Reports</h4>
            <p>Snap a photo of the issue. Location is pinned automatically using GPS geotags.</p>
          </div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <h4>AI Categorizes</h4>
            <p>Our model runs classification checks, flags emergency risks, and routes details.</p>
          </div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <h4>Crew Dispatched</h4>
            <p>Nearest GMC Ward sanitation or engineering crews are dispatched with instructions.</p>
          </div>
          <div className="workflow-step">
            <div className="step-number">4</div>
            <h4>Closed & Verified</h4>
            <p>Citizens receive verification updates. Status is marked resolved transparently.</p>
          </div>
        </div>
      </section>

      {/* Portal Call-to-actions Section */}
      <section className="cta-portals-section">
        <h2>Access Civic Services</h2>
        <p className="section-subtitle">Direct shortcuts to active portal features</p>

        <div className="cta-grid">
          <div className="cta-card">
            <h4>Citizen Grievances</h4>
            <p>Submit garbage pileups, streetlight outages, or sewer drainage issues to municipal inspectors.</p>
            <Link href="/user/login" className="cta-link">Report Issue →</Link>
          </div>
          <div className="cta-card">
            <h4>Toilet Tracker</h4>
            <p>Locate the closest Swachh public washroom with hygiene and user satisfaction scores.</p>
            <Link href="/user/toilet-tracker" className="cta-link">Find Toilet →</Link>
          </div>
          <div className="cta-card">
            <h4>Municipal Advisories</h4>
            <p>View weather warnings, sanitation drives, and water maintenance shutdown calendars.</p>
            <Link href="/user/alerts" className="cta-link">View Alerts →</Link>
          </div>
          <div className="cta-card">
            <h4>System FAQs</h4>
            <p>Have questions about AI weights, photo verification, or SLA response timelines?</p>
            <Link href="/faqs" className="cta-link">Browse FAQs →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
