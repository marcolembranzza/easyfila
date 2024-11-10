import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BellRing } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { queueService } from "@/lib/supabase";
import { QueueItem } from "@/types";

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

  const getStatusMessage = () => {
    if (!currentTicket) return "Carregando...";
    if (currentTicket.status === 'inProgress') return "Agora é sua vez!";
    if (currentTicket.status === 'completed') return "Atendimento finalizado";
    if (currentTicket.status === 'cancelled') return "Senha cancelada";
    return `Sua posição na fila: ${queuePosition}`;
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <BellRing className={`w-8 h-8 text-primary ${isVibrating ? 'animate-pulse' : ''}`} />
          </div>
          <CardTitle className="text-2xl">Status da Fila</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div>
              <p className="text-lg text-gray-600">Sua senha:</p>
              <p className="text-4xl font-bold text-primary">#{currentTicket?.number}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">
                {getStatusMessage()}
              </p>
            </div>
            {isVibrating && currentTicket?.status === 'waiting' && (
              <p className="text-lg font-semibold text-primary animate-pulse">
                Prepare-se! Sua vez está chegando!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotification;