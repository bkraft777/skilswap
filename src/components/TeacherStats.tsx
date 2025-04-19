
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const TeacherStats = () => {
  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ['featuredTeachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_teachers')
        .select('name')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
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
        <p className="text-gray-500">No teachers are currently available.</p>
      )}
    </div>
  );
};

export default TeacherStats;
