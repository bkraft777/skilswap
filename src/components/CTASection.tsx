
import React from 'react';
import BetaSignupForm from './BetaSignupForm';

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-silswap-pink to-silswap-green py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6 text-white">
          Ready to Start Micro Learning?
        </h2>
        <p className="text-xl text-white mb-4 max-w-2xl mx-auto">
          Join our beta platform where thousands are sharing quick 5-minute online lessons. Perfect for busy people who want to learn efficiently.
        </p>
        <p className="text-sm text-white/80 mb-10 max-w-2xl mx-auto">
          Be part of our journey as we develop SlikCoin, the future cryptocurrency that will power SkilSwap's skill-sharing economy.
        </p>
        <BetaSignupForm />
      </div>
    </div>
  );
};

export default CTASection;
