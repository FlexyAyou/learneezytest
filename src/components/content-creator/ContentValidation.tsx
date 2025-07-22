import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  X, 
  Clock, 
  MessageSquare, 
  Star,
  FileText,
  AlertTriangle,
  Search,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ContentValidation() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [validationComment, setValidationComment] = useState('');
  const [selectedContent, setSelectedContent] = useState<number | null>(null);

  const [validationQueue, setValidationQueue] = useState([
    {
      id: 1,
      title: "Formation Sécurité Informatique",
      author: "Marie Dubois",
      authorAvatar: "/api/placeholder/32/32",
      submissionDate: "2024-07-22",
      type: "SCORM",
      status: "en_attente",
      priority: "haute",
      description: "Module de formation sur les bonnes pratiques de sécurité informatique en entreprise",
      criteria: {
        pedagogical: { checked: false, comment: "" },
        technical: { checked: false, comment: "" },
        accessibility: { checked: false, comment: "" },
        content: { checked: false, comment: "" }
      }
    },
    {
      id: 2,
      title: "Quiz React Hooks Avancés",
      author: "Pierre Martin",
      authorAvatar: "/api/placeholder/32/32",
      submissionDate: "2024-07-21",
      type: "H5P",
      status: "valide",
      priority: "moyenne",
      description: "Quiz interactif sur l'utilisation avancée des hooks React",
      criteria: {
        pedagogical: { checked: true, comment: "Objectifs pédagogiques clairs" },
        technical: { checked: true, comment: "Fonctionnement correct" },
        accessibility: { checked: true, comment: "Conforme WCAG 2.1" },
        content: { checked: true, comment: "Contenu pertinent et à jour" }
      }
    },
    {
      id: 3,
      title: "Vidéo Introduction TypeScript",
      author: "Sophie Laurent",
      authorAvatar: "/api/placeholder/32/32",
      submissionDate: "2024-07-20",
      type: "Vidéo",
      status: "refuse",
      priority: "basse",
      description: "Vidéo d'introduction aux concepts de base de TypeScript",
      criteria: {
        pedagogical: { checked: false, comment: "Progression trop rapide pour les débutants" },
        technical: { checked: true, comment: "Qualité audio/vidéo correcte" },
        accessibility: { checked: false, comment: "Manque de sous-titres" },
        content: { checked: true, comment: "Contenu technique correct" }
      }
    }
  ]);

  const qualityCriteria = [
    {
      key: 'pedagogical',
      label: 'Pédagogie',
      description: 'Objectifs clairs, progression logique, activités adaptées'
    },
    {
      key: 'technical',
      label: 'Technique',
      description: 'Fonctionnement correct, compatibilité, performance'
    },
    {
      key: 'accessibility',
      label: 'Accessibilité',
      description: 'Conformité WCAG, navigation au clavier, contrastes'
    },
    {
      key: 'content',
      label: 'Contenu',
      description: 'Exactitude, actualité, pertinence des informations'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { label: "En attente", variant: "outline" as const, icon: Clock },
      valide: { label: "Validé", variant: "default" as const, icon: CheckCircle },
      refuse: { label: "Refusé", variant: "destructive" as const, icon: X },
      en_revision: { label: "En révision", variant: "secondary" as const, icon: MessageSquare }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.en_attente;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      haute: { label: "Haute", className: "bg-red-100 text-red-800" },
      moyenne: { label: "Moyenne", className: "bg-yellow-100 text-yellow-800" },
      basse: { label: "Basse", className: "bg-green-100 text-green-800" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleValidate = (id: number) => {
    setValidationQueue(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'valide' } : item
      )
    );
    toast({
      title: "Contenu validé",
      description: "Le contenu a été approuvé et publié.",
    });
  };

  const handleReject = (id: number) => {
    if (!validationComment.trim()) {
      toast({
        title: "Commentaire requis",
        description: "Veuillez ajouter un commentaire expliquant le refus.",
        variant: "destructive"
      });
      return;
    }
    
    setValidationQueue(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'refuse' } : item
      )
    );
    setValidationComment('');
    toast({
      title: "Contenu refusé",
      description: "Le créateur a été notifié avec vos commentaires.",
    });
  };

  const filteredQueue = validationQueue.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Validation des contenus</h2>
          <p className="text-muted-foreground">
            Reviewez et approuvez les contenus pédagogiques
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {validationQueue.filter(item => item.status === 'en_attente').length} en attente
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="en-attente" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="en-attente">En attente</TabsTrigger>
          <TabsTrigger value="valides">Validés</TabsTrigger>
          <TabsTrigger value="refuses">Refusés</TabsTrigger>
          <TabsTrigger value="criteres">Critères qualité</TabsTrigger>
        </TabsList>

        <TabsContent value="en-attente" className="space-y-4">
          {/* Recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un contenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Liste des contenus en attente */}
          <div className="space-y-4">
            {filteredQueue
              .filter(item => item.status === 'en_attente')
              .map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <Badge variant="outline">{item.type}</Badge>
                            {getPriorityBadge(item.priority)}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={item.authorAvatar} />
                              <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                            </Avatar>
                            <span>{item.author}</span>
                            <span>•</span>
                            <Calendar className="h-4 w-4" />
                            <span>Soumis le {item.submissionDate}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground max-w-2xl">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                        </div>
                      </div>

                      {/* Zone de validation */}
                      <div className="border-t pt-4 space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Commentaire de validation</label>
                          <Textarea
                            placeholder="Ajouter un commentaire (obligatoire en cas de refus)..."
                            value={validationComment}
                            onChange={(e) => setValidationComment(e.target.value)}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedContent(selectedContent === item.id ? null : item.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Voir critères
                          </Button>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(item.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Refuser
                            </Button>
                            <Button
                              onClick={() => handleValidate(item.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Valider
                            </Button>
                          </div>
                        </div>

                        {/* Critères de qualité détaillés */}
                        {selectedContent === item.id && (
                          <div className="border rounded-lg p-4 bg-muted/30">
                            <h4 className="font-medium mb-3">Évaluation par critères</h4>
                            <div className="grid gap-3">
                              {qualityCriteria.map((criterion) => (
                                <div key={criterion.key} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <label className="font-medium">{criterion.label}</label>
                                      <p className="text-sm text-muted-foreground">
                                        {criterion.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {item.criteria[criterion.key as keyof typeof item.criteria].checked ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <X className="h-5 w-5 text-red-500" />
                                      )}
                                    </div>
                                  </div>
                                  {item.criteria[criterion.key as keyof typeof item.criteria].comment && (
                                    <p className="text-sm bg-background p-2 rounded border">
                                      {item.criteria[criterion.key as keyof typeof item.criteria].comment}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="valides">
          <div className="space-y-4">
            {filteredQueue
              .filter(item => item.status === 'valide')
              .map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Par {item.author} • Validé le {item.submissionDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.type}</Badge>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="refuses">
          <div className="space-y-4">
            {filteredQueue
              .filter(item => item.status === 'refuse')
              .map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Par {item.author} • Refusé le {item.submissionDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.type}</Badge>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="criteres">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Critères de qualité
              </CardTitle>
              <CardDescription>
                Standards d'évaluation pour la validation des contenus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {qualityCriteria.map((criterion) => (
                <div key={criterion.key} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{criterion.label}</h3>
                  <p className="text-muted-foreground mb-3">{criterion.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <h4 className="font-medium">Points de contrôle:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {criterion.key === 'pedagogical' && (
                        <>
                          <li>Objectifs d'apprentissage clairement définis</li>
                          <li>Progression logique et adaptée au niveau</li>
                          <li>Activités variées et engageantes</li>
                          <li>Évaluation cohérente avec les objectifs</li>
                        </>
                      )}
                      {criterion.key === 'technical' && (
                        <>
                          <li>Fonctionnement correct sur différents navigateurs</li>
                          <li>Temps de chargement acceptable</li>
                          <li>Responsive design et compatibilité mobile</li>
                          <li>Absence d'erreurs techniques</li>
                        </>
                      )}
                      {criterion.key === 'accessibility' && (
                        <>
                          <li>Navigation possible au clavier</li>
                          <li>Contrastes de couleurs suffisants</li>
                          <li>Textes alternatifs pour les images</li>
                          <li>Structure sémantique correcte</li>
                        </>
                      )}
                      {criterion.key === 'content' && (
                        <>
                          <li>Informations exactes et vérifiées</li>
                          <li>Contenu à jour et pertinent</li>
                          <li>Langage adapté au public cible</li>
                          <li>Respect des droits d'auteur</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}