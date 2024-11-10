import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Phone } from "lucide-react";
import { QueueItem } from "@/types";

interface QueueCardProps {
  item: QueueItem;
  onStatusChange?: (id: string, status: QueueItem['status']) => void;
  isOperator?: boolean;
}

export const QueueCard = ({ item, onStatusChange, isOperator = false }: QueueCardProps) => {
  const statusColors = {
    waiting: "bg-status-waiting",
    inProgress: "bg-status-inProgress",
    completed: "bg-status-completed",
    cancelled: "bg-status-cancelled",
  };

  return (
    <Card className="p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">#{item.number}</span>
            <Badge className={statusColors[item.status]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <User size={16} />
            <span>{item.client_name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <Phone size={16} />
            <span>{item.phone_number}</span>
          </div>
          {item.estimated_time && (
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <Clock size={16} />
              <span>~{item.estimated_time} min</span>
            </div>
          )}
        </div>
        
        {isOperator && item.status !== 'completed' && item.status !== 'cancelled' && (
          <div className="flex gap-2">
            {item.status === 'waiting' && (
              <Button
                variant="default"
                onClick={() => onStatusChange?.(item.id, 'inProgress')}
              >
                Start
              </Button>
            )}
            {item.status === 'inProgress' && (
              <Button
                variant="default"
                onClick={() => onStatusChange?.(item.id, 'completed')}
              >
                Complete
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => onStatusChange?.(item.id, 'cancelled')}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};