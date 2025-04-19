
import { useTeacherApplications } from "@/hooks/useTeacherApplications";
import { TeacherApplicationCard } from "./TeacherApplicationCard";

const AdminDashboard = () => {
  const { 
    applications, 
    isLoading, 
    error, 
    processingId, 
    handleApplicationUpdate 
  } = useTeacherApplications();

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
            <TeacherApplicationCard
              key={application.id}
              application={application}
              processingId={processingId}
              onUpdateStatus={handleApplicationUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
