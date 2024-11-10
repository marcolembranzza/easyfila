import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center space-y-8 p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Filas</h1>
        <p className="text-gray-600">Selecione uma opção</p>
        
        <div className="space-y-4">
          <Button
            className="w-full text-lg py-6"
            onClick={() => navigate('/ranking')}
          >
            Ver Fila
          </Button>
          
          <Button
            className="w-full text-lg py-6"
            variant="outline"
            onClick={() => navigate('/ticket')}
          >
            Retirar Senha
          </Button>
          
          <Button
            className="w-full text-lg py-6"
            variant="secondary"
            onClick={() => navigate('/notification/123')}
          >
            Acompanhar Senha
          </Button>

          <Button
            className="w-full text-lg py-6"
            variant="destructive"
            onClick={() => navigate('/operator')}
          >
            Painel do Operador
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;