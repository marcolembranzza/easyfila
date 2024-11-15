import { useEffect, useState } from "react";
import { QueueItem, QueueStats } from "@/types";
import { queueService } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { differenceInMinutes } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { StatsGrid } from "@/components/stats/StatsGrid";
import { QueueSection } from "@/components/queue/QueueSection";

const OperatorDashboard = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalServed: 0,
    averageWaitTime: 0,
    currentQueueSize: 0,
  });
  const { toast } = useToast();

  const calculateWaitTime = (createdAt: string) => {
    const startTime = new Date(createdAt);
    const currentTime = new Date();
    return differenceInMinutes(currentTime, startTime);
  };

  const updateStats = (items: QueueItem[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = items.filter(item => {
      const itemDate = new Date(item.updated_at);
      return item.status === 'completed' && itemDate >= today;
    }).length;

    const waitingItems = items.filter(item => 
      item.status === 'waiting' || item.status === 'inProgress'
    );

    const totalWaitTime = waitingItems.reduce((acc, item) => {
      return acc + calculateWaitTime(item.created_at);
    }, 0);

    const avgWaitTime = waitingItems.length > 0 
      ? Math.round(totalWaitTime / waitingItems.length)
      : 0;

    setStats({
      totalServed: completedToday,
      averageWaitTime: avgWaitTime,
      currentQueueSize: waitingItems.length,
    });
  };

  const handleStatusChange = async (id: string, newStatus: QueueItem['status']) => {
    try {
      await queueService.updateStatus(id, newStatus);
      // Immediately update the local queue state
      const updatedQueue = queue.map(item => {
        if (item.id === id) {
          return { ...item, status: newStatus, updated_at: new Date().toISOString() };
        }
        return item;
      });
      setQueue(updatedQueue);
      updateStats([...updatedQueue]);
      
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

    // Initial data fetch
    fetchQueue();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'queue_items'
        },
        async (payload) => {
          console.log('Realtime update received:', payload);
          // Immediately fetch fresh data after any change
          await fetchQueue();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel do Operador</h1>
      </div>
      
      <StatsGrid stats={stats} />
      <QueueSection queue={queue} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default OperatorDashboard;