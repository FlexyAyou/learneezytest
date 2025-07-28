
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCheck, Clock, Send } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
    isFromMe: boolean;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
  };
  showAvatar?: boolean;
  isGroupChat?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showAvatar = true,
  isGroupChat = false
}) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Send className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-end space-x-2 animate-fade-in",
      message.isFromMe ? "flex-row-reverse space-x-reverse" : "flex-row"
    )}>
      {showAvatar && !message.isFromMe && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs">
            {message.sender.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-xs lg:max-w-md group",
        message.isFromMe ? "items-end" : "items-start"
      )}>
        {!message.isFromMe && isGroupChat && (
          <p className="text-xs text-muted-foreground mb-1 px-1">
            {message.sender}
          </p>
        )}
        
        <div className={cn(
          "px-4 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md",
          message.isFromMe
            ? "bg-pink-500 text-white rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        <div className={cn(
          "flex items-center space-x-1 mt-1 px-1 opacity-70 group-hover:opacity-100 transition-opacity",
          message.isFromMe ? "justify-end" : "justify-start"
        )}>
          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
          {message.isFromMe && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};
