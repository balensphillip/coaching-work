// this handles the authentication process
const LocalStrategy = require('passport-local').Strategy;
const signup = require('../models/signupModel');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    // Local strategy
// The fields used here should correspond to the way they are written in the schema(model)
    passport.use(new LocalStrategy(function(name, password, done){
 // match name
      let query = { name:name };
// We pass an error or the name of our model (to cater for both possibilities)
      signup.findOne(query, function(err, signupModel){
        if(err) throw err;
  
        if(!signupModel) {
          return done(null, false, { message: 'No name found' });
        }
// Match password
bcrypt.compare(password, signupModel.password, function(err, isMatch){
    if (err) throw err;
    if(isMatch) {
      return done(null, signup);
    } else {
      return done(null, false, { message: 'Wrong password' });
    }
  });
})
}))
}

passport.serializeUser(function(signup, done) {
    done(null, signup.id);
  });

