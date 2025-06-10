import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { LEVEL_TITLES_AND_ICONS, getXPProgress } from '../utils/leveling';
import { supabase } from '../api/supabaseClient';
import ChallengeOfTheWeek from './ChallengeOfTheWeek';
import logo from '../images/logo.png';

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
    title: 'Beginner',
    level: 1,
    icon: '🧽',
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
      
      // Map level to title index
      let titleIndex = 0;
      if (level >= 60) titleIndex = 15;       // Toji Master 🍶
      else if (level >= 55) titleIndex = 14;  // Executive Chef 👨‍🍳
      else if (level >= 50) titleIndex = 13;  // Master Chef 🏅
      else if (level >= 45) titleIndex = 12;  // Head Chef 👨‍🍳
      else if (level >= 40) titleIndex = 11;  // Sous Chef 🔪
      else if (level >= 35) titleIndex = 10;  // Chef De Partie 🍳
      else if (level >= 30) titleIndex = 9;   // Senior Line Cook 🍳
      else if (level >= 25) titleIndex = 8;   // Line Cook 🍳
      else if (level >= 20) titleIndex = 7;   // Junior Cook 🥄
      else if (level >= 15) titleIndex = 6;   // Prep Cook 🥄
      else if (level >= 12) titleIndex = 5;   // Kitchen Assistant 🧽
      else if (level >= 9) titleIndex = 4;    // Kitchen Hand 🧽
      else if (level >= 6) titleIndex = 3;    // Dishwasher 🧽
      else if (level >= 3) titleIndex = 2;    // Kitchen Porter 🧽
      else if (level >= 1) titleIndex = 1;    // Novice 🧽
      else titleIndex = 0;                    // Beginner 🧽

      const { title, icon } = LEVEL_TITLES_AND_ICONS[titleIndex] || LEVEL_TITLES_AND_ICONS[0];
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
  const { title, level, icon, current, required } = useLevelProgress();
  return (
    <div 
      className="flex items-center justify-center px-2 py-1 bg-seafoam text-maineBlue rounded-full shadow text-lg font-bold cursor-help"
      title={`${title} (Level ${level})\n${current} / ${required} XP to next level`}
      aria-label={`Level ${level}: ${title}`}
    >
      <span style={{ fontSize: '1.5rem', marginRight: 4 }}>{icon}</span>
      <span>{level}</span>
    </div>
  );
};

const LastBadge = () => (
  <div 
    className="flex items-center justify-center px-2 py-1 bg-seafoam text-maineBlue rounded-full shadow text-lg font-bold cursor-help"
    title="Kitchen Master"
    aria-label="Kitchen Master Badge"
  >
    <span style={{ fontSize: '1.5rem' }}>🏆</span>
  </div>
);

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

  return (
    <nav className="navbar bg-maineBlue text-weatheredWhite w-full px-4 lg:px-8 py-3 shadow-md">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Left group: Weekly, Level, Badge */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ChallengeOfTheWeek />
          <LevelBadge />
          <LastBadge />
        </div>

        {/* Center: PorkChop text and logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          <span className="hidden sm:block text-3xl font-bold tracking-wider font-retro">PorkChop</span>
          <img src={logo} alt="PorkChop" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
        </div>

        {/* Right: Hamburger menu */}
        <div className="relative ml-2 sm:ml-0">
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
      </div>
    </nav>
  );
};

export default NavBar;
