const express = require('express');
const router = express.Router();
const {createTicket,getTicketById,getTickets,updateTicketStatus,assignAgent} = require('../controllers/ticketController');
const authToken = require('../services/authToken');


router.post('/create',authToken, createTicket);
router.get('/' ,authToken, getTickets);
router.get('/:id', authToken, getTicketById);
router.put('/status/:id',authToken,  updateTicketStatus);
router.put('/assign/:id',authToken,  assignAgent);

module.exports = router;
