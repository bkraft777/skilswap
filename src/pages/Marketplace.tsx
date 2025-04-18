import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSkillOfferings, type SkillOffering } from '@/hooks/useSkillOfferings';
import { SkillOfferingCard } from '@/components/skills/SkillOfferingCard';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Marketplace = () => {
  const { data: offerings, isLoading } = useSkillOfferings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBook = (offering: SkillOffering) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book a session",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    // We'll implement booking functionality in the next step
    toast({
      title: "Coming soon!",
      description: "Booking functionality will be available soon.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Skill Marketplace</h1>
            <p className="text-gray-600 mt-2">Browse and book sessions with skilled teachers</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : offerings && offerings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerings.map((offering) => (
                <SkillOfferingCard
                  key={offering.id}
                  offering={offering}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No skill offerings available at the moment.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
