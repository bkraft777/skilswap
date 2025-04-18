
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

const LEARNING_GOALS = [
  'Learn to Code', 'Start a Business', 'Master Digital Marketing',
  'Improve Design Skills', 'Learn a Language', 'Create Music',
  'Get Fit', 'Write Better', 'Take Better Photos'
];

interface GoalsStepProps {
  selectedGoals: string[];
  onUpdate: (goals: string[]) => void;
}

export const GoalsStep: React.FC<GoalsStepProps> = ({ selectedGoals, onUpdate }) => {
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      onUpdate(selectedGoals.filter(g => g !== goal));
    } else {
      onUpdate([...selectedGoals, goal]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">What do you want to learn?</h3>
      <div className="grid grid-cols-2 gap-4">
        {LEARNING_GOALS.map((goal) => (
          <Button
            key={goal}
            variant={selectedGoals.includes(goal) ? "default" : "outline"}
            className="h-24 flex flex-col gap-2"
            onClick={() => toggleGoal(goal)}
          >
            <Target className={`w-6 h-6 ${
              selectedGoals.includes(goal) ? 'text-white' : 'text-gray-400'
            }`} />
            {goal}
          </Button>
        ))}
      </div>
    </div>
  );
};
