class ApiError extends Error{
  constructor(message, name, status){
    super(message);
    this.name=name;
  }
}

class RecordNotFoundError extends ApiError{
  constructor(errorDetail){
    super();
    this.message = 'No results have been found';
    this.name = 'RecordNotFound';
    this.recordNotFoundErrorDetails = errorDetail || 'Make sure the input exist'
  }
}

class InputNotValidError extends ApiError{
  constructor(validationError, originalData){
    super();
    this.name = "InputNotValidError";
    this.validationErrorDetails = validationError || "Check your input";
    this.originalData = originalData;
  }
}

class UnAuthorizedError extends ApiError{
  constructor(){
    super();
    this.name = "UnAuthorizedError";
    this.message = "You are not authorized to perform that action";
  }
}
module.exports={
  ApiError,
  RecordNotFoundError,
  InputNotValidError,
  UnAuthorizedError
}
