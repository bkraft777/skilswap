
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 gradient-circle opacity-20 animate-rotate-gradient"></div>
      <div className="absolute -bottom-32 -left-20 w-80 h-80 gradient-circle opacity-20 animate-rotate-gradient"></div>
      
      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <h1 className="tagline mb-6 text-center md:text-left">
              <span className="bg-gradient-to-r from-silswap-pink to-silswap-green bg-clip-text text-transparent">
                Swap Skills,
              </span>
              <br />
              Share Love.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 text-center md:text-left">
              Join our global community where people exchange knowledge and learn from each other for free. Find someone to teach you a skill, and teach them one in return.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="button-primary">Join the Community</Button>
              <Button className="button-secondary">Learn More</Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute top-0 left-0 w-full h-full gradient-circle opacity-30 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" 
                alt="People sharing skills" 
                className="relative z-10 rounded-2xl shadow-xl w-full animate-fade-in"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
