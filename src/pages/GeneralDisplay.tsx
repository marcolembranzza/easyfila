import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QueueItem } from "@/types";
import { queueService } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";

const GeneralDisplay = () => {
  const [currentTicket, setCurrentTicket] = useState<QueueItem | null>(null);
  const [nextTickets, setNextTickets] = useState<QueueItem[]>([]);
  const systemUrl = `${window.location.origin}/display`;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const items = await queueService.getQueueItems();
        const inProgress = items.find(item => item.status === 'inProgress');
        const waiting = items
          .filter(item => item.status === 'waiting')
          .slice(0, 3);
        
        setCurrentTicket(inProgress || null);
        setNextTickets(waiting);
      } catch (error) {
        console.error('Error fetching queue:', error);
      }
    };

    fetchQueue();

    const subscription = queueService.subscribeToQueue((items) => {
      const inProgress = items.find(item => item.status === 'inProgress');
      const waiting = items
        .filter(item => item.status === 'waiting')
        .slice(0, 3);
      
      setCurrentTicket(inProgress || null);
      setNextTickets(waiting);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Painel de Senhas</h1>
        
        {/* Senha em Atendimento */}
        <Card className="mb-8 bg-primary text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Em Atendimento</h2>
            {currentTicket ? (
              <div className="text-center">
                <div className="text-7xl font-bold mb-4">
                  {currentTicket.number}
                </div>
                <div className="text-3xl">
                  {currentTicket.client_name}
                </div>
              </div>
            ) : (
              <div className="text-center text-2xl">
                Nenhuma senha em atendimento
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximas Senhas */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Próximas Senhas</h2>
            <div className="space-y-6">
              {nextTickets.map((ticket, index) => (
                <div 
                  key={ticket.id}
                  className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="text-2xl font-medium text-gray-600">
                    {index + 1}º
                  </div>
                  <div className="text-3xl font-bold">
                    {ticket.number}
                  </div>
                  <div className="text-xl text-gray-600">
                    {ticket.client_name}
                  </div>
                </div>
              ))}
              {nextTickets.length === 0 && (
                <div className="text-center text-gray-500 text-xl">
                  Não há senhas em espera
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-center mb-6">Acompanhe as senhas pelo celular</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG value={systemUrl} size={200} />
            </div>
            <p className="mt-4 text-gray-600 text-center">
              Escaneie o QR Code para acompanhar as senhas em tempo real no seu celular
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralDisplay;