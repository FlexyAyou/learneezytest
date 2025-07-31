
import React from 'react';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const CourseSection = () => {
  const courses = [
    {
      id: 1,
      title: "Développement Web Complet",
      instructor: "Marie Dubois",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=180&fit=crop",
      duration: "40h",
      students: 1250,
      rating: 4.8,
      price: "99€",
      level: "Débutant",
      category: "Développement"
    },
    {
      id: 2,
      title: "Intelligence Artificielle & ML",
      instructor: "Paul Martin",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=180&fit=crop",
      duration: "60h",
      students: 890,
      rating: 4.9,
      price: "149€",
      level: "Intermédiaire",
      category: "IA"
    },
    {
      id: 3,
      title: "SVP Modern",
      instructor: "Sophie Laurent",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=180&fit=crop",
      duration: "25h",
      students: 650,
      rating: 4.7,
      price: "79€",
      level: "Tous niveaux",
      category: "Design"
    },
    {
      id: 4,
      title: "Marketing Digital",
      instructor: "Lucas Petit",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=180&fit=crop",
      duration: "30h",
      students: 1100,
      rating: 4.6,
      price: "89€",
      level: "Débutant",
      category: "Marketing"
    },
    {
      id: 5,
      title: "Cybersécurité",
      instructor: "Thomas Roux",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=180&fit=crop",
      duration: "45h",
      students: 780,
      rating: 4.8,
      price: "129€",
      level: "Avancé",
      category: "Sécurité"
    },
    {
      id: 6,
      title: "Photographie Pro",
      instructor: "Emma Moreau",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=180&fit=crop",
      duration: "20h",
      students: 420,
      rating: 4.9,
      price: "69€",
      level: "Tous niveaux",
      category: "Créatif"
    },
    {
      id: 7,
      title: "Data Science",
      instructor: "Alex Durand",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=180&fit=crop",
      duration: "50h",
      students: 950,
      rating: 4.7,
      price: "119€",
      level: "Intermédiaire",
      category: "Data"
    },
    {
      id: 8,
      title: "Mobile Development",
      instructor: "Julie Bernard",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=180&fit=crop",
      duration: "35h",
      students: 720,
      rating: 4.6,
      price: "109€",
      level: "Intermédiaire",
      category: "Mobile"
    }
  ];

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-pink-100 text-pink-800';
    }
  };

  return (
    <section id="cours" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cours Populaires
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos formations les plus demandées, créées par des experts 
            et adaptées aux besoins du marché actuel.
          </p>
        </div>

        {/* Course Grid - 4 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={`text-xs ${getBadgeColor(course.level)}`}>
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs px-2 py-1">
                    {course.price}
                  </Badge>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3">Par {course.instructor}</p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {course.students}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                    {course.rating}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex justify-end gap-2">
                  <Link to={`/cours/${course.id}`}>
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                      Voir
                    </Button>
                  </Link>
                  <Link to="/inscription">
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-xs px-2 py-1">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/cours">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Voir tous les cours
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
