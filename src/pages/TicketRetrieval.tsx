import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ticket } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { queueService } from "@/lib/supabase";

const TicketRetrieval = () => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetTicket = async () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome para retirar uma senha.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const ticket = await queueService.createTicket(name, "", priority === "priority");
      
      if (ticket) {
        toast({
          title: "Senha retirada com sucesso!",
          description: `Sua senha é ${ticket.number}`,
        });
        navigate(`/notification/${ticket.id}`);
      }
    } catch (error) {
      toast({
        title: "Erro ao retirar senha",
        description: "Ocorreu um erro ao tentar retirar sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-md">
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
            <div className="space-y-2">
              <Label>Tipo de Atendimento</Label>
              <RadioGroup
                value={priority}
                onValueChange={setPriority}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="priority" id="priority" />
                  <Label htmlFor="priority">Preferencial</Label>
                </div>
              </RadioGroup>
            </div>
            <Button 
              className="w-full"
              size="lg"
              onClick={handleGetTicket}
              disabled={isLoading}
            >
              {isLoading ? "Aguarde..." : "Retirar Senha"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketRetrieval;