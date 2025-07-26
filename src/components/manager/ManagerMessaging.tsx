import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  Users, 
  Search,
  Plus,
  Archive,
  Star,
  Reply,
  Forward,
  Trash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagerMessaging = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });

  const conversations = [
    {
      id: 1,
      name: 'Marie Dubois',
      role: 'Formatrice',
      lastMessage: 'Confirmation de la session React prévue demain',
      time: '10:30',
      unread: true,
      starred: false
    },
    {
      id: 2,
      name: 'Jean Martin',
      role: 'Formateur',
      lastMessage: 'Rapport de présence - Session Management',
      time: '09:15',
      unread: true,
      starred: true
    },
    {
      id: 3,
      name: 'Alice Bernard',
      role: 'Apprenante',
      lastMessage: 'Question sur le planning de formation',
      time: 'Hier',
      unread: false,
      starred: false
    },
    {
      id: 4,
      name: 'Thomas Petit',
      role: 'Apprenant',
      lastMessage: 'Demande de report de session',
      time: 'Hier',
      unread: false,
      starred: false
    },
    {
      id: 5,
      name: 'Emma Moreau',
      role: 'Apprenante',
      lastMessage: 'Certificat de fin de formation',
      time: '2 jours',
      unread: false,
      starred: true
    }
  ];

  const messageDetails = {
    1: {
      sender: 'Marie Dubois',
      role: 'Formatrice',
      subject: 'Confirmation de la session React prévue demain',
      time: '10:30 - Aujourd\'hui',
      content: 'Bonjour Sophie,\n\nJe vous confirme que la session de formation Mathématiques prévue demain à 14h00 aura bien lieu. J\'ai préparé le matériel pédagogique et les exercices pratiques.\n\nLes 12 participants inscrits ont tous confirmé leur présence. La salle B203 est réservée et l\'équipement technique a été vérifié.\n\nY a-t-il des points particuliers que vous souhaiteriez que j\'aborde pendant cette session ?\n\nCordialement,\nMarie'
    }
  };

  const handleSendMessage = () => {
    if (newMessage.to && newMessage.subject && newMessage.content) {
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès.",
      });
      setNewMessage({ to: '', subject: '', content: '' });
    }
  };

  const handleReply = () => {
    toast({
      title: "Réponse en cours",
      description: "Rédaction de la réponse...",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communiquez avec les formateurs et apprenants</p>
        </div>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau message
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'inbox' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('inbox')}
          className="flex items-center"
        >
          <Inbox className="mr-2 h-4 w-4" />
          Boîte de réception
        </Button>
        <Button
          variant={activeTab === 'compose' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('compose')}
          className="flex items-center"
        >
          <Send className="mr-2 h-4 w-4" />
          Rédiger
        </Button>
        <Button
          variant={activeTab === 'contacts' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('contacts')}
          className="flex items-center"
        >
          <Users className="mr-2 h-4 w-4" />
          Contacts
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Conversations</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedMessage === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => setSelectedMessage(conv.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{conv.name}</p>
                          <Badge variant="outline" className="text-xs">{conv.role}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {conv.starred && <Star className="h-4 w-4 text-yellow-500" />}
                        {conv.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">{conv.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-3">
            {selectedMessage && messageDetails[selectedMessage as keyof typeof messageDetails] && (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {messageDetails[selectedMessage as keyof typeof messageDetails].subject}
                      </CardTitle>
                      <CardDescription>
                        De: {messageDetails[selectedMessage as keyof typeof messageDetails].sender} • {messageDetails[selectedMessage as keyof typeof messageDetails].time}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={handleReply}>
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Forward className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">
                      {messageDetails[selectedMessage as keyof typeof messageDetails].content}
                    </p>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  {/* Quick Reply */}
                  <div className="space-y-4">
                    <Label>Réponse rapide</Label>
                    <Textarea 
                      placeholder="Tapez votre réponse..."
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleReply}>
                        <Send className="mr-2 h-4 w-4" />
                        Répondre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'compose' && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau message</CardTitle>
            <CardDescription>Envoyez un message à un formateur ou apprenant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Destinataire</Label>
              <Select value={newMessage.to} onValueChange={(value) => setNewMessage({...newMessage, to: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un destinataire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marie.dubois@learneezy.com">Marie Dubois - Formatrice</SelectItem>
                  <SelectItem value="jean.martin@learneezy.com">Jean Martin - Formateur</SelectItem>
                  <SelectItem value="alice.bernard@learneezy.com">Alice Bernard - Apprenante</SelectItem>
                  <SelectItem value="thomas.petit@learneezy.com">Thomas Petit - Apprenant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                placeholder="Objet du message"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                placeholder="Rédigez votre message..."
                className="min-h-[200px]"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSendMessage} disabled={!newMessage.to || !newMessage.subject || !newMessage.content}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Formateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Formateurs</CardTitle>
              <CardDescription>Votre équipe de formation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Marie Dubois', email: 'marie.dubois@learneezy.com', specialty: 'Développement Web' },
                { name: 'Jean Martin', email: 'jean.martin@learneezy.com', specialty: 'Management' },
                { name: 'Claire Roussel', email: 'claire.roussel@learneezy.com', specialty: 'SVP' }
              ].map((contact, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-600">{contact.specialty}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Apprenants Récents */}
          <Card>
            <CardHeader>
              <CardTitle>Apprenants Actifs</CardTitle>
              <CardDescription>Contacts récents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Alice Bernard', email: 'alice.bernard@learneezy.com', course: 'React Development' },
                { name: 'Thomas Petit', email: 'thomas.petit@learneezy.com', course: 'UI/UX Design' },
                { name: 'Emma Moreau', email: 'emma.moreau@learneezy.com', course: 'Project Management' }
              ].map((contact, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-600">{contact.course}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Groupes */}
          <Card>
            <CardHeader>
              <CardTitle>Groupes de Discussion</CardTitle>
              <CardDescription>Communications d'équipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Équipe Formation', members: 8, description: 'Coordination pédagogique' },
                { name: 'Gestionnaires', members: 4, description: 'Réunions de gestion' },
                { name: 'Support Technique', members: 6, description: 'Assistance technique' }
              ].map((group, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{group.name}</p>
                      <p className="text-xs text-gray-600">{group.members} membres</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManagerMessaging;