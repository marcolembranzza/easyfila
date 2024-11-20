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
    try {
      if ((position <= 1) && 'vibrate' in navigator) {
        // Try to vibrate multiple times to ensure it works on Android
        const vibrationPattern = [200, 100, 200, 100, 200];
        navigator.vibrate(vibrationPattern);
        
        // Fallback for Android: retry vibration after a short delay
        setTimeout(() => {
          navigator.vibrate(vibrationPattern);
        }, 500);

        toast({
          title: "Atenção!",
          description: position === 0 ? "É sua vez!" : "Sua vez está chegando!",
        });
      }
    } catch (error) {
      console.error('Vibration error:', error);
    }
  };

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
      
      // Handle different ticket statuses
      if (myTicket.status === 'waiting') {
        const position = waitingItems.findIndex(item => item.id === ticketId) + 1;
        setQueuePosition(position);
        
        if (position <= 2) {
          setIsVibrating(true);
          handleVibration(position);
        }
      } else if (myTicket.status === 'inProgress') {
        setQueuePosition(0);
        setIsVibrating(true);
        handleVibration(0);
      } else if (myTicket.status === 'completed' || myTicket.status === 'cancelled') {
        setQueuePosition(null);
        setIsVibrating(false);
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

  useEffect(() => {
    fetchQueuePosition();
    
    const channel = supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'queue_items'
        },
        async () => {
          await fetchQueuePosition();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      channel.unsubscribe();
    };
  }, [ticketId]);

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