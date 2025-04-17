
import React from 'react';
import Navbar from '@/components/Navbar';
import HowItWorksSection from '@/components/HowItWorks';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-16">
          <HowItWorksSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
