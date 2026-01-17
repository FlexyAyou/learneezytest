import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  ShoppingCart, 
  CheckCircle,
  Play,
  Coins,
  Sparkles
} from 'lucide-react';
import { CourseResponse } from '@/types/fastapi';
import DOMPurify from 'dompurify';

// Helper pour nettoyer le HTML et extraire le texte brut
const stripHtmlTags = (html: string | null | undefined): string => {
  if (!html) return '';
  // Nettoyer le HTML puis extraire le texte
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  // Décoder les entités HTML comme &nbsp;
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  return doc.body.textContent || '';
};

interface CourseCatalogCardProps {
  course: CourseResponse;
  onPurchase: (course: CourseResponse) => void;
  isEnrolled?: boolean;
  userTokenBalance: number;
  isLoading?: boolean;
}

export const CourseCatalogCard = ({ 
  course, 
  onPurchase, 
  isEnrolled = false, 
  userTokenBalance,
  isLoading = false 
}: CourseCatalogCardProps) => {
  const tokenPrice = course.price || 0;
  const canAfford = userTokenBalance >= tokenPrice;
  
  const getCategoryName = () => {
    if (course.category_names && course.category_names.length > 0) {
      return course.category_names[0];
    }
    return course.category || 'Formation';
  };

  const getOwnerName = () => {
    if (course.owner_type === 'learneezy') {
      return 'Learneezy';
    }
    return 'Organisme certifié';
  };

  const getTotalLessons = () => {
    return course.modules?.reduce((total, module) => total + (module.content?.length || 0), 0) || 0;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        {course.image_url || (course.thumbnails && course.thumbnails.length > 0) ? (
          <img
            src={course.image_url || course.thumbnails![0]}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-token/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/50" />
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-pink-600 text-white font-bold px-3 py-1.5 text-sm shadow-lg">
            <Coins className="h-3.5 w-3.5 mr-1.5" />
            {tokenPrice} tokens
          </Badge>
        </div>

        {/* Enrolled Badge */}
        {isEnrolled && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-success text-success-foreground font-medium shadow-lg">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Inscrit
            </Badge>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Category & Level */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs font-medium">
            {getCategoryName()}
          </Badge>
          {course.level && (
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {stripHtmlTags(course.description)}
          </p>
        </div>

        {/* Author */}
        <p className="text-sm text-muted-foreground">
          Par <span className="font-medium text-foreground">{getOwnerName()}</span>
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{course.duration || 'Non défini'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>{getTotalLessons()} leçons</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isEnrolled ? (
            <Button 
              className="w-full bg-success hover:bg-success/90 text-success-foreground gap-2"
              onClick={() => window.location.href = `/dashboard/apprenant/courses/${course.id}`}
            >
              <Play className="h-4 w-4" />
              Continuer le cours
            </Button>
          ) : (
            <Button
              className={`w-full gap-2 ${
                canAfford 
                  ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              onClick={() => canAfford && onPurchase(course)}
              disabled={!canAfford || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Traitement...
                </>
              ) : canAfford ? (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Acheter • {tokenPrice} tokens
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4" />
                  Solde insuffisant
                </>
              )}
            </Button>
          )}
        </div>

        {/* Insufficient balance message */}
        {!isEnrolled && !canAfford && (
          <p className="text-xs text-center text-destructive">
            Il vous manque {tokenPrice - userTokenBalance} tokens
          </p>
        )}
      </CardContent>
    </Card>
  );
};
