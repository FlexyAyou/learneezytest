
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  Zap,
  Brain,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'text' | 'code' | 'suggestion';
  isTyping?: boolean;
  rating?: 'good' | 'bad' | null;
}

interface AIChatProps {
  className?: string;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ 
  className,
  minimized = false,
  onToggleMinimize 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui?',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler la réponse de l'IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "C'est une excellente question! Laissez-moi vous expliquer...",
      "Je comprends votre préoccupation. Voici quelques suggestions...",
      "Basé sur votre demande, je recommande...",
      "Voici ce que je peux vous dire à ce sujet...",
      "Excellente idée! Voici comment procéder..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Écoute activée",
        description: "Parlez maintenant...",
      });
    } else {
      toast({
        title: "Écoute désactivée",
        description: "Enregistrement arrêté",
      });
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Message copié",
      description: "Le message a été copié dans le presse-papier",
    });
  };

  const handleRateMessage = (messageId: string, rating: 'good' | 'bad') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
    toast({
      title: "Évaluation enregistrée",
      description: `Merci pour votre retour!`,
    });
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Bonjour! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui?',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        type: 'text'
      }
    ]);
    toast({
      title: "Conversation effacée",
      description: "Nouvelle conversation démarrée",
    });
  };

  const suggestions = [
    "Comment créer un cours?",
    "Expliquer les statistiques",
    "Aide pour la messagerie",
    "Gérer les étudiants"
  ];

  if (minimized) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={onToggleMinimize}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg animate-pulse"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 z-50 shadow-2xl border-0 overflow-hidden transition-all duration-300",
      isFullscreen ? "inset-4" : "w-96 h-[600px]",
      className
    )}>
      <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bot className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">Assistant IA</CardTitle>
              <p className="text-xs opacity-90">En ligne</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3 animate-fade-in",
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              )}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={cn(
                  "text-xs font-medium",
                  message.sender === 'ai' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                    : 'bg-blue-500 text-white'
                )}>
                  {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "max-w-[80%] group",
                message.sender === 'user' ? 'items-end' : 'items-start'
              )}>
                <div className={cn(
                  "px-4 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md",
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm ml-auto'
                    : 'bg-white text-gray-800 rounded-bl-sm border'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.type === 'code' && (
                    <Badge variant="secondary" className="mt-2">
                      <Zap className="h-3 w-3 mr-1" />
                      Code
                    </Badge>
                  )}
                </div>
                
                <div className={cn(
                  "flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyMessage(message.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRateMessage(message.id, 'good')}
                        className={cn(
                          "h-6 w-6 p-0",
                          message.rating === 'good' && 'text-green-500'
                        )}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRateMessage(message.id, 'bad')}
                        className={cn(
                          "h-6 w-6 p-0",
                          message.rating === 'bad' && 'text-red-500'
                        )}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="p-4 bg-white border-t">
            <p className="text-sm text-gray-600 mb-2">Suggestions rapides:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs h-8 justify-start hover:bg-pink-50"
                >
                  <Sparkles className="h-3 w-3 mr-1 text-pink-500" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Input Area */}
        <div className="p-4 bg-white">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceToggle}
              className={cn(
                "h-10 w-10 p-0 transition-all duration-200",
                isListening && "bg-red-500 text-white animate-pulse"
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Posez votre question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12 focus:ring-pink-500 focus:border-pink-500"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-10 w-10 p-0 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
