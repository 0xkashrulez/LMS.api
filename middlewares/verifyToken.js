const jwt=require('jsonwebtoken');
const { message } = require('../utils/apperror');
const apperror = require('../utils/apperror');
const handelstatus=require('../utils/httpStatustext')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];
  if(!authHeader) {
      const error = apperror.create('token is required', 401,handelstatus.ERROR)
      return next(error);
  }

  const token = authHeader.split(' ')[1];
  try {

      const currentUser = jwt.verify(token, process.env.jwt_secrut_key);
      req.currentUser = currentUser;
      next();

  } catch (err) {
      const error = appError.create('invalid token', 401, handelstatus.ERROR)
      return next(error);
  }   
  
}

module.exports = verifyToken;