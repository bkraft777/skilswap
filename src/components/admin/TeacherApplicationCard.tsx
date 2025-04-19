
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationBadge } from "./application-card/ApplicationBadge";
import { ExpertiseSection } from "./application-card/ExpertiseSection";
import { ApplicationDetails } from "./application-card/ApplicationDetails";
import { ActionButtons } from "./application-card/ActionButtons";

interface TeacherApplication {
  id: string;
  full_name: string;
  email: string;
  expertise: string[];
  experience_years: number;
  teaching_style: string;
  motivation: string;
  status: string;
}

interface TeacherApplicationCardProps {
  application: TeacherApplication;
  processingId: string | null;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

export const TeacherApplicationCard = ({ 
  application, 
  processingId, 
  onUpdateStatus 
}: TeacherApplicationCardProps) => {
  return (
    <Card className={application.status === 'approved' ? 'border-green-200' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{application.full_name}</span>
          <ApplicationBadge status={application.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ApplicationDetails
            email={application.email}
            experienceYears={application.experience_years}
            teachingStyle={application.teaching_style}
            motivation={application.motivation}
          />
          <ExpertiseSection expertise={application.expertise} />
          {application.status === 'pending' && (
            <ActionButtons
              id={application.id}
              processingId={processingId}
              onUpdateStatus={onUpdateStatus}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
