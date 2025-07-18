
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Search, Plus, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const InstructorMessaging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      participant: 'Marie Dubois',
      role: 'Étudiant',
      lastMessage: 'Merci pour votre aide sur le module React Hooks!',
      timestamp: '14:30',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b78bd5e0?w=40&h=40&fit=crop&crop=face',
      status: 'online'
    },
    {
      id: 2,
      participant: 'Pierre Martin',
      role: 'Étudiant',
      lastMessage: 'J\'ai une question sur l\'exercice 3 du cours JavaScript...',
      timestamp: '12:15',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      status: 'offline'
    },
    {
      id: 3,
      participant: 'Admin Support',
      role: 'Administrateur',
      lastMessage: 'Nouvelle politique de publication des cours',
      timestamp: '10:45',
      unread: 1,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      status: 'online'
    },
    {
      id: 4,
      participant: 'Sophie Laurent',
      role: 'Étudiant',
      lastMessage: 'Est-ce que vous pourriez m\'expliquer...',
      timestamp: 'Hier',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      status: 'offline'
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: 'Marie Dubois',
        content: 'Bonjour, j\'ai une question sur le module React Hooks. Comment utiliser useEffect avec des dépendances?',
        timestamp: '14:15',
        isFromMe: false
      },
      {
        id: 2,
        sender: 'Vous',
        content: 'Bonjour Marie! Excellente question. useEffect avec des dépendances permet de contrôler quand l\'effet se déclenche. Par exemple: useEffect(() => { // votre code }, [dependency])',
        timestamp: '14:20',
        isFromMe: true
      },
      {
        id: 3,
        sender: 'Marie Dubois',
        content: 'Merci pour votre aide sur le module React Hooks!',
        timestamp: '14:30',
        isFromMe: false
      }
    ],
    2: [
      {
        id: 1,
        sender: 'Pierre Martin',
        content: 'J\'ai une question sur l\'exercice 3 du cours JavaScript...',
        timestamp: '12:15',
        isFromMe: false
      }
    ]
  };

  // Gérer la sélection automatique si venant de la gestion des étudiants
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

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    toast({
      title: "Message envoyé",
      description: `Message envoyé à ${selectedConv?.participant}`,
    });
    setMessageText('');
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
                <CardTitle>Conversations</CardTitle>
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
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.id ? 'bg-pink-50 border-l-4 border-l-pink-500' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={conv.avatar}
                          alt={conv.participant}
                          className="w-10 h-10 rounded-full"
                        />
                        {conv.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900 truncate">{conv.participant}</h4>
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="bg-pink-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{conv.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone de conversation */}
          <Card className="lg:col-span-2">
            {selectedConv ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedConv.avatar}
                      alt={selectedConv.participant}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConv.participant}</h3>
                      <p className="text-sm text-gray-600">{selectedConv.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Messages */}
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isFromMe
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromMe ? 'text-pink-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Zone de saisie */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Tapez votre message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} className="bg-pink-600 hover:bg-pink-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p>Sélectionnez une conversation pour commencer</p>
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
