import { supabase } from "@/integrations/supabase/client";
import { QueueItem, QueueStatus } from "@/types";

export const queueService = {
  async createTicket(
    clientName: string | null,
    phoneNumber: string | null,
    priority: boolean
  ): Promise<QueueItem | null> {
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

    if (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }

    return insertedData;
  },

  async getTickets(): Promise<QueueItem[]> {
    const { data, error } = await supabase
      .from('queue_items')
      .select('*')
      .eq('status', 'waiting');

    if (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }

    return data || [];
  },

  async updateTicketStatus(id: string, status: QueueStatus): Promise<void> {
    const { error } = await supabase
      .from('queue_items')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  },

  async deleteTicket(id: string): Promise<void> {
    const { error } = await supabase
      .from('queue_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },
};
