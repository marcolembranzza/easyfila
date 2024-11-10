import { Trophy } from "lucide-react";
import { QueueList } from "@/components/QueueList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { QueueItem } from "@/types";

// Temporary mock data - in a real app this would come from an API
const mockQueueItems: QueueItem[] = [
  {
    id: "1",
    number: 1,
    clientName: "João Silva",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedTime: 15,
  },
  {
    id: "2",
    number: 2,
    clientName: "Maria Santos",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedTime: 15,
  },
  // Add more mock items as needed
];

const QueueRanking = () => {
  const navigate = useNavigate();

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
            <QueueList 
              items={mockQueueItems.filter(item => item.status === 'waiting').slice(0, 10)} 
            />
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