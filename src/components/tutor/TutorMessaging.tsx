import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Search,
  Filter,
  User,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const TutorMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      instructor: 'M. Bertrand',
      student: 'Emma Martin',
      subject: 'Mathématiques',
      lastMessage: 'Emma a bien progressé cette semaine.',
      timestamp: '2024-01-14 15:30',
      unread: 2,
      canMessage: true,
      messages: [
        {
          id: 1,
          sender: 'M. Bertrand',
          content: 'Bonjour, je voulais vous informer qu\'Emma a bien progressé cette semaine en algèbre.',
          timestamp: '2024-01-14 15:20',
          isInstructor: true
        },
        {
          id: 2,
          sender: 'Vous',
          content: 'Merci pour ce retour positif. Y a-t-il des points à améliorer ?',
          timestamp: '2024-01-14 15:25',
          isInstructor: false
        },
        {
          id: 3,
          sender: 'M. Bertrand',
          content: 'Je recommande plus de pratique sur les équations du second degré.',
          timestamp: '2024-01-14 15:30',
          isInstructor: true
        }
      ]
    },
    {
      id: 2,
      instructor: 'Mme Johnson',
      student: 'Emma Martin',
      subject: 'Anglais',
      lastMessage: 'Rendez-vous programmé pour jeudi.',
      timestamp: '2024-01-13 14:20',
      unread: 0,
      canMessage: true,
      messages: [
        {
          id: 1,
          sender: 'Mme Johnson',
          content: 'J\'ai programmé un rendez-vous individuel pour Emma jeudi à 16h.',
          timestamp: '2024-01-13 14:20',
          isInstructor: true
        }
      ]
    },
    {
      id: 3,
      instructor: 'M. Dupont',
      student: 'Lucas Dubois',
      subject: 'Sciences Physiques',
      lastMessage: 'Messagerie désactivée',
      timestamp: '2024-01-12 10:00',
      unread: 0,
      canMessage: false,
      messages: []
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Simulate sending message
      setNewMessage('');
      console.log('Sending message:', newMessage);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
        <p className="text-gray-600">Communication avec les formateurs et gestionnaires</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">{conversation.instructor}</span>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge variant="default" className="text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                    {!conversation.canMessage && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{conversation.student} • {conversation.subject}</p>
                  <p className="text-sm text-gray-800 truncate">{conversation.lastMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">{conversation.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {(() => {
                const conversation = conversations.find(c => c.id === selectedConversation);
                return (
                  <>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <span className="text-lg">{conversation?.instructor}</span>
                          <p className="text-sm text-gray-600 font-normal">
                            {conversation?.student} • {conversation?.subject}
                          </p>
                        </div>
                        <Badge variant={conversation?.canMessage ? "default" : "destructive"}>
                          {conversation?.canMessage ? "Actif" : "Désactivé"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-[450px]">
                      {!conversation?.canMessage ? (
                        <Alert className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            La messagerie est désactivée pour ce formateur. Veuillez contacter l'administration.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <>
                          {/* Messages */}
                          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                            {conversation?.messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.isInstructor ? 'justify-start' : 'justify-end'}`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    message.isInstructor
                                      ? 'bg-white border text-gray-800'
                                      : 'bg-blue-600 text-white'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      message.isInstructor ? 'text-gray-500' : 'text-blue-100'
                                    }`}
                                  >
                                    {message.sender} • {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Message Input */}
                          <div className="flex space-x-2">
                            <Textarea
                              placeholder="Tapez votre message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1 min-h-[60px] resize-none"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button 
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim()}
                              className="self-end"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </>
                );
              })()}
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="mr-2 h-5 w-5" />
            Filtres Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="unread">Non lues ({conversations.filter(c => c.unread > 0).length})</TabsTrigger>
              <TabsTrigger value="active">Actives ({conversations.filter(c => c.canMessage).length})</TabsTrigger>
              <TabsTrigger value="disabled">Désactivées ({conversations.filter(c => !c.canMessage).length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorMessaging;