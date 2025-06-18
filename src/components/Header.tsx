
import React from 'react';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="bg-black/60 backdrop-blur-md border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <ChevronLeft size={16} className="text-gray-400" />
          </button>
          <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for artists, songs, or albums..."
              className="w-full bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
