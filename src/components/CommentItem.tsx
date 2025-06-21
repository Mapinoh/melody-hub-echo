
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CommentForm } from './CommentForm';

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

interface CommentItemProps {
  comment: Comment;
  user: any;
  onReply: (parentId: string, content: string) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  user,
  onReply
}) => {
  const [isReplying, setIsReplying] = useState(false);

  const getUserDisplayName = (comment: Comment) => {
    return comment.profiles?.full_name || 
           comment.profiles?.username || 
           'Anonymous User';
  };

  const getUserInitials = (comment: Comment) => {
    const name = getUserDisplayName(comment);
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
  };

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
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
                onClick={() => setIsReplying(!isReplying)}
                className="text-gray-400 hover:text-white"
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleReplySubmit}
                placeholder="Write a reply..."
                buttonText="Reply"
                isReply={true}
                onCancel={() => setIsReplying(false)}
              />
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
  );
};
