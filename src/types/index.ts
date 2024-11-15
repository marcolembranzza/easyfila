export type UserRole = 'operator' | 'client';

export type QueueStatus = 'waiting' | 'inProgress' | 'completed' | 'cancelled';

export interface QueueItem {
  id: string;
  number: number;
  client_name: string;
  phone_number: string | null;
  status: QueueStatus;
  created_at: string;
  updated_at: string;
  estimated_time?: number;
  notes?: string;
  priority: boolean;
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