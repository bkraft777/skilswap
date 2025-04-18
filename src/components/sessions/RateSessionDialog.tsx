
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';
import { Star } from 'lucide-react';

interface RateSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onRated: () => void;
}

export function RateSessionDialog({ isOpen, onClose, sessionId, onRated }: RateSessionDialogProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRate = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.rpc('rate_skill_session', {
        p_session_id: sessionId,
        p_rating: rating,
        p_feedback: feedback
      });

      if (error) throw error;

      toast.success('Session rated successfully');
      onRated();
      onClose();
    } catch (error) {
      console.error('Error rating session:', error);
      toast.error('Failed to submit rating');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rate Session</AlertDialogTitle>
          <AlertDialogDescription>
            Share your experience about this session
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 hover:scale-110 transition-transform ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star className="h-8 w-8 fill-current" />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your feedback about the session (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRate}
            disabled={isLoading || rating === 0}
          >
            {isLoading ? 'Submitting...' : 'Submit Rating'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
