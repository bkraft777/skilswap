
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const AVAILABLE_SKILLS = [
  'Programming', 'Digital Marketing', 'Design',
  'Writing', 'Music', 'Languages',
  'Photography', 'Business', 'Fitness'
];

interface SkillsStepProps {
  selectedSkills: string[];
  onUpdate: (skills: string[]) => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({ selectedSkills, onUpdate }) => {
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onUpdate(selectedSkills.filter(s => s !== skill));
    } else {
      onUpdate([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">What skills can you teach?</h3>
      <div className="grid grid-cols-2 gap-4">
        {AVAILABLE_SKILLS.map((skill) => (
          <Button
            key={skill}
            variant={selectedSkills.includes(skill) ? "default" : "outline"}
            className="h-24 flex flex-col gap-2"
            onClick={() => toggleSkill(skill)}
          >
            <CheckCircle2 className={`w-6 h-6 ${
              selectedSkills.includes(skill) ? 'text-white' : 'text-gray-400'
            }`} />
            {skill}
          </Button>
        ))}
      </div>
    </div>
  );
};
