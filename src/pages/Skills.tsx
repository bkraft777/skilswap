
import React from 'react';
import Navbar from '@/components/Navbar';
import PopularSkills from '@/components/PopularSkills';
import Footer from '@/components/Footer';

const Skills = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-16">
          <PopularSkills />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Skills;
