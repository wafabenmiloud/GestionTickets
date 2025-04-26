import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import "./tickets.css";

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
      await axios.post('http://localhost:5000/api/tickets/create', form, { withCredentials: true });
      alert('Ticket créé avec succès !');
      navigate('/dashboard');
    } catch (err) {
      alert('Erreur lors de la création du ticket.');
    }
  };

  return (
    <div className='ticket-form'>
    <h2>Créer un ticket</h2>
  
    {error && <div className="error-message">{error}</div>}
  
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
  
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows="5"
        required
      />
  
      <button type="submit">Créer</button>
    </form>
  </div>
  
  );
}
