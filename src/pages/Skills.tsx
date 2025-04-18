
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PopularSkills from '@/components/PopularSkills';
import Footer from '@/components/Footer';
import SearchBar from '@/components/skills/SearchBar';
import CategoryFilter from '@/components/skills/CategoryFilter';

const Skills = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center mb-8">Explore Skills</h1>
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <PopularSkills 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Skills;
