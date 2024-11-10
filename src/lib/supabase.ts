import { createClient } from '@supabase/supabase-js';
import { QueueItem } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const queueService = {
  async createTicket(clientName: string): Promise<QueueItem | null> {
    const { data, error } = await supabase
      .from('queue_items')
      .insert([{ client_name: clientName, status: 'waiting', estimated_time: 15 }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getQueueItems(): Promise<QueueItem[]> {
    const { data, error } = await supabase
      .from('queue_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: string, status: QueueItem['status']): Promise<void> {
    const { error } = await supabase
      .from('queue_items')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  subscribeToQueue(callback: (items: QueueItem[]) => void) {
    return supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_items' },
        () => {
          this.getQueueItems().then(callback);
        }
      )
      .subscribe();
  }
};