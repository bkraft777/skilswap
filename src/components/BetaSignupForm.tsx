
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Music, Code, User, UserRound, Mail } from 'lucide-react';

const BetaSignupForm = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('learner');
  const [interest, setInterest] = useState('coding');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = 'SkilSwap Beta Signup';
    const body = `
New Beta Signup:
Email: ${email}
Role: ${role}
Interest: ${interest}
    `;
    window.location.href = `mailto:bkraft7x7@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <AlertDialog>
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
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>I want to be a</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
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
          </div>

          <div className="space-y-2">
            <Label>I'm interested in</Label>
            <RadioGroup value={interest} onValueChange={setInterest} className="flex gap-4">
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
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BetaSignupForm;
