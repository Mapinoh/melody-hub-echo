
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { MusicPlayer } from '@/components/MusicPlayer';
import { TrackCard } from '@/components/TrackCard';
import { ArtistCard } from '@/components/ArtistCard';

const Index = () => {
  const featuredTracks = [
    { title: 'Midnight Dreams', artist: 'Luna Artist', duration: '3:24', plays: '1.2M' },
    { title: 'Neon Lights', artist: 'Electric Soul', duration: '2:58', plays: '890K' },
    { title: 'Ocean Waves', artist: 'Peaceful Mind', duration: '4:12', plays: '2.1M' },
    { title: 'City Nights', artist: 'Urban Beats', duration: '3:45', plays: '750K' },
    { title: 'Golden Hour', artist: 'Sunset Vibes', duration: '3:18', plays: '1.5M' },
  ];

  const featuredArtists = [
    { name: 'Luna Artist', followers: '245K' },
    { name: 'Electric Soul', followers: '180K' },
    { name: 'Peaceful Mind', followers: '92K' },
    { name: 'Urban Beats', followers: '156K' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Discover Your Sound
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Stream millions of tracks from independent artists worldwide
              </p>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Start Listening
              </button>
            </div>
          </div>

          {/* Featured Tracks */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <button className="text-gray-400 hover:text-white text-sm font-medium">
                Show all
              </button>
            </div>
            <div className="space-y-2">
              {featuredTracks.map((track, index) => (
                <TrackCard
                  key={index}
                  title={track.title}
                  artist={track.artist}
                  duration={track.duration}
                  plays={track.plays}
                  isPlaying={index === 0}
                />
              ))}
            </div>
          </section>

          {/* Featured Artists */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Artists</h2>
              <button className="text-gray-400 hover:text-white text-sm font-medium">
                Show all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredArtists.map((artist, index) => (
                <ArtistCard
                  key={index}
                  name={artist.name}
                  followers={artist.followers}
                />
              ))}
            </div>
          </section>

          {/* Recently Played */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer group"
                >
                  <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1">Playlist {item}</h3>
                  <p className="text-gray-400 text-xs">Mix · Various Artists</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Music Player */}
        <MusicPlayer />
      </div>
    </div>
  );
};

export default Index;
