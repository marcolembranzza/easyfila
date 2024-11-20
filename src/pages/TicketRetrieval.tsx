import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { queueService } from "@/lib/supabase";

const TicketRetrieval = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetTicket = async () => {
    try {
      setIsLoading(true);
      const trimmedName = name.trim();
      const ticket = await queueService.createTicket(
        trimmedName === "" ? null : trimmedName,
        "",
        priority === "priority"
      );
      
      if (ticket) {
        toast({
          title: "Senha retirada com sucesso!",
          description: `Sua senha é ${ticket.number}`,
        });
        navigate(`/notification/${ticket.id}`);
      }
    } catch (error) {
      console.error("Error getting ticket:", error);
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
    <div className="container max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Retirar Senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome (opcional)</Label>
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
              defaultValue="normal"
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
            onClick={handleGetTicket}
            disabled={isLoading}
          >
            {isLoading ? "Gerando senha..." : "Retirar Senha"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketRetrieval;