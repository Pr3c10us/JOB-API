const unauthorizedErr = require('../Error/unauthorized');
const jwt = require('jsonwebtoken');
const badReqErr = require('../Error/badReqErr');
const asyncwrapper = require('./async');
require('dotenv').config();

const authorize = asyncwrapper(async (req, res, next) => {
  //check if user has access to resource
  let authorized = req.headers.authorization;

  if (!authorized || !authorized.startsWith('Bearer ')) {
    throw new badReqErr('no token provided');
  }
  authorized = authorized.split(' ');
  const token = authorized[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    let { username, userID } = decoded;
    req.user = { username, userID };
    next();
  } catch (error) {
    throw new unauthorizedErr(
      'You do not have access to resource'
    );
  }
});

module.exports = authorize;
