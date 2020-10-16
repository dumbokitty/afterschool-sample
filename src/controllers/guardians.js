const { Student, GuardianStudent, User} = require('../models');
const errors = require('../lib').errors;
const { RecordNotFoundError, UnAuthorizedError} = errors;
const mongoose = require('mongoose');
const { verifyActionByGuardianRelationship } = require('./auth');

const createGuardian = async function(req, res, next) {
  const studentId = req.params.studentId;
  const targetStudent = await Student.findById(studentId);
  const guardian = req.body;
  const requestUser = guardian.user;
  const newGuardian = new GuardianStudent({
    relationshipType:guardian.relationshipType,
    student: studentId});
  var targetUser = await User.findOne({email: requestUser.email});
  if(!targetUser) {
    targetUser = new User(requestUser);
    await targetUser.save();
  } 
  newGuardian.user = targetUser._id;
  await newGuardian.save();
  req.result= newGuardian;
};

const deleteGuardian = async function(req, res, next) {
  const student = req.params.studentId;
  const user = req.params.userId;
  const deletedGuardian = GuardianStudent.findOneAndRemove({user, student});
  if (!deletedGuardian) {
    throw new RecordNotFoundError()
  };
}

const updateUser = async function(req,res,next) {
  const currentUser = req.user;
  const userId = req.params.userId;
  if (currentUser.userRole !== 'admin' && currentUser._id !== userId) { throw new UnAuthorizedError()}; //only admin or the user with the same userId can call this method
  const requestUser = req.body;
  const updatedUser = await User.findOneAndUpdate({_id: userId}, requestUser, {new: true});
  if (!updatedUser) {
    throw new RecordNotFoundError()
  };
  req.result = updatedUser;
}

const getStudentsForUser = async function(req, res, next) {
  const currentUser = req.user;
  const userId = req.params.userId;
  if (currentUser.userRole !== 'admin' && currentUser._id !== userId) { throw new UnAuthorizedError()}; //only admin or the user with the same userId can call this method  //TODO: put it back for authorization
  const foundGuardianShips = await GuardianStudent.aggregate([
    {$match: { user: mongoose.Types.ObjectId(userId)}},
    {$lookup: {
      from: 'students',
      let: {student_id: '$student'},
      pipeline: [
        {$match: {
          $expr: {
            $eq: ['$_id', '$$student_id']
          }
        }},
        {$project: {
          firstName: 1,
          lastName: 1
        }}
      ], 
      as:'studentInfo',
    }},
    {$project: {
      _id: 0,
      relationshipType: 1,
      studentInfo: 1
    }}
  ])
  req.result = {
    students: foundGuardianShips
  };
}

getOneStudentDetailForUser = async function(req,res,next) {
  const currentUser = req.user;
  const userId = req.params.userId;
  const studentId = req.params.studentId;
  if (currentUser.userRole !== 'admin') {
    if (currentUser._id !== userId || !verifyActionByGuardianRelationship(userId, studentId, ['parent']) ){ throw new UnAuthorizedError()}}; //only admin or the parent of the student can call this method plus the current user must be the same as the query param
  const foundStudent = await Student.findOne({_id: studentId}, '-__v');
  if (!foundStudent) {throw new RecordNotFoundError()};
  req.result = foundStudent;
}
module.exports = {
  createGuardian,
  deleteGuardian,
  updateUser,
  getStudentsForUser,
  getOneStudentDetailForUser
}
