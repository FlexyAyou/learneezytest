import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Users, 
  Bell, 
  Send, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TrainerCollaboration() {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState('');
  const [newComment, setNewComment] = useState('');

  const [collaborations, setCollaborations] = useState([
    {
      id: 1,
      moduleTitle: "Formation Mathématiquese",
      trainers: [
        { id: 1, name: "Marie Dubois", role: "Formateur expert", avatar: "/api/placeholder/32/32" },
        { id: 2, name: "Pierre Martin", role: "Formateur junior", avatar: "/api/placeholder/32/32" }
      ],
      status: "en_revision",
      lastActivity: "2024-07-22",
      commentsCount: 3,
      hasNotifications: true
    },
    {
      id: 2,
      moduleTitle: "Quiz JavaScript ES6",
      trainers: [
        { id: 3, name: "Sophie Laurent", role: "Formateur senior", avatar: "/api/placeholder/32/32" }
      ],
      status: "valide",
      lastActivity: "2024-07-21",
      commentsCount: 1,
      hasNotifications: false
    },
    {
      id: 3,
      moduleTitle: "Vidéo Introduction TypeScript",
      trainers: [],
      status: "a_assigner",
      lastActivity: "2024-07-20",
      commentsCount: 0,
      hasNotifications: false
    }
  ]);

  const [comments, setComments] = useState([
    {
      id: 1,
      moduleId: 1,
      author: "Marie Dubois",
      role: "Formateur expert",
      content: "Le contenu semble bien structuré, mais je pense qu'il manque quelques exemples pratiques dans la section sur les hooks avancés.",
      timestamp: "2024-07-22 14:30",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      moduleId: 1,
      author: "Pierre Martin",
      role: "Formateur junior",
      content: "D'accord avec Marie. Peut-être ajouter un exercice pratique sur useContext et useReducer ?",
      timestamp: "2024-07-22 15:15",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 3,
      moduleId: 1,
      author: "Vous",
      role: "Créateur de contenu",
      content: "Excellente suggestion ! Je vais ajouter deux exercices pratiques cette semaine.",
      timestamp: "2024-07-22 16:00",
      avatar: "/api/placeholder/32/32"
    }
  ]);

  const [availableTrainers] = useState([
    { id: 4, name: "Jean Dupont", speciality: "JavaScript/React" },
    { id: 5, name: "Anne Moreau", speciality: "UX/UI Design" },
    { id: 6, name: "Lucas Bernard", speciality: "Backend/API" }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      a_creer: { label: "À créer", variant: "secondary" as const, icon: Clock },
      en_revision: { label: "En révision", variant: "outline" as const, icon: AlertCircle },
      valide: { label: "Validé", variant: "default" as const, icon: CheckCircle },
      a_assigner: { label: "À assigner", variant: "destructive" as const, icon: User }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.a_creer;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleAssignTrainer = (moduleId: number, trainerId: number) => {
    toast({
      title: "Formateur assigné",
      description: "Le formateur a été assigné au module avec succès.",
    });
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedModule) return;
    
    const newCommentObj = {
      id: comments.length + 1,
      moduleId: parseInt(selectedModule),
      author: "Vous",
      role: "Créateur de contenu",
      content: newComment,
      timestamp: new Date().toLocaleString('fr-FR'),
      avatar: "/api/placeholder/32/32"
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    toast({
      title: "Commentaire ajouté",
      description: "Votre commentaire a été publié et les formateurs seront notifiés.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Collaboration avec les formateurs</h2>
          <p className="text-muted-foreground">
            Travaillez en équipe sur vos contenus pédagogiques
          </p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Inviter un formateur
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste des collaborations */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Modules en collaboration
              </CardTitle>
              <CardDescription>
                Gérez les assignations et suivez les statuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {collaborations.map((collab) => (
                <div key={collab.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{collab.moduleTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        Dernière activité: {collab.lastActivity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {collab.hasNotifications && (
                        <Bell className="h-4 w-4 text-orange-500" />
                      )}
                      {getStatusBadge(collab.status)}
                    </div>
                  </div>

                  {/* Formateurs assignés */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Formateurs assignés:</label>
                    {collab.trainers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {collab.trainers.map((trainer) => (
                          <div key={trainer.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={trainer.avatar} />
                              <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{trainer.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select onValueChange={(trainerId) => handleAssignTrainer(collab.id, parseInt(trainerId))}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Assigner un formateur" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTrainers.map((trainer) => (
                              <SelectItem key={trainer.id} value={trainer.id.toString()}>
                                {trainer.name} - {trainer.speciality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      {collab.commentsCount} commentaires
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedModule(collab.id.toString())}
                    >
                      Voir détails
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Zone de commentaires */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Commentaires collaboratifs
              </CardTitle>
              <CardDescription>
                Échangez avec vos formateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sélection du module */}
              <div>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent>
                    {collaborations.map((collab) => (
                      <SelectItem key={collab.id} value={collab.id.toString()}>
                        {collab.moduleTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Liste des commentaires */}
              {selectedModule && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments
                    .filter(comment => comment.moduleId === parseInt(selectedModule))
                    .map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Nouveau commentaire */}
              {selectedModule && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleSendComment} disabled={!newComment.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}