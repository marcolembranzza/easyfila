import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QueueItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { Star } from "lucide-react";
import { queueService } from "@/lib/supabase";

const GeneralDisplay = () => {
  const [currentTickets, setCurrentTickets] = useState<QueueItem[]>([]);
  const [nextTickets, setNextTickets] = useState<QueueItem[]>([]);
  const systemUrl = `${window.location.origin}/ticket`;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const items = await queueService.getQueueItems();
        
        const inProgress = items.filter(item => item.status === 'inProgress');
        const waiting = items
          .filter(item => item.status === 'waiting')
          .slice(0, 5);
        
        setCurrentTickets(inProgress);
        setNextTickets(waiting);
      } catch (error) {
        console.error('Error fetching queue:', error);
      }
    };

    fetchQueue();
    
    const channel = supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_items' },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8">Painel Geral</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          <div className="space-y-8">
            {/* Senhas em Atendimento */}
            <Card className="bg-primary text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Em Atendimento</h2>
                <div className="space-y-4">
                  {currentTickets.length > 0 ? (
                    currentTickets.map((ticket) => (
                      <div key={ticket.id} className="bg-white/10 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-2">
                            {ticket.number}
                          </div>
                          <div className="text-2xl flex justify-center items-center space-x-2">
                            <span>{ticket.client_name}</span>
                            {ticket.priority && (
                              <div className="flex items-center space-x-1 bg-white/20 text-white px-2 py-0.5 rounded text-sm">
                                <Star className="h-4 w-4" />
                                <span>Preferencial</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-2xl">
                      Nenhuma senha em atendimento
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Próximas Senhas */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Próximas Senhas</h2>
                <div className="space-y-6">
                  {nextTickets.map((ticket, index) => (
                    <div 
                      key={ticket.id}
                      className={`flex justify-between items-center border-b last:border-0 pb-4 last:pb-0 ${
                        index === 0 ? 'bg-primary/5 p-4 rounded-lg shadow-md border border-primary/20' : ''
                      }`}
                    >
                      <div className={`text-2xl font-medium ${index === 0 ? 'text-primary' : 'text-gray-600'}`}>
                        {index + 1}º
                      </div>
                      <div className="text-3xl font-bold flex items-center space-x-2">
                        <span className={index === 0 ? 'text-primary' : ''}>{ticket.number}</span>
                        {ticket.priority && (
                          <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">
                            <Star className="h-4 w-4" />
                            <span>Preferencial</span>
                          </div>
                        )}
                      </div>
                      <div className={`text-xl ${index === 0 ? 'text-primary font-medium' : 'text-gray-600'}`}>
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
          </div>

          {/* Coluna do QR Code */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardContent className="p-8 flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-center mb-6">Retire e acompanhe sua senha pelo celular</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeSVG value={systemUrl} size={200} />
                </div>
                <p className="mt-4 text-gray-600 text-center">
                  Escaneie o QR Code para retirar uma nova senha ou acompanhar o painel em tempo real no seu celular
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDisplay;