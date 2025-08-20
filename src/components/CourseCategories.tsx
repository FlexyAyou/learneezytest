
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
import { useLanguage } from '../contexts/LanguageContext';

const CourseCategories = () => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 1,
      name: t('courseCategories.graphicsDesign'),
      icon: Palette,
      count: 245
    },
    {
      id: 2,
      name: t('courseCategories.digitalMarketing'),
      icon: TrendingUp,
      count: 180
    },
    {
      id: 3,
      name: t('courseCategories.writingTranslation'),
      icon: FileText,
      count: 120
    },
    {
      id: 4,
      name: t('courseCategories.lifestyle'),
      icon: Heart,
      count: 95
    },
    {
      id: 5,
      name: t('courseCategories.videoAnimation'),
      icon: Video,
      count: 210
    },
    {
      id: 6,
      name: t('courseCategories.business'),
      icon: Briefcase,
      count: 165
    },
    {
      id: 7,
      name: t('courseCategories.musicAudio'),
      icon: Music,
      count: 85
    },
    {
      id: 8,
      name: t('courseCategories.data'),
      icon: Database,
      count: 140
    },
    {
      id: 9,
      name: t('courseCategories.programmingTech'),
      icon: Code,
      count: 320
    },
    {
      id: 10,
      name: t('courseCategories.photography'),
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
            {t('courseCategories.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('courseCategories.subtitle')}
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
                      {category.count} {t('courseCategories.courseCount')}
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
            {t('courseCategories.moreCourses')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;
