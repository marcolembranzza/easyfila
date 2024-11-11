import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Senhas</h1>
        
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center cursor-pointer" onClick={() => navigate('/ticket')}>
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Ticket className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Retirar Senha</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/ticket')}
              >
                Clique para retirar uma nova senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientView;