import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

// You can further style this in LandingPage.css to match your theme
const LandingPage: React.FC = () => {
  return (
    <div className="landing-root">
      <nav className="landing-nav">
        <span className="landing-logo">V7</span>
        <div>
          <Link to="/signin" className="landing-nav-btn">Log In</Link>
          <Link to="/signup" className="landing-nav-btn primary">Sign Up</Link>
        </div>
      </nav>
      <main className="landing-main">
        <div className="landing-hero">
          <h1>Level Up Your Cooking</h1>
          <p className="landing-tagline">
            Discover new recipes, conquer weekly challenges, and track your culinary journey—all powered by AI.
          </p>
          <div className="landing-cta">
            <Link to="/signup" className="landing-cta-btn primary">Get Started Free</Link>
            <Link to="/signin" className="landing-cta-btn">Log In</Link>
          </div>
        </div>
        <section className="landing-features">
          <div className="feature-card">
            <h2>Weekly Challenges</h2>
            <p>Test your skills with unique AI-generated cooking challenges every week. Earn XP and badges as you go!</p>
          </div>
          <div className="feature-card">
            <h2>Recipe Discovery</h2>
            <p>Get personalized recipe ideas based on your kitchen ingredients and preferences.</p>
          </div>
          <div className="feature-card">
            <h2>My Kitchen</h2>
            <p>Track what you have, reduce waste, and get suggestions for what to cook next.</p>
          </div>
          <div className="feature-card">
            <h2>Cookbook & XP</h2>
            <p>Save your favorite recipes, level up, and unlock achievements as you cook more!</p>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} V7 Cooking App. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
