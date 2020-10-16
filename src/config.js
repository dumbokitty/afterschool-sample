const googleSecret = require('./secret.json');
const googleClientId = googleSecret.web.client_id;
const googleClientSecret = googleSecret.web.client_secret;

module.exports = {
  'googleAuth' : {
      'clientID'         : googleClientId,
      'clientSecret'     : googleClientSecret,
      'callbackURL'      : 'http://localhost:4000/auth/google/callback'
  }
};