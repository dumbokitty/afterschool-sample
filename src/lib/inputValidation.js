const { Validator } = require('jsonschema');
const v = new Validator();
const { InputNotValidError } = require('./errors');

const addressSchema = {
  "id": "/SimpleAddress",
  "type": "object",
  "properties": {
    "street": { "type": "string" },
    "city": {"type": "string"},
    "state": {"type": "string"},
    "zipcode": {"type": "string"},
  }
} 

const personSchema = {
  "id": "/SimplePerson",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "required": true
    },
    "lastName": {
      "type": "string",
      "required": true
    },
    "cellPhone": {
      "type": "string",
      "pattern": /\d{3}-\d{3}-\d{4}/,
      "required": true
    },
    "address": {"$ref": "/SimpleAddress"},
  }
}

const studentSchema = {
  "id": "/SimpleStudent",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
    },
    "lastName": {
      "type": "string",
    },
    "gender": {
      "type": "string",
    },
    "address": {
      "type": "object",
      "$ref": "/SimpleAddress",
    }
  },
  "required": [
    "firstName",
    "lastName",
    "gender",
  ],
}

v.addSchema(addressSchema, "/SimpleAddress");
v.addSchema(personSchema, "/SimplePerson");

function validateStudent(data) {
  const validationResult = v.validate(data, studentSchema);
  if (validationResult.errors.length>0) {
    throw new InputNotValidError(validationResult.errors, data)
  }
  return Promise.resolve();
}

function validateStudents(studentsData) {
  var errors = [];
  studentsData.map((student)=>{
    const validateStudentResult = v.validate(student, studentSchema);
    
    if (validateStudentResult.errors.length>0) { 
      errors.push(validateStudentResult.errors);}
  })
  if (errors.length>0) {
    throw new InputNotValidError(errors);
  }
  return Promise.resolve();
}
module.exports = {
  validateStudent,
  validateStudents
}