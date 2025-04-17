
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Music, Code, User, UserRound, Mail } from 'lucide-react';
import { z } from 'zod';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive"
      });
      return;
    }

    const existingSignups = JSON.parse(localStorage.getItem('betaSignups') || '[]');
    
    if (existingSignups.some((s: BetaSignup) => s.email === email)) {
      setErrors({ email: "This email has already been registered" });
      toast({
        title: "Already Registered",
        description: "This email has already been registered for the beta.",
        variant: "destructive"
      });
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
      title: "Registration Successful!",
      description: "Thank you for joining the SkilSwap beta. We'll be in touch soon!",
    });

    setEmail('');
    setIsOpen(false);
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
          <AlertDialogTitle className="text-2xl font-bold text-center mb-4">Join SkilSwap Beta</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>I want to be a</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value: 'learner' | 'teacher') => setRole(value)} 
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="learner" id="learner" />
                <Label htmlFor="learner" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Learner
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" /> Teacher
                </Label>
              </div>
            </RadioGroup>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>I'm interested in</Label>
            <RadioGroup 
              value={interest} 
              onValueChange={(value: 'coding' | 'music') => setInterest(value)} 
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="coding" id="coding" />
                <Label htmlFor="coding" className="flex items-center gap-2">
                  <Code className="h-4 w-4" /> Coding
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="music" id="music" />
                <Label htmlFor="music" className="flex items-center gap-2">
                  <Music className="h-4 w-4" /> Music
                </Label>
              </div>
            </RadioGroup>
            {errors.interest && (
              <p className="text-sm text-red-500 mt-1">{errors.interest}</p>
            )}
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BetaSignupForm;
