
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TeacherNotifications from '@/components/teacher/TeacherNotifications';
import { useAuth } from '@/hooks/useAuth';

const NavbarExtras = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-2">
      {user && (
        <>
          <TeacherNotifications />
          <Button variant="outline" size="sm" asChild>
            <Link to="/find-teacher">Find a Teacher</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default NavbarExtras;
