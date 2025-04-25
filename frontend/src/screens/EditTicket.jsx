import React, { useEffect, useState } from 'react';
import { getTickets, updateTicket } from '../services/ticketService';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsers } from '../services/userService';

export default function EditTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTickets();
      const ticketData = res.data.find((tk) => tk._id === id);
      setTicket(ticketData);
  
      const users = await getUsers();
      const agentList = users.data.filter((u) => u.role === 'agent');
      setAgents(agentList);
    };
  
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTicket(id, ticket);
    alert('Ticket mis à jour');
    navigate('/dashboard');
  };

  if (!ticket) return <p>Chargement...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier le Ticket</h2>
      <input name="title" value={ticket.title} onChange={handleChange} /><br />
      <textarea name="description" value={ticket.description} onChange={handleChange} /><br />
      <select name="status" value={ticket.status} onChange={handleChange}>
        <option>Ouvert</option>
        <option>En cours</option>
        <option>Résolu</option>
        <option>Fermé</option>
      </select>
      <select
  name="assignedTo"
  value={ticket.assignedTo?._id || ''}
  onChange={(e) =>
    setTicket({ ...ticket, assignedTo: { _id: e.target.value } })
  }
>
  <option value="">-- Choisir un agent --</option>
  {agents.map((agent) => (
    <option key={agent._id} value={agent._id}>
      {agent.name}
    </option>
  ))}
</select>

      <br />
      <button type="submit">Enregistrer</button>
    </form>
  );
}
