import { StatsCard } from "@/components/StatsCard";
import { Users, Clock, CheckCircle2 } from "lucide-react";
import { QueueStats } from "@/types";

interface StatsGridProps {
  stats: QueueStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Tamanho da Fila"
        value={stats.currentQueueSize}
        icon={<Users className="text-primary" />}
      />
      <StatsCard
        title="Tempo Médio de Espera"
        value={`${stats.averageWaitTime} min`}
        icon={<Clock className="text-primary" />}
      />
      <StatsCard
        title="Total Atendidos Hoje"
        value={stats.totalServed}
        icon={<CheckCircle2 className="text-primary" />}
      />
    </div>
  );
};