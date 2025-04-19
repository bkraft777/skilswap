
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import Logo from './navigation/Logo';
import NavLinks from './navigation/NavLinks';
import UserMenu from './navigation/UserMenu';
import MobileMenu from './navigation/MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      if (error) return false;
      return !!data;
    }
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />

          <div className="hidden md:flex items-center space-x-8">
            <NavLinks user={user} isAdmin={isAdmin} />
            <UserMenu user={user} />
          </div>

          <MobileMenu 
            isOpen={isMenuOpen}
            onToggle={toggleMenu}
            user={user}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
