import React from 'react';
import {AuthContextProvider}   from "./context/AuthContext";
import Router from "./Router";
import axios from "axios";


axios.defaults.withCredentials = true;

function App() {

  return (
    <AuthContextProvider>
    <Router/>
    </AuthContextProvider>
   
  );
}

export default App;