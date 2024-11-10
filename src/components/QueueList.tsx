import { QueueCard } from "./QueueCard";
import { QueueItem } from "@/types";

interface QueueListProps {
  items: QueueItem[];
  onStatusChange?: (id: string, status: QueueItem['status']) => void;
  isOperator?: boolean;
}

export const QueueList = ({ items, onStatusChange, isOperator = false }: QueueListProps) => {
  // Sort items by priority first, then by number
  const sortedItems = [...items].sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority ? 1 : -1;
    }
    return a.number - b.number;
  });

  return (
    <div className="space-y-4">
      {sortedItems.map((item) => (
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