
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "I've always wanted to learn guitar but couldn't afford lessons. On SkilSwap, I found someone who taught me guitar basics in exchange for Python programming lessons. It's amazing!",
    name: "Alex Johnson",
    role: "Software Developer",
    skills: "Exchanged: Python for Guitar",
    image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "SkilSwap transformed my hobby into something meaningful. I taught Italian cooking to a wonderful person who helped me improve my graphic design skills. We're still friends!",
    name: "Maria Rodriguez",
    role: "Home Chef",
    skills: "Exchanged: Cooking for Graphic Design",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "As a retired teacher, I have so much knowledge to share. Through SkilSwap, I teach math to students while learning photography from younger community members. It's a perfect exchange.",
    name: "Robert Chen",
    role: "Retired Math Teacher",
    skills: "Exchanged: Math for Photography",
    image: "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  }
];

const TestimonialSection = () => {
  return (
    <div className="bg-white">
      <div className="section-container">
        <h2 className="section-title">Success Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-8 flex flex-col h-full animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="font-poppins font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  <p className="text-silswap-pink text-sm mt-1">{testimonial.skills}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
