
import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="gradient-circle w-10 h-10"></div>
              <span className="ml-2 text-xl font-poppins font-bold">SkilSwap.io</span>
            </div>
            <p className="text-gray-600 mb-4">
              Swap Skills, Share Love. Connect with people worldwide and exchange knowledge for free.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://instagram.com/skilswap.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#E4405F] transform hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://twitter.com/skilswap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#1DA1F2] transform hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://linkedin.com/company/skilswap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#0A66C2] transform hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://facebook.com/skilswap.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#1877F2] transform hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="/how-it-works" className="text-gray-600 hover:text-silswap-pink transition-colors">How It Works</a></li>
              <li><a href="/skills" className="text-gray-600 hover:text-silswap-pink transition-colors">Skills</a></li>
              <li><a href="/community" className="text-gray-600 hover:text-silswap-pink transition-colors">Community</a></li>
              <li><a href="/resources" className="text-gray-600 hover:text-silswap-pink transition-colors">Resources</a></li>
              <li><a href="/blog" className="text-gray-600 hover:text-silswap-pink transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-gray-600 hover:text-silswap-pink transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-silswap-pink transition-colors">Contact Us</a></li>
              <li><a href="/feedback" className="text-gray-600 hover:text-silswap-pink transition-colors">Feedback</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-silswap-pink transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-silswap-pink transition-colors">Terms of Use</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">Stay updated with the latest skill swapping opportunities.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-silswap-pink"
              />
              <button 
                type="submit" 
                className="button-primary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} SkilSwap.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
