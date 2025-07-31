import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare,
  Users,
  Search,
  Filter,
  Plus,
  Bell,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MessageBubble } from '@/components/messaging/MessageBubble';
import { ConversationItem } from '@/components/messaging/ConversationItem';
import { MessageInput } from '@/components/messaging/MessageInput';
import { TypingIndicator } from '@/components/messaging/TypingIndicator';

interface Message {
  id: string;
  sender: string;
  senderType: 'trainer' | 'student';
  content: string;
  timestamp: string;
  read: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
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
  status?: 'online' | 'offline' | 'away';
  lastMessageType?: 'text' | 'image' | 'file' | 'audio';
  typing?: boolean;
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
      status: 'online',
      lastMessageType: 'text',
      messages: [
        {
          id: '1',
          sender: 'Alice Martin',
          senderType: 'student',
          content: 'Bonjour, j\'ai une question sur l\'exercice 3 du chapitre 2',
          timestamp: '09:15',
          read: true,
          status: 'read'
        },
        {
          id: '2',
          sender: 'Formateur',
          senderType: 'trainer',
          content: 'Bonjour Alice ! Quelle est votre question exactement ?',
          timestamp: '09:20',
          read: true,
          status: 'read'
        },
        {
          id: '3',
          sender: 'Alice Martin',
          senderType: 'student',
          content: 'Je ne comprends pas comment résoudre l\'équation du second degré',
          timestamp: '09:25',
          read: true,
          status: 'read'
        },
        {
          id: '4',
          sender: 'Alice Martin',
          senderType: 'student',
          content: 'Merci pour l\'aide sur l\'exercice d\'algèbre',
          timestamp: '10:30',
          read: false,
          status: 'delivered'
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
      status: 'online',
      lastMessageType: 'text',
      messages: [
        {
          id: '5',
          sender: 'Bob Dupont',
          senderType: 'student',
          content: 'Bonjour, est-ce que quelqu\'un a les notes du dernier cours ?',
          timestamp: '13:30',
          read: true,
          status: 'read'
        },
        {
          id: '6',
          sender: 'Claire Durand',
          senderType: 'student',
          content: 'La session de demain est-elle maintenue ?',
          timestamp: '14:45',
          read: false,
          status: 'delivered'
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
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

  const handleSendMessage = (messageText: string, attachments?: File[]) => {
    if (!messageText.trim() && !attachments?.length) return;
    if (!selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Formateur',
      senderType: 'trainer',
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      status: 'sent'
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

    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès"
    });

    // Simuler la frappe
    setTypingUsers(['Alice Martin']);
    setTimeout(() => {
      setTypingUsers([]);
    }, 3000);
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
          read: true,
          status: 'sent'
        }
      ],
      status: 'online',
      lastMessageType: 'text',
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
            <Badge variant="destructive" className="flex items-center space-x-1 animate-pulse">
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
                  <Input
                    placeholder="Tapez votre message..."
                    value={newConversation.initialMessage}
                    onChange={(e) => setNewConversation({ ...newConversation, initialMessage: e.target.value })}
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
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Conversations
                </CardTitle>
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
                  <ConversationItem
                    key={conversation.id}
                    conversation={{
                      id: conversation.id,
                      participant: conversation.type === 'group' 
                        ? `Groupe (${conversation.participants.length})`
                        : conversation.participants[0],
                      lastMessage: conversation.lastMessage,
                      timestamp: conversation.lastMessageTime,
                      unread: conversation.unreadCount,
                      status: conversation.status,
                      isGroup: conversation.type === 'group',
                      lastMessageType: conversation.lastMessageType,
                      typing: conversation.typing
                    }}
                    isSelected={selectedConversation?.id === conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      markAsRead(conversation.id);
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone de conversation */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {selectedConversation.type === 'group' ? (
                        <Users className="h-5 w-5 text-primary" />
                      ) : (
                        <span className="text-primary font-medium">
                          {selectedConversation.participants[0]?.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">
                        {selectedConversation.type === 'group'
                          ? `Groupe - ${selectedConversation.participants.join(', ')}`
                          : selectedConversation.participants[0]
                        }
                      </h3>
                      {selectedConversation.sessionName && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>{selectedConversation.sessionName}</span>
                        </div>
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
                    <MessageBubble
                      key={message.id}
                      message={{
                        id: message.id,
                        content: message.content,
                        sender: message.sender,
                        timestamp: message.timestamp,
                        isFromMe: message.senderType === 'trainer',
                        status: message.status
                      }}
                      showAvatar={message.senderType === 'student'}
                      isGroupChat={selectedConversation.type === 'group'}
                    />
                  ))}
                </div>
                
                <TypingIndicator users={typingUsers} />
              </CardContent>
              
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder="Tapez votre message..."
                showAttachments={true}
                showEmoji={true}
                showVoice={true}
              />
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
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
