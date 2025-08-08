import React from 'react';
import { Clock, Users, Star } from 'lucide-react';
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
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const getBadgeColor = (level: string) => {
    if (['CP', 'CE1', 'CE2', 'CM1', 'CM2'].includes(level)) {
      return 'bg-pink-100 text-pink-800';
    } else if (['6ème', '5ème', '4ème', '3ème'].includes(level)) {
      return 'bg-purple-100 text-purple-800';
    } else if (['2nde', '1ère', 'Terminale'].includes(level)) {
      return 'bg-pink-100 text-pink-800';
    }
    return 'bg-purple-100 text-purple-800';
  };

  const getCycleColor = (cycle: string) => {
    switch (cycle) {
      case 'élémentaire': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'secondaire': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-pink-50 text-pink-700 border-pink-200';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`text-xs font-medium ${getBadgeColor(course.level)}`}>
            {course.level}
          </Badge>
          <Badge className={`text-xs border ${getCycleColor(course.cycle)}`}>
            {course.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs px-2 py-1">
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
        
        <div className="flex items-center justify-end gap-2">
          <Link to={`/cours/${course.id}`}>
            <Button variant="outline" size="sm">
              Voir détails
            </Button>
          </Link>
          <Link to={`/cours/${course.id}/reservation`}>
            <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              S'inscrire
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;