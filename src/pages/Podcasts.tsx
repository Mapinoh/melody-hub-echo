
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { PodcastCard } from '@/components/PodcastCard';
import { EpisodeCard } from '@/components/EpisodeCard';
import { usePodcasts } from '@/hooks/usePodcasts';
import { Mic, TrendingUp, Clock } from 'lucide-react';

const Podcasts = () => {
  const { podcasts, episodes, isLoading } = usePodcasts();

  const categories = [
    { name: 'Comedy', color: 'from-yellow-500 to-orange-500' },
    { name: 'News', color: 'from-blue-500 to-indigo-500' },
    { name: 'Technology', color: 'from-green-500 to-teal-500' },
    { name: 'Health', color: 'from-pink-500 to-rose-500' },
    { name: 'Business', color: 'from-gray-500 to-slate-500' },
    { name: 'Sports', color: 'from-red-500 to-orange-500' },
  ];

  return (
    <SharedLayout>
      <div className="p-4 md:p-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Podcasts
            </h1>
            <p className="text-gray-400">
              Discover amazing stories, insights, and conversations
            </p>
          </div>

          {/* Categories */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Browse by category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`bg-gradient-to-br ${category.color} rounded-lg p-4 h-24 flex items-end cursor-pointer hover:scale-105 transition-transform`}
                >
                  <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Podcasts */}
          {podcasts.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-2 text-green-400" size={24} />
                  Popular podcasts
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {podcasts.slice(0, 12).map((podcast) => (
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
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
                  <Clock className="mr-2 text-blue-400" size={24} />
                  Latest episodes
                </h2>
              </div>
              
              <div className="space-y-2">
                {episodes.slice(0, 10).map((episode) => (
                  <EpisodeCard 
                    key={episode.id} 
                    episode={episode} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!isLoading && podcasts.length === 0 && episodes.length === 0 && (
            <div className="text-center py-12">
              <Mic size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No podcasts available yet
              </h3>
              <p className="text-gray-400">
                Check back soon for amazing podcast content
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <Mic size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Loading podcasts...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SharedLayout>
  );
};

export default Podcasts;
