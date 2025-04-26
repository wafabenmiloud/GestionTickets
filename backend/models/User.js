const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Validation for register
const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email'),
    password: passwordComplexity().required().label('Password'),
    role: Joi.string().valid('user', 'agent', 'admin').optional().label('Role') // Optional on signup
  });
  return schema.validate(data);
};

// Validation for login
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(data);
};

module.exports = { User, validate, validateLogin };
