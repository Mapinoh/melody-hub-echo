
import React from 'react';
import { Home, Search, Library, Plus, Heart, Music, Podcast, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const ResponsiveSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  const playlistNavItems = [
    { icon: Plus, label: 'Create Playlist', path: '/playlists' },
    { icon: Heart, label: 'Liked Songs', path: '/liked' },
    { icon: Sparkles, label: 'AI Discover', path: '/discover' },
    { icon: Music, label: 'Music', path: '/music' },
    { icon: Podcast, label: 'Podcasts', path: '/podcasts' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-black border-r border-gray-800 flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">MAUDIO</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2 mb-8">
          {mainNavItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800",
                isActive(item.path) && "text-white bg-gray-800"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Playlist Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Library
          </h3>
          {playlistNavItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800",
                isActive(item.path) && "text-white bg-gray-800"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">© 2024 MAUDIO</p>
      </div>
    </div>
  );
};
