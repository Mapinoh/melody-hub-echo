
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { AIPlaylistCard } from '@/components/AIPlaylistCard';
import { Button } from '@/components/ui/button';
import { useAIPlaylists } from '@/hooks/useAIPlaylists';
import { Sparkles, RefreshCw, Zap, TrendingUp } from 'lucide-react';

const Discover = () => {
  const { aiPlaylists, isLoading, generateDiscoverWeekly, isGenerating } = useAIPlaylists();

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
      <div className="p-4 md:p-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              AI Discover
            </h1>
            <p className="text-gray-400">
              Personalized playlists curated just for you
            </p>
          </div>

          {/* Generate New Playlists */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-xl font-semibold mb-2">
                    Get Fresh Recommendations
                  </h2>
                  <p className="text-purple-100">
                    Generate new AI-curated playlists based on your listening habits
                  </p>
                </div>
                <Button
                  onClick={() => generateDiscoverWeekly()}
                  disabled={isGenerating}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" size={16} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={16} />
                      Generate Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Playlist Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {playlistTypes.map((type) => (
              <div
                key={type.type}
                className={`bg-gradient-to-br ${type.gradient} rounded-lg p-6 text-white`}
              >
                <type.icon size={32} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-white/80 text-sm">{type.description}</p>
              </div>
            ))}
          </div>

          {/* Your AI Playlists */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Your AI Playlists
              </h2>
              {aiPlaylists.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => generateDiscoverWeekly()}
                  disabled={isGenerating}
                  className="text-gray-400 hover:text-white"
                >
                  {isGenerating ? 'Generating...' : 'Refresh All'}
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <Sparkles size={48} className="mx-auto text-purple-400 mb-4" />
                  <p className="text-gray-400">Loading your personalized playlists...</p>
                </div>
              </div>
            ) : aiPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  No AI playlists yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Generate your first AI-curated playlist to get started
                </p>
                <Button
                  onClick={() => generateDiscoverWeekly()}
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" size={16} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={16} />
                      Create My First Playlist
                    </>
                  )}
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </SharedLayout>
  );
};

export default Discover;
