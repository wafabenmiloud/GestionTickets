import React from "react";
import logo from "../assets/Aman.png";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>

        {" "}
        <span>
        Connect with a community of programmers from around the world on the CodeQuery app. <br />
        </span>
    </footer>
  );
}
