
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectProps<T extends string> {
  options: readonly T[] | T[];
  selectedOptions: T[];
  onChange: (selectedOptions: T[]) => void;
  placeholder?: string;
}

export function MultiSelect<T extends string>({ 
  options, 
  selectedOptions, 
  onChange, 
  placeholder = "Select options" 
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: T) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(selected => selected !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };

  const removeOption = (option: T) => {
    onChange(selectedOptions.filter(selected => selected !== option));
  };

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-md p-2 flex flex-wrap gap-2 cursor-pointer"
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          selectedOptions.map(option => (
            <div 
              key={option} 
              className="flex items-center bg-gray-100 px-2 py-1 rounded"
            >
              {option}
              <X 
                className="ml-2 h-4 w-4 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }} 
              />
            </div>
          ))
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full border rounded-md mt-1 bg-white shadow-lg max-h-60 overflow-y-auto">
          {Array.from(options).map(option => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={cn(
                "p-2 hover:bg-gray-100 cursor-pointer",
                selectedOptions.includes(option) && "bg-gray-200"
              )}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
