import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Schema for sign in/sign up
const authFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for password reset (email only)
const resetFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type AuthFormValues = z.infer<typeof authFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const AuthForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isResetMode, setIsResetMode] = React.useState(false);
  const { toast } = useToast();

  const authForm = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onAuthSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      console.log('Attempting auth:', isSignUp ? 'signup' : 'signin');
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        console.log('Sign in successful, auth state will update automatically');
        
        // Show success message but don't navigate - let the Auth component handle redirection
        toast({
          title: "Welcome back!",
          description: "Signing you in...",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    try {
      console.log('Sending password reset email');
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Reset link sent!",
        description: "Please check your email for the password reset link.",
      });
      setIsResetMode(false);
      resetForm.reset();
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setIsLoading(false);
    authForm.clearErrors();
    resetForm.clearErrors();
    
    if (newMode === 'reset') {
      setIsResetMode(true);
    } else {
      setIsResetMode(false);
      setIsSignUp(newMode === 'signup');
    }
  };

  if (isResetMode) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
            <FormField
              control={resetForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <button
            onClick={() => switchMode('signin')}
            className="text-blue-600 hover:text-blue-500"
          >
            Back to Sign In
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>
      
      <Form {...authForm}>
        <form onSubmit={authForm.handleSubmit(onAuthSubmit)} className="space-y-4">
          <FormField
            control={authForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={authForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
          className="text-blue-600 hover:text-blue-500"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
