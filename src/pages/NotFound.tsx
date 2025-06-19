
import React from 'react';
import { Link } from 'react-router-dom';
import { SharedLayout } from '@/components/SharedLayout';
import { Button } from '@/components/ui/button';
import { Home, Music } from 'lucide-react';

const NotFound = () => {
  return (
    <SharedLayout showMusicPlayer={false}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-8">
            <Music className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Page Not Found</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>Lost? Try searching for your favorite tracks or artists.</p>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
};

export default NotFound;
