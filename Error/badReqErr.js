const { StatusCodes } = require('http-status-codes');
const customApiErr = require('./customError');

class badReqErr extends customApiErr {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = badReqErr;
