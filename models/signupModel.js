//Model refers to a structure of the database
//In the model folder we store schemas there.
//We are going to describe a schema 
//A schema refers to the structure of a database

// first we require mongoose package becoz it will 
// help us define the schema
const mongoose = require('mongoose')

// this is a plugin that helps us capture the usernames
const passportLocalMongoose = require('passport-local-mongoose')

//creating the schema for register2 file.
const signupSchema = mongoose.Schema({
 name:{
     type:String,
     required:true
// the data that is coming in, its a string and required
 },
 email:{
     type:String,
     required:true,
     unique:true
//the data that is coming in, its a string and is required
 },
 password:{
    type:String,
    required:true,
//the data that is coming in, its a string and is required
}
})

// setting up the username field which is email
signupSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
  });
  
// we are exposing our schema to other files
const Signup = module.exports = mongoose.model('Signup', signupSchema);