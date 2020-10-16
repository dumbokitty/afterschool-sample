const  Student = require('./students');
const  User = require('./users');
const GuardianStudent = require('./guardianStudent');
const UserRolePermission = require('./userRolePermission');

const models = {
  Student,
  User,
  GuardianStudent,
  UserRolePermission,
}


module.exports=models;
