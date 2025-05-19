import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import TipOfTheDay from './TipOfTheDay';

const navItems = [
  { path: '/my-kitchen', label: 'My Kitchen' },
  { path: '/culinary-school', label: 'Culinary School' },
  { path: '/my-cookbook', label: 'My Cookbook' },
  { path: '/chefs-corner', label: 'Chefs Corner' },
];

const NavBar = () => {
  const location = useLocation();
  return (
    <nav className="flex items-center justify-center gap-8 px-2 py-3 bg-maineBlue text-weatheredWhite shadow-md">
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
      <TipOfTheDay />
      <Link to="/profile" className="flex items-center gap-2 hover:text-seafoam">
        <UserCircleIcon className="h-7 w-7" />
        <span className="hidden sm:inline">Profile</span>
      </Link>
    </nav>
  );
};

export default NavBar;
