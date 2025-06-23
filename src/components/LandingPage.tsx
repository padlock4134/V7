import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import logo from "../images/logo.png";
import TermsModal from './TermsModal';
import { useTermsModal } from './useTermsModal';
import InstallPWAButton from "./InstallPWAButton";

import FlippableCookbook from "./FlippableCookbook";
// Placeholder SVG for Freddie (replace with your vector when ready)
const FreddieSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" aria-label="Grandpa Freddie" style={{marginBottom: '1rem'}}>
    <circle cx="40" cy="40" r="38" fill="#f9fafb" stroke="#63ace5" strokeWidth="4"/>
    <ellipse cx="40" cy="50" rx="22" ry="18" fill="#e94e3c" opacity="0.13"/>
    <circle cx="40" cy="38" r="20" fill="#f5e9da" stroke="#2a4d69" strokeWidth="2"/>
    <ellipse cx="40" cy="44" rx="12" ry="8" fill="#fff"/>
    <circle cx="32" cy="38" r="2.5" fill="#2a4d69"/>
    <circle cx="48" cy="38" r="2.5" fill="#2a4d69"/>
    <path d="M34 48 Q40 54 46 48" stroke="#2a4d69" strokeWidth="2" fill="none"/>
  </svg>
);

const RecipeCard = ({ title, icon, children }: { title: string, icon?: string, children: React.ReactNode }) => (
  <section className="recipe-card bg-weatheredWhite rounded-2xl shadow-lg border-2 border-seafoam mb-8 p-7 max-w-xl mx-auto">
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-2xl">{icon}</span>}
      <h2 className="text-xl font-retro font-bold text-maineBlue">{title}</h2>
    </div>
    <div className="recipe-content text-navy font-sans">{children}</div>
  </section>
);

const LandingPage: React.FC = () => {
  const { modalOpen, setModalOpen, termsContent } = useTermsModal();
  return (
    <div className="landing-root bg-sand font-retro min-h-screen flex flex-col">
      <nav className="landing-nav bg-weatheredWhite/90 shadow-md rounded-b-2xl flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="PorkChop Logo" className="h-12 w-12 object-contain rounded-full border-2 border-seafoam bg-white" />
          <span className="text-3xl font-bold text-lobsterRed tracking-wide font-retro">PorkChop</span>
        </div>
        <div className="flex gap-3">
          <Link to="/signin" className="landing-nav-btn hover:bg-seafoam hover:text-maineBlue transition-colors">Log In</Link>
          <Link
  to="/signup"
  className="landing-nav-btn primary transition-colors"
  style={{ backgroundColor: '#e94e3c', color: '#f9fafb', fontWeight: 700 }}
  onMouseOver={e => { e.currentTarget.style.backgroundColor = '#63ace5'; e.currentTarget.style.color = '#2a4d69'; }}
  onFocus={e => { e.currentTarget.style.backgroundColor = '#63ace5'; e.currentTarget.style.color = '#2a4d69'; }}
  onMouseOut={e => { e.currentTarget.style.backgroundColor = '#e94e3c'; e.currentTarget.style.color = '#f9fafb'; }}
  onBlur={e => { e.currentTarget.style.backgroundColor = '#e94e3c'; e.currentTarget.style.color = '#f9fafb'; }}
>
  Sign Up
</Link>
        </div>
      </nav>
      <main className="landing-main flex-1 flex flex-col items-center justify-center px-4">
        {/* Cookbook Cover */}
        <section className="w-full max-w-2xl mx-auto text-center mt-16 mb-10">
          <FreddieSVG />
          <h1 className="text-5xl md:text-6xl font-bold text-maineBlue mb-2 font-retro leading-tight">Porkchop: The Digitized Commissary Kitchen</h1>
          <p className="text-xl text-seafoam font-sans mb-2">A Family Cookbook for the Digital Age</p>
          <p className="text-navy font-sans mb-6">Inspired by Grandpa Fred’s legacy, Porkchop brings the spirit of the classic commissary kitchen—resourceful, communal, and creative—into the digital age.</p>
          <div className="flex flex-col items-center gap-2 mt-2">
            <span className="text-sm text-navy">
              You can install PorkChop as an app on your phone or tablet—works on both Android and iOS!
            </span>
            <span className="text-xs text-navy">
              On iPhone/iPad: Tap the Share icon and choose "Add to Home Screen". On Android: Tap "Install PorkChop App" below.
            </span>
            <InstallPWAButton />
          </div>
        </section>

        {/* Table of Contents */}
        <section className="table-of-contents w-full max-w-xl mx-auto mb-10 bg-weatheredWhite/70 rounded-xl shadow p-4 flex flex-wrap justify-center gap-4 border border-seafoam">
          <a href="#pantry" className="toc-link text-maineBlue font-retro">Prep Your Pantry</a>
          <a href="#market" className="toc-link text-maineBlue font-retro">Find What You Need</a>
          <a href="#plan" className="toc-link text-maineBlue font-retro">Plan & Plate</a>
          <a href="#grow" className="toc-link text-maineBlue font-retro">Grow & Learn</a>
          <a href="#freddie" className="toc-link text-maineBlue font-retro">About Freddie</a>
          <a href="#faq" className="toc-link text-maineBlue font-retro">Kitchen Tips</a>
        </section>

        {/* Flippable Cookbook */}
        <FlippableCookbook />
      </main>
      <footer className="landing-footer bg-weatheredWhite/90 rounded-t-2xl text-center py-4 mt-12 text-navy font-sans text-base shadow-inner">
        <span> {new Date().getFullYear()} PorkChop. All rights reserved. |{' '}
          <span className="text-xs text-navy underline cursor-pointer hover:text-lobsterRed" onClick={() => setModalOpen(true)}>Terms of Service & Privacy Policy</span>
        </span>
        <TermsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} termsContent={termsContent} />
      </footer>
    </div>
  );
};

export default LandingPage;
