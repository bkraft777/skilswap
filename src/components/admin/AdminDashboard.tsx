
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();
  
  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ['teacherApplications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleApplicationUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('teacher_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Also add user to profiles table if they don't exist already
      if (status === 'approved') {
        const application = applications?.find(app => app.id === id);
        if (application && application.user_id) {
          console.log('Updating profile for user:', application.user_id);
          
          // First check if user has skills in profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('skills')
            .eq('id', application.user_id)
            .single();
            
          // Update profile with expertise if needed
          if (profileData) {
            console.log('Updating existing profile with skills:', application.expertise);
            await supabase
              .from('profiles')
              .update({ 
                skills: application.expertise 
              })
              .eq('id', application.user_id);
          }
          
          // For debugging: Verify the update happened
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('skills')
            .eq('id', application.user_id)
            .single();
            
          console.log('Updated profile:', updatedProfile);
        }
      }

      toast({
        title: "Application Updated",
        description: `Teacher application ${status} successfully.`,
      });
      
      // Update local state immediately for a better UX
      // This ensures the badge updates right away
      if (applications) {
        const updatedApplications = applications.map(app => 
          app.id === id ? { ...app, status } : app
        );
        // Force a refresh of the UI
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="p-6">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading applications</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Teacher Applications</h1>
      
      {applications?.length === 0 ? (
        <p className="text-gray-500">No pending applications</p>
      ) : (
        <div className="grid gap-4">
          {applications?.map((application) => (
            <Card key={application.id} className={application.status === 'approved' ? 'border-green-200' : ''}>
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
                        onClick={() => handleApplicationUpdate(application.id, 'approved')}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
