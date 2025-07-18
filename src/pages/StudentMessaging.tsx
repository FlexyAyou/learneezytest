
import React, { useState } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Home, Book, BarChart3, Award, MessageSquare, User, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DashboardSidebar from '@/components/DashboardSidebar';

const StudentMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [message, setMessage] = useState('');

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/etudiant", icon: Home },
    { title: "Mes cours", href: "/dashboard/etudiant/courses", icon: Book },
    { title: "Progression", href: "/dashboard/etudiant/progress", icon: BarChart3 },
    { title: "Certificats", href: "/dashboard/etudiant/certificates", icon: Award },
    { title: "Messages", href: "/dashboard/etudiant/messages", icon: MessageSquare, isActive: true, badge: "3" },
    { title: "Profil", href: "/profil", icon: User },
    { title: "Paramètres", href: "/dashboard/etudiant/settings", icon: Settings },
  ];

  const userInfo = {
    name: "Jean-Paul Martin",
    email: "jean-paul@email.com"
  };

  const conversations = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "Instructeur",
      course: "React Avancé",
      lastMessage: "Avez-vous terminé le chapitre 3 ?",
      time: "14:30",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Pierre Martin",
      role: "Instructeur",
      course: "Design UX/UI",
      lastMessage: "Le projet final est disponible",
      time: "12:15",
      unread: 1,
      online: false
    },
    {
      id: 3,
      name: "Support InfinitiaX",
      role: "Admin",
      course: "Support",
      lastMessage: "Votre demande a été traitée",
      time: "Hier",
      unread: 0,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Marie Dubois",
      content: "Bonjour Jean-Paul ! Comment avancez-vous avec le cours React ?",
      time: "14:20",
      isMe: false
    },
    {
      id: 2,
      sender: "Moi",
      content: "Bonjour ! Ça va bien, j'ai terminé les 2 premiers chapitres. Très intéressant !",
      time: "14:25",
      isMe: true
    },
    {
      id: 3,
      sender: "Marie Dubois",
      content: "Parfait ! Avez-vous terminé le chapitre 3 ? Il y a quelques exercices pratiques importants.",
      time: "14:30",
      isMe: false
    },
    {
      id: 4,
      sender: "Marie Dubois",
      content: "N'hésitez pas si vous avez des questions sur les hooks !",
      time: "14:30",
      isMe: false
    }
  ];

  const selectedUser = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        title="Espace Étudiant"
        subtitle="Votre parcours d'apprentissage"
        items={sidebarItems}
        userInfo={userInfo}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex">
          {/* Liste des conversations */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Rechercher une conversation..." className="pl-10" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? 'bg-pink-50 border-r-2 border-r-pink-600' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                          <p className="text-xs text-gray-500">{conversation.role} • {conversation.course}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <span className="mt-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* En-tête du chat */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          {selectedUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedUser.role} • {selectedUser.course}
                          {selectedUser.online && <span className="text-green-500 ml-2">En ligne</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isMe 
                          ? 'bg-pink-600 text-white' 
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isMe ? 'text-pink-100' : 'text-gray-500'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Tapez votre message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-10"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-pink-600 hover:bg-pink-700"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMessaging;
