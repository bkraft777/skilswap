
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const TeacherStats = () => {
  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ['teacherApplications'],
    queryFn: async () => {
      // First try to get from featured_teachers table
      let { data: featuredTeachers, error: featuredError } = await supabase
        .from('featured_teachers')
        .select('name')
        .eq('is_active', true);
      
      if (featuredTeachers && featuredTeachers.length > 0) {
        return featuredTeachers.map(teacher => ({ name: teacher.name }));
      }
      
      // If no featured teachers, get from teacher_applications table
      const { data: applicationTeachers, error } = await supabase
        .from('teacher_applications')
        .select('full_name')
        .eq('status', 'approved');
      
      if (error) throw error;
      
      // Map the result to match the expected format
      return (applicationTeachers || []).map(teacher => ({ 
        name: teacher.full_name 
      }));
    }
  });

  if (isLoading) return <div>Loading teachers...</div>;
  if (error) return <div>Error loading teachers</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Teachers ({teachers?.length || 0})</h2>
      <ul className="space-y-2">
        {teachers?.map((teacher, index) => (
          <li key={index} className="text-gray-700">{teacher.name}</li>
        ))}
      </ul>
      {teachers?.length === 0 && (
        <p className="text-gray-500">
          No approved teachers are currently available. Teacher applications need to be approved by administrators.
        </p>
      )}
    </div>
  );
};

export default TeacherStats;
