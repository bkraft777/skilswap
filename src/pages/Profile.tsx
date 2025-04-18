
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileView from '@/components/profile/ProfileView';
import { PointsDisplay } from '@/components/points/PointsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Coins } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Coins className="h-4 w-4" /> Points
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileView />
          </TabsContent>
          
          <TabsContent value="points">
            <PointsDisplay />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
