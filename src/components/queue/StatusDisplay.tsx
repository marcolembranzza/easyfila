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

  return (
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
        </div>
      </CardContent>
    </Card>
  );
};