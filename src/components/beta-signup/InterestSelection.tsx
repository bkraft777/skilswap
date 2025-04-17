
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Code, Music } from 'lucide-react';

interface InterestSelectionProps {
  interest: 'coding' | 'music';
  onInterestChange: (value: 'coding' | 'music') => void;
  disabled?: boolean;
}

const InterestSelection = ({ interest, onInterestChange, disabled }: InterestSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label>I'm interested in</Label>
      <RadioGroup 
        value={interest} 
        onValueChange={onInterestChange}
        className="flex gap-4"
        disabled={disabled}
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
    </div>
  );
};

export default InterestSelection;
