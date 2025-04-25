import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // à adapter si besoin

export const getUsers = () => axios.get(`${API_URL}/users`);
