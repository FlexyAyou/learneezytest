
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Martin",
      role: "Développeuse Frontend",
      company: "TechCorp",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      content: "Grâce à InfinitiaX, j'ai pu me reconvertir dans le développement web en seulement 6 mois. Les cours sont excellents et le support est fantastique !",
      rating: 5
    },
    {
      id: 2,
      name: "Marc Dubois",
      role: "Chef de Projet Digital",
      company: "Innovation Lab",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "La qualité des formations et la flexibilité d'apprentissage m'ont permis de monter en compétences tout en travaillant. Je recommande vivement !",
      rating: 5
    },
    {
      id: 3,
      name: "Julie Petit",
      role: "UX Designer",
      company: "Creative Studio",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Les cours de design UX/UI sont incroyables. J'ai appris plus en 3 mois qu'en 2 ans d'autoformation. L'investissement en vaut vraiment la peine.",
      rating: 5
    },
    {
      id: 4,
      name: "Pierre Moreau",
      role: "Data Scientist",
      company: "AI Solutions",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Formation en IA et Machine Learning exceptionnelle. Les projets pratiques m'ont vraiment aidé à maîtriser les concepts et décrocher mon emploi actuel.",
      rating: 5
    },
    {
      id: 5,
      name: "Laura Roux",
      role: "Marketing Manager",
      company: "Growth Agency",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      content: "Excellent contenu, instructeurs passionnés et communauté bienveillante. InfinitiaX m'a permis de booster ma carrière dans le marketing digital.",
      rating: 5
    },
    {
      id: 6,
      name: "Thomas Laurent",
      role: "Cybersecurity Expert", 
      company: "SecureNet",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      content: "Formation en cybersécurité très complète avec des cas pratiques réels. J'ai pu appliquer directement mes nouvelles compétences dans mon travail.",
      rating: 5
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet elit
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 sm:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 h-full flex flex-col border border-border">
                    {/* Author Info */}
                    <div className="flex flex-col items-center mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3 sm:mb-4"
                      />
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 text-center leading-relaxed flex-grow">
                      "{testimonial.content}"
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-16" />
            <CarouselNext className="hidden md:flex -right-16" />
          </Carousel>
        </div>

        {/* CTA Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-6 sm:p-8 lg:p-12 text-primary-foreground">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            Rejoignez Plus de 50 000 Étudiants Satisfaits
          </h3>
          <p className="text-sm sm:text-lg lg:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Commencez votre parcours d'apprentissage dès aujourd'hui et 
            transformez votre avenir professionnel.
          </p>
          <button className="bg-background text-primary font-bold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-secondary transition-colors">
            Commencer Maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
