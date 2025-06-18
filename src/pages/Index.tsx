
import React, { useEffect } from 'react';
import { ResponsiveSidebar } from '@/components/ResponsiveSidebar';
import { Header } from '@/components/Header';
import { EnhancedMusicPlayer } from '@/components/EnhancedMusicPlayer';
import { EnhancedTrackCard } from '@/components/EnhancedTrackCard';
import { ArtistCard } from '@/components/ArtistCard';
import { AudioProvider, useAudioPlayer } from '@/hooks/useAudioPlayer';
import { mockTracks, mockArtists, featuredPlaylists } from '@/data/mockData';

const IndexContent = () => {
  const { addToQueue } = useAudioPlayer();

  useEffect(() => {
    // Initialize the queue with mock tracks
    addToQueue(mockTracks);
  }, [addToQueue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white flex">
      {/* Sidebar */}
      <ResponsiveSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        {/* Header - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Mobile Top Spacing */}
        <div className="h-16 md:hidden"></div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-24">
          {/* Hero Section */}
          <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 md:p-8 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4">
                Discover Your Sound
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-4 md:mb-6">
                Stream millions of tracks from independent artists worldwide
              </p>
              <button className="bg-white text-purple-600 px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors touch-manipulation">
                Start Listening
              </button>
            </div>
          </div>

          {/* Featured Tracks */}
          <section className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Trending Now</h2>
              <button className="text-gray-400 hover:text-white text-sm font-medium touch-manipulation">
                Show all
              </button>
            </div>
            <div className="space-y-2">
              {mockTracks.slice(0, 6).map((track) => (
                <EnhancedTrackCard key={track.id} track={track} />
              ))}
            </div>
          </section>

          {/* Featured Artists */}
          <section className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Featured Artists</h2>
              <button className="text-gray-400 hover:text-white text-sm font-medium touch-manipulation">
                Show all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {mockArtists.slice(0, 4).map((artist) => (
                <ArtistCard
                  key={artist.id}
                  name={artist.name}
                  followers={artist.followers}
                  imageUrl={artist.imageUrl}
                />
              ))}
            </div>
          </section>

          {/* Playlists Section */}
          <section className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Featured Playlists</h2>
              <button className="text-gray-400 hover:text-white text-sm font-medium touch-manipulation">
                Show all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {featuredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-gray-800/50 rounded-lg p-3 md:p-4 hover:bg-gray-800 transition-colors cursor-pointer group touch-manipulation"
                >
                  <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] md:border-l-[8px] border-l-black border-y-[4px] md:border-y-[6px] border-y-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1 truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-xs truncate">{playlist.trackCount} tracks</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recently Played */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">More Music</h2>
            <div className="space-y-2">
              {mockTracks.slice(6).map((track) => (
                <EnhancedTrackCard key={track.id} track={track} />
              ))}
            </div>
          </section>
        </main>

        {/* Enhanced Music Player */}
        <EnhancedMusicPlayer />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AudioProvider>
      <IndexContent />
    </AudioProvider>
  );
};

export default Index;
