const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    console.error('Erreur connexion MongoDB ', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
