
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, Coins, Star, X } from "lucide-react";
import { Session } from "@/hooks/useUserSessions";
import { useAuth } from "@/hooks/useAuth";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { CancelSessionDialog } from "./CancelSessionDialog";
import { RateSessionDialog } from "./RateSessionDialog";

interface SessionListProps {
  sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
  const { user } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRateDialog, setShowRateDialog] = useState(false);

  const canCancelSession = (session: Session) => {
    const now = new Date();
    const sessionDate = new Date(session.scheduled_time);
    return (
      !session.cancelled_at &&
      session.status !== 'completed' &&
      sessionDate > now
    );
  };

  const canRateSession = (session: Session) => {
    return (
      session.status === 'completed' &&
      session.learner_id === user?.id &&
      !session.rating
    );
  };

  const handleRefresh = () => {
    // The query will automatically refetch due to invalidation
    setShowCancelDialog(false);
    setShowRateDialog(false);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => {
          const isTeacher = session.teacher_id === user?.id;
          
          return (
            <Card key={session.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">
                  {session.offering.skill}
                  {session.rating && (
                    <span className="ml-2 text-yellow-400 inline-flex items-center">
                      <Star className="h-4 w-4 fill-current" />
                      {session.rating}
                    </span>
                  )}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {isTeacher ? 'Teaching Session' : 'Learning Session'}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(session.scheduled_time), 'PPpp')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <span>{session.points_amount} points</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{session.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {session.offering.description}
                </p>

                <div className="flex gap-2 pt-2">
                  {canCancelSession(session) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedSessionId(session.id);
                        setShowCancelDialog(true);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                  {canRateSession(session) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSessionId(session.id);
                        setShowRateDialog(true);
                      }}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Rate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSessionId && (
        <>
          <CancelSessionDialog
            isOpen={showCancelDialog}
            onClose={() => setShowCancelDialog(false)}
            sessionId={selectedSessionId}
            onCancelled={handleRefresh}
          />
          <RateSessionDialog
            isOpen={showRateDialog}
            onClose={() => setShowRateDialog(false)}
            sessionId={selectedSessionId}
            onRated={handleRefresh}
          />
        </>
      )}
    </>
  );
}
