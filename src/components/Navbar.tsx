import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center"
            >
              <div className="gradient-circle w-10 h-10"></div>
              <span className="ml-2 text-2xl font-poppins font-bold">SkilSwap.io</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="font-medium hover:text-silswap-pink transition-colors">Home</a>
            <a href="/how-it-works" className="font-medium hover:text-silswap-pink transition-colors">How It Works</a>
            <a href="/skills" className="font-medium hover:text-silswap-pink transition-colors">Skills</a>
            <a href="/community" className="font-medium hover:text-silswap-pink transition-colors">Community</a>
            <Button 
              className="button-primary"
              onClick={() => navigate('/login')}
            >
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="block px-3 py-2 rounded-md font-medium hover:bg-silswap-pink/10"
            >
              Home
            </a>
            <a
              href="/how-it-works"
              className="block px-3 py-2 rounded-md font-medium hover:bg-silswap-pink/10"
            >
              How It Works
            </a>
            <a
              href="/skills"
              className="block px-3 py-2 rounded-md font-medium hover:bg-silswap-pink/10"
            >
              Skills
            </a>
            <a
              href="/community"
              className="block px-3 py-2 rounded-md font-medium hover:bg-silswap-pink/10"
            >
              Community
            </a>
            <div className="px-3 py-2">
              <Button 
                className="button-primary w-full"
                onClick={() => navigate('/login')}
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
