
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample teacher data (in a real app, this would come from the database)
const featuredTeachers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Web Development', 'UI/UX Design', 'React'],
    rating: 4.9,
    bio: 'Frontend developer with 8+ years of experience teaching coding skills to beginners.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Data Science', 'Python', 'Machine Learning'],
    rating: 4.8,
    bio: 'Data scientist helping people understand complex concepts in just 5 minutes.'
  },
  {
    id: 3,
    name: 'Aisha Patel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Digital Marketing', 'SEO', 'Content Creation'],
    rating: 4.7,
    bio: 'Marketing expert specializing in quick, actionable tips for online presence.'
  }
];

const FeaturedTeachers = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="section-container">
        <h2 className="section-title mb-4">Meet Our Featured Teachers</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          These talented individuals are sharing their expertise in quick 5-minute sessions.
          Join them and start your learning journey today!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTeachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{teacher.name}</h3>
                  <div className="flex items-center text-amber-500">
                    <span className="text-sm">★</span>
                    <span className="text-sm ml-1">{teacher.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{teacher.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedTeachers;
