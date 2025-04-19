
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Coins, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTAClick = () => {
    if (user) {
      navigate('/points');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 gradient-circle opacity-20 animate-rotate-gradient"></div>
      <div className="absolute -bottom-32 -left-20 w-80 h-80 gradient-circle opacity-20 animate-rotate-gradient"></div>
      
      <div className="section-container relative z-10 py-12 md:py-20">
        {user && (
          <div className="mb-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Welcome, {user.email?.split('@')[0] || 'Learner'}!
            </h2>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <h1 className="tagline mb-6 text-center md:text-left">
              <span className="animate-gradient bg-[length:200%_auto] bg-gradient-to-r from-silswap-pink via-purple-500 to-silswap-green bg-clip-text text-transparent text-4xl md:text-5xl font-bold">
                5-Minute Micro Learning Sessions
              </span>
            </h1>
            <h2 className="text-lg md:text-xl text-gray-600 mb-4 text-center md:text-left">
              When you need just 5 minutes of someone's help, when you're stuck on a task, or are just wanting a quick lesson.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-4 text-center md:text-left">
              Join our beta community where people exchange quick 5-minute online lessons. Learn bite-sized skills from others, and teach what you know in return.
            </p>
            <p className="text-sm text-gray-500 mb-8 text-center md:text-left">
              Beta Version: We're testing our micro-learning platform while developing SkiLCoin, the future native cryptocurrency for SkilSwap's ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-silswap-pink to-purple-600 hover:from-silswap-pink hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
              >
                {user ? (
                  <>
                    <Coins className="h-5 w-5" />
                    Manage Your Points
                  </>
                ) : (
                  <>
                    Join SkilSwap Now
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/marketplace')}
                className="border-purple-400 text-purple-700 hover:bg-purple-50"
              >
                Browse Skills
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute top-0 left-0 w-full h-full gradient-circle opacity-30 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" 
                alt="Quick learning with technology" 
                className="relative z-10 rounded-2xl shadow-xl w-full animate-fade-in object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

