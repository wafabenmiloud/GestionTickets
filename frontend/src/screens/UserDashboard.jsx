import React, { useEffect, useState } from "react";
import { getTickets } from "../services/ticketService";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const currentUser = localStorage.getItem("name");

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await getTickets();
      const userTickets = res.data.filter(
        (ticket) => ticket.createdBy?.name === currentUser
      );
      setTickets(userTickets);
      setFilteredTickets(userTickets);
    };
    fetchTickets();
  }, [currentUser]);

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
    <div>
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
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Statut</th>
              <th>Assigné à</th>
              <th>Créé le</th>
              <th>Modifier</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.assignedTo?.name || "Non assigné"}</td>
                <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/edit/${ticket._id}`}>Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
