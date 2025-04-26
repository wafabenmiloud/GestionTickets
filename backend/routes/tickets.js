const express = require('express');
const router = express.Router();
const {createTicket,getTicketById,getTickets,updateTicketStatus,assignAgent} = require('../controllers/ticketController');


router.post('/create', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.put('/status/:id', updateTicketStatus);
router.put('/assign/:id', assignAgent);

module.exports = router;
