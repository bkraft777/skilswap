
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Admin = () => {
  const queryClient = useQueryClient();
  
  // Invalidate the cache when the component mounts to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['teacherApplications'],
    });
  }, [queryClient]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
