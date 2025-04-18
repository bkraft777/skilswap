
import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useUserPoints } from "@/hooks/useUserPoints";
import { SkillOffering } from "@/hooks/useSkillOfferings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface BookSkillDialogProps {
  offering: SkillOffering;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookSkillDialog({ offering, open, onOpenChange }: BookSkillDialogProps) {
  const { user } = useAuth();
  const { points } = useUserPoints();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book a session",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!points?.points_balance || points.points_balance < offering.points_cost) {
      toast({
        title: "Insufficient points",
        description: "You don't have enough points to book this session",
        variant: "destructive",
      });
      return;
    }

    // Placeholder - Will implement actual booking logic later
    toast({
      title: "Coming soon!",
      description: "Booking functionality will be implemented in the next update.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book {offering.skill} Session</DialogTitle>
          <DialogDescription>
            Review the session details before confirming your booking
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Available: {offering.availability.join(", ")}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span>Cost: {offering.points_cost} points</span>
            </div>

            {points && (
              <div className="text-sm text-muted-foreground">
                Your balance: {points.points_balance} points
              </div>
            )}

            <p className="text-sm">{offering.description}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleBooking} className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
