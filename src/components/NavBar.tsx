import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import TipOfTheDay from './TipOfTheDay';
import ChallengeOfTheWeek from './ChallengeOfTheWeek';
import { LEVEL_TITLES_AND_ICONS, getXPProgress } from '../utils/leveling';
import { supabase } from '../api/supabaseClient';
import TermsModal from './TermsModal';
import { useTermsModal } from './useTermsModal';

const LevelBadge = () => {
  const [xp, setXp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXp = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .single();
      if (!error && data && typeof data.xp === 'number') {
        setXp(data.xp);
      }
      setLoading(false);
    };
    fetchXp();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mr-2 animate-pulse">
        <div className="w-12 h-8 bg-seafoam rounded-full mb-1" />
        <div className="w-20 h-2 bg-blue-900 rounded" />
        <span className="text-xs text-seafoam mt-0.5" style={{ fontFamily: 'monospace' }}>...</span>
      </div>
    );
  }
  if (xp == null) {
    return null;
  }
  const { level, current, required } = getXPProgress(xp);
  const { title, icon } = LEVEL_TITLES_AND_ICONS[level - 1] || LEVEL_TITLES_AND_ICONS[0];
  const progressPercent = required > 0 ? Math.round((current / required) * 100) : 100;
  return (
    <div className="flex flex-col items-center justify-center mr-2">
      <div
        className="flex items-center justify-center px-2 py-1 bg-seafoam text-maineBlue rounded-full shadow text-lg font-bold cursor-help"
        title={`${title} (Level ${level})\n${current} / ${required} XP to next level`}
        aria-label={`Level ${level}: ${title}`}
        style={{ minWidth: 40 }}
      >
        <span style={{ fontSize: '1.5rem', marginRight: 4 }}>{icon}</span>
        <span className="sr-only">Level {level}</span>
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

const navItems = [
  { path: '/my-kitchen', label: 'My Kitchen' },
  { path: '/culinary-school', label: 'Culinary School' },
  { path: '/my-cookbook', label: 'My Cookbook' },
  { path: '/chefs-corner', label: 'Chefs Corner' },
  { path: '/weekly-challenges', label: 'Weekly Challenges' },
];

const NavBar = () => {
  const location = useLocation();
  const { modalOpen, setModalOpen, termsContent } = useTermsModal();
  return (
    <>
      <nav className="navbar bg-maineBlue text-weatheredWhite flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 shadow-md w-full">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <span className="text-2xl font-bold tracking-wider font-retro">PorkChop</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-8 items-center w-full md:w-auto mt-2 md:mt-0">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link px-3 py-2 rounded transition-colors duration-200 hover:bg-seafoam hover:text-maineBlue font-retro text-center w-full md:w-auto ${location.pathname === path ? 'bg-weatheredWhite text-maineBlue font-bold' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <LevelBadge />
          <Link to="/profile" aria-label="Profile">
            <UserCircleIcon className="h-9 w-9 text-seafoam hover:text-lobsterRed transition-colors" />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
