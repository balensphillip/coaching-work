// we are requiring our packages into the controller called app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session')({
  // no tracing footprint
  secret: 'secret',
  // session should be dumped after use
  resave: false,
  // incase of session creation failure deatils should be dumped
  saveUninitialized: false
});

// we are qualifying config to be a package but config package is our own i.e we just created it.
const config = require('./config/database');


// route section (these are controllers)
let loginRoutes = require('./routes/login')
const mgtEntryRoutes = require('./routes/mgtEntry')
const registerRoutes = require('./routes/register')
const signupRoutes = require('./routes/signup');
const Signup = require('./models/signupModel');

// here we are instatiating the server/app/index
const app = express();

//creating a connection to the mongo database from the controller(specifying its location)
mongoose.connect(config.database);
// Incase of a connection
const db = mongoose.connection;
db.once('open', ()=> {
    console.log('Connected to mongodb');
})
db.on('error', (err)=> {
    console.error('Connection error',err)
}) 

// setting up the view engine
app.engine('pug', require('pug').__express)
app.set('view engine','pug')
app.set('views', path.join(__dirname,'views'))

// bodyparser middleware section: This helps to clean data that is within the forms.
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(session);
// responsible for handling username and password
// passport.initialize helps us to initialize
app.use(passport.initialize());
// this helps to create a session after authentication
app.use(passport.session());

passport.use(Signup.createStrategy());
// this is an inbuilt method
// when u log into the system  a serial number is given to u so the system knows the id
passport.serializeUser(Signup.serializeUser());
// forgetting the serial number when log out happens
passport.deserializeUser(Signup.deserializeUser());

// // flash middleware
// app.use(require('connect-flash'))
// app.use(function (req, res, next) {
//     res.locals.messages = require('express-messages')(req, res);
//     next();
//   });  

// setting directory for static files
app.use(express.static(path.join(__dirname, "public")));

// // express flash middleware
// app.use(session({
//     secret: 'keyboard cat',
//     resave: true,
//     saveUninitialized: true
//   }));
  

// intsructing the controller to point the login file.
// @ this line below we are using middleware
app.use('/login',loginRoutes)
app.use('/mgtEntry',mgtEntryRoutes)
app.use('/register2',registerRoutes)
// this route is handling the get and post method
app.use('/signup',signupRoutes)
// this is a post route middleware whereas we are 
// using the same variable that we created
// for loginRoutes for it to work
// app.use('/form/submit',registerRoutes)

// For invalid routes as in if someone hits a non existent route.
// This should always be the last route after all other routes are 
// excecuted.the message that appears in case someone searches for a route 
//  doesnt exist on my server
app.get('*', (req, res) => {
  res.status(404).send('This is an invalid URL')
})


//establish the server listening port
app.listen(3000, ()=> {
    console.log('The server has started on port 3000')
})

