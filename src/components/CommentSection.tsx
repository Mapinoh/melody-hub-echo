
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  track_id: string;
  parent_id?: string;
  created_at: string;
  profiles: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  } | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  trackId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ trackId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [trackId]);

  const fetchComments = async () => {
    try {
      // First, get all comments for this track
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('track_id', trackId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Get all user IDs from comments
      const userIds = commentsData?.map(comment => comment.user_id) || [];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user profiles
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.id, profile]) || []
      );

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from('comments')
            .select('*')
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          if (repliesError) throw repliesError;

          // Get user IDs from replies
          const replyUserIds = replies?.map(reply => reply.user_id) || [];
          
          // Fetch profiles for reply users
          const { data: replyProfiles, error: replyProfilesError } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url')
            .in('id', replyUserIds);

          if (replyProfilesError) throw replyProfilesError;

          // Create a map for reply profiles
          const replyProfilesMap = new Map(
            replyProfiles?.map(profile => [profile.id, profile]) || []
          );

          const repliesWithProfiles = replies?.map(reply => ({
            ...reply,
            profiles: replyProfilesMap.get(reply.user_id) || null
          })) || [];

          return {
            ...comment,
            profiles: profilesMap.get(comment.user_id) || null,
            replies: repliesWithProfiles
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (content: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        content,
        user_id: user.id,
        track_id: trackId
      });

    if (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
      throw error;
    }

    fetchComments();
    toast.success('Comment posted successfully!');
  };

  const handleSubmitReply = async (parentId: string, content: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        content,
        user_id: user.id,
        track_id: trackId,
        parent_id: parentId
      });

    if (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
      throw error;
    }

    fetchComments();
    toast.success('Reply posted successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <CommentForm onSubmit={handleSubmitComment} />
      ) : (
        <div className="text-gray-400 text-center py-4">
          Please log in to add comments
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={user}
            onReply={handleSubmitReply}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};
