import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTeachersList } from '@/hooks/useTeachersList';
import { handleTeacherClick } from '@/utils/handleTeacherClick';
import { TeacherCard } from '@/components/teacher/TeacherCard';

const TeacherStats = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: teachers, isLoading, error, refetch } = useTeachersList();

  // Force an initial refetch on component mount to ensure data is fresh
  useEffect(() => {
    const initialFetch = async () => {
      console.log('Forcing initial refresh of teacher data');
      await refetch();
    };
    
    initialFetch();
  }, [refetch]);

  if (isLoading) return <TeacherListSkeleton />;
  if (error) return <div className="text-red-500">Error loading teachers</div>;

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${isMobile ? 'w-full' : ''}`}>
      <h2 className="text-xl font-bold mb-4">Available Teachers ({teachers?.length || 0})</h2>
      
      {!teachers || teachers.length === 0 ? (
        <p className="text-gray-500">
          No approved teachers are currently available. Check back soon!
        </p>
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher, index) => (
            <TeacherCard
              key={index}
              teacher={teacher}
              onClick={() => {
                handleTeacherClick({
                  teacher,
                  userId: user?.id,
                  onSuccess: (requestId) => {
                    toast({
                      title: "Connection initiated",
                      description: `Connecting you with ${teacher.name}`,
                    });
                    console.log('Navigating to waiting room with request ID:', requestId);
                    navigate(`/waiting-room/${requestId}`);
                  },
                  onError: (message) => {
                    toast({
                      title: "Connection failed",
                      description: message,
                      variant: "destructive",
                    });
                    if (message.includes("sign in")) {
                      navigate('/auth');
                    }
                  }
                });
              }}
            />
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
