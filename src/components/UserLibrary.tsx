
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
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'library' | 'liked' | 'recent')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-sm font-medium">{tab.label}</span>
            <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
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
              <div className="space-y-2">
                {formattedLibraryTracks.map((track) => (
                  <EnhancedTrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">Your library is empty</h3>
                <p className="text-gray-500">Start adding tracks to build your personal collection</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">Liked tracks will appear here</h3>
            <p className="text-gray-500">Start liking songs to see them in this section</p>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No recent plays</h3>
            <p className="text-gray-500">Start listening to music to see your history here</p>
          </div>
        )}
      </div>
    </div>
  );
};
