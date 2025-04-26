import { AiOutlineLogout } from "react-icons/ai";
import axios from "axios";
import "./header.css";
import logo from "../assets/Amanda.png";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import  AuthContext  from "../context/AuthContext";

export default function Header() {
  const { loggedIn } = useContext(AuthContext);
  const { getLoggedIn } = useContext(AuthContext);
  const { userInfo } = useContext(AuthContext);

  function Avatar(props) {
    const name = props.name || "";
    const initials = name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  
    return (
      <div
        style={{
          display: "inline-block",
          width: props.size || 50,
          height: props.size || 50,
          borderRadius: "50%",
          backgroundColor: props.color || "#ccc",
          textAlign: "center",
          fontSize: 15,
          color: "#fff",
          fontWeight: "bold",
          lineHeight: props.size + "px",
          marginLeft: "2rem",
        }}
      >
        {initials}
      </div>
    );
  }
  
  const navigate = useNavigate();

  async function logout() {
    await axios.get("http://localhost:5000/api/auth/logout");

    await getLoggedIn();
    navigate("/login");

    if (window.location.pathname === "/") {
      window.location.reload();
    }
  }

  return (
    <header>
    {loggedIn && userInfo?.role === 'admin' &&<Link to="/"  className="logo">
  <img src={logo} alt="logo"/>
</Link>}
{(userInfo?.role != 'admin') &&
  <img src={logo} alt="logo" width={220}/>
}
      <nav>
        {!loggedIn && (
          <>
            <Link className="link" to="/login">
            Connexion
            </Link>
            <Link className="link2" to="/register">
            Inscription
            </Link>
          </>
        )}
        {loggedIn && (
         <>
          {userInfo&& userInfo?.role === 'admin' &&<Link className="link" to="/">Tickets</Link>}
         {userInfo&& userInfo?.role === 'admin' && <Link  className="link2" to="/admin">Dashboard</Link>}
          {userInfo&& userInfo?.role === 'user' && <Link className="link2" to="/dashboard">Mon tableau de bord</Link>}
         <Link to="/create">
           <button>
             {" "}
             Nouveau Ticket
           </button>
         </Link>
         <div>
         {userInfo&&<Avatar size={45} color="#999" name={userInfo.name} />}
    </div>
         <AiOutlineLogout className="logout" onClick={logout} />
       </>
        )}
      </nav>
    </header>
  );
}
