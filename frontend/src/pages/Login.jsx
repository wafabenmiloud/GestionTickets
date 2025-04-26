import { useContext, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import axios from "axios";
import AuthContext from "../context/AuthContext";

export default function LoginPage() {
  const { getLoggedIn } = useContext(AuthContext);
  const { userInfo } = useContext(AuthContext);

  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/auth/login"; 
      await axios.post(url, data, { withCredentials: true });
      await getLoggedIn();

if (userInfo.role === "admin") {
        navigate("/admin");  
      } else {
        navigate("/dashboard");  
      }    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="auth">
      <form className="login" onSubmit={handleSubmit}>
        <h3>Welcome back! Please log in</h3>

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
        <button type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}
