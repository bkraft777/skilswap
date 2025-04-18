
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PopularSkills from '@/components/PopularSkills';
import Footer from '@/components/Footer';
import SearchBar from '@/components/skills/SearchBar';

const Skills = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center mb-8">Explore Skills</h1>
          <SearchBar onSearch={handleSearch} />
          <PopularSkills searchQuery={searchQuery} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Skills;
