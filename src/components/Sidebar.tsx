
import React from 'react';
import { Home, Search, Music, Heart, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search', active: false },
    { icon: Music, label: 'Your Library', active: false },
  ];

  const libraryItems = [
    { icon: PlusCircle, label: 'Create Playlist' },
    { icon: Heart, label: 'Liked Songs' },
  ];

  return (
    <div className={cn('bg-black text-white w-64 h-full flex flex-col', className)}>
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          MelodyHub
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 mb-8">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              'flex items-center space-x-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              item.active
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Library Section */}
      <div className="px-3 mb-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide px-3 mb-3">
          Your Library
        </h3>
        {libraryItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center space-x-4 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Playlists */}
      <div className="px-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {['My Playlist #1', 'Chill Vibes', 'Workout Mix', 'Late Night Drives'].map((playlist) => (
            <a
              key={playlist}
              href="#"
              className="block px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {playlist}
            </a>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-800">
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="text-sm font-medium">Your Profile</span>
        </a>
      </div>
    </div>
  );
};
