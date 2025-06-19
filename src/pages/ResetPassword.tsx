
import React from 'react';
import { useResetPasswordToken } from '@/hooks/useResetPasswordToken';
import PasswordUpdateForm from '@/components/auth/PasswordUpdateForm';
import InvalidResetLink from '@/components/auth/InvalidResetLink';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ResetPassword = () => {
  const { isValidToken } = useResetPasswordToken();

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Validating reset link..." />
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <InvalidResetLink />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <PasswordUpdateForm />
      </div>
    </div>
  );
};

export default ResetPassword;
