import { useState } from "react";
import { QueueList } from "@/components/QueueList";
import { StatsCard } from "@/components/StatsCard";
import { Users, Clock, CheckCircle2, BarChart } from "lucide-react";
import { QueueItem, QueueStats } from "@/types";

// Temporary mock data
const mockQueue: QueueItem[] = [
  {
    id: "1",
    number: 1,
    clientName: "John Doe",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedTime: 15,
  },
  {
    id: "2",
    number: 2,
    clientName: "Jane Smith",
    status: "inProgress",
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedTime: 10,
  },
];

const mockStats: QueueStats = {
  totalServed: 45,
  averageWaitTime: 12,
  currentQueueSize: 8,
};

const OperatorDashboard = () => {
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue);

  const handleStatusChange = (id: string, newStatus: QueueItem['status']) => {
    setQueue(queue.map(item => 
      item.id === id 
        ? { ...item, status: newStatus, updatedAt: new Date() }
        : item
    ));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Operator Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Current Queue Size"
          value={mockStats.currentQueueSize}
          icon={<Users className="text-primary" />}
        />
        <StatsCard
          title="Average Wait Time"
          value={`${mockStats.averageWaitTime} min`}
          icon={<Clock className="text-primary" />}
        />
        <StatsCard
          title="Total Served Today"
          value={mockStats.totalServed}
          icon={<CheckCircle2 className="text-primary" />}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Current Queue</h2>
        <QueueList
          items={queue}
          onStatusChange={handleStatusChange}
          isOperator={true}
        />
      </div>
    </div>
  );
};

export default OperatorDashboard;