
import React, { useEffect } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { EnhancedTrackCard } from '@/components/EnhancedTrackCard';
import { AIPlaylistCard } from '@/components/AIPlaylistCard';
import { PodcastCard } from '@/components/PodcastCard';
import { EpisodeCard } from '@/components/EpisodeCard';
import { Button } from '@/components/ui/button';
import { useSupabaseTracks } from '@/hooks/useSupabaseTracks';
import { useAIPlaylists } from '@/hooks/useAIPlaylists';
import { usePodcasts } from '@/hooks/usePodcasts';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { tracks: databaseTracks, isLoading: tracksLoading, error: tracksError } = useSupabaseTracks();
  const { aiPlaylists, isLoading: playlistsLoading } = useAIPlaylists();
  const { podcasts, episodes, isLoading: podcastsLoading } = usePodcasts();

  useEffect(() => {
    console.log('Database tracks:', databaseTracks);
    console.log('AI playlists:', aiPlaylists);
    console.log('Podcasts:', podcasts);
  }, [databaseTracks, aiPlaylists, podcasts]);

  const displayTracks = databaseTracks.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artists.stage_name,
    duration: track.duration || 180,
    plays: `${track.play_count} plays`,
    imageUrl: track.cover_art_url,
    url: track.audio_url
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SharedLayout>
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {getGreeting()}{user ? `, ${user.email?.split('@')[0]}` : ''}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Discover new music, podcasts, and personalized recommendations
            </p>
          </div>

          {/* Error States */}
          {tracksError && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">Error loading tracks: {tracksError.message}</p>
            </div>
          )}

          {/* Loading States */}
          {(tracksLoading || playlistsLoading || podcastsLoading) && (
            <div className="mb-4 p-3 bg-blue-900/50 border border-blue-700 rounded-lg">
              <p className="text-blue-300 text-sm">Loading your personalized content...</p>
            </div>
          )}

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-4 md:p-6 hover:from-green-600 hover:to-green-800 transition-all cursor-pointer">
              <h3 className="text-white font-semibold text-base md:text-lg mb-2">Recently Played</h3>
              <p className="text-green-100 text-xs md:text-sm">Jump back in</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-lg p-4 md:p-6 hover:from-orange-600 hover:to-orange-800 transition-all cursor-pointer">
              <h3 className="text-white font-semibold text-base md:text-lg mb-2">New Podcasts</h3>
              <p className="text-orange-100 text-xs md:text-sm">Fresh episodes</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-4 md:p-6 hover:from-purple-600 hover:to-purple-800 transition-all cursor-pointer">
              <h3 className="text-white font-semibold text-base md:text-lg mb-2">Your Library</h3>
              <p className="text-purple-100 text-xs md:text-sm">Browse collection</p>
            </div>
          </div>

          {/* AI Curated Playlists */}
          {aiPlaylists.length > 0 && (
            <section className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-white flex items-center">
                  <Sparkles className="mr-2 text-purple-400" size={20} />
                  Made for you
                </h2>
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white text-sm font-medium"
                >
                  Show all
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiPlaylists.slice(0, 6).map((playlist) => (
                  <AIPlaylistCard 
                    key={playlist.id} 
                    playlist={playlist} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Recently Played Tracks */}
          {displayTracks.length > 0 && (
            <section className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-white">
                  Recently played
                </h2>
                <Button className="text-gray-400 hover:text-white text-sm font-medium" variant="ghost">
                  Show all
                </Button>
              </div>
              
              <div className="space-y-2">
                {displayTracks.slice(0, 5).map((track) => (
                  <EnhancedTrackCard 
                    key={track.id} 
                    track={track} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular Podcasts */}
          {podcasts.length > 0 && (
            <section className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-white">
                  Popular podcasts
                </h2>
                <Button className="text-gray-400 hover:text-white text-sm font-medium" variant="ghost">
                  Show all
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {podcasts.slice(0, 6).map((podcast) => (
                  <PodcastCard 
                    key={podcast.id} 
                    podcast={podcast} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Latest Episodes */}
          {episodes.length > 0 && (
            <section className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-white">
                  Latest episodes
                </h2>
                <Button className="text-gray-400 hover:text-white text-sm font-medium" variant="ghost">
                  Show all
                </Button>
              </div>
              
              <div className="space-y-2">
                {episodes.slice(0, 5).map((episode) => (
                  <EpisodeCard 
                    key={episode.id} 
                    episode={episode} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* More Music to Discover */}
          {displayTracks.length > 5 && (
            <section className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-white">
                  More music
                </h2>
                <Button className="text-gray-400 hover:text-white text-sm font-medium" variant="ghost">
                  Show all
                </Button>
              </div>
              
              <div className="space-y-2">
                {displayTracks.slice(5, 10).map((track) => (
                  <EnhancedTrackCard 
                    key={track.id} 
                    track={track} 
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </SharedLayout>
  );
};

export default Index;
