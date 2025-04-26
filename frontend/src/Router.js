import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";
import AuthContext from "./context/AuthContext";
import Header from "./components/Header";

function App() {
  const { loggedIn, userInfo } = useContext(AuthContext);

  return (
    <Router>
      <Header />
      <Routes>
        {!loggedIn && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {loggedIn && userInfo && (
          <>
            <Route path="/create" element={<CreateTicket />} />

            {userInfo.role === "admin" && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/edit/:id" element={<EditTicket />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </>
            )}

            {userInfo.role === "user" && (
              <Route path="/dashboard" element={<UserDashboard />} />
            )}

            <Route
              path="*"
              element={
                userInfo.role === "admin" ? (
                  <Navigate to="/" />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
