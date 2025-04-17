import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import EmailInput from './beta-signup/EmailInput';
import RoleSelection from './beta-signup/RoleSelection';
import InterestSelection from './beta-signup/InterestSelection';

// Define validation schema
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['learner', 'teacher'], {
    required_error: "Please select a role"
  }),
  interest: z.enum(['coding', 'music'], {
    required_error: "Please select an interest"
  })
});

interface BetaSignup {
  email: string;
  role: 'learner' | 'teacher';
  interest: 'coding' | 'music';
  date: string;
}

const BetaSignupForm = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'learner' | 'teacher'>('learner');
  const [interest, setInterest] = useState<'coding' | 'music'>('coding');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const validateForm = (): boolean => {
    try {
      signupSchema.parse({ email, role, interest });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingSignups = JSON.parse(localStorage.getItem('betaSignups') || '[]');
      
      if (existingSignups.some((s: BetaSignup) => s.email === email)) {
        setErrors({ email: "This email has already been registered" });
        toast({
          title: "Already Registered",
          description: "This email has already been registered for the beta.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const signup: BetaSignup = {
        email,
        role,
        interest,
        date: new Date().toISOString()
      };

      localStorage.setItem('betaSignups', JSON.stringify([...existingSignups, signup]));

      toast({
        title: "Registration Successful! 🎉",
        description: "Thank you for joining the SkilSwap beta. We'll be in touch soon!",
      });

      setEmail('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-white text-silswap-pink hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
          Join SkilSwap Beta
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center mb-4">
            Join SkilSwap Beta
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailInput 
            email={email}
            onChange={handleEmailChange}
            error={errors.email}
            disabled={isSubmitting}
          />
          
          <RoleSelection
            role={role}
            onRoleChange={setRole}
            disabled={isSubmitting}
          />
          
          <InterestSelection
            interest={interest}
            onInterestChange={setInterest}
            disabled={isSubmitting}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BetaSignupForm;
