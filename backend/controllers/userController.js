const { User } = require("../models/User");
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
    const users = await User.find().select('-password');
    res.json(users);})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
