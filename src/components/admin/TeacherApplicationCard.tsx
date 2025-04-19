
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from 'lucide-react';

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
          <Badge variant={
            application.status === 'approved' ? 'success' :
            application.status === 'rejected' ? 'destructive' :
            'default'
          }>
            {application.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Email:</p>
            <p>{application.email}</p>
          </div>
          <div>
            <p className="font-semibold">Expertise:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {application.expertise.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold">Experience:</p>
            <p>{application.experience_years} years</p>
          </div>
          <div>
            <p className="font-semibold">Teaching Style:</p>
            <p className="text-gray-600">{application.teaching_style}</p>
          </div>
          <div>
            <p className="font-semibold">Motivation:</p>
            <p className="text-gray-600">{application.motivation}</p>
          </div>
          
          {application.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => onUpdateStatus(application.id, 'approved')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                disabled={processingId === application.id}
              >
                <CheckCircle className="h-4 w-4" />
                {processingId === application.id ? 'Processing...' : 'Approve'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => onUpdateStatus(application.id, 'rejected')}
                className="flex items-center gap-2"
                disabled={processingId === application.id}
              >
                <XCircle className="h-4 w-4" />
                {processingId === application.id ? 'Processing...' : 'Reject'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
