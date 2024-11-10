import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QueueList } from "@/components/QueueList";
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

const TicketRetrieval = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queueItems] = useState<QueueItem[]>(mockQueueItems);

  const handleGetTicket = () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome para retirar uma senha.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would make an API call to get a ticket number
    const mockTicketNumber = Math.floor(Math.random() * 100) + 1;

    toast({
      title: "Senha retirada com sucesso!",
      description: `Sua senha é ${mockTicketNumber}`,
    });

    navigate("/client", { 
      state: { 
        ticketNumber: mockTicketNumber,
        clientName: name 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Ticket retrieval section */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Ticket className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Retirada de Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button 
                className="w-full"
                size="lg"
                onClick={handleGetTicket}
              >
                Retirar Senha
              </Button>
            </CardContent>
          </Card>

          {/* Queue status section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Fila Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto">
                <QueueList 
                  items={queueItems.filter(item => item.status === 'waiting').slice(0, 10)} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketRetrieval;