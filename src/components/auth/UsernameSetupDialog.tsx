
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsername } from '@/hooks/useUsername';

interface UsernameSetupDialogProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const UsernameSetupDialog = ({ isOpen, onComplete }: UsernameSetupDialogProps) => {
  const [username, setUsername] = useState('');
  const { updateUsername, isLoading } = useUsername();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUsername(username);
    if (success) {
      onComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your username</DialogTitle>
          <DialogDescription>
            Pick a unique username. It must be 3-30 characters long and can only contain letters and numbers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="^[a-zA-Z0-9]{3,30}$"
            required
            minLength={3}
            maxLength={30}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Username'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
