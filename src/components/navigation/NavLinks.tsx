
import { Link } from 'react-router-dom';
import { Search, LayoutDashboard, Coins, GraduationCap, Shield } from 'lucide-react';

interface NavLinksProps {
  user: any;
  isAdmin?: boolean;
  isMobile?: boolean;
}

const NavLinks = ({ user, isAdmin, isMobile = false }: NavLinksProps) => {
  const baseClassName = isMobile
    ? "block px-3 py-2 rounded-md font-medium hover:bg-silswap-pink/10"
    : "font-medium hover:text-silswap-pink transition-colors";

  const linkWithIcon = `${baseClassName} flex items-center gap-1`;

  return (
    <>
      <Link to="/" className={baseClassName}>Home</Link>
      <Link to="/how-it-works" className={baseClassName}>How It Works</Link>
      <Link to="/marketplace" className={baseClassName}>Marketplace</Link>
      <Link to="/skills" className={baseClassName}>Skills</Link>
      <Link to="/community" className={baseClassName}>Community</Link>
      {user && (
        <>
          <Link to="/find-teacher" className={linkWithIcon}>
            <Search className="h-4 w-4" /> Find a Teacher
          </Link>
          <Link to="/dashboard" className={linkWithIcon}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/points" className={linkWithIcon}>
            <Coins className="h-4 w-4" /> Points
          </Link>
          <Link to="/become-teacher" className={linkWithIcon}>
            <GraduationCap className="h-4 w-4" /> Become a Teacher
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`${linkWithIcon} ${isMobile ? 'bg-silswap-green/10' : ''} text-silswap-green hover:text-silswap-pink`}
            >
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
          <Link to="/edit-profile" className={baseClassName}>Edit Profile</Link>
        </>
      )}
    </>
  );
};

export default NavLinks;
