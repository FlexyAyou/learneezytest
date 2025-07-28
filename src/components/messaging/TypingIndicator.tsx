
import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  users: string[];
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  users,
  className
}) => {
  if (users.length === 0) return null;

  return (
    <div className={cn("flex items-center space-x-2 p-4 text-sm text-muted-foreground", className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>
        {users.length === 1
          ? `${users[0]} est en train d'écrire...`
          : `${users.length} personnes sont en train d'écrire...`
        }
      </span>
    </div>
  );
};
