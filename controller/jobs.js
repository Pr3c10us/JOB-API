const {
  jobJoiSchema,
  jobModel,
} = require('../Database//jobModel');
const asyncwrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const badReqErr = require('../Error/badReqErr');
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
  let {
    Position,
    Status,
    'Job Type': JobType,
    sort,
  } = req.query;
  let queryObj = {};
  queryObj.userID = req.user.userID;

  if (Position) {
    queryObj.Position = { $regex: Position, $options: 'i' };
  }
  if (Status) {
    queryObj.Status = Status;
  }
  if (JobType) {
    queryObj['Job Type'] = JobType;
  }

  //
  let sortObj = {};
  if (sort) {
    if (sort == 'latest') {
      sortObj.Date = 1;
    } else if (sort == 'oldest') {
      sortObj.Date = -1;
    } else if (sort == 'a-z') {
      sortObj.Position = 1;
    } else if (sort == 'z-a') {
      sortObj.Position = -1;
    } else {
      throw new badReqErr(`sort can not be ${sort}`);
    }
  }
  //get all data based on querys from database
  const allJobs = await jobModel
    .find(queryObj)
    .sort(sortObj);

  res.status(StatusCodes.OK).json({
    nbHits: allJobs.length,
    Jobs: allJobs,
  });
});
//
//
//
//Delete a job controller
//
const deleteJob = asyncwrapper(async (req, res) => {
  let { jobID } = req.params;

  //check if job exist
  const job = await jobModel.findOne({ _id: jobID });
  if (!job) {
    throw new badReqErr('Job does not exist');
  }

  //delete job
  await jobModel.deleteOne({ _id: jobID });

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Job has been deleted' });
});
//
//
//
//Update job
//
const updateJob = asyncwrapper(async (req, res) => {
  let { jobID } = req.params;

  //check if job exist
  const job = await jobModel.findOne({ _id: jobID });
  if (!job) {
    throw new badReqErr('Job does not exist');
  }

  //update data
  const updatedJob = await jobModel.findOneAndUpdate(
    { _id: jobID },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ updatedJob });
});

module.exports = {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
};
