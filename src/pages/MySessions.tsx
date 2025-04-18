
import React from 'react';
import { useUserSessions } from '@/hooks/useUserSessions';
import { SessionList } from '@/components/sessions/SessionList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MySessions = () => {
  const { data: sessions, isLoading } = useUserSessions();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">My Sessions</h1>
            <p className="text-gray-600 mt-2">View all your upcoming and past sessions</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : sessions && sessions.length > 0 ? (
            <SessionList sessions={sessions} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No sessions found. Book a session to get started!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MySessions;
