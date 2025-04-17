
import React from 'react';
import { UserCircle, Search, CalendarClock, MessageCircle } from 'lucide-react';

const steps = [
  {
    icon: <UserCircle className="w-12 h-12 text-silswap-pink" />,
    title: 'Create Your Profile',
    description: 'Add the skills you want to teach and the skills you want to learn.',
  },
  {
    icon: <Search className="w-12 h-12 text-silswap-green" />,
    title: 'Find Your Match',
    description: 'Our algorithm will find people who want to learn what you teach and teach what you want to learn.',
  },
  {
    icon: <CalendarClock className="w-12 h-12 text-silswap-pink" />,
    title: 'Schedule a Swap',
    description: 'Agree on a time and format (online or in-person) for your skill swap sessions.',
  },
  {
    icon: <MessageCircle className="w-12 h-12 text-silswap-green" />,
    title: 'Exchange Knowledge',
    description: 'Teach each other your skills and provide feedback after the exchange.',
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-white">
      <div className="section-container">
        <h2 className="section-title">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="font-poppins font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="mt-4 text-xl font-bold text-silswap-pink">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
