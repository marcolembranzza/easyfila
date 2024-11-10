import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BellRing } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QueueItem } from "@/types";

const ClientNotification = () => {
  const { ticketId } = useParams();
  const { toast } = useToast();
  const [queuePosition, setQueuePosition] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);

  // Simulate queue position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueuePosition((prev) => {
        const newPosition = Math.max(0, prev - 1);
        if (newPosition <= 2 && !isVibrating) {
          setIsVibrating(true);
          // Vibrate if available
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
            toast({
              title: "Atenção!",
              description: "Sua vez está próxima!",
            });
          }
        }
        return newPosition;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isVibrating, toast]);

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
              <p className="text-4xl font-bold text-primary">#{ticketId}</p>
            </div>
            <div>
              <p className="text-lg text-gray-600">Posição na fila:</p>
              <p className="text-4xl font-bold">{queuePosition}</p>
            </div>
            {isVibrating && (
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