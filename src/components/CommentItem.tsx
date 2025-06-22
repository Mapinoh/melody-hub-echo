
import React, { useState } from 'react';
import { CommentForm } from '@/components/CommentForm';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Reply, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_id?: string;
  created_at: string;
  profiles: {
    full_name: string;
    username: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  currentUser: any;
  onReply: (content: string, parentId: string) => Promise<void>;
  onDelete: (commentId: string, isReply: boolean, parentId?: string) => Promise<void>;
  isReply?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  onReply,
  onDelete,
  isReply = false
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReply = async (content: string) => {
    await onReply(content, comment.id);
    setShowReplyForm(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(comment.id, isReply, comment.parent_id);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = currentUser && currentUser.id === comment.user_id;

  return (
    <div className={`space-y-3 ${isReply ? 'ml-8 border-l border-gray-700 pl-4' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.profiles.avatar_url} />
          <AvatarFallback className="bg-gray-700 text-white text-xs">
            {comment.profiles.full_name?.charAt(0) || comment.profiles.username?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white text-sm">
                {comment.profiles.full_name || comment.profiles.username}
              </span>
              <span className="text-gray-400 text-xs">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {!isReply && currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-400 hover:text-white text-xs h-auto p-1"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-400 text-xs h-auto p-1"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReply}
                placeholder="Write a reply..."
                buttonText="Reply"
                isReply={true}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onReply={onReply}
                  onDelete={onDelete}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
