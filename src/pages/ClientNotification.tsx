import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BellRing } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { queueService } from "@/lib/supabase";
import { QueueItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ClientNotification = () => {
  const { ticketId } = useParams();
  const { toast } = useToast();
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<QueueItem | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState({
    name: '',
    phoneNumber: ''
  });

  const verifyTicket = async () => {
    try {
      const items = await queueService.getQueueItems();
      const ticket = items.find(item => 
        item.id === ticketId && 
        item.client_name.toLowerCase() === verificationData.name.toLowerCase() &&
        item.phone_number === verificationData.phoneNumber
      );

      if (ticket) {
        setIsVerified(true);
        setCurrentTicket(ticket);
      } else {
        toast({
          title: "Verificação falhou",
          description: "Nome ou número de telefone incorretos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível verificar seus dados.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!isVerified) return;

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
  }, [ticketId, isVibrating, toast, isVerified]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setVerificationData(prev => ({ ...prev, phoneNumber: formattedNumber }));
  };

  const getStatusMessage = () => {
    if (!currentTicket) return "Carregando...";
    if (currentTicket.status === 'inProgress') return "Agora é sua vez!";
    if (currentTicket.status === 'completed') return "Atendimento finalizado";
    if (currentTicket.status === 'cancelled') return "Senha cancelada";
    return `Sua posição na fila: ${queuePosition}`;
  };

  if (!isVerified) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Verificar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={verificationData.name}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefone</Label>
                <Input
                  id="phoneNumber"
                  value={verificationData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={verifyTicket}
              >
                Verificar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
