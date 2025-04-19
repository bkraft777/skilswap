
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SKILLS } from '@/lib/constants';

interface SkillSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SkillSelector = ({ value, onChange }: SkillSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Skill Category</label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a skill category" />
        </SelectTrigger>
        <SelectContent>
          {SKILLS.map((skill) => (
            <SelectItem key={skill} value={skill}>
              {skill}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SkillSelector;
