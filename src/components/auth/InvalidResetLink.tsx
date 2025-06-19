
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const InvalidResetLink = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Invalid Reset Link</h2>
      <p className="text-gray-600 mb-6">
        This password reset link is invalid or has expired. Please request a new one.
      </p>
      <Button onClick={() => navigate('/auth', { replace: true })} className="w-full">
        Back to Sign In
      </Button>
    </div>
  );
};

export default InvalidResetLink;
