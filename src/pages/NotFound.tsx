
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-silswap-bg">
        <div className="text-center px-4">
          <div className="gradient-circle w-24 h-24 mx-auto mb-8 opacity-50"></div>
          <h1 className="text-6xl font-poppins font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! We couldn't find the page you're looking for.
          </p>
          <p className="text-gray-500 mb-8">
            The page at <span className="font-semibold">{location.pathname}</span> does not exist.
          </p>
          <Button className="button-primary" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
