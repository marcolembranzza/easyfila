import { QueueCard } from "./QueueCard";
import { QueueItem } from "@/types";

interface QueueListProps {
  items: QueueItem[];
  onStatusChange?: (id: string, status: QueueItem['status']) => void;
  isOperator?: boolean;
}

export const QueueList = ({ items, onStatusChange, isOperator = false }: QueueListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <QueueCard
          key={item.id}
          item={item}
          onStatusChange={onStatusChange}
          isOperator={isOperator}
        />
      ))}
    </div>
  );
};