import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            Sistema de Senhas
          </Link>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline">Área Administrativa</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;