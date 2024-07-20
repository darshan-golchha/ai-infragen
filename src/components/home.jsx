import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <header>
        <h1>InfraGen</h1>
        <p>Intelligent Infrastructure Design at Your Fingertips</p>
      </header>

      <main>
        <section className="intro">
          <h2>Design Your Perfect Infrastructure</h2>
          <p>
            Welcome to InfraArchitect AI, where we revolutionize the way you plan and design your IT infrastructure. 
            Our AI-powered system asks you targeted questions to understand your unique needs and challenges, 
            then generates a personalized infrastructure plan tailored just for you.
          </p>
        </section>

        <section className="features">
          <div className="feature">
            <i className="icon-questions"></i>
            <h3>Smart Questionnaire</h3>
            <p>Answer our intelligently crafted questions to help us understand your specific requirements.</p>
          </div>
          <div className="feature">
            <i className="icon-analysis"></i>
            <h3>In-Depth Analysis</h3>
            <p>Our AI analyzes your responses to identify the best solutions for your use cases and challenges.</p>
          </div>
          <div className="feature">
            <i className="icon-blueprint"></i>
            <h3>Custom Blueprint</h3>
            <p>Receive a detailed, personalized infrastructure plan based on industry best practices and your needs.</p>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to Build Your Ideal Infrastructure?</h2>
          <Link to="/form" className="cta-button">Get Started</Link>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Infragen. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;