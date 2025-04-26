import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard2() {
  const { userInfo } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  
  useEffect(() => {
    if (userInfo.role !== "agent") {
      alert("Accès réservé aux administrateurs !");
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      const ticketRes = await axios.get("http://localhost:5000/api/tickets", {
        withCredentials: true,
      });
      const agentTickets = ticketRes.data.filter(
        (ticket) => ticket.assignedTo?._id === userInfo.id
      );
      setTickets(agentTickets);
      setFilteredTickets(agentTickets);
    };

    fetchData();
  }, [userInfo.role]);

  useEffect(() => {
    let filtered = tickets;
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }
  
    setFilteredTickets(filtered);
  }, [statusFilter, tickets]);


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

     
      </div>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Créé par</th>
           
            <th>Création</th>
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
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
