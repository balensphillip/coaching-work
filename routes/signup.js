const express = require('express');
const router = express.Router();
const passport = require('passport')
const expressValidator = require('express-validator')
router.use(expressValidator())
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// requiring our model or schema of register
const Signup = require('../models/signupModel');

//accessing the signup page
router.get('/',(req, res)=>{
// we are rendering the signup pug file
    res.render('signup')
});

// route for viewing the signup page.
router.post('/', async (req,res)=>{
    console.log(req.body)

    try{
    const newSignup = new Signup(req.body);
//findOne is a database method 
    let user = await Signup.findOne({email:req.body.email});
    if(user){
        return res.status(400).send('User email alreday exists, please check your email or register in order to login');
    }
    else{
//encrypting the password using bryptjs
    bcrypt.genSalt(7,(err,salt) => {
        bcrypt.hash(newSignup.password, salt,(err,hash)=> {
            if(err){
                console.error(err)
                return;
            }
            newSignup.password = hash
        })
    })
// Note: register() encrypts the password
        await Signup.register(newSignup, req.body.password,(err) => {
         if (err){
             throw err;
         }
         res.redirect('/login');
        });
    }
// saying when i wait please give some time for data to post
        // await newUser.save()
        // res.redirect('/login');
    }catch(err){
        console.log(err);
        res.send('your data wasnt saved');
    }
});

//we exposing our route to any file that will require it.
module.exports = router;