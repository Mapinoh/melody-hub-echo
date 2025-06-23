
import React, { useState } from 'react';
import { useUserLibrary } from '@/hooks/useUserLibrary';
import { useSupabaseTracks } from '@/hooks/useSupabaseTracks';
import { EnhancedTrackCard } from '@/components/EnhancedTrackCard';
import { Heart, Clock, Music } from 'lucide-react';

export const UserLibrary: React.FC = () => {
  const { libraryTracks, isLoading } = useUserLibrary();
  const { likedTracks } = useSupabaseTracks();
  const [activeTab, setActiveTab] = useState<'library' | 'liked' | 'recent'>('library');

  // Format library tracks for display
  const formattedLibraryTracks = libraryTracks.map(item => ({
    id: item.tracks.id,
    title: item.tracks.title,
    artist: item.tracks.artists.stage_name,
    duration: item.tracks.duration || 180,
    plays: `${item.tracks.play_count} plays`,
    imageUrl: item.tracks.cover_art_url,
    url: item.tracks.audio_url,
    addedAt: item.added_at
  }));

  const tabs = [
    { id: 'library', label: 'My Library', icon: Music, count: formattedLibraryTracks.length },
    { id: 'liked', label: 'Liked Songs', icon: Heart, count: likedTracks.length },
    { id: 'recent', label: 'Recently Played', icon: Clock, count: 0 }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Tabs - Mobile optimized */}
      <div className="flex bg-gray-800 rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'library' | 'liked' | 'recent')}
            className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-md transition-colors flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-xs md:text-sm font-medium whitespace-nowrap">{tab.label}</span>
            <span className="text-xs bg-gray-600 text-gray-300 px-1.5 md:px-2 py-1 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'library' && (
          <div>
            {formattedLibraryTracks.length > 0 ? (
              <div className="space-y-1 md:space-y-2">
                {formattedLibraryTracks.map((track) => (
                  <EnhancedTrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12 px-4">
                <Music className="w-12 md:w-16 h-12 md:h-16 text-gray-600 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-medium text-gray-400 mb-2">Your library is empty</h3>
                <p className="text-gray-500 text-sm md:text-base">Start adding tracks to build your personal collection</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-8 md:py-12 px-4">
            <Heart className="w-12 md:w-16 h-12 md:h-16 text-gray-600 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-gray-400 mb-2">Liked tracks will appear here</h3>
            <p className="text-gray-500 text-sm md:text-base">Start liking songs to see them in this section</p>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="text-center py-8 md:py-12 px-4">
            <Clock className="w-12 md:w-16 h-12 md:h-16 text-gray-600 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-gray-400 mb-2">No recent plays</h3>
            <p className="text-gray-500 text-sm md:text-base">Start listening to music to see your history here</p>
          </div>
        )}
      </div>
    </div>
  );
};
