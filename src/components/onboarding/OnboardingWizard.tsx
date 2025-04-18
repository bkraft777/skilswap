
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, UserRound, BookOpen, Target } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    title: "Complete Your Profile",
    description: "Add a profile picture and bio to help others know you better.",
    icon: <UserRound className="w-6 h-6" />,
  },
  {
    title: "Select Your Skills",
    description: "What skills can you teach? Choose from our categories.",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: "Set Your Goals",
    description: "What do you want to learn? This helps us suggest relevant skills.",
    icon: <Target className="w-6 h-6" />,
  }
];

export const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(true);
  
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <div className="space-y-4">
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer">
                    <UserRound className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Click to upload a profile picture
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {['Coding', 'Music', 'Language', 'Art'].map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    className="h-24 flex flex-col gap-2"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {['Learn to Code', 'Master an Instrument', 'Learn a Language', 'Digital Art'].map((goal) => (
                  <Button
                    key={goal}
                    variant="outline"
                    className="h-24 flex flex-col gap-2"
                  >
                    <Target className="w-6 h-6" />
                    {goal}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
