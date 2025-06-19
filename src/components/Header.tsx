
import React from 'react';
import { Search, ChevronLeft, ChevronRight, User, Home, Upload, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-black/60 backdrop-blur-md border-b border-gray-800 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-400" />
          </button>
          <button 
            onClick={() => window.history.forward()}
            className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          
          {/* Quick Nav */}
          <div className="hidden md:flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <Home size={16} className="mr-2" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/upload')}
              className="text-gray-400 hover:text-white"
            >
              <Upload size={16} className="mr-2" />
              Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/playlists')}
              className="text-gray-400 hover:text-white"
            >
              <Music size={16} className="mr-2" />
              Playlists
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 md:mx-8">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for artists, songs, or albums..."
              className="w-full bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="text-gray-400 hover:text-white flex items-center space-x-2"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User size={12} />
                </div>
                <span className="hidden md:inline text-sm">Profile</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-400 text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <User size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
