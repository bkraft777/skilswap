
import { Badge } from '@/components/ui/badge';
import { Teacher } from '@/types/teacher-stats';
import { isNative } from '@/integrations/capacitor';

interface TeacherCardProps {
  teacher: Teacher;
  onClick: () => void;
}

export const TeacherCard = ({ teacher, onClick }: TeacherCardProps) => {
  // Format the display name - prioritize username and make it look clean
  const displayName = teacher.name || 'Unknown Teacher';
  
  // Add additional mobile-specific classes when running in a native app
  const cardClasses = `p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100 ${
    isNative() ? 'touch-manipulation active:opacity-70' : ''
  }`;

  // Prevent default touch behavior in native apps to avoid double-triggering
  const handleTouch = (e: React.TouchEvent) => {
    if (isNative()) {
      // Prevent default only in native environment to avoid scroll issues
      e.preventDefault();
      console.log('Touch event on teacher:', displayName);
    }
  };

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      onTouchStart={handleTouch}
      onTouchEnd={handleTouch}
      role="button"
      aria-label={`Connect with ${displayName}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
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
