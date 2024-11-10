import { useEffect, useState } from "react";
import { QueueList } from "@/components/QueueList";
import { StatsCard } from "@/components/StatsCard";
import { Users, Clock, CheckCircle2 } from "lucide-react";
import { QueueItem, QueueStats } from "@/types";
import { queueService } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const OperatorDashboard = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalServed: 0,
    averageWaitTime: 0,
    currentQueueSize: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const items = await queueService.getQueueItems();
        setQueue(items);
        updateStats(items);
      } catch (error) {
        console.error('Error fetching queue:', error);
      }
    };

    fetchQueue();

    const subscription = queueService.subscribeToQueue((items) => {
      setQueue(items);
      updateStats(items);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateStats = (items: QueueItem[]) => {
    const completed = items.filter(item => item.status === 'completed').length;
    const waiting = items.filter(item => item.status === 'waiting').length;
    const avgWaitTime = Math.round(items.reduce((acc, item) => acc + (item.estimatedTime || 0), 0) / items.length) || 0;

    setStats({
      totalServed: completed,
      averageWaitTime: avgWaitTime,
      currentQueueSize: waiting,
    });
  };

  const handleStatusChange = async (id: string, newStatus: QueueItem['status']) => {
    try {
      await queueService.updateStatus(id, newStatus);
      toast({
        title: "Status atualizado",
        description: "O status da senha foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao tentar atualizar o status da senha.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Operator Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Current Queue Size"
          value={stats.currentQueueSize}
          icon={<Users className="text-primary" />}
        />
        <StatsCard
          title="Average Wait Time"
          value={`${stats.averageWaitTime} min`}
          icon={<Clock className="text-primary" />}
        />
        <StatsCard
          title="Total Served Today"
          value={stats.totalServed}
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