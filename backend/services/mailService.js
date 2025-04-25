const nodemailer = require('nodemailer');

// Créer un transporteur de mail (avec ton service de messagerie)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ou un autre fournisseur
  auth: {
    user: 'ton-email@gmail.com', // Ton email
    pass: 'ton-mot-de-passe',     // Ton mot de passe ou application spécifique
  },
});

// Fonction pour envoyer un email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'ton-email@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
