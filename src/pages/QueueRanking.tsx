import { useEffect, useState } from "react";
import { QueueList } from "@/components/QueueList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { QueueItem } from "@/types";
import { queueService } from "@/lib/supabase";

const QueueRanking = () => {
  const navigate = useNavigate();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const items = await queueService.getQueueItems();
        setQueueItems(items);
      } catch (error) {
        console.error('Error fetching queue:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();

    const subscription = queueService.subscribeToQueue(setQueueItems);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Ranking da Fila</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <QueueList 
                items={queueItems.filter(item => item.status === 'waiting')} 
              />
            )}
            <div className="flex justify-center mt-6">
              <Button 
                size="lg"
                onClick={() => navigate('/ticket')}
              >
                Retirar Nova Senha
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueRanking;