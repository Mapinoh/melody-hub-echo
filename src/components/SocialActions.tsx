
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseTracks } from '@/hooks/useSupabaseTracks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Heart, Share, Plus } from 'lucide-react';

interface SocialActionsProps {
  trackId: string;
  likeCount: number;
  isLiked?: boolean;
}

export const SocialActions: React.FC<SocialActionsProps> = ({ 
  trackId, 
  likeCount, 
  isLiked: initialIsLiked = false 
}) => {
  const { user } = useAuth();
  const { likeTrack, isTrackLiked } = useSupabaseTracks();
  const [liked, setLiked] = useState(initialIsLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  // Update liked state when user or track data changes
  useEffect(() => {
    if (user) {
      setLiked(isTrackLiked(trackId));
    }
  }, [user, trackId, isTrackLiked]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like tracks');
      return;
    }

    try {
      // Optimistic update
      const wasLiked = liked;
      setLiked(!liked);
      setCurrentLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

      likeTrack(trackId);
      toast.success(wasLiked ? 'Removed from liked tracks' : 'Added to liked tracks');
    } catch (error) {
      // Revert on error
      setLiked(liked);
      setCurrentLikeCount(likeCount);
      toast.error('Failed to update like status');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this track!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleAddToPlaylist = () => {
    if (!user) {
      toast.error('Please log in to add tracks to playlists');
      return;
    }
    
    // This would open a playlist selection modal
    toast.info('Playlist feature coming soon!');
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`flex items-center gap-2 transition-colors ${
          liked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Heart 
          className="w-4 h-4" 
          fill={liked ? 'currentColor' : 'none'} 
        />
        <span className="text-sm">{currentLikeCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddToPlaylist}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">Add</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <Share className="w-4 h-4" />
        <span className="text-sm">Share</span>
      </Button>
    </div>
  );
};
