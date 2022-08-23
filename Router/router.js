const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  jobJoiSchema,
  jobModel,
} = require('../Database//jobModel');
const asyncwrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const badReqErr = require('../Error/badReqErr');
const {
  register,
  login,
} = require('../controller/signing');
const unauthorizedErr = require('../Error/unauthorized');
const authorize = require('../middleware/auth');
const {
  createJob,
  getAllJobs,
} = require('../controller/jobs');
const router = require('express').Router();

router.route('/register').post(register);
router.route('/login').post(login);

router
  .route('/job')
  .post(authorize, createJob)
  .get(authorize, getAllJobs)
  .delete(authorize, asyncwrapper(async (req, res) => {
    
  }))
module.exports = router;
