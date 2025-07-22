import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare,
  Send,
  Users,
  Search,
  Filter,
  Plus,
  Bell,
  Clock,
  User,
  BookOpen,
  MessageCircle,
  Archive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: string;
  senderType: 'trainer' | 'student';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: 'individual' | 'group';
  sessionName?: string;
  moduleName?: string;
  messages: Message[];
}

const InternalTrainerMessaging = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      participants: ['Alice Martin'],
      lastMessage: 'Merci pour l\'aide sur l\'exercice d\'algèbre',
      lastMessageTime: '10:30',
      unreadCount: 2,
      type: 'individual',
      sessionName: 'Formation Mathématiques - Niveau 1',
      messages: [
        {
          id: '1',
          sender: 'Alice Martin',
          senderType: 'student',
          content: 'Bonjour, j\'ai une question sur l\'exercice 3 du chapitre 2',
          timestamp: '09:15',
          read: true
        },
        {
          id: '2',
          sender: 'Formateur',
          senderType: 'trainer',
          content: 'Bonjour Alice ! Quelle est votre question exactement ?',
          timestamp: '09:20',
          read: true
        },
        {
          id: '3',
          sender: 'Alice Martin',
          senderType: 'student',
          content: 'Je ne comprends pas comment résoudre l\'équation du second degré',
          timestamp: '09:25',
          read: true
        },
        {
          id: '4',
          sender: 'Alice Martin',
          senderType: 'student',
          content: 'Merci pour l\'aide sur l\'exercice d\'algèbre',
          timestamp: '10:30',
          read: false
        }
      ]
    },
    {
      id: '2',
      participants: ['Bob Dupont', 'Claire Durand', 'David Lambert'],
      lastMessage: 'La session de demain est-elle maintenue ?',
      lastMessageTime: '14:45',
      unreadCount: 1,
      type: 'group',
      sessionName: 'Formation Mathématiques - Niveau 1',
      messages: [
        {
          id: '5',
          sender: 'Bob Dupont',
          senderType: 'student',
          content: 'Bonjour, est-ce que quelqu\'un a les notes du dernier cours ?',
          timestamp: '13:30',
          read: true
        },
        {
          id: '6',
          sender: 'Claire Durand',
          senderType: 'student',
          content: 'La session de demain est-elle maintenue ?',
          timestamp: '14:45',
          read: false
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [newConversation, setNewConversation] = useState({
    participants: [] as string[],
    type: 'individual' as 'individual' | 'group',
    subject: '',
    initialMessage: ''
  });

  const availableStudents = [
    'Alice Martin', 'Bob Dupont', 'Claire Durand', 'David Lambert', 
    'Emma Rousseau', 'Franck Petit', 'Gabrielle Moreau', 'Henri Bernard'
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Formateur',
      senderType: 'trainer',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.content,
          lastMessageTime: message.timestamp
        };
      }
      return conv;
    }));

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: message.content,
      lastMessageTime: message.timestamp
    });

    setNewMessage('');
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès"
    });
  };

  const handleStartNewConversation = () => {
    if (!newConversation.participants.length || !newConversation.initialMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner des participants et écrire un message",
        variant: "destructive"
      });
      return;
    }

    const conversation: Conversation = {
      id: Date.now().toString(),
      participants: newConversation.participants,
      lastMessage: newConversation.initialMessage,
      lastMessageTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      type: newConversation.type,
      messages: [
        {
          id: Date.now().toString(),
          sender: 'Formateur',
          senderType: 'trainer',
          content: newConversation.initialMessage,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          read: true
        }
      ]
    };

    setConversations([conversation, ...conversations]);
    setNewConversation({
      participants: [],
      type: 'individual',
      subject: '',
      initialMessage: ''
    });
    setIsNewConversationOpen(false);
    
    toast({
      title: "Conversation créée",
      description: "Nouvelle conversation démarrée avec succès"
    });
  };

  const markAsRead = (conversationId: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participants.some(p => 
      p.toLowerCase().includes(searchTerm.toLowerCase())
    ) || conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'unread' && conv.unreadCount > 0) ||
      (filterType === 'individual' && conv.type === 'individual') ||
      (filterType === 'group' && conv.type === 'group');
    
    return matchesSearch && matchesFilter;
  });

  const totalUnreadMessages = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messagerie</h1>
          <p className="text-muted-foreground">Communiquez avec vos apprenants</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {totalUnreadMessages > 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <Bell className="h-3 w-3" />
              <span>{totalUnreadMessages}</span>
            </Badge>
          )}
          
          <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle conversation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nouvelle conversation</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type de conversation</label>
                  <Select value={newConversation.type} onValueChange={(value: 'individual' | 'group') => 
                    setNewConversation({ ...newConversation, type: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individuelle</SelectItem>
                      <SelectItem value="group">Groupe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Participants</label>
                  <Select value="" onValueChange={(value) => {
                    if (!newConversation.participants.includes(value)) {
                      setNewConversation({
                        ...newConversation,
                        participants: [...newConversation.participants, value]
                      });
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner des apprenants" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStudents.map(student => (
                        <SelectItem key={student} value={student}>
                          {student}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {newConversation.participants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newConversation.participants.map(participant => (
                        <Badge key={participant} variant="outline" className="flex items-center space-x-1">
                          <span>{participant}</span>
                          <button 
                            onClick={() => setNewConversation({
                              ...newConversation,
                              participants: newConversation.participants.filter(p => p !== participant)
                            })}
                            className="ml-1 hover:bg-muted rounded-full"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message initial</label>
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newConversation.initialMessage}
                    onChange={(e) => setNewConversation({ ...newConversation, initialMessage: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewConversationOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleStartNewConversation}>
                    Démarrer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Liste des conversations */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Badge variant="outline">{conversations.length}</Badge>
              </div>
              
              {/* Recherche et filtres */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les conversations</SelectItem>
                    <SelectItem value="unread">Non lues</SelectItem>
                    <SelectItem value="individual">Individuelles</SelectItem>
                    <SelectItem value="group">Groupes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="overflow-y-auto h-[calc(100%-8rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      markAsRead(conversation.id);
                    }}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center">
                          {conversation.type === 'group' ? (
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                          ) : (
                            <Avatar>
                              <AvatarFallback>
                                {conversation.participants[0]?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm truncate">
                              {conversation.type === 'group' 
                                ? `Groupe (${conversation.participants.length})`
                                : conversation.participants[0]
                              }
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          
                          {conversation.sessionName && (
                            <div className="flex items-center space-x-1 mt-1">
                              <BookOpen className="h-3 w-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.sessionName}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{conversation.lastMessageTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone de conversation */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedConversation.type === 'group' ? (
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <Avatar>
                        <AvatarFallback>
                          {selectedConversation.participants[0]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div>
                      <h3 className="font-semibold">
                        {selectedConversation.type === 'group'
                          ? `Groupe - ${selectedConversation.participants.join(', ')}`
                          : selectedConversation.participants[0]
                        }
                      </h3>
                      {selectedConversation.sessionName && (
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.sessionName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <Separator />
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'trainer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderType === 'trainer'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.senderType === 'student' && (
                          <p className="text-xs font-medium mb-1">{message.sender}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderType === 'trainer' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <Separator />
              
              {/* Zone de saisie */}
              <div className="p-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                <p className="text-muted-foreground">
                  Choisissez une conversation existante ou créez-en une nouvelle
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternalTrainerMessaging;