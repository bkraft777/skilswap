
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTeacherSearch } from '@/hooks/useTeacherSearch';
import SkillSelector from '@/components/teacher/SkillSelector';

const FindTeacher = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [specificNeed, setSpecificNeed] = useState('');
  const { user } = useAuth();
  const { isSearching, searchTeachers } = useTeacherSearch(user?.id);

  const handleSearch = () => {
    searchTeachers(selectedSkill, specificNeed);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Find a Teacher</h1>
          <p className="text-gray-600 mb-8 text-center">
            Select the skill you need help with and describe your specific need
          </p>

          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <SkillSelector 
              value={selectedSkill}
              onChange={setSelectedSkill}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">What do you need help with?</label>
              <Input
                value={specificNeed}
                onChange={(e) => setSpecificNeed(e.target.value)}
                placeholder="e.g., playing a difficult chord on guitar"
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleSearch} 
              className="w-full" 
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search for Teachers'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindTeacher;
