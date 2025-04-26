import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import AuthContext from "./context/AuthContext";
import Header from "./components/Header";

function App() {
  const { loggedIn, userInfo } = useContext(AuthContext);  // <-- fetch userInfo

  return (
    <Router>
      <Header/>
      <Routes>
        {!loggedIn && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        {loggedIn && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/edit/:id" element={<EditTicket />} />
            {userInfo.role === 'admin' && <Route path="/admin" element={<AdminDashboard />} />}
            {userInfo.role === 'user' && <Route path="/dashboard" element={<UserDashboard />} />}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
