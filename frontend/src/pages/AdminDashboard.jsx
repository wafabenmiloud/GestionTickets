import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { userInfo } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);

  const createAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          ...newAgent,
          role: "agent",
        },
        { withCredentials: true }
      );

      alert("Agent créé avec succès !");
      setNewAgent({ name: "", email: "", password: "" });
      setShowModal(false);
      // Refetch agents
      const userRes = await axios.get("http://localhost:5000/api/auth/users", { withCredentials: true });
      const onlyAgents = userRes.data.filter((u) => u.role === 'agent');
      setAgents(onlyAgents);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création de l'agent");
    }
  };
  useEffect(() => {
    if (userInfo.role !== "admin") {
      alert("Accès réservé aux administrateurs !");
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      const ticketRes = await axios.get("http://localhost:5000/api/tickets", {
        withCredentials: true,
      });
      const userRes = await axios.get("http://localhost:5000/api/auth/users", {
        withCredentials: true,
      });
      const onlyAgents = userRes.data.filter((u) => u.role === "agent");

      setTickets(ticketRes.data);
      setFilteredTickets(ticketRes.data);
      setAgents(onlyAgents);
    };

    fetchData();
  }, [userInfo.role]);

  useEffect(() => {
    let filtered = tickets;
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }
    if (agentFilter) {
      filtered = filtered.filter(
        (ticket) => ticket.assignedTo?._id === agentFilter
      );
    }
    setFilteredTickets(filtered);
  }, [statusFilter, agentFilter, tickets]);

  const handleAssign = async (ticketId, agentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tickets/assign/${ticketId}`,
        { agentId },
        { withCredentials: true }
      );
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === ticketId
          ? { ...ticket, assignedTo: agents.find((a) => a._id === agentId) }
          : ticket
      );
      setTickets(updatedTickets);
    } catch (err) {
      console.error("Erreur d'assignation:", err);
    }
  };
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tickets/status/${ticketId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
      );
      setTickets(updatedTickets);
    } catch (err) {
      console.error("Erreur de mise à jour du statut:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Tableau de bord Admin</h2>
      <button className="add-agent-button" onClick={() => setShowModal(true)}>
        ➕ Ajouter un agent
      </button>

      {/* --- Popup Modal --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Créer un nouvel agent</h3>
            <form onSubmit={createAgent}>
              <input
                type="text"
                placeholder="Nom"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Créer</button>
                <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="filters">
        <div className="filter">
          <label>Statut: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">-- Tous --</option>
            <option value="Ouvert">Ouvert</option>
            <option value="En cours">En cours</option>
            <option value="Résolu">Résolu</option>
            <option value="Fermé">Fermé</option>
          </select>
        </div>

        <div className="filter">
          <label>Agent: </label>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          >
            <option value="">-- Tous --</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Créé par</th>
            <th>Assigné à</th>
            <th>Création</th>
            <th>Assigner un agent</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.title}</td>
                <td>
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      handleStatusChange(ticket._id, e.target.value)
                    }
                  >
                    <option value="Ouvert">Ouvert</option>
                    <option value="En cours">En cours</option>
                    <option value="Résolu">Résolu</option>
                    <option value="Fermé">Fermé</option>
                  </select>
                </td>
              
              <td>{ticket.createdBy?.name || "N/A"}</td>
              <td>{ticket.assignedTo?.name || "Non assigné"}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td>
                <select
                  onChange={(e) => handleAssign(ticket._id, e.target.value)}
                  value={ticket.assignedTo?._id || ""}
                >
                  <option value="">-- Assigner --</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
