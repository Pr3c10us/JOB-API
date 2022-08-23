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
//
//
//
//CREATING USER CONTOLLER
//
const createJob = asyncwrapper(async (req, res) => {
  //add username to job
  req.body.userID = req.user.userID;

  //validate request
  const validate = jobJoiSchema.validate(req.body);
  let { error } = validate;
  if (error) {
    throw new badReqErr(error.details[0].message);
  }

  //create a new job
  await jobModel.create(req.body);

  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: 'Job created succesfuly' });
});
//
//
//
//GET ALL JOB THAT BELONGS TO USER
//
const getAllJobs = asyncwrapper(async (req, res) => {
  //get all data from database
  const allJobs = await jobModel.find({
    username: req.user.username,
  });

  res.status(StatusCodes.OK).json({
    nbHits: allJobs.length,
    Jobs: allJobs,
  });
});

module.exports = { createJob, getAllJobs };
