import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PawIcon, LeafIcon, CogIcon, CalendarIcon, LightbulbIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const activeClass = 'text-[color:var(--primary)]';
  const inactiveClass = 'text-[color:var(--foreground)] opacity-60 hover:opacity-100';

  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
      }
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </NavLink>
  );
};

const BottomNav: React.FC = () => {
  const { t } = useLocalization();
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[color:var(--card)] border-t border-[color:var(--border)] flex z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <NavItem to="/home" icon={<HomeIcon />} label={t('navHome')} />
      <NavItem to="/pets" icon={<PawIcon />} label={t('navPets')} />
      <NavItem to="/crops" icon={<LeafIcon />} label={t('navCrops')} />
      <NavItem to="/planner" icon={<CalendarIcon />} label={t('navPlanner')} />
      <NavItem to="/guides" icon={<LightbulbIcon />} label={t('navGuides')} />
      <NavItem to="/settings" icon={<CogIcon />} label={t('navSettings')} />
    </nav>
  );
};

export default BottomNav;