
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from '@/components/ui/skeleton';

const TeacherStats = () => {
  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ['availableTeachers'],
    queryFn: async () => {
      // First try to get from featured_teachers table
      let { data: featuredTeachers, error: featuredError } = await supabase
        .from('featured_teachers')
        .select('name, skills')
        .eq('is_active', true);
      
      if (featuredTeachers && featuredTeachers.length > 0) {
        return featuredTeachers;
      }
      
      // If no featured teachers, get from teacher_applications table
      const { data: applicationTeachers, error } = await supabase
        .from('teacher_applications')
        .select('full_name, expertise')
        .eq('status', 'approved');
      
      if (error) throw error;
      
      // Map the result to match the expected format
      return (applicationTeachers || []).map(teacher => ({ 
        name: teacher.full_name,
        skills: teacher.expertise
      }));
    }
  });

  if (isLoading) return <TeacherListSkeleton />;
  if (error) return <div className="text-red-500">Error loading teachers</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Available Teachers ({teachers?.length || 0})</h2>
      
      {teachers?.length === 0 ? (
        <p className="text-gray-500">
          No approved teachers are currently available. Check back soon!
        </p>
      ) : (
        <div className="space-y-3">
          {teachers?.map((teacher, index) => (
            <div key={index} className="p-3 border rounded-md hover:bg-gray-50">
              <p className="font-medium">{teacher.name}</p>
              {teacher.skills && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {teacher.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TeacherListSkeleton = () => (
  <div className="p-4 bg-white rounded-lg shadow-sm">
    <Skeleton className="h-7 w-48 mb-4" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 border rounded-md">
          <Skeleton className="h-5 w-32 mb-2" />
          <div className="flex gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TeacherStats;
