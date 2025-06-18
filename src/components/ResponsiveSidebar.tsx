
import React, { useState } from 'react';
import { Home, Search, Music, Heart, PlusCircle, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveSidebarProps {
  className?: string;
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ className }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search', active: false },
    { icon: Music, label: 'Your Library', active: false },
  ];

  const libraryItems = [
    { icon: PlusCircle, label: 'Create Playlist' },
    { icon: Heart, label: 'Liked Songs' },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          MelodyHub
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="px-2 md:px-3 mb-6 md:mb-8">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              'flex items-center space-x-3 md:space-x-4 px-3 py-3 md:py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation',
              item.active
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Library Section */}
      <div className="px-2 md:px-3 mb-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide px-3 mb-3">
          Your Library
        </h3>
        {libraryItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center space-x-3 md:space-x-4 px-3 py-3 md:py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors touch-manipulation"
            onClick={() => setIsMobileOpen(false)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Playlists */}
      <div className="px-2 md:px-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {['My Playlist #1', 'Chill Vibes', 'Workout Mix', 'Late Night Drives'].map((playlist) => (
            <a
              key={playlist}
              href="#"
              className="block px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors touch-manipulation"
              onClick={() => setIsMobileOpen(false)}
            >
              {playlist}
            </a>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-2 md:p-3 border-t border-gray-800">
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-gray-800 transition-colors touch-manipulation"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="text-sm font-medium">Your Profile</span>
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        'md:hidden fixed left-0 top-0 bottom-0 w-80 bg-black text-white transform transition-transform duration-300 z-50 flex flex-col',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn('hidden md:flex bg-black text-white w-64 h-full flex-col', className)}>
        <SidebarContent />
      </div>
    </>
  );
};
