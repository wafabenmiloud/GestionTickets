import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import AuthContext from "../context/AuthContext";  // Import the AuthContext
import axios from 'axios';
import './AdminDashboard.css';

export default function UserDashboard() {
  const { userInfo } = useContext(AuthContext);  // Access user info from context
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!userInfo || !userInfo.id) {
      alert("Veuillez vous connecter pour accéder à vos tickets.");
      window.location.href = "/login";
      return;
    }

    const fetchTickets = async () => {
      const res = await axios.get("http://localhost:5000/api/tickets", { withCredentials: true });
      const userTickets = res.data.filter(
        (ticket) => ticket.createdBy?._id === userInfo.id
      );
      setTickets(userTickets);
      setFilteredTickets(userTickets);
    };
    

    fetchTickets();
  }, [userInfo]);

  useEffect(() => {
    if (statusFilter) {
      setFilteredTickets(
        tickets.filter((ticket) => ticket.status === statusFilter)
      );
    } else {
      setFilteredTickets(tickets);
    }
  }, [statusFilter, tickets]);

  return (
    <div className="admin-dashboard">
      <h2>Mes Tickets</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>Filtrer par statut: </label>
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
      {filteredTickets.length === 0 ? (
        <p>Vous n'avez soumis aucun ticket.</p>
      ) : (
        <table className="ticket-table" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Statut</th>
              <th>Créé le</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
