
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface UserMenuProps {
  user: any;
  className?: string;
}

const UserMenu = ({ user, className = '' }: UserMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      {user ? (
        <Button onClick={handleLogout}>Sign Out</Button>
      ) : (
        <Button onClick={() => navigate('/auth')} className="button-primary">
          Join Now
        </Button>
      )}
    </div>
  );
};

export default UserMenu;
