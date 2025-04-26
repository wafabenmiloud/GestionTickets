const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicket,getTicketById } = require('../controllers/ticketController');
const authMiddleware = require('../authMiddleware');

router.post('/', authMiddleware, createTicket);
router.get('/', authMiddleware, getTickets);
router.put('/:id', authMiddleware, updateTicket);
router.get('/:id', authMiddleware, getTicketById);

module.exports = router;
