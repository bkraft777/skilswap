
import React from 'react';
import Navbar from '@/components/Navbar';
import TeacherApplicationForm from '@/components/teacher/TeacherApplicationForm';
import Footer from '@/components/Footer';

const BecomeTeacher = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Become a Teacher</h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Share your expertise with others and earn while teaching in bite-sized lessons
          </p>
          <TeacherApplicationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeTeacher;
