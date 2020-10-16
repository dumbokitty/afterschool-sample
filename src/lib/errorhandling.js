const errors = require('./errors');
const MongooseError = require('mongoose').Error;
const { RecordNotFoundError, InputNotValidError, UnAuthorizedError } = errors;
function tokenAuthenticationError(error, req, res, next) {
  if (error.name==='UnauthorizedError') {
    res.status(403).send({error: "Not Authorized To Perform This Action"})
  }
  next(error);
}

function noResultFoundError(error, req, res, next) {
  if (error instanceof RecordNotFoundError){
    res.status(500).send({error: 'No record found'})
  };
  next(error);
}

function otherMangoDbError(error, req, res, next) {
  if (error.name ==='MongoError') {
    res.status(500).send({error: 'Mongo Error', errorCode: error.code})
  };
  next(error)
}

function errorHandling(error, req, res, next) {
  console.log(error);
  if (error instanceof UnAuthorizedError) {
    res.status(403).send({error: "Not Authorized To Perform This Action"})
  } else if (error.name ==='MongoError') 
  {
    res.status(500).send({error: 'Mongo Error', errorCode: error.code})
  } else if (error instanceof RecordNotFoundError) 
  {
    res.status(500).send({error: 'No record found'})
  } else if (error instanceof InputNotValidError) 
  {
    res.status(400).send({error: 'Invalid Input', errorDetail: error.validationErrorDetails})
  } else if (error instanceof MongooseError) {
    if (error instanceof MongooseError.ValidationError) {
      res.status(500).send({error: error._message, information: error.errors})
    }
    res.status(500).send({error: error._message}) 
  };
  next(error);
}
module.exports={
  tokenAuthenticationError,
  noResultFoundError,
  otherMangoDbError,
  errorHandling
}