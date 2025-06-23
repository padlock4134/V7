import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import logo from "../images/logo.png";
import TermsModal from './TermsModal';
import { useTermsModal } from './useTermsModal';
import InstallPWAButton from "./InstallPWAButton";

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
        {/* HERO SECTION */}
        <section className="w-full max-w-3xl mx-auto text-center mt-20 mb-12">
  <h1 className="text-5xl md:text-6xl font-bold text-maineBlue mb-4 font-retro leading-tight">
    Porkchop: The Digitized Commissary Kitchen
  </h1>
  <p className="text-xl md:text-2xl text-seafoam font-sans mb-8">
    Inspired by Grandpa Fred’s legacy, Porkchop brings the spirit of the classic commissary kitchen—resourceful, communal, and creative—into the digital age. Plan, prep, and plate with what you have, and discover where to shop to support local.
  </p>

  <div className="flex flex-col items-center gap-2 mt-4">
    <span className="text-sm text-navy">
      You can install PorkChop as an app on your phone or tablet—works on both Android and iOS!
    </span>
    <span className="text-xs text-navy">
      On iPhone/iPad: Tap the Share icon and choose "Add to Home Screen". On Android: Tap "Install PorkChop App" below.
    </span>
    <InstallPWAButton />
  </div>
</section>

        {/* HOW IT WORKS / WHY PORKCHOP */}
        <section className="w-full max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
  <div className="bg-weatheredWhite rounded-2xl shadow-lg border border-seafoam p-6 flex flex-col items-center">
    <span className="text-3xl mb-2">🥞</span>
    <h2 className="text-lg font-bold text-maineBlue mb-2 font-retro">Prep Your Pantry</h2>
    <p className="text-navy font-sans text-center">Take stock of what you have—just like Grandpa Fred did every Saturday morning before pancakes. Resourcefulness starts here.</p>
  </div>
  <div className="bg-weatheredWhite rounded-2xl shadow-lg border border-seafoam p-6 flex flex-col items-center">
    <span className="text-3xl mb-2">🛍️</span>
    <h2 className="text-lg font-bold text-maineBlue mb-2 font-retro">Find What You Need</h2>
    <p className="text-navy font-sans text-center">Discover where to shop to fill in the gaps, prioritizing local and specialty shops. Support your community while filling your plate.</p>
  </div>
  <div className="bg-weatheredWhite rounded-2xl shadow-lg border border-seafoam p-6 flex flex-col items-center">
    <span className="text-3xl mb-2">🍽️</span>
    <h2 className="text-lg font-bold text-maineBlue mb-2 font-retro">Plan & Plate</h2>
    <p className="text-navy font-sans text-center">Use professional tools to plan meals, organize recipes, and bring it all together at your own table—honoring Grandpa Fred’s legacy of mentorship and good food.</p>
  </div>
</section>

        {/* APP HIGHLIGHT SECTION */}
        <section className="max-w-3xl mx-auto mb-12 px-6 py-8 bg-weatheredWhite rounded-2xl shadow-lg border-2 border-seafoam text-center">
  <h2 className="text-2xl font-retro text-lobsterRed font-bold mb-3">Why Porkchop?</h2>
  <p className="text-navy font-sans mb-2">
    Porkchop isn’t just another cooking app—it’s a digitized commissary kitchen inspired by Grandpa Fred. Here, resourcefulness, community, and creativity come together so you can make the most of every meal. We’re here to help you learn new skills, build confidence, and grow as a home cook. And as you cook, plan, and grow, you’ll earn badges and achievements along the way.
  </p>
  <p className="text-navy font-sans">
    <span className="font-bold text-maineBlue">Secure, private, and ad-free.</span> Your data stays yours. Always.
  </p>
</section>
        <section className="landing-features flex flex-col md:flex-row flex-wrap justify-center gap-8 mt-6">
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Pantry Station</h2>
    <p className="text-navy font-sans">Inventory what you have, reduce waste, and let Porkchop suggest how to make the most of it—just like Grandpa Fred did every Saturday morning.</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Market Station</h2>
    <p className="text-navy font-sans">Find local and specialty shops to fill in the gaps, support your community, and discover new favorites.</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Recipe Station</h2>
    <p className="text-navy font-sans">Organize and discover meals that fit your pantry and your style. Grandpa Fred believed every ingredient could find its purpose.</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Planning Station</h2>
    <p className="text-navy font-sans">Build meal plans and shopping lists in one place, and bring it all together at your own table. Track your progress, learn new techniques, and earn badges as you grow your kitchen skills!</p>
  </div>
  
  
        </section>
      {/* Objections & Answers Section */}
<section className="max-w-3xl mx-auto mt-12 mb-8 px-6 py-8 bg-weatheredWhite rounded-2xl shadow-lg border-2 border-seafoam">
  <h2 className="text-2xl font-retro text-lobsterRed font-bold mb-6 text-center">You Might Be Wondering…</h2>
  <div className="space-y-6">
    <div>
      <div className="font-bold text-maineBlue">Isn’t this just another recipe app?</div>
      <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
        Nope! Porkchop is a digitized commissary kitchen inspired by Grandpa Fred. It’s about making the most of what you have, discovering where to shop locally, and connecting with a food-loving community.
      </div>
    </div>
    <div>
      <div className="font-bold text-maineBlue">Will this work for me if I don’t live near lots of markets?</div>
      <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
        Absolutely. Porkchop helps you find the best options wherever you are, and guides you to use what’s already in your fridge or pantry.
      </div>
    </div>
    <div>
      <div className="font-bold text-maineBlue">Do I have to be a chef?</div>
      <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
        Porkchop is for everyone, from beginners to pros. Grandpa Fred believed good food is for all, and our platform guides you every step of the way.
      </div>
    </div>
    <div>
      <div className="font-bold text-maineBlue">Is this expensive?</div>
      <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
        Not at all. Porkchop is about resourcefulness and creativity. Start with what you have, fill in the gaps locally, and enjoy real, affordable meals.
      </div>
    </div>
  </div>
</section>
{/* Grandpa Fred Story Section */}
<section className="max-w-3xl mx-auto mb-12 px-6 py-8 bg-seafoam/30 rounded-2xl shadow-lg border-2 border-seafoam text-center">
  <h2 className="text-2xl font-retro text-maineBlue font-bold mb-3">Inspired by Grandpa Fred</h2>
  <p className="text-navy font-sans mb-2">
    Every Saturday morning, Grandpa Fred would gather all the grandkids for a big pancake breakfast. The kitchen was always alive with laughter, the smell of fresh pancakes, and the feeling that everyone belonged. After breakfast, I’d head out for a round of golf—always with a full belly and a heart full of Grandpa’s wisdom.
  </p>
  <p className="text-navy font-sans">
    Those mornings weren’t just about food—they were about mentorship, family, and the simple joy of sharing a meal together. Porkchop is our way of honoring Grandpa Fred, letting everyone experience a piece of his kitchen, no matter where they are.
  </p>
  <p className="text-navy font-sans mt-4">
    <span className="font-bold text-maineBlue">Welcome to Porkchop:</span> the digitized commissary kitchen inspired by Grandpa Fred’s legacy of resourcefulness, community, and love.
  </p>
</section>
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
