var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const User = require('../models').User;
const UserRolePermission = require('../models').UserRolePermission;
const GuardianStudent = require('../models').GuardianStudent;
const { UnAuthorizedError, RecordNotFoundError } = require('../lib').errors

var createToken = function(auth) {
    return jwt.sign({
            id: auth.id
        }, 'my-secret'
    );
};

var verifyActionByGuardianRelationship = async function(userId, studentId, requiredRoles) {
  var guardianRecord= await GuardianStudent.findOne({user: userId, student: studentId});
  if (! guardianRecord && !(guardianRecord.relationshipType in requiredRoles) ) return false; //only parent can get the student details this can be expand to use the userRolePermission for detailed permission level 
  return true
}

module.exports = {
  generateToken: function(req, res, next) {
      req.token = createToken(req.auth);
      return next();
  },
  sendToken: function(req, res) {
      res.setHeader('x-auth-token', req.token);
      return res.status(200).send(JSON.stringify(req.user));
  },
  authorizeUser: function(roles){
    return [
      expressJwt({
        secret: 'my-secret',
        requestProperty: 'auth', //decoded content in req.auth property
        getToken: function(req) {
            if (req.headers['x-auth-token']) {
              return req.headers['x-auth-token'];
            }
            return null;
          }
      }),
      async function(req, res, next) {
        const currentUser = await User.findById(req.auth.id).catch(error=>{next(new RecordNotFoundError())}); //User not found in the db
        if (typeof roles === 'string' ) { roles = [roles]};
        req.user = currentUser;
        if (roles && !(roles.includes(currentUser.userRole)) ) { next(new UnAuthorizedError())}; // for minium level authorization, roles parameter can be null so it only requirs an exisiting user.
        next();
    }]
  },
  getOne:function (req, res) {
    var user = req.user.toObject();
    delete user['__v'];
    res.json(user);
  },
  verifyActionByGuardianRelationship
};