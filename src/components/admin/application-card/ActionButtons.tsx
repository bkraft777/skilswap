
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from 'lucide-react';

interface ActionButtonsProps {
  id: string;
  processingId: string | null;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

export const ActionButtons = ({ id, processingId, onUpdateStatus }: ActionButtonsProps) => (
  <div className="flex gap-2 mt-4">
    <Button
      onClick={() => onUpdateStatus(id, 'approved')}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
      disabled={processingId === id}
    >
      <CheckCircle className="h-4 w-4" />
      {processingId === id ? 'Processing...' : 'Approve'}
    </Button>
    <Button
      variant="destructive"
      onClick={() => onUpdateStatus(id, 'rejected')}
      className="flex items-center gap-2"
      disabled={processingId === id}
    >
      <XCircle className="h-4 w-4" />
      {processingId === id ? 'Processing...' : 'Reject'}
    </Button>
  </div>
);
