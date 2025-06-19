
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

const resetFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetFormValues = z.infer<typeof resetFormSchema>;

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onBackToSignIn: () => void;
}

const ResetPasswordForm = ({ isLoading, setIsLoading, onBackToSignIn }: ResetPasswordFormProps) => {
  const { toast } = useToast();

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '',
    },
  });

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
      onBackToSignIn();
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
          onClick={onBackToSignIn}
          className="text-blue-600 hover:text-blue-500"
        >
          Back to Sign In
        </button>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
