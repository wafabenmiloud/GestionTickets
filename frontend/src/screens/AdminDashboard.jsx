import React, { useEffect, useState } from "react";
import { getTickets } from "../services/ticketService";
import { getUsers } from '../services/userService';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [agents, setAgents] = useState([]);

   useEffect(() => {
    const fetchData = async () => {
      const res = await getTickets();
      const userRes = await getUsers();
      const onlyAgents = userRes.data.filter((u) => u.role === 'agent');

      setTickets(res.data);
      setFilteredTickets(res.data);
      setAgents(onlyAgents);
    };

    fetchData();
  }, []);
  useEffect(() => {
    let filtered = tickets;

    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (agentFilter) {
      filtered = filtered.filter(ticket => ticket.assignedTo?._id === agentFilter);
    }

    setFilteredTickets(filtered);
  }, [statusFilter, agentFilter, tickets]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Accès réservé aux administrateurs !");
      window.location.href = "/";
    }
  }, []);

  return (
    <div>
      <h2>Tableau de bord Admin</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Filtrer par statut: </label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">-- Tous --</option>
          <option value="Ouvert">Ouvert</option>
          <option value="En cours">En cours</option>
          <option value="Résolu">Résolu</option>
          <option value="Fermé">Fermé</option>
        </select>

        <label style={{ marginLeft: '2rem' }}>Filtrer par agent: </label>
        <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)}>
          <option value="">-- Tous --</option>
          {agents.map(agent => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Créé par</th>
            <th>Assigné à</th>
            <th>Création</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>{ticket.createdBy?.name || "N/A"}</td>
              <td>{ticket.assignedTo?.name || "Non assigné"}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
