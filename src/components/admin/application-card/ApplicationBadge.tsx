
import { Badge } from "@/components/ui/badge";

interface ApplicationBadgeProps {
  status: string;
}

export const ApplicationBadge = ({ status }: ApplicationBadgeProps) => (
  <Badge variant={
    status === 'approved' ? 'success' :
    status === 'rejected' ? 'destructive' :
    'default'
  }>
    {status}
  </Badge>
);
