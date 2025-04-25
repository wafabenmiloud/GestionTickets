import React, { useState } from 'react';
import { createTicket } from '../services/ticketService';
import { useNavigate } from 'react-router-dom';

export default function CreateTicket() {
  const [form, setForm] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(form);
      alert('Ticket créé avec succès !');
      navigate('/dashboard');
    } catch (err) {
      alert('Erreur lors de la création');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer un ticket</h2>
      <input
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      /><br />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      /><br />
      <button type="submit">Créer</button>
    </form>
  );
}
