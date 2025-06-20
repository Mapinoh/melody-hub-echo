
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { AIPlaylistCard } from '@/components/AIPlaylistCard';
import { useAIPlaylists } from '@/hooks/useAIPlaylists';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

const Discover = () => {
  const { aiPlaylists, isLoading } = useAIPlaylists();

  const playlistTypes = [
    {
      type: 'discover_weekly',
      title: 'Discover Weekly',
      description: 'Your weekly mix of fresh music',
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      type: 'daily_mix',
      title: 'Daily Mix',
      description: 'Songs you love and new discoveries',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'release_radar',
      title: 'Release Radar',
      description: 'New music from artists you follow',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <SharedLayout>
      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              AI Discover
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Personalized playlists automatically curated for you daily
            </p>
          </div>

          {/* Auto-generation Info */}
          <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4 md:p-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="text-purple-400 mt-1" size={20} />
                <div>
                  <h2 className="text-white text-base md:text-lg font-semibold mb-2">
                    AI Curation Running Daily
                  </h2>
                  <p className="text-purple-100 text-sm md:text-base">
                    Our AI automatically generates fresh playlists for you every day based on your listening habits, 
                    favorite genres, and music discovery preferences. Check back daily for new recommendations!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {playlistTypes.map((type) => (
              <div
                key={type.type}
                className={`bg-gradient-to-br ${type.gradient} rounded-lg p-4 md:p-6 text-white`}
              >
                <type.icon size={24} className="mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-white/80 text-xs md:text-sm">{type.description}</p>
              </div>
            ))}
          </div>

          {/* Your AI Playlists */}
          <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Your AI Playlists
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <Sparkles size={48} className="mx-auto text-purple-400 mb-4" />
                  <p className="text-gray-400">Loading your personalized playlists...</p>
                </div>
              </div>
            ) : aiPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiPlaylists.map((playlist) => (
                  <AIPlaylistCard 
                    key={playlist.id} 
                    playlist={playlist} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  AI playlists coming soon
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Our AI is learning your music preferences. Check back tomorrow for your first 
                  automatically generated playlists!
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </SharedLayout>
  );
};

export default Discover;
