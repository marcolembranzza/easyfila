import { useState, useEffect } from "react";
import { QueueList } from "@/components/QueueList";
import { Card } from "@/components/ui/card";
import { QueueItem } from "@/types";

// Temporary mock data
const mockClientQueue: QueueItem[] = [
  {
    id: "1",
    number: 1,
    clientName: "John Doe",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedTime: 15,
  },
];

const ClientView = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>(mockClientQueue);
  const [currentPosition, setCurrentPosition] = useState(1);

  useEffect(() => {
    // Request notification permission when component mounts
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 p-6 bg-primary text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">Your Position</h2>
        <div className="text-5xl font-bold mb-4">#{currentPosition}</div>
        <p className="text-primary-foreground/80">
          Estimated wait time: ~15 minutes
        </p>
      </Card>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Queue Status</h2>
        <QueueList items={queueItems} />
      </div>
    </div>
  );
};

export default ClientView;