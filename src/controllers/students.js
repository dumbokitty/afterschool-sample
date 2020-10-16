const {Student, GuardianStudent, User} = require('../models');
const errors = require('../lib').errors;
const validation = require('../lib').validation;
const { UnAuthorizedError, RecordNotFoundError} = errors;
const { validateStudent } = validation;
const { verifyActionByGuardianRelationship } = require('./auth');

var getAllStudents = async function(req, res, next) {
  Student.find(req.query, function(err, students){
    if (err) {
      next(err)
    } else {
      if (students.length ===0 ) {
        next(new RecordNotFoundError())
      } else {
        req.result = students;
        next();
      }
    }
  })
  
}

var sendResult = function(req, res) {
  res.json(req.result);
}

var findStudentById = async function(req, res, next) {
  const studentId = req.params.studentId;
  if (req.user.userRole!=='admin'&&!await verifyActionByGuardianRelationship(req.user_id, studentId, ['parent'])) { throw new UnAuthorizedError() };

  const fectchedStudent = await Student.findById(studentId).populate(
    { path: 'guardians', 
      select: {'_id': 0}, //foreign field student needs to be selected. otherwise guardians cannot be populated
      populate: {
        path: 'user',
      }
    })
  req.result = fectchedStudent;
}





var createStudent = async function(req, res, next ) {
  const inputStudent = req.body.student;  
  await validateStudent(inputStudent);
  const newStudent = new Student(inputStudent);
  await newStudent.save();
  req.result = newStudent;
}

var updateStudent = async function (req, res, next ) {
  const id = req.params.studentId;
  if (req.user.userRole!=='admin'&& !await verifyActionByGuardianRelationship(req, ['parent'])) { throw new UnAuthorizedError() };
  const inputStudent = req.body;
  await validateStudent(inputStudent); //TODO: rethink of which fields can be updated
  const updateResult = await Student.findOneAndUpdate({_id : id}, inputStudent, {new: true});
  if (!updateResult) {throw new RecordNotFoundError()};
  res.result = updateResult;
}

var createUser = async function (req, res, next) {
  const inputUser = req.body;
  try {
    const newUser = new User(inputUser);
    await newUser.save()
  }
  catch(error) {
    next(error)
  };
  next();
}

var getUsers = async function (req, res, next) {
  User.find(req.query, function(err, users){
    if (err) {
      next(err)
    } else {
      if (users.length ===0 ) {
        next(new RecordNotFoundError())
      } else {
        req.result = users;
        next();
      }
    }
  })
}

module.exports={
  getAllStudents,
  sendResult,
  findStudentById,
  updateStudent,
  createStudent,
  createUser,
  getUsers
}