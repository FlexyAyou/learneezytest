import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, ThumbsUp, MessageSquare, TrendingUp, Award, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerReviews = () => {
  const { toast } = useToast();
  const [filterRating, setFilterRating] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  const reviews = [
    {
      id: 1,
      student: { name: 'Marie Bernard', email: 'marie@example.com', avatar: '' },
      date: '2024-01-10',
      subject: 'React Hooks',
      rating: 5,
      comment: 'Excellente formation! Jean explique très clairement les concepts et les exemples pratiques m\'ont vraiment aidée à comprendre. Je recommande vivement.',
      helpful: 12,
      session: {
        duration: 3,
        price: 135
      },
      replied: true,
      trainerReply: 'Merci Marie pour ce retour très positif ! J\'ai été ravi de vous accompagner dans votre apprentissage de React.'
    },
    {
      id: 2,
      student: { name: 'Pierre Durand', email: 'pierre@example.com', avatar: '' },
      date: '2024-01-08',
      subject: 'JavaScript ES6+',
      rating: 4,
      comment: 'Bonne formation dans l\'ensemble. Le contenu était intéressant mais j\'aurais aimé avoir plus d\'exemples concrets et d\'exercices pratiques.',
      helpful: 8,
      session: {
        duration: 2,
        price: 80
      },
      replied: false,
      trainerReply: null
    },
    {
      id: 3,
      student: { name: 'Sophie Martin', email: 'sophie@example.com', avatar: '' },
      date: '2024-01-05',
      subject: 'UI/UX Design',
      rating: 5,
      comment: 'Formation très enrichissante! Jean maîtrise parfaitement son sujet et sait transmettre sa passion. Les outils présentés sont vraiment utiles.',
      helpful: 15,
      session: {
        duration: 3,
        price: 150
      },
      replied: true,
      trainerReply: 'Merci Sophie ! C\'était un plaisir de partager ma passion pour le design avec vous.'
    },
    {
      id: 4,
      student: { name: 'Thomas Petit', email: 'thomas@example.com', avatar: '' },
      date: '2024-01-03',
      subject: 'Node.js API',
      rating: 4,
      comment: 'Contenu de qualité et formateur compétent. Le rythme était un peu soutenu mais j\'ai appris beaucoup de choses utiles.',
      helpful: 6,
      session: {
        duration: 2,
        price: 96
      },
      replied: false,
      trainerReply: null
    },
    {
      id: 5,
      student: { name: 'Emma Dubois', email: 'emma@example.com', avatar: '' },
      date: '2023-12-28',
      subject: 'TypeScript',
      rating: 5,
      comment: 'Parfait pour débuter avec TypeScript! La progression est bien pensée et les explications sont claires.',
      helpful: 10,
      session: {
        duration: 2,
        price: 90
      },
      replied: true,
      trainerReply: 'Merci Emma ! TypeScript peut sembler intimidant au début mais vous avez très bien suivi.'
    },
    {
      id: 6,
      student: { name: 'Lucas Moreau', email: 'lucas@example.com', avatar: '' },
      date: '2023-12-25',
      subject: 'React',
      rating: 3,
      comment: 'Formation correcte mais j\'ai eu du mal à suivre certains concepts. Peut-être prévoir plus de temps pour les bases.',
      helpful: 4,
      session: {
        duration: 2,
        price: 80
      },
      replied: false,
      trainerReply: null
    }
  ];

  const subjects = ['React', 'JavaScript', 'UI/UX Design', 'Node.js', 'TypeScript'];

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    const matchesSubject = filterSubject === 'all' || review.subject.includes(filterSubject);
    return matchesRating && matchesSubject;
  });

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalHelpful = reviews.reduce((acc, review) => acc + review.helpful, 0);
  const responseRate = (reviews.filter(r => r.replied).length / reviews.length * 100);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length * 100)
  }));

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText('');
    setIsReplyDialogOpen(true);
  };

  const submitReply = () => {
    if (!replyText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre réponse",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Réponse publiée",
      description: "Votre réponse a été envoyée à l'étudiant et publiée publiquement",
    });

    setIsReplyDialogOpen(false);
    setReplyText('');
    setSelectedReview(null);
  };

  const renderStars = (rating: number, size = 'text-base') => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Évaluations</h1>
        <p className="text-muted-foreground">Consultez les retours et notes de vos élèves</p>
      </div>

      {/* Statistiques des évaluations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <p className="text-muted-foreground text-sm">Note moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{reviews.length}</p>
                <p className="text-muted-foreground text-sm">Évaluations totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ThumbsUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{totalHelpful}</p>
                <p className="text-muted-foreground text-sm">Votes utiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{responseRate.toFixed(0)}%</p>
                <p className="text-muted-foreground text-sm">Taux de réponse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Répartition des notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Répartition des notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{item.stars}</span>
                  <Star className="h-3 w-3 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {item.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Filtres */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Note</label>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les notes</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Spécialité</label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les spécialités</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des évaluations */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {review.student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{review.student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(review.date)} • {review.subject}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating, 'text-lg')}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {review.session.duration}h • {review.session.price}€
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">{review.comment}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {review.helpful} personnes ont trouvé cela utile
                  </span>
                </div>
                
                {!review.replied && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleReply(review)}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Répondre
                  </Button>
                )}
              </div>

              {review.replied && review.trainerReply && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">J</span>
                    </div>
                    <span className="font-medium text-blue-900">Jean Martin (Formateur)</span>
                  </div>
                  <p className="text-blue-800">{review.trainerReply}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucune évaluation trouvée</h3>
              <p className="text-muted-foreground">
                Aucune évaluation ne correspond à vos critères de filtre.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog pour répondre */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Répondre à l'évaluation</DialogTitle>
            <DialogDescription>
              Votre réponse sera visible publiquement et envoyée par email à l'étudiant
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="font-medium">{selectedReview.student.name}</span>
                <div className="flex ml-2">
                  {renderStars(selectedReview.rating, 'text-sm')}
                </div>
              </div>
              <p className="text-sm text-gray-600">"{selectedReview.comment}"</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Textarea
              placeholder="Écrivez votre réponse..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={submitReply}>
              Publier la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerReviews;