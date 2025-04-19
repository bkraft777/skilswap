
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// List of available general skills
const AVAILABLE_SKILLS = [
  'Programming', 'Digital Marketing', 'Design',
  'Writing', 'Music', 'Languages',
  'Photography', 'Business', 'Fitness'
];

const FindTeacher = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [specificNeed, setSpecificNeed] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to search for teachers",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedSkill) {
      toast({
        title: "Missing information",
        description: "Please select a skill category",
        variant: "destructive",
      });
      return;
    }

    if (!specificNeed.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe what you need help with",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      // Get learner's information for the notification
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const learnerName = profileData?.username || 'A learner';

      // Find teachers with the selected skill
      const { data: teachers, error: teachersError } = await supabase
        .from('profiles')
        .select('id, username')
        .contains('skills', [selectedSkill]);

      if (teachersError) throw teachersError;

      if (!teachers || teachers.length === 0) {
        toast({
          title: "No teachers found",
          description: `No teachers are currently available for ${selectedSkill}. Please try another skill or check back later.`,
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      // Create a new help request entry
      const { data: requestData, error: requestError } = await supabase
        .from('skill_help_requests')
        .insert({
          learner_id: user.id,
          skill_category: selectedSkill,
          specific_need: specificNeed,
          status: 'pending'
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Send notifications to all teachers with this skill
      const notificationPromises = teachers.map(teacher => 
        supabase
          .from('teacher_notifications')
          .insert({
            teacher_id: teacher.id,
            message: `${learnerName} is looking for help with ${specificNeed} in ${selectedSkill}`,
            request_id: requestData.id,
            status: 'unread'
          })
      );

      await Promise.all(notificationPromises);

      toast({
        title: "Request sent!",
        description: `Your request for help with ${specificNeed} has been sent to ${teachers.length} teacher${teachers.length === 1 ? '' : 's'}.`,
      });

      // Redirect to the waiting room
      navigate(`/waiting-room/${requestData.id}`);
    } catch (error) {
      console.error("Error searching for teachers:", error);
      toast({
        title: "Error",
        description: "An error occurred while searching for teachers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
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
            <div className="space-y-2">
              <label className="block text-sm font-medium">Skill Category</label>
              <Select 
                value={selectedSkill} 
                onValueChange={setSelectedSkill}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill category" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SKILLS.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
