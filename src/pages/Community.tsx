
import React from 'react';
import Navbar from '@/components/Navbar';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';

const Community = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-16">
          <TestimonialSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
