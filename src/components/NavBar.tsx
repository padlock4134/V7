import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import TipOfTheDay from './TipOfTheDay';
import { LEVEL_TITLES_AND_ICONS, getXPProgress } from '../utils/leveling';
import { supabase } from '../api/supabaseClient';
import ChallengeOfTheWeek from './ChallengeOfTheWeek';
import TermsModal from './TermsModal';
import { useTermsModal } from './useTermsModal';

interface LevelProgress {
  title: string;
  level: number;
  icon: string;
  current: number;
  required: number;
  progressPercent: number;
}

const useLevelProgress = (): LevelProgress => {
  const [progress, setProgress] = useState<LevelProgress>({
    title: 'Novice',
    level: 1,
    icon: '⭐',
    current: 0,
    required: 100,
    progressPercent: 0,
  });

  useEffect(() => {
    const fetchXp = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_xp')
        .select('xp')
        .eq('user_id', user.id)
        .single();

      if (data?.xp == null) return;

      const { level, current, required } = getXPProgress(data.xp);
      const { title, icon } = LEVEL_TITLES_AND_ICONS[level - 1] || LEVEL_TITLES_AND_ICONS[0];
      const progressPercent = (current / required) * 100;

      setProgress({
        title,
        level,
        icon,
        current,
        required,
        progressPercent,
      });
    };

    fetchXp();
  }, []);

  return progress;
};

const LevelBadge = () => {
  const { title, level, icon, current, required, progressPercent } = useLevelProgress();
  return (
    <div className="flex flex-col items-center justify-center mr-2">
      <div
        className="flex items-center justify-center px-2 py-1 bg-seafoam text-maineBlue rounded-full shadow text-lg font-bold cursor-help"
        title={`${title} (Level ${level})\n${current} / ${required} XP to next level`}
        aria-label={`Level ${level}: ${title}`}
        style={{ minWidth: 40 }}
      >
        <span style={{ fontSize: '1.5rem', marginRight: 4 }}>{icon}</span>
        <span>{level}</span>
      </div>
      {/* WoW-style XP bar */}
      <div className="w-20 h-2 mt-1 bg-blue-900 rounded overflow-hidden border border-blue-300 shadow-inner" style={{ minWidth: 80 }}>
        <div
          className="h-full bg-gradient-to-r from-seafoam to-blue-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="text-xs text-seafoam mt-0.5" style={{ fontFamily: 'monospace' }}>{current} / {required} XP</span>
    </div>
  );
};

const LastBadge = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex items-center justify-center px-2 py-1 bg-seafoam text-maineBlue rounded-full shadow text-lg font-bold cursor-help"
        title="Last Badge Earned"
        aria-label="Last Badge Earned"
        style={{ minWidth: 40 }}
      >
        <span style={{ fontSize: '1.5rem' }}>🏆</span>
      </div>
    </div>
  );
};

const navItems = [
  { path: '/my-kitchen', label: 'My Kitchen' },
  { path: '/culinary-school', label: 'Culinary School' },
  { path: '/my-cookbook', label: 'My Cookbook' },
  { path: '/chefs-corner', label: 'Chefs Corner' },
  { path: '/profile', label: 'Profile' },
];

const NavBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { modalOpen, setModalOpen, termsContent } = useTermsModal();
  return (
    <>
      <nav className="navbar bg-maineBlue text-weatheredWhite w-full px-4 lg:px-8 py-3 shadow-md">
        <div className="max-w-2xl mx-auto relative">
          {/* Centered PorkChop text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tracking-wider font-retro">PorkChop</span>
          </div>

          {/* Left and right content */}
          <div className="flex items-center justify-between w-full">
            {/* Left side items */}
            <div className="flex items-center space-x-4">
              <img src="/porkchop-logo.png" alt="PorkChop" className="h-10 w-10" />
              <div className="flex items-center">
                <ChallengeOfTheWeek />
              </div>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Menu */}
              <div className="relative">
                <button 
                  type="button"
                  aria-label="Menu"
                  className="p-2 hover:bg-seafoam hover:text-maineBlue rounded transition-colors"
                  onClick={() => setIsMenuOpen(prev => !prev)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              
              {/* Menu Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 top-[100%] w-48 bg-maineBlue rounded-lg shadow-xl p-4 z-50 border border-seafoam">
                  <div className="flex flex-col space-y-4">
                    {navItems.map(({ path, label }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-lg font-retro py-2 px-3 rounded transition-colors hover:bg-seafoam hover:text-maineBlue flex items-center ${
                          location.pathname === path ? 'bg-weatheredWhite text-maineBlue font-bold' : ''
                        }`}
                      >
                        {label === 'Profile' && <UserCircleIcon className="h-5 w-5 mr-2" />}
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              </div>

              {/* XP Level */}
              <div className="flex items-center">
                <LevelBadge />
              </div>

              {/* Last Badge */}
              <div className="flex items-center">
                <LastBadge />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
