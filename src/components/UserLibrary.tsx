
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTrackCard } from '@/components/EnhancedTrackCard';
import { Heart, Clock, List } from 'lucide-react';
import { toast } from 'sonner';

export const UserLibrary: React.FC = () => {
  const { user } = useAuth();
  const [likedTracks, setLikedTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'liked' | 'recent'>('liked');

  useEffect(() => {
    if (user) {
      fetchUserLibrary();
    }
  }, [user]);

  const fetchUserLibrary = async () => {
    try {
      // Fetch liked tracks
      const { data: likedData } = await supabase
        .from('likes')
        .select(`
          track_id,
          tracks (
            *,
            artists (
              id,
              stage_name
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch recent plays
      const { data: recentData } = await supabase
        .from('play_history')
        .select(`
          track_id,
          played_at,
          tracks (
            *,
            artists (
              id,
              stage_name
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('played_at', { ascending: false })
        .limit(50);

      // Format liked tracks
      const formattedLiked = (likedData || []).map(item => ({
        id: item.tracks.id,
        title: item.tracks.title,
        artist: item.tracks.artists.stage_name,
        duration: item.tracks.duration || 180,
        plays: `${item.tracks.play_count} plays`,
        imageUrl: item.tracks.cover_art_url,
        url: item.tracks.audio_url
      }));

      // Format recent tracks (remove duplicates)
      const seenTracks = new Set();
      const formattedRecent = (recentData || [])
        .filter(item => {
          if (seenTracks.has(item.tracks.id)) return false;
          seenTracks.add(item.tracks.id);
          return true;
        })
        .map(item => ({
          id: item.tracks.id,
          title: item.tracks.title,
          artist: item.tracks.artists.stage_name,
          duration: item.tracks.duration || 180,
          plays: `${item.tracks.play_count} plays`,
          imageUrl: item.tracks.cover_art_url,
          url: item.tracks.audio_url,
          playedAt: item.played_at
        }));

      setLikedTracks(formattedLiked);
      setRecentTracks(formattedRecent);
    } catch (error) {
      console.error('Error fetching user library:', error);
      toast.error('Failed to load your library');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'liked', label: 'Liked Songs', icon: Heart, count: likedTracks.length },
    { id: 'recent', label: 'Recently Played', icon: Clock, count: recentTracks.length }
  ];

  if (loading) {
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
            onClick={() => setActiveTab(tab.id as 'liked' | 'recent')}
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
        {activeTab === 'liked' && (
          <div>
            {likedTracks.length > 0 ? (
              <div className="space-y-2">
                {likedTracks.map((track) => (
                  <EnhancedTrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No liked songs yet</h3>
                <p className="text-gray-500">Start liking songs to build your personal collection</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div>
            {recentTracks.length > 0 ? (
              <div className="space-y-2">
                {recentTracks.map((track) => (
                  <EnhancedTrackCard key={`${track.id}-${track.playedAt}`} track={track} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No recent plays</h3>
                <p className="text-gray-500">Start listening to music to see your history here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
