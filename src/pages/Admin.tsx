
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const Admin = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto">
          <AdminDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
