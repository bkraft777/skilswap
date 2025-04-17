
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EditProfileForm from '@/components/profile/EditProfileForm';

const EditProfile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <EditProfileForm />
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
