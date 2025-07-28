
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { MessageBubble } from '@/components/messaging/MessageBubble';
import { ConversationItem } from '@/components/messaging/ConversationItem';
import { MessageInput } from '@/components/messaging/MessageInput';
import { TypingIndicator } from '@/components/messaging/TypingIndicator';

const InstructorMessaging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const conversations = [
    {
      id: '1',
      participant: 'Marie Dubois',
      role: 'Étudiant',
      lastMessage: 'Merci pour votre aide sur le module React Hooks!',
      timestamp: '14:30',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b78bd5e0?w=40&h=40&fit=crop&crop=face',
      status: 'online' as const,
      lastMessageType: 'text' as const
    },
    {
      id: '2',
      participant: 'Pierre Martin',
      role: 'Étudiant',
      lastMessage: 'J\'ai une question sur l\'exercice 3 du cours JavaScript...',
      timestamp: '12:15',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      status: 'offline' as const,
      lastMessageType: 'text' as const
    },
    {
      id: '3',
      participant: 'Admin Support',
      role: 'Administrateur',
      lastMessage: 'Nouvelle politique de publication des cours',
      timestamp: '10:45',
      unread: 1,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      status: 'online' as const,
      lastMessageType: 'text' as const
    },
    {
      id: '4',
      participant: 'Sophie Laurent',
      role: 'Étudiant',
      lastMessage: 'Est-ce que vous pourriez m\'expliquer...',
      timestamp: 'Hier',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      status: 'offline' as const,
      lastMessageType: 'text' as const,
      typing: false
    }
  ];

  const messages = {
    '1': [
      {
        id: '1',
        sender: 'Marie Dubois',
        content: 'Bonjour, j\'ai une question sur le module React Hooks. Comment utiliser useEffect avec des dépendances?',
        timestamp: '14:15',
        isFromMe: false,
        status: 'read' as const
      },
      {
        id: '2',
        sender: 'Vous',
        content: 'Bonjour Marie! Excellente question. useEffect avec des dépendances permet de contrôler quand l\'effet se déclenche. Par exemple: useEffect(() => { // votre code }, [dependency])',
        timestamp: '14:20',
        isFromMe: true,
        status: 'read' as const
      },
      {
        id: '3',
        sender: 'Marie Dubois',
        content: 'Merci pour votre aide sur le module React Hooks!',
        timestamp: '14:30',
        isFromMe: false,
        status: 'delivered' as const
      }
    ],
    '2': [
      {
        id: '1',
        sender: 'Pierre Martin',
        content: 'J\'ai une question sur l\'exercice 3 du cours JavaScript...',
        timestamp: '12:15',
        isFromMe: false,
        status: 'read' as const
      }
    ]
  };

  useEffect(() => {
    if (location.state?.studentId) {
      const studentConversation = conversations.find(conv => 
        conv.participant === location.state.studentName
      );
      if (studentConversation) {
        setSelectedConversation(studentConversation.id);
      }
    }
  }, [location.state]);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation as keyof typeof messages] || [] : [];

  const handleSendMessage = (messageText: string, attachments?: File[]) => {
    if (!messageText.trim() && !attachments?.length) return;
    if (!selectedConversation) return;

    toast({
      title: "Message envoyé",
      description: `Message envoyé à ${selectedConv?.participant}`,
    });

    // Simuler la frappe
    setTypingUsers(['Marie Dubois']);
    setTimeout(() => {
      setTypingUsers([]);
    }, 3000);
  };

  const handleNewConversation = () => {
    toast({
      title: "Nouvelle conversation",
      description: "Interface de sélection de destinataire",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/instructeur')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
            <p className="text-gray-600">Communiquez avec vos étudiants et l'équipe</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Liste des conversations */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Conversations
                </CardTitle>
                <Button size="sm" onClick={handleNewConversation}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[450px] overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isSelected={selectedConversation === conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone de conversation */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConv ? (
              <>
                <CardHeader className="border-b flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-medium text-sm">
                        {selectedConv.participant.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConv.participant}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        {selectedConv.role}
                        <span className={`ml-2 w-2 h-2 rounded-full ${
                          selectedConv.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        showAvatar={!message.isFromMe}
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
                />
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
                  <p>Choisissez une conversation pour commencer à discuter</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorMessaging;
