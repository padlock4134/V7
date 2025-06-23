import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { LEVEL_TITLES_AND_ICONS, getXPProgress } from '../utils/leveling';
import { supabase } from '../api/supabaseClient';
import ChallengeOfTheWeek from './ChallengeOfTheWeek';
import { getUserBadges, BADGES } from '../utils/badges';
// @ts-ignore
import logo from '../images/logo.png';

interface LevelProgress {
  title: string;
  level: number;
  icon: string;
  current: number;
  required: number;
  progressPercent: number;
}

const LevelProgressContext = createContext<{ refreshXP: () => void; progress: LevelProgress }>({ refreshXP: () => {}, progress: {
  title: 'Beginner',
  level: 1,
  icon: '🧽',
  current: 0,
  required: 100,
  progressPercent: 0,
}});
export const useLevelProgressContext = () => useContext(LevelProgressContext);

const useLevelProgress = (): [LevelProgress, () => void] => {
  const [progress, setProgress] = useState<LevelProgress>({
    title: LEVEL_TITLES_AND_ICONS[0].title,
    level: 1,
    icon: LEVEL_TITLES_AND_ICONS[0].icon,
    current: 0,
    required: 100,
    progressPercent: 0,
  });
  const fetchXpRef = useRef<() => Promise<void>>();

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
    // Map level directly to LEVEL_TITLES_AND_ICONS index (level 1 = index 0, level 2 = index 1, ...)
    const titleIndex = Math.max(0, Math.min(level - 1, LEVEL_TITLES_AND_ICONS.length - 1));
    const { title, icon } = LEVEL_TITLES_AND_ICONS[titleIndex];
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

  useEffect(() => {
    fetchXpRef.current = fetchXp;
    fetchXp();
  }, []);

  const refreshXP = () => {
    if (fetchXpRef.current) fetchXpRef.current();
  };

  return [progress, refreshXP];
};

const LevelBadge = () => {
  const { progress } = useLevelProgressContext();
  return (
    <span className="flex items-center text-lg font-bold">
      <span className="mr-1">{progress.icon}</span>
      {progress.title} (Lv {progress.level})
    </span>
  );
};

const LastBadge = () => {
  const [lastBadge, setLastBadge] = useState<{icon: string, name: string, description: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLastBadge = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Get all user badges
        const userBadges = await getUserBadges(user.id);
        
        if (userBadges.length > 0) {
          // Sort by awarded_at descending to get the most recent badge
          userBadges.sort((a, b) => 
            new Date(b.awarded_at).getTime() - new Date(a.awarded_at).getTime()
          );
          
          // Find the badge details from BADGES array
          const badgeId = userBadges[0].badge_id;
          const badgeDetails = BADGES.find(b => b.id === badgeId);
          
          if (badgeDetails) {
            setLastBadge({
              icon: badgeDetails.icon,
              name: badgeDetails.name,
              description: badgeDetails.description
            });
          }
        }
      } catch (error) {
        console.error('Error fetching last badge:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLastBadge();
  }, []);
  
  if (loading) return null;
  
  // Show placeholder if no badge is earned yet
  if (!lastBadge) {
    return (
      <div className="flex items-center ml-2" title="Complete weekly challenges to earn badges!">
        <span className="text-lg opacity-50">🏅</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center ml-2" title={`${lastBadge.name}: ${lastBadge.description}`}>
      <span className="text-lg">{lastBadge.icon}</span>
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

const NavBar: React.FC = () => {
  const { progress, refreshXP } = useLevelProgressContext();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar bg-maineBlue text-weatheredWhite w-full px-4 lg:px-8 py-3 shadow-md">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Flex container for all items */}
        <div className="flex items-center space-x-3 w-full">
          {/* Weekly Challenge */}
          <ChallengeOfTheWeek />
          
          {/* PorkChop Logo */}
          <img src={logo} alt="PorkChop" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          
          {/* PorkChop Text */}
          <span className="hidden sm:block text-3xl font-bold tracking-wider font-retro">PorkChop</span>
          
          {/* Level Badge */}
          <LevelBadge />
          
          {/* Last Badge */}
          <LastBadge />
          
          {/* Spacer to push hamburger menu to the right */}
          <div className="flex-grow"></div>
          
          {/* Hamburger Menu */}
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
        </div>
      </div>
    </nav>
  );
};

const NavBarWithProvider: React.FC = (props) => {
  const [progress, refreshXP] = useLevelProgress();
  return (
    <LevelProgressContext.Provider value={{ progress, refreshXP }}>
      <NavBar {...props} />
    </LevelProgressContext.Provider>
  );
};

export default NavBarWithProvider;
