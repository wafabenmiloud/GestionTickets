const express = require('express');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const tickets = await Ticket.find().populate('createdBy assignedTo');
  res.json(tickets);
});

router.post('/', auth, async (req, res) => {
  const ticket = await Ticket.create({ ...req.body, createdBy: req.user.id });
  res.json(ticket);
});

router.put('/:id', auth, async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ticket);
});

module.exports = router;