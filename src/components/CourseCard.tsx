
import React from 'react';
import { Clock, Users, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    instructor: string;
    image: string;
    duration: string;
    students: number;
    rating: number;
    price: string;
    originalPrice: string;
    level: string;
    category: string;
    cycle: string;
    availableSlots: number;
    description: string;
    completed?: boolean;
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const handleDownloadProgram = () => {
    // Simuler le téléchargement du programme
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Programme de formation: ${course.title}\nFormateur: ${course.instructor}\nDurée: ${course.duration}\nDescription: ${course.description}`);
    element.download = `programme-${course.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative">
      {/* Badge formation complétée */}
      {course.completed && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-green-500 text-white font-medium">
            ✅ Formation suivie
          </Badge>
        </div>
      )}
      
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs px-2 py-1">
            {course.price}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {course.description}
        </p>
        
        <p className="text-sm text-gray-600 mb-3">Par {course.instructor}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link to={`/cours/${course.id}`}>
              <Button variant="outline" size="sm">
                Voir détails
              </Button>
            </Link>
            {/* Bouton de téléchargement du programme */}
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0"
              onClick={handleDownloadProgram}
              title="Télécharger le programme de formation"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          {course.completed ? (
            <Link to="/dashboard/etudiant/courses">
              <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                Mon parcours
              </Button>
            </Link>
          ) : (
            <Link to={`/cours/${course.id}/reservation`}>
              <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                S'inscrire
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
