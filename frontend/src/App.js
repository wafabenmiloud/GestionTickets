import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TicketList from './pages/TicketList';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';

function App() {
  const role = localStorage.getItem('role');

  return (
    <Router>
      <nav>
        <Link to="/">Accueil</Link> | 
        <Link to="/tickets">Tickets</Link> | 
        <Link to="/create">Nouveau Ticket</Link>

        <Link to="/login">Connexion</Link> | 
        <Link to="/register">Inscription</Link>
        {role === 'admin' && <Link to="/admin">Dashboard Admin</Link>}
        {role === 'user' && <Link to="/dashboard">Mon tableau de bord</Link>}

      </nav>
      <Routes>
      <Route path="/create" element={<CreateTicket />} />
      <Route path="/edit/:id" element={<EditTicket />} />

        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;