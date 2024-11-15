import { useEffect, useState } from "react";
import { QueueItem, QueueStats } from "@/types";
import { queueService } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { differenceInMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  const handleResetQueue = async () => {
    try {
      const { error } = await supabase.rpc('clear_queue_items');
      if (error) throw error;
      
      setQueue([]);
      setStats({
        totalServed: 0,
        averageWaitTime: 0,
        currentQueueSize: 0,
      });
      
      toast({
        title: "Fila resetada",
        description: "Todas as informações da fila foram apagadas com sucesso.",
      });
    } catch (error) {
      console.error('Error resetting queue:', error);
      toast({
        title: "Erro ao resetar fila",
        description: "Ocorreu um erro ao tentar resetar a fila.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_items' },
        async (payload) => {
          const { data: items, error } = await supabase
            .from('queue_items')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: true });

          if (error) {
            console.error('Error fetching queue:', error);
            return;
          }

          const activeItems = (items || []).filter(
            item => item.status !== 'completed' && item.status !== 'cancelled'
          );
          
          setQueue(activeItems);
          updateStats(items || []);
        }
      )
      .subscribe();

    // Initial fetch
    const fetchInitialData = async () => {
      const { data: items, error } = await supabase
        .from('queue_items')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching initial queue:', error);
        return;
      }

      const activeItems = (items || []).filter(
        item => item.status !== 'completed' && item.status !== 'cancelled'
      );
      
      setQueue(activeItems);
      updateStats(items || []);
    };

    fetchInitialData();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel do Operador</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Resetar Fila
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá apagar todas as informações da fila, incluindo histórico.
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetQueue}>
                Sim, resetar fila
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <StatsGrid stats={stats} />
      <QueueSection queue={queue} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default OperatorDashboard;