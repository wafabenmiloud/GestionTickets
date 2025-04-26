import React, { useEffect, useState, useContext } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

export default function EditTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const { userInfo } = useContext(AuthContext);  // Accessing user info from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const ticketRes = await axios.get(`http://localhost:5000/api/tickets/${id}`);
        setTicket(ticketRes.data);

        const usersRes = await axios.get('http://localhost:5000/api/auth/users');
        const agentList = usersRes.data.filter((u) => u.role === 'agent');
        setAgents(agentList);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'admin' && ticket?.createdBy?._id !== userInfo.id)) {
      alert("Accès réservé aux administrateurs ou à l'utilisateur ayant créé le ticket !");
      navigate('/dashboard');
    }
  }, [userInfo, ticket, navigate]);

  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/tickets/${id}`, ticket);
      alert('Ticket mis à jour avec succès');
      navigate('/dashboard');
    } catch (err) {
      alert('Erreur lors de la mise à jour du ticket');
    }
  };

  if (!ticket) return <p>Chargement...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier le Ticket</h2>
      <input
        name="title"
        value={ticket.title}
        onChange={handleChange}
        required
      /><br />
      <textarea
        name="description"
        value={ticket.description}
        onChange={handleChange}
        required
      /><br />
      <select
        name="status"
        value={ticket.status}
        onChange={handleChange}
      >
        <option>Ouvert</option>
        <option>En cours</option>
        <option>Résolu</option>
        <option>Fermé</option>
      </select><br />
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
      </select><br />
      <button type="submit">Enregistrer</button>
    </form>
  );
}
