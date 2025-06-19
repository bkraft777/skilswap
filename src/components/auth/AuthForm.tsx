
import React from 'react';
import SignInUpForm from './SignInUpForm';
import ResetPasswordForm from './ResetPasswordForm';

const AuthForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isResetMode, setIsResetMode] = React.useState(false);

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setIsLoading(false);
    
    if (newMode === 'reset') {
      setIsResetMode(true);
    } else {
      setIsResetMode(false);
      setIsSignUp(newMode === 'signup');
    }
  };

  const handleToggleMode = () => {
    switchMode(isSignUp ? 'signin' : 'signup');
  };

  const handleForgotPassword = () => {
    switchMode('reset');
  };

  const handleBackToSignIn = () => {
    switchMode('signin');
  };

  if (isResetMode) {
    return (
      <ResetPasswordForm
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onBackToSignIn={handleBackToSignIn}
      />
    );
  }

  return (
    <SignInUpForm
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      isSignUp={isSignUp}
      onToggleMode={handleToggleMode}
      onForgotPassword={handleForgotPassword}
    />
  );
};

export default AuthForm;
