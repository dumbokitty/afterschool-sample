var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../passport')();
const {asyncWrapper} = require('../lib');
const controllers = require('../controllers');
const { getAllStudents, sendResult, findStudentById, updateStudent, createStudent, 
    getUsers } = controllers.students;
const { generateToken, sendToken, authorizeUser} = controllers.auth;
const { createGuardian, deleteGuardian, updateUser, getStudentsForUser} = controllers.guardians;
router.route('/auth/google')
  .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
      if (!req.user) {
          return res.send(401, 'User Not Authenticated');
      }
      req.auth = {
          id: req.user.id
      };
      
      next();
  }, generateToken, sendToken);

router.route('/students').get(authorizeUser('admin'), getAllStudents, sendResult);
router.route('/students/:studentId').get(authorizeUser(), asyncWrapper(findStudentById), sendResult);  //only admin or parent of the student can findStudentById
router.route('/students/:studentId').put(authorizeUser(), asyncWrapper(updateStudent), sendResult); //only admin or parent of the student can update student info
router.route('/students').post(authorizeUser('admin'), asyncWrapper(createStudent), sendResult); //only admin can add a new student

router.route('/users/:userId').put(authorizeUser(), asyncWrapper(updateUser), sendResult);
router.route('/users').get(authorizeUser('admin'),getUsers,sendResult);
router.route('/students/:studentId/guardians').post(authorizeUser(), asyncWrapper(createGuardian),sendResult); //only admin or parent of student can add guardian
router.route('/students/:studentId/guardians/:userId').delete(authorizeUser(), asyncWrapper(deleteGuardian), sendResult);//only admin or parent of student can delete guardian
router.route('/users/:userId/students').get(authorizeUser(), asyncWrapper(getStudentsForUser), sendResult); //user only get the student name and id not the details

module.exports = router;
