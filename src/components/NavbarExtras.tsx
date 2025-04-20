
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TeacherNotifications from '@/components/teacher/TeacherNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Search, LogIn } from 'lucide-react';

const NavbarExtras = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          <TeacherNotifications />
          <Button variant="default" size="sm" asChild className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
            <Link to="/find-teacher">
              <Search className="h-4 w-4" />
              <span>Find a Teacher</span>
            </Link>
          </Button>
        </>
      ) : (
        <Button variant="default" size="sm" asChild>
          <Link to="/auth">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default NavbarExtras;
