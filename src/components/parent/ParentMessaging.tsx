import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Search, Filter, AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ParentMessaging = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      teacherName: "M. Dubois",
      teacherRole: "Formateur Mathématiques",
      studentName: "Emma Martin",
      subject: "Mathématiques",
      lastMessage: "Les derniers exercices sont très bien réalisés. Emma fait de réels progrès !",
      lastMessageDate: "2024-01-16",
      unreadCount: 2,
      messagingEnabled: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      teacherName: "Mme Lefèvre",
      teacherRole: "Gestionnaire Pédagogique",
      studentName: "Emma Martin",
      subject: "Suivi général",
      lastMessage: "Voici le bilan trimestriel d'Emma. Très satisfaisant dans l'ensemble.",
      lastMessageDate: "2024-01-14",
      unreadCount: 0,
      messagingEnabled: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      teacherName: "M. Bernard",
      teacherRole: "Formateur Sciences",
      studentName: "Lucas Martin",
      subject: "Sciences",
      lastMessage: "Lucas participe bien en cours. Je vous enverrai ses notes bientôt.",
      lastMessageDate: "2024-01-12",
      unreadCount: 1,
      messagingEnabled: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      teacherName: "Mme Petit",
      teacherRole: "Formateur Anglais",
      studentName: "Lucas Martin",
      subject: "Anglais",
      lastMessage: "",
      lastMessageDate: "",
      unreadCount: 0,
      messagingEnabled: false,
      avatar: "/placeholder.svg"
    }
  ];

  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: "M. Dubois",
      content: "Bonjour, je souhaitais vous informer qu'Emma fait d'excellents progrès en algèbre.",
      timestamp: "2024-01-16 14:30",
      isFromTeacher: true
    },
    {
      id: 2,
      conversationId: 1,
      sender: "Vous",
      content: "Merci beaucoup ! Nous sommes ravis de ces progrès. Y a-t-il des points à travailler ?",
      timestamp: "2024-01-16 15:45",
      isFromTeacher: false
    },
    {
      id: 3,
      conversationId: 1,
      sender: "M. Dubois",
      content: "Les derniers exercices sont très bien réalisés. Emma fait de réels progrès ! Je recommande de continuer les exercices supplémentaires à la maison.",
      timestamp: "2024-01-16 16:20",
      isFromTeacher: true
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "emma" && conv.studentName === "Emma Martin") ||
                         (selectedFilter === "lucas" && conv.studentName === "Lucas Martin");
    
    return matchesSearch && matchesFilter;
  });

  const selectedConversationData = conversations.find(conv => conv.id === selectedConversation);
  const conversationMessages = messages.filter(msg => msg.conversationId === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Logique d'envoi du message
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messagerie</h1>
          <p className="text-muted-foreground">Communication avec les formateurs et gestionnaires</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Liste des conversations */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="emma">Emma</SelectItem>
                    <SelectItem value="lucas">Lucas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.teacherName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conversation.teacherName}</p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{conversation.teacherRole}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{conversation.studentName}</Badge>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{conversation.subject}</span>
                        </div>
                        {conversation.messagingEnabled ? (
                          <p className="text-sm text-muted-foreground mt-2 truncate">
                            {conversation.lastMessage}
                          </p>
                        ) : (
                          <div className="flex items-center gap-2 mt-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs text-yellow-600">Messagerie désactivée</span>
                          </div>
                        )}
                        {conversation.lastMessageDate && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{conversation.lastMessageDate}</span>
                          </div>
                        )}
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
          {selectedConversationData ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversationData.avatar} />
                    <AvatarFallback>{selectedConversationData.teacherName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConversationData.teacherName}</CardTitle>
                    <CardDescription>
                      {selectedConversationData.teacherRole} • {selectedConversationData.subject}
                    </CardDescription>
                    <Badge variant="outline" className="mt-1">{selectedConversationData.studentName}</Badge>
                  </div>
                </div>
              </CardHeader>

              {selectedConversationData.messagingEnabled ? (
                <>
                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isFromTeacher ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.isFromTeacher 
                              ? 'bg-muted text-foreground' 
                              : 'bg-primary text-primary-foreground'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isFromTeacher ? 'text-muted-foreground' : 'text-primary-foreground/80'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Zone de saisie */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 min-h-[80px] resize-none"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      La messagerie est désactivée pour ce formateur. 
                      Veuillez contacter l'administration pour plus d'informations.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium">Sélectionnez une conversation</p>
                  <p className="text-muted-foreground">
                    Choisissez une conversation dans la liste pour commencer à échanger
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentMessaging;