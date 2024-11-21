import { useEffect, useState, useRef } from "react";
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
  const [isActive, setIsActive] = useState(true);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const keepScreenOnInterval = useRef<NodeJS.Timeout | null>(null);

  const handleVibration = (position: number) => {
    try {
      if ((position <= 1) && 'vibrate' in navigator) {
        if (vibrationIntervalRef.current) {
          clearInterval(vibrationIntervalRef.current);
        }

        const vibrationPattern = [200, 100, 200];
        navigator.vibrate(vibrationPattern);

        let attempt = 0;
        const maxAttempts = 2;

        vibrationIntervalRef.current = setInterval(() => {
          if (attempt < maxAttempts && isActive) {
            navigator.vibrate(vibrationPattern);
            attempt++;
          } else {
            if (vibrationIntervalRef.current) {
              clearInterval(vibrationIntervalRef.current);
              vibrationIntervalRef.current = null;
            }
          }
        }, 5000);

        toast({
          title: "Atenção!",
          description: position === 0 ? "É sua vez!" : "Sua vez está chegando!",
        });
      }
    } catch (error) {
      console.error('Vibration error:', error);
    }
  };

  const startKeepScreenOn = () => {
    if (keepScreenOnInterval.current) {
      clearInterval(keepScreenOnInterval.current);
    }

    // Tenta manter a tela ligada através de interações periódicas
    keepScreenOnInterval.current = setInterval(() => {
      if (document.hidden) {
        window.focus();
      }
      // Força uma pequena atualização do DOM
      const tempElement = document.createElement('div');
      document.body.appendChild(tempElement);
      document.body.removeChild(tempElement);
    }, 15000);
  };

  const stopKeepScreenOn = () => {
    if (keepScreenOnInterval.current) {
      clearInterval(keepScreenOnInterval.current);
      keepScreenOnInterval.current = null;
    }
  };

  const acquireWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        await releaseWakeLock();
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('Wake Lock acquired');
        
        // Inicia o mecanismo de fallback
        startKeepScreenOn();
      } catch (err) {
        console.error('Wake Lock error:', err);
        // Se falhar o Wake Lock, usa apenas o fallback
        startKeepScreenOn();
      }
    } else {
      // Se Wake Lock não estiver disponível, usa o fallback
      startKeepScreenOn();
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock released');
      }
      stopKeepScreenOn();
    } catch (err) {
      console.error('Wake Lock release error:', err);
    }
  };

  const fetchQueuePosition = async () => {
    if (!isActive || !ticketId) return;

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
        
        if (position <= 2) {
          setIsVibrating(true);
          handleVibration(position);
        } else {
          setIsVibrating(false);
        }
      } else if (myTicket.status === 'inProgress') {
        setQueuePosition(0);
        setIsVibrating(true);
        handleVibration(0);
        await acquireWakeLock();
      } else {
        setQueuePosition(null);
        setIsVibrating(false);
        await releaseWakeLock();
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
    setIsActive(true);
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
          if (isActive) {
            await fetchQueuePosition();
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      setIsActive(false);
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
      }
      if (keepScreenOnInterval.current) {
        clearInterval(keepScreenOnInterval.current);
      }
      channel.unsubscribe();
      releaseWakeLock();
    };
  }, [ticketId]);

  // Adiciona um listener para o evento visibilitychange
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentTicket?.status === 'inProgress') {
        acquireWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentTicket?.status]);

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