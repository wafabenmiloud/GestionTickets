import API from './api';

export const getTickets = () => API.get('/tickets');
export const createTicket = (data) => API.post('/tickets', data);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);