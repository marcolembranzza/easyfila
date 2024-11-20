import { QueueItem, QueueStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const queueService = {
  async createTicket(clientName: string, phoneNumber: string = '', priority: boolean = false): Promise<QueueItem> {
    const { data: insertedData, error } = await supabase
      .from('queue_items')
      .insert([{ 
        client_name: clientName ? clientName.trim() : null, 
        phone_number: phoneNumber || null, 
        status: 'waiting' as QueueStatus,
        priority: priority 
      }])
      .select()
      .single();

    if (error) throw error;
    if (!insertedData) throw new Error('No data returned from insert');

    return {
      ...insertedData,
      status: insertedData.status as QueueStatus
    };
  },

  async getQueueItems(): Promise<QueueItem[]> {
    const { data, error } = await supabase
      .from('queue_items')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as QueueStatus
    })) as QueueItem[];
  },

  async updateStatus(id: string, status: QueueStatus): Promise<void> {
    const { error } = await supabase
      .from('queue_items')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
};