const {
  register,
  login,
  updateprofile,
} = require('../controller/signing');
const authorize = require('../middleware/auth');
const {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
} = require('../controller/jobs');
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
