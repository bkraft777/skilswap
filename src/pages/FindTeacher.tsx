
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeacherStats from '@/components/TeacherStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Music, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTeacherSearch } from '@/hooks/useTeacherSearch';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SKILL_CATEGORIES } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';

const FindTeacher = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [specificNeed, setSpecificNeed] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const { isSearching, searchTeachers } = useTeacherSearch(user?.id);

  // Pre-select 'Music' if it's available in SKILL_CATEGORIES
  useEffect(() => {
    if (SKILL_CATEGORIES.includes('Music') && !selectedSkill) {
      setSelectedSkill('Music');
    }
  }, [selectedSkill]);

  const handleSearch = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to search for teachers",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSkill || !specificNeed.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a skill and describe your specific need",
        variant: "destructive",
      });
      return;
    }
    
    searchTeachers(selectedSkill, specificNeed);
  };

  const musicExamples = [
    "Learning to play guitar chords", 
    "Reading sheet music", 
    "Vocal training techniques",
    "Piano finger exercises",
    "Music theory basics"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <TeacherStats />
          </div>
          
          <div className="md:col-span-2">
            <div className="mb-8 bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Music className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold">Find a Music Teacher</h1>
              </div>
              <p className="text-gray-600 mb-6">
                Our skilled music teachers can help you with instrument practice, music theory, 
                vocal training, and more. Tell us what you need help with!
              </p>

              <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">What skill do you need help with?</label>
                  <Select
                    value={selectedSkill}
                    onValueChange={setSelectedSkill}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_CATEGORIES.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">What do you need help with specifically?</label>
                  <Input
                    value={specificNeed}
                    onChange={(e) => setSpecificNeed(e.target.value)}
                    placeholder="e.g., playing difficult guitar chords"
                    className="w-full"
                  />
                  
                  {selectedSkill === 'Music' && specificNeed.length === 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {musicExamples.map((example, i) => (
                          <Button 
                            key={i} 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSpecificNeed(example)}
                            className="text-xs"
                          >
                            {example}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleSearch} 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={isSearching || !selectedSkill || !specificNeed.trim()}
                >
                  {isSearching ? 'Sending Request...' : 'Search for Teachers'}
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-amber-500" />
                  <h2 className="text-xl font-bold">How It Works</h2>
                </div>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Select the skill you need help with (e.g., Music)</li>
                  <li>Describe your specific question or challenge</li>
                  <li>Click "Search for Teachers" to send your request</li>
                  <li>Available teachers will be notified and can connect with you</li>
                  <li>Once a teacher connects, you'll have a quick 5-minute session to solve your problem</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindTeacher;
