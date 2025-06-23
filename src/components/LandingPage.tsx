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
          <Link to="/signup" className="landing-nav-btn primary bg-lobsterRed text-weatheredWhite hover:bg-seafoam hover:text-maineBlue transition-colors">Sign Up</Link>
        </div>
      </nav>
      <main className="landing-main flex-1 flex flex-col items-center justify-center px-4">
        {/* HERO SECTION */}
        <section className="w-full max-w-3xl mx-auto text-center mt-20 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-maineBlue mb-4 font-retro leading-tight">
            Your Kitchen. <span className="text-lobsterRed">Superpowered.</span>
          </h1>
          <p className="text-xl md:text-2xl text-navy font-sans mb-8">
            PorkChop is your AI cooking sidekick—helping you plan, shop, and cook smarter every day. Discover recipes, conquer weekly challenges, and track your progress, all in one place.
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-navy">No clutter. No ads. Cancel anytime.</span>
            <InstallPWAButton />
          </div>
        </section>

        {/* HOW IT WORKS / WHY PORKCHOP */}
        <section className="w-full max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-weatheredWhite rounded-2xl shadow-lg border border-seafoam p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🍳</span>
            <h2 className="text-lg font-bold text-maineBlue mb-2 font-retro">Cook With Confidence</h2>
            <p className="text-navy font-sans text-center">Step-by-step interactive cooking mode, smart ingredient tracking, and instant answers from Chef Freddie.</p>
          </div>
          <div className="bg-weatheredWhite rounded-2xl shadow-lg border border-seafoam p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🛒</span>
            <h2 className="text-lg font-bold text-maineBlue mb-2 font-retro">Shop & Plan Smarter</h2>
            <p className="text-navy font-sans text-center">Personalized shopping lists, pantry scanning, and meal planning that fits your real life and real kitchen.</p>
          </div>
          <div className="bg-weatheredWhite rounded-2xl shadow-lg border border-seafoam p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏆</span>
            <h2 className="text-lg font-bold text-maineBlue mb-2 font-retro">Level Up & Have Fun</h2>
            <p className="text-navy font-sans text-center">Weekly challenges, XP, badges, and a growing cookbook. Cooking is a game—get rewarded for learning and trying new things.</p>
          </div>
        </section>

        {/* APP HIGHLIGHT SECTION */}
        <section className="max-w-3xl mx-auto mb-12 px-6 py-8 bg-weatheredWhite rounded-2xl shadow-lg border-2 border-seafoam text-center">
          <h2 className="text-2xl font-retro text-lobsterRed font-bold mb-3">Why PorkChop?</h2>
          <p className="text-navy font-sans mb-2">
            Tired of endless recipe lists and generic cooking apps? PorkChop is built for real home cooks who want to learn, experiment, and actually enjoy the process. No more guessing what’s for dinner—just open your digital kitchen and get inspired.
          </p>
          <p className="text-navy font-sans">
            <span className="font-bold text-maineBlue">Secure, private, and ad-free.</span> Your data stays yours. Always.
          </p>
        </section>
        <section className="landing-features flex flex-col md:flex-row flex-wrap justify-center gap-8 mt-6">
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Weekly Challenges</h2>
    <p className="text-navy font-sans">Test your skills with unique AI-generated cooking challenges every week. Earn XP and badges as you go!</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Recipe Discovery</h2>
    <p className="text-navy font-sans">Get personalized recipe ideas based on your kitchen ingredients and preferences.</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">My Kitchen</h2>
    <p className="text-navy font-sans">Track what you have, reduce waste, and get suggestions for what to cook next.</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Cookbook & XP</h2>
    <p className="text-navy font-sans">Save your favorite recipes, level up, and unlock achievements as you cook more!</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Smart Shopping Lists</h2>
    <p className="text-navy font-sans">Automatically generate and manage grocery lists based on your planned recipes and kitchen inventory.</p>
  </div>
  <div className="feature-card bg-weatheredWhite rounded-2xl shadow-lg p-7 w-full sm:w-72 border border-seafoam">
    <h2 className="text-xl font-bold text-maineBlue mb-2 font-retro">Step-by-Step Cooking Mode</h2>
    <p className="text-navy font-sans">Follow interactive, distraction-free instructions while you cook, with voice and visual guidance.</p>
  </div>
        </section>
      {/* Chef Freddie Objections & Answers Section */}
      <section className="max-w-3xl mx-auto mt-12 mb-8 px-6 py-8 bg-weatheredWhite rounded-2xl shadow-lg border-2 border-seafoam">
        <h2 className="text-2xl font-retro text-lobsterRed font-bold mb-6 text-center">Chef Freddie Answers Your Questions</h2>
        <div className="space-y-6">
          <div>
            <div className="font-bold text-maineBlue">Why wouldn’t I just use ChatGPT or Google for recipes?</div>
            <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
              Chef Freddie: Those tools can give you recipes, but I’m here to help you actually cook them. Whether you’re new to the kitchen or just want to get better, I guide you step-by-step, answer your questions, and help you learn as you go. Recipes are just the start—real cooking is about support!
            </div>
          </div>
          <div>
            <div className="font-bold text-maineBlue">What makes PorkChop different from other cooking apps?</div>
            <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
              Chef Freddie: Most apps give you a list of recipes and send you on your way. PorkChop is your kitchen companion! I help you build skills, tackle new challenges, and turn recipes into real meals—no matter your experience level.
            </div>
          </div>
          <div>
            <div className="font-bold text-maineBlue">How much does PorkChop cost?</div>
            <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
              Chef Freddie: PorkChop is $10.99/month. One simple price, no ads, no hidden fees, and you can cancel anytime. There is no free trial.
            </div>
          </div>
          <div>
            <div className="font-bold text-maineBlue">How does Chef Freddie know what I have at home?</div>
            <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
              Chef Freddie: When you scan your pantry or add ingredients, I remember them for you. That way, I can suggest recipes you can actually make—and I’m here to walk you through every step, so you’re never left guessing.
            </div>
          </div>
          <div>
            <div className="font-bold text-maineBlue">Is my data safe with PorkChop?</div>
            <div className="text-navy font-sans mt-1 pl-2 border-l-4 border-seafoam italic">
              Chef Freddie: Absolutely! Your privacy and security are top priorities. We never sell your data, and you control what you share. My job is to help you cook and learn, not to share your kitchen secrets!
            </div>
          </div>
        </div>
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
