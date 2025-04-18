
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortAsc } from 'lucide-react';

export type SortOption = 'popularity' | 'difficulty' | 'activeUsers' | 'default';

interface SortSkillsProps {
  onSortChange: (value: SortOption) => void;
  currentSort: SortOption;
}

const SortSkills = ({ onSortChange, currentSort }: SortSkillsProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-lg font-semibold">Sort by</h2>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4" />
            <SelectValue placeholder="Sort by..." />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="popularity">Popularity</SelectItem>
          <SelectItem value="difficulty">Difficulty</SelectItem>
          <SelectItem value="activeUsers">Active Users</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSkills;
