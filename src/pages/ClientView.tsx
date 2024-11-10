import { useState } from "react";
import { QueueItem } from "@/types";

export const ClientView = () => {
  const [ticket] = useState<QueueItem>({
    id: "1",
    number: 1,
    client_name: "John Doe",
    phone_number: "(11) 99999-9999", // Added the required phone_number field
    status: "waiting",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_time: 15
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Your Ticket</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg"><strong>Ticket Number:</strong> #{ticket.number}</p>
        <p className="text-lg"><strong>Client Name:</strong> {ticket.client_name}</p>
        <p className="text-lg"><strong>Phone:</strong> {ticket.phone_number}</p>
        <p className="text-lg"><strong>Status:</strong> {ticket.status}</p>
        <p className="text-lg"><strong>Estimated Wait Time:</strong> {ticket.estimated_time} min</p>
      </div>
    </div>
  );
};