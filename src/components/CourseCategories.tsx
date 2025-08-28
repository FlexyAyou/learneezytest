
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, Star } from 'lucide-react';

const CourseCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Développement Web",
      description: "Apprenez les technologies modernes du web",
      courseCount: 42,
      studentsCount: 1250,
      avgRating: 4.8,
      color: "bg-blue-500",
      courses: [
        { name: "React Avancé", level: "Avancé", duration: "8h" },
        { name: "Node.js", level: "Intermédiaire", duration: "12h" },
        { name: "Vue.js", level: "Débutant", duration: "6h" }
      ]
    },
    {
      id: 2,
      title: "Design UI/UX",
      description: "Maîtrisez l'art du design d'interface",
      courseCount: 28,
      studentsCount: 890,
      avgRating: 4.7,
      color: "bg-purple-500",
      courses: [
        { name: "Figma Pro", level: "Intermédiaire", duration: "10h" },
        { name: "Design System", level: "Avancé", duration: "15h" },
        { name: "Prototypage", level: "Débutant", duration: "5h" }
      ]
    },
    {
      id: 3,
      title: "Intelligence Artificielle",
      description: "Explorez le futur avec l'IA",
      courseCount: 35,
      studentsCount: 2100,
      avgRating: 4.9,
      color: "bg-green-500",
      courses: [
        { name: "Machine Learning", level: "Avancé", duration: "20h" },
        { name: "ChatGPT API", level: "Intermédiaire", duration: "8h" },
        { name: "Python IA", level: "Débutant", duration: "12h" }
      ]
    },
    {
      id: 4,
      title: "Marketing Digital",
      description: "Développez votre présence en ligne",
      courseCount: 24,
      studentsCount: 1580,
      avgRating: 4.6,
      color: "bg-red-500",
      courses: [
        { name: "SEO Avancé", level: "Avancé", duration: "14h" },
        { name: "Social Media", level: "Intermédiaire", duration: "9h" },
        { name: "Google Ads", level: "Débutant", duration: "7h" }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explorez nos catégories de formation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez une large gamme de formations adaptées à tous les niveaux, 
            conçues par des experts pour vous faire progresser dans votre carrière.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {category.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-bold text-lg">{category.courseCount}</span>
                    </div>
                    <span className="text-xs text-gray-500">Formations</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="font-bold text-lg">{category.studentsCount}</span>
                    </div>
                    <span className="text-xs text-gray-500">Étudiants</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(category.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-bold text-sm text-gray-700">{category.avgRating}</span>
                </div>

                {/* Popular Courses */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Formations populaires:</h4>
                  <div className="space-y-2">
                    {category.courses.map((course, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate">{course.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;
