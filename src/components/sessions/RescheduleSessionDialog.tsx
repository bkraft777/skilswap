
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';
import { CalendarCheck, Clock } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type SkillSessionUpdate = Database['public']['Tables']['skill_sessions']['Update'];

interface RescheduleSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  currentScheduledTime: string;
  onRescheduled: () => void;
}

export function RescheduleSessionDialog({ 
  isOpen, 
  onClose, 
  sessionId, 
  currentScheduledTime, 
  onRescheduled 
}: RescheduleSessionDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(currentScheduledTime));
  const [time, setTime] = useState(format(new Date(currentScheduledTime), 'HH:mm'));
  const [isLoading, setIsLoading] = useState(false);

  const handleReschedule = async () => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    try {
      setIsLoading(true);
      
      // Combine date and time into a single timestamp
      const [hours, minutes] = time.split(':').map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes);
      
      // Create an object with the correct type
      const updateData: SkillSessionUpdate = {
        scheduled_time: newDateTime.toISOString()
      };

      // Type assertion for the id parameter
      const { error } = await supabase
        .from('skill_sessions')
        .update(updateData)
        .eq('id', sessionId as any);

      if (error) throw error;

      toast.success('Session rescheduled successfully');
      onRescheduled();
      onClose();
    } catch (error) {
      console.error('Error rescheduling session:', error);
      toast.error('Failed to reschedule session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Session</DialogTitle>
          <DialogDescription>
            Choose a new date and time for your session.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              <span>Current: {format(new Date(currentScheduledTime), 'PPP')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>at {format(new Date(currentScheduledTime), 'h:mm a')}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Select New Date</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="border rounded-md p-2"
            />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Select New Time</h4>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleReschedule} 
            disabled={isLoading || !date}
          >
            {isLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
