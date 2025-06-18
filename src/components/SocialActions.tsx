
import React, { useState } from 'react';
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
  isLiked = false 
}) => {
  const { user } = useAuth();
  const { likeTrack } = useSupabaseTracks();
  const [liked, setLiked] = useState(isLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like tracks');
      return;
    }

    try {
      likeTrack(trackId);
      setLiked(!liked);
      setCurrentLikeCount(prev => liked ? prev - 1 : prev + 1);
      toast.success(liked ? 'Removed from liked tracks' : 'Added to liked tracks');
    } catch (error) {
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
