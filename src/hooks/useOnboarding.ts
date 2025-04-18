
import { useState } from 'react';

export interface OnboardingState {
  isComplete: boolean;
  currentStep: number;
  profileData: {
    avatar?: File;
    bio?: string;
  };
  selectedSkills: string[];
  learningGoals: string[];
}

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    isComplete: false,
    currentStep: 0,
    profileData: {},
    selectedSkills: [],
    learningGoals: []
  });

  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 2)
    }));
  };

  const previousStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const updateProfileData = (data: Partial<OnboardingState['profileData']>) => {
    setState(prev => ({
      ...prev,
      profileData: { ...prev.profileData, ...data }
    }));
  };

  const updateSkills = (skills: string[]) => {
    setState(prev => ({
      ...prev,
      selectedSkills: skills
    }));
  };

  const updateGoals = (goals: string[]) => {
    setState(prev => ({
      ...prev,
      learningGoals: goals
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      isComplete: true
    }));
  };

  return {
    state,
    nextStep,
    previousStep,
    updateProfileData,
    updateSkills,
    updateGoals,
    completeOnboarding
  };
};
