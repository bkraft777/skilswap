
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
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
