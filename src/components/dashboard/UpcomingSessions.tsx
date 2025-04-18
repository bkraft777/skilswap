
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/hooks/useUserSessions";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";

interface UpcomingSessionsProps {
  sessions?: Session[];
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  const upcomingSessions = sessions
    ?.filter(session => new Date(session.scheduled_time) > new Date())
    ?.sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
    ?.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingSessions && upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{session.offering.skill}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(session.scheduled_time), 'PPP')}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {format(new Date(session.scheduled_time), 'h:mm a')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming sessions</p>
        )}
      </CardContent>
    </Card>
  );
}
