
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import DownloadAppButton from '@/components/common/DownloadAppButton';
import AIChatButton from '@/components/common/AIChatButton';
import CourseCategories from '@/components/CourseCategories';
import AnimatedSeparator from '@/components/AnimatedSeparator';
import KeyFigures from '@/components/KeyFigures';
import HowItWorks from '@/components/HowItWorks';
import CourseSection from '@/components/CourseSection';
import TeamSection from '@/components/TeamSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import PartnersSection from '@/components/PartnersSection';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <KeyFigures />
      <AnimatedSeparator />
      <HowItWorks />
      <CourseCategories />
      <CourseSection />
      <AnimatedSeparator />
      <TeamSection />
      <TestimonialsCarousel />
      <PartnersSection />
      <About />
      <Footer />
      <DownloadAppButton />
      <AIChatButton />
    </div>
  );
};

export default Index;
