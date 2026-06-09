import React from 'react';
import { useLocation } from 'wouter';
import { Heart, Star, BookOpen, Compass, Trophy, LayoutDashboard } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/play', icon: Heart, label: 'Play' },
  { path: '/mirror', icon: Star, label: 'Mirror' },
  { path: '/journey', icon: Compass, label: 'Journey' },
  { path: '/archive', icon: BookOpen, label: 'Archive' },
  { path: '/leaderboard', icon: Trophy, label: 'Ranks' },
];

export function NavBar() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/40 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location === path || (path !== '/dashboard' && location.startsWith(path));
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className={`w-5 h-5 transition-all ${active ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : ''}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
