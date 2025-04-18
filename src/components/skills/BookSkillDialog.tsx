
import React, { useState } from 'react';
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useBookSession } from "@/hooks/useBookSession";

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
  const { bookSession, isPending, error, setError } = useBookSession();
  const [selectedTime, setSelectedTime] = useState(offering.availability[0] || '');

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

    if (!selectedTime) {
      toast({
        title: "Select a time",
        description: "Please select a time for your session",
        variant: "destructive",
      });
      return;
    }

    try {
      await bookSession({
        offeringId: offering.id,
        scheduledTime: selectedTime,
      });

      toast({
        title: "Session booked!",
        description: "Your session has been successfully booked.",
      });
      onOpenChange(false);
    } catch (err) {
      // Error is handled by the mutation
      toast({
        title: "Booking failed",
        description: error || "An error occurred while booking the session",
        variant: "destructive",
      });
    }
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
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select a time</option>
                {offering.availability.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
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
          <Button 
            onClick={handleBooking} 
            disabled={isPending} 
            className="gap-2"
          >
            <CalendarCheck className="h-4 w-4" />
            {isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
