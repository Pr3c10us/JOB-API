const Joi = require('joi');
const mongoose = require('mongoose');

const registerSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    max: 20,
  },
  lastname: {
    type: String,
    required: true,
    max: 20,
  },
  username: {
    type: String,
    required: true,
    max: 20,
  },
  country: {
    type: String,
    required: true,
    max: 30,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 30,
  },
});
const registerModel = mongoose.model(
  'registerModel',
  registerSchema
);
const registerJoiSchema = Joi.object({
  firstname: Joi.string().required().max(20),
  lastname: Joi.string().required().max(20),
  username: Joi.string().required().max(20),
  country: Joi.string().required().max(30),
  email: Joi.string().required().email(),
  password: Joi.string().required().max(30).min(8),
});

const loginJoiSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().required().max(30).min(8),
});

module.exports = {
  registerModel,
  registerJoiSchema,
  loginJoiSchema,
};
