const { sendEmail } = require('../services/mailService');

// Route de création de ticket
app.post('/tickets', async (req, res) => {
  const { title, description, createdBy, assignedTo } = req.body;
  const newTicket = new Ticket({
    title,
    description,
    createdBy,
    assignedTo,
    status: 'Ouvert', // Statut initial
  });

  try {
    await newTicket.save();

    // Envoi de l'email
    const user = await User.findById(createdBy); // Trouver l'utilisateur qui a créé le ticket
    const agent = assignedTo ? await User.findById(assignedTo) : null;
    
    const emailBody = `
      Un nouveau ticket a été créé :
      - Titre : ${newTicket.title}
      - Description : ${newTicket.description}
      - Créé par : ${user.name}
      - Assigné à : ${agent ? agent.name : 'Non assigné'}
      - Statut : ${newTicket.status}
    `;
    
    // Envoie de l'email au créateur et à l'agent assigné
    await sendEmail(user.email, 'Ticket créé', emailBody);
    if (agent) {
      await sendEmail(agent.email, 'Ticket assigné', emailBody);
    }

    res.status(201).send(newTicket);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Route pour mettre à jour un ticket
app.put('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { status, assignedTo } = req.body;
  
    try {
      const ticket = await Ticket.findById(id);
      const oldAssignedTo = ticket.assignedTo;
      
      ticket.status = status || ticket.status;
      ticket.assignedTo = assignedTo || ticket.assignedTo;
  
      await ticket.save();
  
      // Envoi de l'email de modification
      const user = await User.findById(ticket.createdBy);
      let emailBody = `
        Votre ticket a été mis à jour :
        - Titre : ${ticket.title}
        - Statut : ${ticket.status}
      `;
      
      if (assignedTo && oldAssignedTo !== assignedTo) {
        const agent = await User.findById(assignedTo);
        emailBody += `
          - Assigné à : ${agent.name}
        `;
        await sendEmail(agent.email, 'Ticket réassigné', emailBody);
      }
      
      await sendEmail(user.email, 'Ticket mis à jour', emailBody);
  
      res.status(200).send(ticket);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  