import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

export default function CreateTicket() {
  const { userInfo } = useContext(AuthContext);  // Accessing user info from context
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'user' && userInfo.role !== 'admin')) {
      setError('Accès réservé aux utilisateurs et administrateurs!');
      navigate('/login');  
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tickets', form, { withCredentials: true });
      alert('Ticket créé avec succès !');
      navigate('/dashboard');  // Redirect to the dashboard after successful creation
    } catch (err) {
      alert('Erreur lors de la création du ticket.');
    }
  };

  return (
    <div>
      <h2>Créer un ticket</h2>
      {error && <div className="error-message">{error}</div>}  {/* Display error message if not allowed */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        /><br />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        /><br />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
