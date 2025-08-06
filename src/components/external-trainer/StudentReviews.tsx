
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const StudentReviews = () => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState('newest');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Données d'exemple des avis étudiants
  const reviews = [
    {
      id: '1',
      student: {
        name: 'Theresa Edin',
        avatar: '/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png'
      },
      rating: 4,
      date: '2 months ago',
      course: 'Excellent Course',
      comment: 'Lorem ipsum dolor sit amet. Qui incidunt dolores non similique ducimus et debitis molestiae. Et autem quia eum reprehenderit voluptates est reprehenderit illo est enim perferendis est neque sunt.',
      hasReply: false,
      trainerReply: null
    },
    {
      id: '2',
      student: {
        name: 'Carolyn Welbron',
        avatar: '/lovable-uploads/a2af7b26-415f-4b76-ad63-bb8cbc351c0c.png'
      },
      rating: 4,
      date: '2 months ago',
      course: 'Excellent Course',
      comment: 'Lorem ipsum dolor sit amet. Qui incidunt dolores non similique ducimus et debitis molestiae. Et autem quia eum reprehenderit voluptates est reprehenderit illo est enim perferendis est neque sunt.',
      hasReply: false,
      trainerReply: null
    },
    {
      id: '3',
      student: {
        name: 'Theresa Edin',
        avatar: '/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png'
      },
      rating: 4,
      date: '2 months ago',
      course: 'Excellent Course',
      comment: 'Lorem ipsum dolor sit amet. Qui incidunt dolores non similique ducimus et debitis molestiae. Et autem quia eum reprehenderit voluptates est reprehenderit illo est enim perferendis est neque sunt.',
      hasReply: true,
      trainerReply: 'Merci beaucoup pour votre retour positif ! Je suis ravi que la formation vous ait plu.'
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleReply = (reviewId: string) => {
    setReplyingTo(reviewId);
    setReplyText('');
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
      title: "Réponse envoyée",
      description: "Votre réponse a été publiée avec succès",
    });

    setReplyingTo(null);
    setReplyText('');
  };

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Avis des étudiants
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={review.student.avatar} alt={review.student.name} />
                <AvatarFallback>
                  {review.student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{review.student.name}</h4>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                <p className="text-sm font-medium text-gray-700 mb-2">{review.course}</p>
                <p className="text-gray-600 mb-3">{review.comment}</p>
                
                <div className="flex items-center gap-3">
                  {!review.hasReply && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReply(review.id)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Reply
                    </Button>
                  )}
                  
                  {review.hasReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(review.id)}
                      className="text-gray-600"
                    >
                      {expandedReviews.has(review.id) ? (
                        <>Hide reply <ChevronUp className="w-4 h-4 ml-1" /></>
                      ) : (
                        <>View reply <ChevronDown className="w-4 h-4 ml-1" /></>
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Reply section */}
                {replyingTo === review.id && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <Textarea
                      placeholder="Add a Comment"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="mb-3"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={submitReply}
                        className="bg-pink-500 hover:bg-pink-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Trainer reply */}
                {review.hasReply && expandedReviews.has(review.id) && review.trainerReply && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                      <span className="font-medium text-blue-900">Formateur</span>
                    </div>
                    <p className="text-blue-800 text-sm">{review.trainerReply}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudentReviews;
