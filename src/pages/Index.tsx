
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CourseCategories from '@/components/CourseCategories';
import AnimatedSeparator from '@/components/AnimatedSeparator';
import CourseSection from '@/components/CourseSection';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CourseCategories />
      <AnimatedSeparator />
      <CourseSection />
      <About />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
