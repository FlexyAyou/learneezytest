
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile, Mic, Image, X } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  showAttachments?: boolean;
  showEmoji?: boolean;
  showVoice?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = "Tapez votre message...",
  disabled = false,
  showAttachments = true,
  showEmoji = false,
  showVoice = false
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4 bg-background">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm"
            >
              <Paperclip className="h-3 w-3" />
              <span className="truncate max-w-32">{file.name}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Message Input */}
      <div className="flex space-x-2">
        {/* Attachment Button */}
        {showAttachments && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
              accept="image/*,application/pdf,.doc,.docx"
            />
          </Button>
        )}

        {/* Image Button */}
        {showAttachments && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const files = Array.from((e.target as HTMLInputElement).files || []);
                setAttachments(prev => [...prev, ...files]);
              };
              input.click();
            }}
            disabled={disabled}
          >
            <Image className="h-4 w-4" />
          </Button>
        )}

        {/* Voice Button */}
        {showVoice && (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "transition-colors",
              isRecording && "bg-red-500 text-white animate-pulse"
            )}
            onClick={() => setIsRecording(!isRecording)}
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}

        {/* Text Input */}
        <div className="flex-1 relative">
          <Input
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="pr-12"
          />
          {showEmoji && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              disabled={disabled}
            >
              <Smile className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
