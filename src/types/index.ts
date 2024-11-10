export type UserRole = 'operator' | 'client';

export type QueueStatus = 'waiting' | 'inProgress' | 'completed' | 'cancelled';

export interface QueueItem {
  id: string;
  number: number;
  clientName: string;
  status: QueueStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number;
  notes?: string;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
}

export interface QueueStats {
  totalServed: number;
  averageWaitTime: number;
  currentQueueSize: number;
}