
import React from 'react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-silswap-pink to-silswap-green py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6 text-white">
          Ready to Start Swapping Skills?
        </h2>
        <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
          Join thousands of people worldwide who are already sharing knowledge and building connections through skill swapping.
        </p>
        <Button className="bg-white text-silswap-pink hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
          Join SilSwap Today
        </Button>
      </div>
    </div>
  );
};

export default CTASection;
