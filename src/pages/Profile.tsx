
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileView from '@/components/profile/ProfileView';

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProfileView />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
