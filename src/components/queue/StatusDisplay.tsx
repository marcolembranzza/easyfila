import { QueueItem } from "@/types";
import { BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusDisplayProps {
  currentTicket: QueueItem | null;
  isVibrating: boolean;
}

export const StatusDisplay = ({ currentTicket, isVibrating }: StatusDisplayProps) => {
  const getStatusMessage = () => {
    if (!currentTicket) return "Carregando...";
    if (currentTicket.status === 'inProgress') return "Agora é sua vez!";
    if (currentTicket.status === 'completed') return "Atendimento finalizado";
    if (currentTicket.status === 'cancelled') return "Senha cancelada";
    return "Aguardando...";
  };

  const getBellColor = () => {
    if (!currentTicket) return "text-primary";
    if (currentTicket.status === 'inProgress') return "text-red-500";
    if (currentTicket.status === 'waiting') {
      const queuePosition = currentTicket.number;
      if (queuePosition === 1 || queuePosition === 2) {
        return isVibrating ? "text-orange-500" : "text-yellow-500";
      }
    }
    return "text-primary";
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