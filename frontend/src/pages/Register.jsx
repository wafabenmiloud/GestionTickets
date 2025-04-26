import React, { useContext, useState } from "react";
import "./RegisterPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Register() {
  const { getLoggedIn } = useContext(AuthContext);
  const [data, setData] = useState({
    name: "",        // <-- changed username to name
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/auth/register"; // <-- correct URL
      await axios.post(url, data, { withCredentials: true }); // <-- important for cookies
      await getLoggedIn();
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="auth">
      <form className="register" onSubmit={handleSubmit}>
        <h3>Get started</h3>
        <input
          type="text"
          placeholder="Name"
          name="name"          // <-- changed name from username to name
          onChange={handleChange}
          value={data.name}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={data.email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={data.password}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Sign Up</button> {/* <-- fixed typo */}
      </form>
    </div>
  );
}
