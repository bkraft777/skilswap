
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileView from '@/components/profile/ProfileView';
import { PointsDisplay } from '@/components/points/PointsDisplay';

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ProfileView />
          <PointsDisplay />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
