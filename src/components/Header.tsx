import { User, UserCog, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add actual logout logic (authentication, clearing tokens, etc.)
    console.log("Logout clicked");
    navigate('/'); // Navigate back to the initial screen
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-semibold text-lg">
          Queue System
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none ring-offset-2 transition-opacity hover:opacity-80">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;