import React from 'react';
import { Code, Utensils, Music, Languages, Palette, Camera, BookOpen, Play } from 'lucide-react';

interface SkillCategory {
  icon: JSX.Element;
  title: string;
  examples: string;
  color: string;
  iconColor: string;
}

const skillCategories: SkillCategory[] = [
  {
    icon: <Code className="w-10 h-10" />,
    title: 'Programming',
    examples: 'Web Development, Python, Mobile Apps',
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: <Utensils className="w-10 h-10" />,
    title: 'Cooking',
    examples: 'Baking, International Cuisine, Meal Prep',
    color: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    icon: <Music className="w-10 h-10" />,
    title: 'Music',
    examples: 'Guitar, Piano, Singing, Music Production',
    color: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    icon: <Languages className="w-10 h-10" />,
    title: 'Languages',
    examples: 'Spanish, Mandarin, French, ESL',
    color: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    icon: <Palette className="w-10 h-10" />,
    title: 'Art & Design',
    examples: 'Drawing, UI/UX, Digital Art, Painting',
    color: 'bg-pink-50',
    iconColor: 'text-pink-500',
  },
  {
    icon: <Camera className="w-10 h-10" />,
    title: 'Photography',
    examples: 'Portrait, Landscape, Photo Editing',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
  {
    icon: <BookOpen className="w-10 h-10" />,
    title: 'Academic',
    examples: 'Math, Science, History, Writing',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
  },
  {
    icon: <Play className="w-10 h-10" />,
    title: 'Sports & Fitness',
    examples: 'Yoga, Dance, Running, Home Workouts',
    color: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
];

interface PopularSkillsProps {
  searchQuery?: string;
}

const PopularSkills = ({ searchQuery = '' }: PopularSkillsProps) => {
  const filteredCategories = skillCategories.filter(category => {
    const matchTitle = category.title.toLowerCase().includes(searchQuery);
    const matchExamples = category.examples.toLowerCase().includes(searchQuery);
    return matchTitle || matchExamples;
  });

  return (
    <div className="bg-silswap-bg">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <div 
              key={index}
              className={`${category.color} rounded-lg p-6 shadow-sm card-hover animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${category.iconColor} mb-4`}>
                {category.icon}
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-2">{category.title}</h3>
              <p className="text-gray-600">{category.examples}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularSkills;
