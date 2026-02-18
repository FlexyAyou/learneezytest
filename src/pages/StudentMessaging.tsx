import React, { useState, useEffect } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Building2, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';
import { useStudentContext } from '@/hooks/useStudentContext';
import { fastAPIClient } from '@/services/fastapi-client';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  user_id: number;
  name: string;
  role: string;
  last_message: string;
  timestamp: string;
  unread_count: number;
  online: boolean;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  timestamp: string;
  is_read: boolean;
}

const StudentMessaging = () => {
  const { user } = useFastAPIAuth();
  const location = useLocation();
  const { isOFStudent, ofName } = useStudentContext();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = async () => {
    try {
      const data = await fastAPIClient.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (otherUserId: number) => {
    try {
      const data = await fastAPIClient.getMessages(otherUserId);
      setMessages(data);
      loadConversations();
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
      const interval = setInterval(() => loadMessages(selectedUserId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  // Handle selected contact from navigation
  useEffect(() => {
    if (location.state?.selectedContactId) {
      setSelectedUserId(location.state.selectedContactId);
    }
  }, [location.state]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      await fastAPIClient.sendMessage({
        receiver_id: selectedUserId,
        content: newMessage
      });
      setNewMessage('');
      loadMessages(selectedUserId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Envoi échoué.",
        variant: "destructive"
      });
    }
  };

  const selectedUser = conversations.find(conv => conv.user_id === selectedUserId);
  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex">
          {/* Liste des conversations */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">
                {isOFStudent ? "Mes contacts" : "Messages"}
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.user_id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUserId === conversation.user_id ? 'bg-pink-50 border-r-2 border-r-pink-600' : ''
                    }`}
                  onClick={() => setSelectedUserId(conversation.user_id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className={conversation.role === "organisme_formation"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-pink-100 text-pink-600"
                        }>
                          {conversation.role === "organisme_formation"
                            ? <Building2 className="h-4 w-4" />
                            : conversation.name.split(' ').map(n => n[0]).join('')
                          }
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
                          <p className="text-xs text-gray-500 uppercase">{conversation.role}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-gray-500">
                            {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {conversation.unread_count > 0 && (
                            <span className="mt-1 bg-pink-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                              {conversation.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{conversation.last_message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedUser ? (
              <>
                {/* En-tête du chat */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className={selectedUser.role === "organisme_formation"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-pink-100 text-pink-600"
                        }>
                          {selectedUser.role === "organisme_formation"
                            ? <Building2 className="h-4 w-4" />
                            : selectedUser.name.split(' ').map(n => n[0]).join('')
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                        <p className="text-xs text-gray-500 uppercase">
                          {selectedUser.role}
                          {selectedUser.online && <span className="text-green-500 ml-2">• En ligne</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="icon" variant="ghost" className="text-gray-500"><Phone className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-gray-500"><Video className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-gray-500"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${msg.sender_id === user?.id
                          ? 'bg-pink-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
                        }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${msg.sender_id === user?.id ? 'text-pink-100' : 'text-gray-400'
                          }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="ghost" className="text-gray-400"><Paperclip className="h-5 w-5" /></Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-10 py-6 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-pink-500"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6 h-12 rounded-xl"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="bg-pink-50 p-6 rounded-full mb-4">
                  <MessageSquare className="h-12 w-12 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Vos messages</h3>
                <p className="text-gray-500 mt-2 max-w-xs">Sélectionnez une conversation pour commencer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMessaging;
