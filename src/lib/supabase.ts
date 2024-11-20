import { QueueItem, QueueStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const queueService = {
  async createTicket(clientName: string, phoneNumber: string = '', priority: boolean = false): Promise<QueueItem> {
    // First, insert with a temporary name to get the ticket number
    const { data: insertedData, error } = await supabase
      .from('queue_items')
      .insert([{ 
        client_name: 'Temporary', 
        phone_number: phoneNumber || null, 
        status: 'waiting' as QueueStatus,
        priority: priority 
      }])
      .select()
      .single();

    if (error) throw error;
    if (!insertedData) throw new Error('No data returned from insert');

    // Now update with the correct name based on whether clientName was provided
    const finalClientName = clientName.trim() ? clientName : `Cliente ${insertedData.number}`;
    
    const { data: updatedData, error: updateError } = await supabase
      .from('queue_items')
      .update({ client_name: finalClientName })
      .eq('id', insertedData.id)
      .select()
      .single();

    if (updateError) throw updateError;
    if (!updatedData) throw new Error('No data returned from update');

    return {
      ...updatedData,
      status: updatedData.status as QueueStatus
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
