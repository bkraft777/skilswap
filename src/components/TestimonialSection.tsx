
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(Array(testimonials.length).fill(true));

  const goToNextTestimonial = () => {
    setIsVisible(prev => {
      const newVisibility = [...prev];
      newVisibility[activeIndex] = false;
      return newVisibility;
    });
    
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setIsVisible(prev => {
        const newVisibility = [...prev];
        const nextIndex = (activeIndex + 1) % testimonials.length;
        newVisibility[nextIndex] = true;
        return newVisibility;
      });
    }, 300);
  };

  const goToPrevTestimonial = () => {
    setIsVisible(prev => {
      const newVisibility = [...prev];
      newVisibility[activeIndex] = false;
      return newVisibility;
    });
    
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
      setIsVisible(prev => {
        const newVisibility = [...prev];
        const prevIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
        newVisibility[prevIndex] = true;
        return newVisibility;
      });
    }, 300);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      goToNextTestimonial();
    }, 8000);
    
    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <div className="bg-gray-900 py-16">
      <div className="section-container">
        <h2 className="section-title text-white mb-12">Success Stories</h2>
        
        <div className="relative">
          {/* Mobile view (carousel) */}
          <div className="md:hidden">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col h-full">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-6 flex-grow">"{testimonials[activeIndex].quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-silswap-pink" 
                />
                <div className="ml-4">
                  <p className="font-poppins font-semibold text-white">{testimonials[activeIndex].name}</p>
                  <p className="text-gray-400 text-sm">{testimonials[activeIndex].role}</p>
                  <p className="text-silswap-pink text-sm mt-1">{testimonials[activeIndex].skills}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-silswap-pink' : 'bg-gray-600'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Desktop view (grid) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col h-full transform transition-all duration-300 hover:shadow-2xl ${
                  isVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-silswap-pink transform hover:scale-110 transition-transform duration-200"
                  />
                  <div className="ml-4">
                    <p className="font-poppins font-semibold text-white">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    <p className="text-silswap-pink text-sm mt-1">{testimonial.skills}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows for mobile */}
          <button 
            onClick={goToPrevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 md:hidden bg-gray-800/80 p-2 rounded-full"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button 
            onClick={goToNextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 md:hidden bg-gray-800/80 p-2 rounded-full"
            aria-label="Next testimonial"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
