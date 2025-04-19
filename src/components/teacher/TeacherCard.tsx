
import { Badge } from '@/components/ui/badge';
import { Teacher } from '@/types/teacher-stats';

interface TeacherCardProps {
  teacher: Teacher;
  onClick: () => void;
}

export const TeacherCard = ({ teacher, onClick }: TeacherCardProps) => {
  // Get the part of the email before the @ symbol
  const displayName = teacher.name?.includes('@') 
    ? teacher.name.split('@')[0] 
    : teacher.name;

  return (
    <div 
      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
      onClick={onClick}
      onTouchStart={() => console.log('Touch start on teacher:', displayName)}
      onTouchEnd={() => console.log('Touch end on teacher:', displayName)}
      role="button"
      aria-label={`Connect with ${displayName}`}
      tabIndex={0}
    >
      <p className="font-medium break-words">{displayName}</p>
      {teacher.skills && teacher.skills.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-1">
          {teacher.skills.map((skill, skillIndex) => (
            <Badge key={skillIndex} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 mt-1">No skills specified</p>
      )}
    </div>
  );
};
