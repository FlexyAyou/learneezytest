
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, CheckCheck, Clock, Mic, Image, Paperclip } from 'lucide-react';

interface ConversationItemProps {
  conversation: {
    id: string;
    participant: string;
    role?: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
    isGroup?: boolean;
    lastMessageType?: 'text' | 'image' | 'file' | 'audio';
    typing?: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick
}) => {
  const getStatusColor = () => {
    switch (conversation.status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getLastMessageIcon = () => {
    switch (conversation.lastMessageType) {
      case 'image':
        return <Image className="h-3 w-3 text-muted-foreground" />;
      case 'file':
        return <Paperclip className="h-3 w-3 text-muted-foreground" />;
      case 'audio':
        return <Mic className="h-3 w-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "p-4 cursor-pointer border-b hover:bg-muted/50 transition-all duration-200 hover:shadow-sm",
        isSelected && "bg-pink-50 border-l-4 border-l-pink-500 shadow-sm"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          {conversation.isGroup ? (
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {conversation.participant.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          {!conversation.isGroup && conversation.status && (
            <div className={cn(
              "absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full",
              getStatusColor()
            )} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-medium text-sm text-foreground truncate">
              {conversation.participant}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {conversation.timestamp}
              </span>
              {conversation.unread > 0 && (
                <Badge variant="destructive" className="text-xs min-w-[20px] h-5 flex items-center justify-center animate-pulse">
                  {conversation.unread}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getLastMessageIcon()}
            <p className={cn(
              "text-sm truncate flex-1",
              conversation.typing
                ? "text-green-600 italic"
                : "text-muted-foreground"
            )}>
              {conversation.typing ? "En train d'écrire..." : conversation.lastMessage}
            </p>
          </div>
          
          {conversation.role && (
            <Badge variant="outline" className="text-xs mt-1">
              {conversation.role}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
