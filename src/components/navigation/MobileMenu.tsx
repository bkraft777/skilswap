
import { Menu, X } from 'lucide-react';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  user: any;
  isAdmin?: boolean;
}

const MobileMenu = ({ isOpen, onToggle, user, isAdmin }: MobileMenuProps) => {
  return (
    <>
      <div className="md:hidden">
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLinks user={user} isAdmin={isAdmin} isMobile={true} />
            <div className="px-3 py-2">
              <UserMenu user={user} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
