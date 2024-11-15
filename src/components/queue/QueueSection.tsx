import { QueueList } from "@/components/QueueList";
import { QueueItem } from "@/types";

interface QueueSectionProps {
  queue: QueueItem[];
  onStatusChange: (id: string, status: QueueItem['status']) => Promise<void>;
}

export const QueueSection = ({ queue, onStatusChange }: QueueSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Fila Atual</h2>
      <QueueList
        items={queue}
        onStatusChange={onStatusChange}
        isOperator={true}
      />
    </div>
  );
};