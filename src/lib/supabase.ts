import { createClient } from '@supabase/supabase-js';
import { QueueItem } from '@/types';

const supabaseUrl = "https://mclsaxppvuylyxxbmsvn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbHNheHBwdnV5bHl4eGJtc3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNjkyMjcsImV4cCI6MjA0Njg0NTIyN30.T4W4puHVY_gszZ6Yg7N5oTTkWOzHYu6Jre8q3cut6Ps";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const queueService = {
  async createTicket(clientName: string, phoneNumber: string, priority: boolean = false): Promise<QueueItem> {
    const { data, error } = await supabase
      .from('queue_items')
      .insert([{ 
        client_name: clientName, 
        phone_number: phoneNumber, 
        status: 'waiting',
        priority: priority 
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    return data as QueueItem;
  },

  async getQueueItems(): Promise<QueueItem[]> {
    const { data, error } = await supabase
      .from('queue_items')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as QueueItem[];
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
        async (payload) => {
          const items = await this.getQueueItems();
          callback(items);
        }
      )
      .subscribe();
  }
};