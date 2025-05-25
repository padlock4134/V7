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
];

const NavBar = () => {
  const location = useLocation();
  const { modalOpen, setModalOpen, termsContent } = useTermsModal();
  return (
    <>
      <nav className="flex items-center justify-center gap-8 px-2 py-3 bg-maineBlue text-weatheredWhite shadow-md">
        <LevelBadge />
        <span className="font-retro text-2xl tracking-wider">PorkChop</span>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1 rounded hover:bg-seafoam hover:text-maineBlue transition-colors ${location.pathname === item.path ? 'bg-seafoam text-maineBlue' : ''}`}
          >
            {item.label}
          </Link>
        ))}

        <div className="flex flex-col sm:flex-row gap-2 items-center ml-4">
          <TipOfTheDay />
          <ChallengeOfTheWeek />
        </div>
        <Link to="/profile" className="flex items-center gap-2 hover:text-seafoam">
          <UserCircleIcon className="h-7 w-7" />
          <span className="hidden sm:inline">Profile</span>
        </Link>
      </nav>

    </>
  );
};

export default NavBar;
