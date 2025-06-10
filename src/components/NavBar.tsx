import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import TipOfTheDay from './TipOfTheDay';
import { LEVEL_TITLES_AND_ICONS, getXPProgress } from '../utils/leveling';
import { supabase } from '../api/supabaseClient';
import ChallengeOfTheWeek from './ChallengeOfTheWeek';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { modalOpen, setModalOpen, termsContent } = useTermsModal();
  return (
    <>
      <nav className="navbar bg-maineBlue text-weatheredWhite w-full px-4 lg:px-8 py-3 shadow-md">
        <div className="w-[640px] mx-auto flex items-center justify-between lg:pl-12">
          {/* Left section: Logo and level */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <span className="text-2xl font-bold tracking-wider font-retro">PorkChop</span>
            
            {/* Level badge */}
            <div className="hidden lg:flex items-center">
              <LevelBadge />
            </div>
          </div>

          {/* Right section: Challenge, Profile, Menu */}
          <div className="flex items-center space-x-4">
            <ChallengeOfTheWeek />
            <Link to="/profile" aria-label="Profile">
              <UserCircleIcon className="h-9 w-9 text-seafoam hover:text-lobsterRed transition-colors" />
            </Link>
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
                        className={`text-lg font-retro py-2 px-3 rounded transition-colors hover:bg-seafoam hover:text-maineBlue ${
                          location.pathname === path ? 'bg-weatheredWhite text-maineBlue font-bold' : ''
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
