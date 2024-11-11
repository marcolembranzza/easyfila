import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { queueService } from "@/lib/supabase";
import { QueueItem } from "@/types";
import { StatusDisplay } from "@/components/queue/StatusDisplay";
import { QueuePosition } from "@/components/queue/QueuePosition";

const ClientNotification = () => {
  const { ticketId } = useParams();
  const { toast } = useToast();
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<QueueItem | null>(null);

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
          
          if (position <= 2 && !isVibrating) {
            setIsVibrating(true);
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
              toast({
                title: "Atenção!",
                description: "Sua vez está próxima!",
              });
            }
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

    fetchQueuePosition();
    const interval = setInterval(fetchQueuePosition, 5000);
    return () => clearInterval(interval);
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