import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { queueService } from "@/lib/supabase";
import { QueueItem } from "@/types";
import { StatusDisplay } from "@/components/queue/StatusDisplay";
import { QueuePosition } from "@/components/queue/QueuePosition";
import { supabase } from "@/integrations/supabase/client";

const ClientNotification = () => {
  const { ticketId } = useParams();
  const { toast } = useToast();
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<QueueItem | null>(null);

  const handleVibration = (position: number) => {
    if (position === 1 && 'vibrate' in navigator) {
      // Vibrate for 200ms, pause for 100ms, vibrate for 200ms
      navigator.vibrate([200, 100, 200]);
      
      toast({
        title: "Atenção!",
        description: "Você é o próximo da fila!",
      });
    }
  };

  useEffect(() => {
    const fetchQueuePosition = async () => {
      try {
        const items = await queueService.getQueueItems();
        const waitingItems = items.filter(item => item.status === 'waiting');
        const myTicket = items.find(item => item.id === ticketId);
        
        if (!myTicket) {
          toast({
            title: "Senha não encontrada",
            description: "A senha informada não foi encontrada no sistema.",
            variant: "destructive"
          });
          return;
        }

        setCurrentTicket(myTicket);
        
        if (myTicket.status === 'waiting') {
          const position = waitingItems.findIndex(item => item.id === ticketId) + 1;
          setQueuePosition(position);
          
          // Trigger vibration if client is first in queue
          handleVibration(position);
          
          if (position <= 2 && !isVibrating) {
            setIsVibrating(true);
          }
        } else if (myTicket.status === 'inProgress') {
          setQueuePosition(0);
        }
      } catch (error) {
        console.error('Error fetching queue position:', error);
        toast({
          title: "Erro",
          description: "Não foi possível obter a posição na fila.",
          variant: "destructive"
        });
      }
    };

    // Initial data fetch
    fetchQueuePosition();
    
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
          await fetchQueuePosition();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [ticketId, isVibrating, toast]);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <StatusDisplay 
        currentTicket={currentTicket} 
        isVibrating={isVibrating} 
      />
      <QueuePosition 
        queuePosition={queuePosition} 
        isVibrating={isVibrating} 
      />
    </div>
  );
};

export default ClientNotification;