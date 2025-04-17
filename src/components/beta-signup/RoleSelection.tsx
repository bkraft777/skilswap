
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, UserRound } from 'lucide-react';

interface RoleSelectionProps {
  role: 'learner' | 'teacher';
  onRoleChange: (value: 'learner' | 'teacher') => void;
  disabled?: boolean;
}

const RoleSelection = ({ role, onRoleChange, disabled }: RoleSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label>I want to be a</Label>
      <RadioGroup 
        value={role} 
        onValueChange={onRoleChange}
        className="flex gap-4"
        disabled={disabled}
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
    </div>
  );
};

export default RoleSelection;
