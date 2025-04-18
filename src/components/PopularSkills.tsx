
import React from 'react';
import { Code, Utensils, Music, Languages, Palette, Camera, BookOpen, Play, Star, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface SkillCategory {
  icon: JSX.Element;
  title: string;
  examples: string;
  color: string;
  iconColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number; // 0-100
  activeUsers: number;
}

const skillCategories: SkillCategory[] = [
  {
    icon: <Code className="w-10 h-10" />,
    title: 'Programming',
    examples: 'Web Development, Python, Mobile Apps',
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
    difficulty: 'Intermediate',
    popularity: 95,
    activeUsers: 15420
  },
  {
    icon: <Utensils className="w-10 h-10" />,
    title: 'Cooking',
    examples: 'Baking, International Cuisine, Meal Prep',
    color: 'bg-red-50',
    iconColor: 'text-red-500',
    difficulty: 'Beginner',
    popularity: 88,
    activeUsers: 12350
  },
  {
    icon: <Music className="w-10 h-10" />,
    title: 'Music',
    examples: 'Guitar, Piano, Singing, Music Production',
    color: 'bg-purple-50',
    iconColor: 'text-purple-500',
    difficulty: 'Intermediate',
    popularity: 82,
    activeUsers: 9840
  },
  {
    icon: <Languages className="w-10 h-10" />,
    title: 'Languages',
    examples: 'Spanish, Mandarin, French, ESL',
    color: 'bg-green-50',
    iconColor: 'text-green-500',
    difficulty: 'Intermediate',
    popularity: 90,
    activeUsers: 18670
  },
  {
    icon: <Palette className="w-10 h-10" />,
    title: 'Art & Design',
    examples: 'Drawing, UI/UX, Digital Art, Painting',
    color: 'bg-pink-50',
    iconColor: 'text-pink-500',
    difficulty: 'Intermediate',
    popularity: 85,
    activeUsers: 11230
  },
  {
    icon: <Camera className="w-10 h-10" />,
    title: 'Photography',
    examples: 'Portrait, Landscape, Photo Editing',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    difficulty: 'Beginner',
    popularity: 80,
    activeUsers: 8940
  },
  {
    icon: <BookOpen className="w-10 h-10" />,
    title: 'Academic',
    examples: 'Math, Science, History, Writing',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    difficulty: 'Advanced',
    popularity: 75,
    activeUsers: 14520
  },
  {
    icon: <Play className="w-10 h-10" />,
    title: 'Sports & Fitness',
    examples: 'Yoga, Dance, Running, Home Workouts',
    color: 'bg-orange-50',
    iconColor: 'text-orange-500',
    difficulty: 'Beginner',
    popularity: 87,
    activeUsers: 16780
  },
];

interface PopularSkillsProps {
  searchQuery?: string;
  selectedCategory?: string;
}

const PopularSkills = ({ searchQuery = '', selectedCategory = 'All Categories' }: PopularSkillsProps) => {
  const filteredCategories = skillCategories.filter(category => {
    const matchSearch = category.title.toLowerCase().includes(searchQuery) || 
                       category.examples.toLowerCase().includes(searchQuery);
    const matchCategory = selectedCategory === 'All Categories' || 
                         category.title === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getDifficultyColor = (difficulty: SkillCategory['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600';
      case 'Intermediate':
        return 'text-yellow-600';
      case 'Advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

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
              <p className="text-gray-600 mb-4">{category.examples}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${getDifficultyColor(category.difficulty)}`}>
                    {category.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">{category.activeUsers.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Popularity</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-600">{category.popularity}%</span>
                    </div>
                  </div>
                  <Progress value={category.popularity} className="h-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularSkills;
