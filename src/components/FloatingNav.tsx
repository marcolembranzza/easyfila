import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const FloatingNav = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate('/ticket')}>
            Retirar Senha
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/ranking')}>
            Fila de Clientes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/operator')}>
            Controle de Fila
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/display')}>
            Painel Geral
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FloatingNav;