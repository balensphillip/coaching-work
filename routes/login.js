const express = require('express');
const router = express.Router();

//accessing the login page
router.get('/',(req, res)=>{
// we are rendering the login_2 pug file
    res.render('login_2')
});

//we exposing our route to any file that will require it.
module.exports = router;