import React from 'react';
import Link from 'next/link';
import '../home.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-custom">
        <h1>AI that sees and solves city problems</h1>
        <p>
          An AI-powered civic intelligence platform that helps cities
          detect, prioritize, and resolve urban issues faster and smarter
          through citizen participation.
        </p>

        <div className="hero-buttons-custom">
          <Link href="/select-role" className="btn-custom primary-custom">Get Started</Link>
          <a href="#how" className="btn-custom outline-custom">How It Works</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-custom" id="how">
        <h2>Why CiviVision?</h2>

        <div className="feature-grid-custom">
          <div className="card-custom">
            <h3>📸 AI Issue Detection</h3>
            <p>Automatically identifies civic issues from images.</p>
          </div>

          <div className="card-custom">
            <h3>⚡ Smart Prioritization</h3>
            <p>AI assigns urgency so critical problems are fixed first.</p>
          </div>

          <div className="card-custom">
            <h3>🗺️ Geo Insights</h3>
            <p>Heatmaps help authorities plan and act proactively.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
