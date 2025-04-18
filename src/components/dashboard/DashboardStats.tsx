
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/hooks/useUserSessions";
import { UserPoints } from "@/hooks/useUserPoints";
import { Coins, Calendar, BookOpen } from "lucide-react";

interface DashboardStatsProps {
  sessions?: Session[];
  points?: UserPoints;
}

export function DashboardStats({ sessions, points }: DashboardStatsProps) {
  const upcomingSessions = sessions?.filter(
    session => new Date(session.scheduled_time) > new Date()
  ).length || 0;

  const completedSessions = sessions?.filter(
    session => session.status === 'completed'
  ).length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{points?.points_balance || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total earned: {points?.total_earned || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingSessions}</div>
          <p className="text-xs text-muted-foreground">
            Next 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedSessions}</div>
          <p className="text-xs text-muted-foreground">
            Total sessions completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
