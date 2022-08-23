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
  updateprofile,
} = require('../controller/signing');
const unauthorizedErr = require('../Error/unauthorized');
const authorize = require('../middleware/auth');
const {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
} = require('../controller/jobs');
const {
  registerModel,
} = require('../Database/signingModel');
const router = require('express').Router();

router
  .route('/register')
  .post(register)
  .patch(authorize, updateprofile);
router.route('/login').post(login);

router
  .route('/job')
  .post(authorize, createJob)
  .get(authorize, getAllJobs);

router
  .route('/job/:jobID')
  .delete(authorize, deleteJob)
  .patch(authorize, updateJob);
module.exports = router;
