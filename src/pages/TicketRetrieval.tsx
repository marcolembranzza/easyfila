import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { queueService } from "@/lib/supabase";
import { Ticket, User2, Star } from "lucide-react";

const TicketRetrieval = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetTicket = async () => {
    try {
      setIsLoading(true);
      const ticket = await queueService.createTicket(
        name,
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
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
            <Ticket className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Retirar Senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User2 className="w-4 h-4" />
              Nome (opcional)
            </Label>
            <Input
              id="name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Tipo de Atendimento
            </Label>
            <RadioGroup
              value={priority}
              onValueChange={setPriority}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="cursor-pointer font-medium">
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="priority" id="priority" />
                <Label htmlFor="priority" className="cursor-pointer font-medium">
                  Preferencial
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            className="w-full"
            size="lg"
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