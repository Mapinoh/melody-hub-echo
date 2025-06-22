
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CommentForm } from '@/components/CommentForm';
import { CommentItem } from '@/components/CommentItem';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  track_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    username: string;
    avatar_url?: string;
  };
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
      console.log('Fetching comments for track:', trackId);
      
      // First fetch main comments with profiles using inner join
      const { data: mainComments, error: mainError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          user_id,
          track_id,
          parent_id,
          created_at,
          updated_at,
          profiles!inner (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('track_id', trackId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (mainError) {
        console.error('Error fetching main comments:', mainError);
        throw mainError;
      }

      console.log('Main comments fetched:', mainComments);

      if (!mainComments || mainComments.length === 0) {
        setComments([]);
        return;
      }

      // Build comments with replies
      const commentsWithReplies = await Promise.all(
        mainComments.map(async (comment) => {
          // Type guard to ensure profiles exists and has required properties
          if (!comment.profiles || 
              typeof comment.profiles !== 'object' || 
              !('full_name' in comment.profiles) ||
              !('username' in comment.profiles)) {
            console.warn('Comment has invalid profile data:', comment.id);
            return null;
          }

          // Type assertion after type guard
          const validComment = comment as typeof comment & { profiles: NonNullable<Comment['profiles']> };

          // Fetch replies for this comment
          const { data: replies, error: repliesError } = await supabase
            .from('comments')
            .select(`
              id,
              content,
              user_id,
              track_id,
              parent_id,
              created_at,
              updated_at,
              profiles!inner (
                full_name,
                username,
                avatar_url
              )
            `)
            .eq('parent_id', validComment.id)
            .order('created_at', { ascending: true });

          if (repliesError) {
            console.error('Error fetching replies:', repliesError);
            // Continue without replies rather than failing
          }

          // Filter and type-check valid replies
          const validReplies: Comment[] = (replies || [])
            .filter((reply) => {
              return reply.profiles && 
                     typeof reply.profiles === 'object' && 
                     'full_name' in reply.profiles && 
                     'username' in reply.profiles;
            })
            .map(reply => {
              // Type assertion for valid replies
              const validReply = reply as typeof reply & { profiles: NonNullable<Comment['profiles']> };
              return {
                ...validReply,
                profiles: validReply.profiles
              } as Comment;
            });

          return {
            ...validComment,
            profiles: validComment.profiles,
            replies: validReplies
          } as Comment;
        })
      );

      // Filter out null comments and set state
      const validComments = commentsWithReplies.filter((comment): comment is Comment => comment !== null);
      setComments(validComments);
      
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (content: string) => {
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          user_id: user.id,
          track_id: trackId
        })
        .select(`
          id,
          content,
          user_id,
          track_id,
          parent_id,
          created_at,
          updated_at,
          profiles!inner (
            full_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Type guard for profile data with null check
      if (data && 
          data.profiles && 
          typeof data.profiles === 'object' && 
          'full_name' in data.profiles && 
          'username' in data.profiles) {
        
        // Type assertion after type guard
        const validData = data as typeof data & { profiles: NonNullable<Comment['profiles']> };
        
        const newComment: Comment = {
          ...validData,
          profiles: validData.profiles,
          replies: []
        };
        
        setComments(prev => [newComment, ...prev]);
        toast.success('Comment posted successfully');
      }
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleSubmitReply = async (content: string, parentId: string) => {
    if (!user) {
      toast.error('Please log in to reply');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          user_id: user.id,
          track_id: trackId,
          parent_id: parentId
        })
        .select(`
          id,
          content,
          user_id,
          track_id,
          parent_id,
          created_at,
          updated_at,
          profiles!inner (
            full_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Type guard for profile data with null check
      if (data && 
          data.profiles && 
          typeof data.profiles === 'object' && 
          'full_name' in data.profiles && 
          'username' in data.profiles) {
        
        // Type assertion after type guard
        const validData = data as typeof data & { profiles: NonNullable<Comment['profiles']> };
        
        const newReply: Comment = {
          ...validData,
          profiles: validData.profiles
        };

        // Add the reply to the appropriate comment
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        ));
        toast.success('Reply posted successfully');
      }
    } catch (error: any) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  const handleDeleteComment = async (commentId: string, isReply: boolean, parentId?: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      if (isReply && parentId) {
        // Remove reply from parent comment
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: comment.replies?.filter(reply => reply.id !== commentId) || [] }
            : comment
        ));
      } else {
        // Remove main comment
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }

      toast.success('Comment deleted successfully');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>
        <div className="text-gray-400">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {user && (
        <CommentForm
          onSubmit={handleSubmitComment}
          placeholder="Add a comment..."
          buttonText="Post Comment"
        />
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onReply={handleSubmitReply}
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No comments yet</p>
            <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};
