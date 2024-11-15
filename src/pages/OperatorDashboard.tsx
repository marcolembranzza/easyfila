import { useEffect, useState } from "react";
import { QueueList } from "@/components/QueueList";
import { StatsCard } from "@/components/StatsCard";
import { Users, Clock, CheckCircle2, Trash2 } from "lucide-react";
import { QueueItem, QueueStats } from "@/types";
import { queueService } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { differenceInMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
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

const OperatorDashboard = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalServed: 0,
    averageWaitTime: 0,
    currentQueueSize: 0,
  });
  const { toast } = useToast();

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

  useEffect(() => {
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

  const handleResetQueue = async () => {
    try {
      const { error } = await supabase.rpc('clear_queue_items', {});
      if (error) throw error;
      
      toast({
        title: "Fila resetada",
        description: "Todas as informações da fila foram apagadas com sucesso.",
      });
      
      await fetchQueue();
    } catch (error) {
      toast({
        title: "Erro ao resetar fila",
        description: "Ocorreu um erro ao tentar resetar a fila.",
        variant: "destructive",
      });
    }
  };

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