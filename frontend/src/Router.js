import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboard2 from "./pages/AdminDashboard2";

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

            {(userInfo.role === "user") && (
              <Route path="/dashboard" element={<UserDashboard />} />
            )}
  {(userInfo.role === "agent") && (
              <Route path="/dashboard2" element={<AdminDashboard2 />} />
            )}
            <Route
              path="*"
              element={
                userInfo.role === "admin" ? (
                  <Navigate to="/" />
                ) : userInfo.role === "user"? (
                  <Navigate to="/dashboard" />
                ):                  <Navigate to="/dashboard2" />

              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
