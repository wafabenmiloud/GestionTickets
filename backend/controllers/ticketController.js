const Ticket = require('../models/Ticket');
const User = require('../models/User');
const sendEmail = require('../services/mailService');

exports.createTicket = async (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required." });
  }

  try {
    const ticket = await Ticket.create({
      title,
      description,
      createdBy: req.user.id
    });

    const user = await User.findById(req.user.id);
    await sendEmail({
      to: user.email,
      subject: 'Ticket créé',
      text: `Votre ticket "${title}" a été créé.`
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    await ticket.save();

    // Email notifications
    if (assignedTo) {
      const agent = await User.findById(assignedTo);
      await sendEmail({
        to: agent.email,
        subject: 'Nouveau ticket assigné',
        text: `Vous avez été assigné au ticket : "${ticket.title}".`
      });
    }

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

