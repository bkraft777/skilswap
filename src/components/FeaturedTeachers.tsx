
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFeaturedTeachers } from '@/hooks/useFeaturedTeachers';
import { Skeleton } from '@/components/ui/skeleton';

const TeacherSkeleton = () => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center gap-4 pb-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
  </Card>
);

const FeaturedTeachers = () => {
  const { data: teachers, isLoading, error } = useFeaturedTeachers();

  if (error) {
    console.error('Error loading featured teachers:', error);
    return null;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="section-container">
        <h2 className="section-title mb-4">Meet Our Featured Teachers</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          These talented individuals are sharing their expertise in quick 5-minute sessions.
          Join them and start your learning journey today!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <TeacherSkeleton />
              <TeacherSkeleton />
              <TeacherSkeleton />
            </>
          ) : teachers?.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No featured teachers available at the moment.
            </p>
          ) : (
            teachers?.map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.avatar_url} alt={teacher.name} />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedTeachers;
