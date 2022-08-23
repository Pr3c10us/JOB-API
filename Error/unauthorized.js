const { StatusCodes } = require('http-status-codes');
const customApiErr = require('./customError');

class unauthorizedErr extends customApiErr {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = unauthorizedErr;
