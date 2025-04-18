
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from '@/hooks/useOnboarding';
import { ProfileStep } from './steps/ProfileStep';
import { SkillsStep } from './steps/SkillsStep';
import { GoalsStep } from './steps/GoalsStep';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const OnboardingWizard = () => {
  const { state, nextStep, previousStep, updateProfileData, updateSkills, updateGoals, completeOnboarding } = useOnboarding();
  const [open, setOpen] = React.useState(true);
  const { toast } = useToast();
  
  const progress = ((state.currentStep + 1) / 3) * 100;

  const handleComplete = () => {
    completeOnboarding();
    setOpen(false);
    toast({
      title: "Welcome to SkilSwap! 🎉",
      description: "Your profile is ready. Start exploring skills or share your knowledge!",
    });
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <ProfileStep
            profileData={state.profileData}
            onUpdate={updateProfileData}
          />
        );
      case 1:
        return (
          <SkillsStep
            selectedSkills={state.selectedSkills}
            onUpdate={updateSkills}
          />
        );
      case 2:
        return (
          <GoalsStep
            selectedGoals={state.learningGoals}
            onUpdate={updateGoals}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {state.currentStep === 3 ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                All Set!
              </>
            ) : (
              renderStep()
            )}
          </DialogTitle>
          <DialogDescription>
            Let's get you started on your learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {state.currentStep + 1} of 3
          </p>
        </div>

        <div className="mt-6 flex justify-between gap-4">
          {state.currentStep > 0 && (
            <Button
              variant="outline"
              onClick={previousStep}
            >
              Back
            </Button>
          )}
          <Button
            onClick={state.currentStep === 2 ? handleComplete : nextStep}
            className="ml-auto"
          >
            {state.currentStep === 2 ? 'Get Started' : 'Next Step'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
