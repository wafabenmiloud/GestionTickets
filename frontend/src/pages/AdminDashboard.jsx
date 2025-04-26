import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from 'axios';

export default function AdminDashboard() {
  const { userInfo } = useContext(AuthContext);  // Accessing user info from context
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Admin role validation based on AuthContext
    if (userInfo.role !== "admin") {
      alert("Accès réservé aux administrateurs !");
      window.location.href = "/";  // Redirect to home if not admin
      return;
    }

    const fetchData = async () => {
      const ticketRes = await axios.get("http://localhost:5000/api/tickets/",{ withCredentials: true });
      const userRes = await axios.get("http://localhost:5000/api/auth/users", { withCredentials: true });
      const onlyAgents = userRes.data.filter((u) => u.role === 'agent');


      setTickets(ticketRes.data);
      setFilteredTickets(ticketRes.data);
      setAgents(onlyAgents);
    };

    fetchData();
  }, [userInfo.role]); 

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
