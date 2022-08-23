const Joi = require('joi');
const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  Position: {
    type: String,
    required: true,
    max: 50,
  },
  Company: {
    type: String,
    required: true,
    max: 100,
  },
  'Job Location': {
    type: String,
    default: 'my city',
  },
  Status: {
    type: String,
    enum: ['pending', 'declined', 'interview'],
    default: 'pending',
  },
  'Job Type': {
    type: String,
    enum: [
      'full-time',
      'part-time',
      'remote',
      'internship',
    ],
    default: 'full-time',
  },
  userID: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});

const jobModel = mongoose.model('jobModel', jobSchema);

const jobJoiSchema = Joi.object({
  Position: Joi.string().required().max(50),
  Company: Joi.string().required().max(100),
  'Job Location': Joi.string().default('my city'),
  Status: Joi.string()
    .default('pending')
    .valid('pending', 'declined', 'interview'),
  'Job Type': Joi.string()
    .default('full-time')
    .valid(
      'full-time',
      'part-time',
      'remote',
      'internship'
    ),
  userID: Joi.string(),
});

module.exports = { jobJoiSchema, jobModel };
