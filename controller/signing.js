//required modules
//
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  registerJoiSchema,
  registerModel,
  loginJoiSchema,
} = require('../Database/signingModel');
const asyncwrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const badReqErr = require('../Error/badReqErr');
//
//
//
// Register controller
//
const register = asyncwrapper(async (req, res) => {
  //Validate request
  let valid = registerJoiSchema.validate(req.body);
  const { error: validateErr } = valid;
  if (validateErr) {
    throw new badReqErr(valid.error.details[0].message);
  }

  //check if user exist
  let { username, email, firstname, password } = req.body;
  const userExist = await registerModel.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (userExist) {
    if (username == userExist.username) {
      throw new badReqErr('username taken');
    }
    if (email == userExist.email) {
      throw new badReqErr(
        'email already associated to another account'
      );
    }
  }
  // hash password
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(password, salt);
  //create user
  await registerModel.create(req.body);

  //Assign token
  //Assign token
  const user = await registerModel
    .findOne({
      $or: [{ username: username }, { email: username }],
    })
    .select('-password -_id -__v');
  let { lastname, country } = user;
  const token = jwt.sign(
    {
      email,
      username,
      firstname,
      lastname,
      country,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }
  );

  res
    .header({ Token: token })
    .status(StatusCodes.ACCEPTED)
    .json({
      msg: `${firstname} your account has been created`,
    });
});
//
//
//
// Login controller
//
const login = asyncwrapper(async (req, res) => {
  //validate request
  const valid = loginJoiSchema.validate(req.body);
  let { error: validateErr } = valid;
  if (validateErr) {
    throw new badReqErr(validateErr.details[0].message);
  }

  //Check if user exist
  let { username, password } = req.body;
  const userExist = await registerModel.findOne({
    $or: [{ username: username }, { email: username }],
  });
  if (!userExist) {
    throw new badReqErr('User does not exist');
  }

  //check is password is correct
  if (!bcrypt.compareSync(password, userExist.password)) {
    throw new badReqErr('paswword wrong');
  }

  //Assign token
  const user = await registerModel
    .findOne({
      $or: [{ username: username }, { email: username }],
    })
    .select('-password -__v');
  let {
    email,
    username: mainusername,
    firstname,
    lastname,
    country,
    _id: userID,
  } = user;
  const token = jwt.sign(
    {
      email,
      username: mainusername,
      firstname,
      lastname,
      country,
      userID,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }
  );

  res
    .header({ Token: token })
    .status(StatusCodes.ACCEPTED)
    .json({ msg: `Welcome ${userExist.firstname}` });
});

module.exports = { register, login };
