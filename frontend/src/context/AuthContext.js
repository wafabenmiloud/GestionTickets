import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    iat: ""
  });

  async function getLoggedIn() {
    try {
      const loggedInRes = await axios.get(
        "http://localhost:5000/api/auth/loggedIn",  
        { withCredentials: true }
      );

      setLoggedIn(loggedInRes.data.logged);
      setUserInfo(loggedInRes.data.data);
    } catch (error) {
      console.error("Error fetching login state:", error);
      setLoggedIn(false);
      setUserInfo({});
    }
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, getLoggedIn, userInfo }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
