
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SharedLayout } from '@/components/SharedLayout';
import { Button } from '@/components/ui/button';
import { Home, Music, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <SharedLayout showMusicPlayer={false}>
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <Music className="w-20 h-20 md:w-24 md:h-24 text-gray-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-300 mb-3">Page Not Found</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              asChild
              variant="ghost" 
              className="w-full text-gray-400 hover:text-white"
            >
              <Link to="/search" className="flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Search Music
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Lost? Try searching for your favorite tracks or explore our music library.
            </p>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
};

export default NotFound;
