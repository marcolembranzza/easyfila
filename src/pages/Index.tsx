import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'operator' | 'client' | null>(null);

  const handleRoleSelect = (selectedRole: 'operator' | 'client') => {
    setRole(selectedRole);
    if (selectedRole === 'operator') {
      navigate('/operator');
    } else {
      navigate('/ticket');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center space-y-8 p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900">Queue Management System</h1>
        <p className="text-gray-600">Select your role to continue</p>
        
        <div className="space-y-4">
          <Button
            className="w-full text-lg py-6"
            onClick={() => handleRoleSelect('operator')}
          >
            I'm an Operator
          </Button>
          
          <Button
            className="w-full text-lg py-6"
            variant="outline"
            onClick={() => handleRoleSelect('client')}
          >
            I'm a Client
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;