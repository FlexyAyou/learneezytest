
import React, { useState, useEffect, useMemo } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { fastAPIClient } from '@/services/fastapi-client';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

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

const OFMessaging = () => {
    const { user } = useFastAPIAuth();
    const { toast } = useToast();
    const location = useLocation();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [contacts, setContacts] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = async () => {
        try {
            const [convs, conts] = await Promise.all([
                fastAPIClient.getConversations(),
                fastAPIClient.getContacts()
            ]);
            setConversations(convs);
            setContacts(conts);
        } catch (error) {
            console.error("Error loading messaging data:", error);
        }
    };

    const loadMessages = async (otherUserId: number) => {
        setLoading(true);
        try {
            const data = await fastAPIClient.getMessages(otherUserId);
            setMessages(data);
            // Refresh to update unread count
            loadData();
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // Poll for updates
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            loadMessages(selectedUserId);
            const interval = setInterval(() => loadMessages(selectedUserId), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUserId]);

    useEffect(() => {
        if (location.state?.selectedUserId) {
            setSelectedUserId(location.state.selectedUserId);
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
                description: "Impossible d'envoyer le message.",
                variant: "destructive"
            });
        }
    };

    const selectedUser = conversations.find(c => c.user_id === selectedUserId) || contacts.find(c => c.user_id === selectedUserId);

    const displayConversations = useMemo(() => {
        const merged = new Map<number, Conversation>();
        // Add contacts first (empty state)
        contacts.forEach(c => merged.set(c.user_id, c));
        // Overwrite with actual conversations (history takes precedence)
        conversations.forEach(c => merged.set(c.user_id, c));

        return Array.from(merged.values()).sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }, [conversations, contacts]);

    const filteredConversations = displayConversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-120px)] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            {/* Liste des conversations */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Messages</h2>
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
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.user_id}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUserId === conv.user_id ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
                                    }`}
                                onClick={() => setSelectedUserId(conv.user_id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                {conv.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        {conv.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-sm text-gray-600 truncate flex-1 mr-2">{conv.last_message}</p>
                                            {conv.unread_count > 0 && (
                                                <span className="bg-blue-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            {searchQuery ? "Aucun contact trouvé" : "Aucune conversation"}
                        </div>
                    )}
                </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUserId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {selectedUser?.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-gray-900">{selectedUser?.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedUser?.role === 'apprenant' ? 'Apprenant' : selectedUser?.role}
                                        {selectedUser?.online && <span className="text-green-500 ml-2">• En ligne</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button size="icon" variant="ghost" className="text-gray-500"><Phone className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="text-gray-500"><Video className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="text-gray-500"><MoreVertical className="h-4 w-4" /></Button>
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
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-400'
                                            }`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center space-x-3">
                                <Button size="icon" variant="ghost" className="text-gray-400"><Paperclip className="h-5 w-5" /></Button>
                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="Ecrivez votre message..."
                                        className="pr-12 py-6 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        <Smile className="h-5 w-5" />
                                    </Button>
                                </div>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 rounded-xl transition-all"
                                    onClick={handleSendMessage}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="bg-blue-50 p-6 rounded-full mb-4">
                            <MessageSquare className="h-12 w-12 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Vos messages</h3>
                        <p className="text-gray-500 mt-2 max-w-xs">Sélectionnez une conversation pour commencer à discuter avec vos apprenants ou formateurs.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OFMessaging;
