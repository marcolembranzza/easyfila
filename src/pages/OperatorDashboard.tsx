import { useEffect, useState } from "react";
import { QueueList } from "@/components/QueueList";
import { StatsCard } from "@/components/StatsCard";
import { Users, Clock, CheckCircle2 } from "lucide-react";
import { QueueItem, QueueStats } from "@/types";
import { queueService } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { differenceInMinutes } from "date-fns";

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
        const activeItems = items.filter(
          item => item.status !== 'completed' && item.status !== 'cancelled'
        );
        setQueue(activeItems);
        updateStats(items);
      } catch (error) {
        console.error('Error fetching queue:', error);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    const subscription = queueService.subscribeToQueue((items) => {
      const activeItems = items.filter(
        item => item.status !== 'completed' && item.status !== 'cancelled'
      );
      setQueue(activeItems);
      updateStats(items);
    });

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  const updateStats = (items: QueueItem[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = items.filter(item => {
      const itemDate = new Date(item.updated_at);
      return item.status === 'completed' && itemDate >= today;
    }).length;

    const waiting = items.filter(item => item.status === 'waiting').length;

    // Calculate average wait time for completed items
    const completedItems = items.filter(item => item.status === 'completed');
    const totalWaitTime = completedItems.reduce((acc, item) => {
      const startTime = new Date(item.created_at);
      const endTime = new Date(item.updated_at);
      return acc + differenceInMinutes(endTime, startTime);
    }, 0);

    const avgWaitTime = completedItems.length > 0 
      ? Math.round(totalWaitTime / completedItems.length)
      : 0;

    setStats({
      totalServed: completedToday,
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
      <h1 className="text-3xl font-bold mb-8">Painel do Operador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Tamanho da Fila"
          value={stats.currentQueueSize}
          icon={<Users className="text-primary" />}
        />
        <StatsCard
          title="Tempo Médio de Espera"
          value={`${stats.averageWaitTime} min`}
          icon={<Clock className="text-primary" />}
        />
        <StatsCard
          title="Total Atendidos Hoje"
          value={stats.totalServed}
          icon={<CheckCircle2 className="text-primary" />}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Fila Atual</h2>
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