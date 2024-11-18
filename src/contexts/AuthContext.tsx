import { createContext, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (_email: string, password: string) => {
    try {
      if (password === 'admin') {
        setIsAuthenticated(true);
        setUser({ 
          id: 'admin',
          email: 'admin@admin.com',
          role: 'admin'
        } as User);
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo à área administrativa",
        });
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Senha incorreta",
          variant: "destructive",
        });
        throw new Error("Senha incorreta");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};