
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { MessageCircle, Heart, Reply, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
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

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          user_id: user.id,
          track_id: trackId
        });

      if (error) throw error;

      setNewComment('');
      fetchComments();
      toast.success('Comment posted successfully!');
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: replyContent.trim(),
          user_id: user.id,
          track_id: trackId,
          parent_id: parentId
        });

      if (error) throw error;

      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
      toast.success('Reply posted successfully!');
    } catch (error: any) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  const getUserDisplayName = (comment: Comment) => {
    return comment.profiles?.full_name || 
           comment.profiles?.username || 
           'Anonymous User';
  };

  const getUserInitials = (comment: Comment) => {
    const name = getUserDisplayName(comment);
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
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
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            rows={3}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="text-gray-400 text-center py-4">
          Please log in to add comments
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-600 text-white">
                  {getUserInitials(comment)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-medium">
                    {getUserDisplayName(comment)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-3">{comment.content}</p>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Like
                  </Button>
                  
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 space-y-3">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim()}
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Reply
                      </Button>
                      <Button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3 border-l-2 border-gray-600 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-600 text-white">
                            {getUserInitials(reply)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-sm">
                              {getUserDisplayName(reply)}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
