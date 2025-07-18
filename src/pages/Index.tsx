
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CourseSection from '@/components/CourseSection';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CourseSection />
      <About />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
