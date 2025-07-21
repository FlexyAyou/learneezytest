import React from 'react';
import { 
  Palette, 
  TrendingUp, 
  FileText, 
  Heart, 
  Video, 
  Briefcase, 
  Music, 
  Database, 
  Code, 
  Camera 
} from 'lucide-react';

const CourseCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Graphics & Design',
      icon: Palette,
      count: 245
    },
    {
      id: 2,
      name: 'Digital Marketing',
      icon: TrendingUp,
      count: 180
    },
    {
      id: 3,
      name: 'Writing & Translation',
      icon: FileText,
      count: 120
    },
    {
      id: 4,
      name: 'Lifestyle',
      icon: Heart,
      count: 95
    },
    {
      id: 5,
      name: 'Video & Animation',
      icon: Video,
      count: 210
    },
    {
      id: 6,
      name: 'Business',
      icon: Briefcase,
      count: 165
    },
    {
      id: 7,
      name: 'Music & Audio',
      icon: Music,
      count: 85
    },
    {
      id: 8,
      name: 'Data',
      icon: Database,
      count: 140
    },
    {
      id: 9,
      name: 'Programming & Tech',
      icon: Code,
      count: 320
    },
    {
      id: 10,
      name: 'Photography',
      icon: Camera,
      count: 75
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explorez nos Catégories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez une large gamme de compétences adaptées à vos objectifs professionnels
          </p>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide pb-6 space-x-6 animate-slide-in-right">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="group cursor-pointer flex-shrink-0 w-48 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:bg-card/80">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                      <IconComponent className="h-8 w-8 text-primary group-hover:text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.count} cours
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Gradient Fade Effects */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg">
            Plus de <span className="font-bold text-primary">1,500 cours</span> disponibles dans toutes les catégories
          </p>
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;