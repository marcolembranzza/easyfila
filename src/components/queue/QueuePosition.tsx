import { QueueItem } from "@/types";

interface QueuePositionProps {
  queuePosition: number | null;
  isVibrating: boolean;
}

export const QueuePosition = ({ queuePosition, isVibrating }: QueuePositionProps) => {
  if (queuePosition === null) return null;
  
  return (
    <div className="mt-4">
      {queuePosition > 0 && (
        <p className="text-lg font-semibold text-center">
          Sua posição na fila: {queuePosition}
        </p>
      )}
      {isVibrating && queuePosition <= 2 && (
        <p className="text-lg font-semibold text-primary animate-pulse text-center mt-2">
          Prepare-se! Sua vez está chegando!
        </p>
      )}
    </div>
  );
};