
import React, { useState } from 'react';
import { ResponsiveSidebar } from '@/components/ResponsiveSidebar';
import { Header } from '@/components/Header';
import { EnhancedMusicPlayer } from '@/components/EnhancedMusicPlayer';
import { FullScreenPlayer } from '@/components/FullScreenPlayer';
import { EnhancedTrackCard } from '@/components/EnhancedTrackCard';
import { mockTracks } from '@/data/mockData';

const Index = () => {
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);

  const handleOpenFullScreenPlayer = () => {
    setIsFullScreenPlayerOpen(true);
  };

  const handleCloseFullScreenPlayer = () => {
    setIsFullScreenPlayerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex w-full">
      {/* Sidebar */}
      <ResponsiveSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        
        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 pb-24 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                Good evening
              </h1>
              <p className="text-gray-400">
                Discover new music and enjoy your favorites
              </p>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">Recently Played</h3>
                <p className="text-gray-400 text-sm">Jump back in</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">Made For You</h3>
                <p className="text-gray-400 text-sm">Your personal mixes</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">New Releases</h3>
                <p className="text-gray-400 text-sm">Fresh tracks</p>
              </div>
            </div>

            {/* Featured Tracks */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Popular Tracks
                </h2>
                <button className="text-gray-400 hover:text-white text-sm font-medium">
                  Show all
                </button>
              </div>
              
              <div className="space-y-2">
                {mockTracks.slice(0, 6).map((track) => (
                  <EnhancedTrackCard 
                    key={track.id} 
                    track={{
                      ...track,
                      duration: Math.floor(Math.random() * 240) + 120
                    }} 
                  />
                ))}
              </div>
            </section>

            {/* Trending Artists */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Trending Artists
                </h2>
                <button className="text-gray-400 hover:text-white text-sm font-medium">
                  Show all
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {['Artist 1', 'Artist 2', 'Artist 3', 'Artist 4', 'Artist 5', 'Artist 6'].map((artist, index) => (
                  <div key={artist} className="text-center group cursor-pointer">
                    <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3 group-hover:scale-105 transition-transform"></div>
                    <h3 className="text-white font-medium text-sm mb-1">{artist}</h3>
                    <p className="text-gray-400 text-xs">Artist</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recently Added */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Recently Added
                </h2>
                <button className="text-gray-400 hover:text-white text-sm font-medium">
                  Show all
                </button>
              </div>
              
              <div className="space-y-2">
                {mockTracks.slice(6, 10).map((track) => (
                  <EnhancedTrackCard 
                    key={track.id} 
                    track={{
                      ...track,
                      duration: Math.floor(Math.random() * 240) + 120
                    }} 
                  />
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Music Player */}
        <EnhancedMusicPlayer onOpenFullScreen={handleOpenFullScreenPlayer} />
        <FullScreenPlayer 
          isOpen={isFullScreenPlayerOpen} 
          onClose={handleCloseFullScreenPlayer} 
        />
      </div>
    </div>
  );
};

export default Index;
