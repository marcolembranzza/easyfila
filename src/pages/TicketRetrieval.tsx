import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TicketRetrieval = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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

    // Navigate to client view with the ticket information
    navigate("/client", { 
      state: { 
        ticketNumber: mockTicketNumber,
        clientName: name 
      } 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
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
    </div>
  );
};

export default TicketRetrieval;