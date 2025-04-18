
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileView from '@/components/profile/ProfileView';
import { PointsDisplay } from '@/components/points/PointsDisplay';
import { SessionList } from '@/components/sessions/SessionList';
import { useUserSessions } from '@/hooks/useUserSessions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Coins, Calendar } from 'lucide-react';

const Profile = () => {
  const { data: sessions, isLoading: isLoadingSessions } = useUserSessions();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Coins className="h-4 w-4" /> Points
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Sessions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileView />
          </TabsContent>
          
          <TabsContent value="points">
            <PointsDisplay />
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">My Sessions</h2>
                <p className="text-gray-600 mt-2">View all your upcoming and past sessions</p>
              </div>

              {isLoadingSessions ? (
                <div className="text-center py-12">Loading...</div>
              ) : sessions && sessions.length > 0 ? (
                <SessionList sessions={sessions} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No sessions found. Book a session to get started!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
