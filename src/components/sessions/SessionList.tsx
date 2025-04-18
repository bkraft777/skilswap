
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, Coins } from "lucide-react";
import { Session } from "@/hooks/useUserSessions";
import { useAuth } from "@/hooks/useAuth";
import { format } from 'date-fns';

interface SessionListProps {
  sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
  const { user } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => {
        const isTeacher = session.teacher_id === user?.id;
        
        return (
          <Card key={session.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">{session.offering.skill}</CardTitle>
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
