const Ticket = require('../models/Ticket');
const { User } = require("../models/User");
const jwt = require('jsonwebtoken');

const sendEmail = require('../services/mailService');

exports.createTicket = async (req, res) => {

  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
      }
      const ticket = await Ticket.create({
        title,
        description,
        createdBy: info.id
      });
  
      await sendEmail({
        to: info.email,
        subject: 'Ticket créé',
        text: `Votre ticket "${title}" a été créé avec succès.`
      });
  
      res.status(201).json(ticket);
    });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// List all tickets
exports.getTickets = async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;

      let tickets;
      if (info.role === "agent") {
        tickets = await Ticket.find({ assignedTo: info.id })
          .populate('createdBy', 'email name')
          .populate('assignedTo', 'name');
      } else {
        tickets = await Ticket.find()
          .populate('createdBy', 'email name')
          .populate('assignedTo', 'name');
      }

      res.json(tickets);
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Update ticket status
exports.updateTicketStatus = async (req, res) => {

  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params;
      const { status } = req.body;
    
      const ticket = await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      ticket.status = status;
      await ticket.save();
  
      const user = await User.findById(ticket.createdBy);
      await sendEmail({
        to: user.email,
        subject: `Mise à jour du ticket "${ticket.title}"`,
        text: `Le statut de votre ticket est passé à : ${status}`
      });
  
      res.json(ticket);
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Assign agent to a ticket
exports.assignAgent = async (req, res) => {
 

  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params;
      const { agentId } = req.body;
    const ticket = await Ticket.findById(id);
    const agent = await User.findById(agentId);

    if (!ticket || !agent) {
      return res.status(404).json({ message: "Ticket or Agent not found" });
    }

    ticket.assignedTo = agentId;
    await ticket.save();

    await sendEmail({
      to: agent.email,
      subject: `Nouveau ticket assigné`,
      text: `Un nouveau ticket vous a été assigné : ${ticket.title}`
    });

    res.json(ticket);})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {

  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
