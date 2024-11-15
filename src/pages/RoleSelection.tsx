import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'operator' | 'client' | null>(null);

  const handleRoleSelect = (selectedRole: 'operator' | 'client') => {
    setRole(selectedRole);
    if (selectedRole === 'operator') {
      navigate('/operator');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center space-y-8 p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900">Área Administrativa</h1>
        <p className="text-gray-600">Selecione seu perfil para continuar</p>
        
        <div className="space-y-4">
          <Button
            className="w-full text-lg py-6"
            onClick={() => handleRoleSelect('operator')}
          >
            Sou Operador
          </Button>
          
          <Button
            className="w-full text-lg py-6"
            variant="outline"
            onClick={() => handleRoleSelect('client')}
          >
            Voltar para Área do Cliente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;