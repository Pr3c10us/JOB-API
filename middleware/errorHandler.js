const { StatusCodes } = require('http-status-codes');
const customApiErr = require('../Error/customError');

const errorhandler = (err, req, res, next) => {
  if (err instanceof customApiErr) {
    return res
      .status(err.statusCode)
      .json({ msg: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      msg: 'We are having a little server issues',
    });
};

module.exports = errorhandler;
