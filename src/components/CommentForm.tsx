
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  isReply?: boolean;
  onCancel?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = "Add a comment...",
  buttonText = "Post Comment",
  isReply = false,
  onCancel
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
        rows={isReply ? 2 : 3}
      />
      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size={isReply ? "sm" : "default"}
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Posting...' : buttonText}
        </Button>
        {isReply && onCancel && (
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
