import { QueueItem } from "@/types";
import { BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface StatusDisplayProps {
  currentTicket: QueueItem | null;
  isVibrating: boolean;
}

export const StatusDisplay = ({ currentTicket, isVibrating }: StatusDisplayProps) => {
  const { toast } = useToast();

  const getStatusMessage = () => {
    if (!currentTicket) return "Carregando...";
    if (currentTicket.status === 'inProgress') return "Agora é sua vez!";
    if (currentTicket.status === 'completed') return "Atendimento finalizado";
    if (currentTicket.status === 'cancelled') return "Senha cancelada";
    return "Aguardando...";
  };

  const getBellColor = () => {
    if (!currentTicket) return "text-primary";
    
    // Red when it's the client's turn (status is inProgress)
    if (currentTicket.status === 'inProgress') {
      handleVibration();
      return "text-red-500";
    }
    
    if (currentTicket.status === 'waiting') {
      const queuePosition = currentTicket.number;
      
      // Yellow when client is second in queue
      if (queuePosition === 2) {
        return "text-yellow-500";
      }
      
      // Orange when client is first in queue
      if (queuePosition === 1) {
        handleVibration();
        return "text-orange-500";
      }
    }
    
    // Default primary color for all other cases
    return "text-primary";
  };

  const handleVibration = () => {
    // Check if device supports vibration
    if ('vibrate' in navigator) {
      // Vibrate pattern: 200ms on, 100ms off, 200ms on
      navigator.vibrate([200, 100, 200]);
      
      toast({
        title: "Atenção!",
        description: "Sua vez está chegando!",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <BellRing 
            className={`w-8 h-8 ${getBellColor()} ${isVibrating ? 'animate-pulse' : ''}`} 
          />
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
        </div>
      </CardContent>
    </Card>
  );
};