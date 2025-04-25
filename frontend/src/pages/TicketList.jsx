import React, { useEffect, useState } from 'react';
import { getTickets } from '../services/ticketService';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(res => setTickets(res.data));
  }, []);

  return (
    <div>
      <h2>Liste des tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>{ticket.title} - {ticket.status}</li>
        ))}
      </ul>
    </div>
  );
}