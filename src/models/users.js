var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
      type: String, required: true,
      trim: true, unique: true,
      index: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  googleProvider: {
      type: {
          id: String,
          token: String
      },
      select: false
  },
  userRole: {
      type: String,
      default: 'guardian',
      enum: ['admin', 'teacher','guardian'] //guardian means the user is parent/pickup
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  cellPhone: {
    type: String,
    match: /\d{3}-\d{3}-\d{4}/
  },
});

UserSchema.set('toJSON', {
  getters: true, 
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v
  } 
});

UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  console.log('upsert');
  return this.findOne({
      'googleProvider.id': profile.id
  }, async function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
          var newUser
            var newUser = await that.findOne({email:profile.emails[0].value }) //user already been created by administrator and it is the first time longin
            if (newUser) {
              newUser.googleProvider = {
                id: profile.id,
                token: accessToken}}
            else {
              newUser = new that({
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  email: profile.emails[0].value,
                  googleProvider: {
                      id: profile.id,
                      token: accessToken
                  }
              });}
          newUser.save(function(error, savedUser) {
              if (error) {
                console.log(error)
              }
              return cb(error, savedUser);
          });
      } else {
          if (err) {
          }
          return cb(err, user);
      }
  });
};

module.exports=mongoose.model('User', UserSchema);