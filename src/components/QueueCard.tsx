import { Button } from "@/components/ui/button";
import { QueueItem } from "@/types";
import { Clock, User, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface QueueCardProps {
  item: QueueItem;
  onStatusChange?: (id: string, status: QueueItem['status']) => void;
  isOperator?: boolean;
}

export const QueueCard = ({ item, onStatusChange, isOperator = false }: QueueCardProps) => {
  const { user } = useAuth();
  const isClient = user?.role === 'client';

  const getStatusColor = () => {
    switch (item.status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'inProgress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting': return 'Aguardando';
      case 'inProgress': return 'Em Atendimento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleStatusChange = async (newStatus: QueueItem['status']) => {
    if (onStatusChange) {
      await onStatusChange(item.id, newStatus);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4 w-full">
        <div className="text-3xl font-bold text-primary w-16 text-center">
          {item.number}
        </div>
        
        <div className="flex-grow space-y-2">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="font-medium">{item.client_name}</span>
          </div>
          
          {!isClient && (
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <span>{item.phone_number}</span>
            </div>
          )}
          
          {item.notes && (
            <div className="text-sm text-gray-600 italic">
              {item.notes}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span>{item.estimated_time || 15} min</span>
          
          <span 
            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor()}`}
          >
            {getStatusText(item.status)}
          </span>
        </div>
        
        {isOperator && onStatusChange && (
          <div className="flex space-x-2">
            {item.status === 'waiting' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleStatusChange('inProgress')}
              >
                Iniciar
              </Button>
            )}
            {item.status === 'inProgress' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleStatusChange('completed')}
              >
                Concluir
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};