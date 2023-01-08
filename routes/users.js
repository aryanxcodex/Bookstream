const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');

router.get('/register',(req,res)=>{
    res.render('users/register');
});

router.post('/register', catchAsync(async (req,res)=>{
    const { email, username, password } = req.body;
    const role = "user";
    const user = new User({email, username, role});
    const registeredUser = await User.register(user,password);
    req.flash('success','Welcome to bookstream');
    res.redirect("/");
}));

router.get('/login',(req,res)=>{
    res.render();
});

router.post('/login',(req,res)=>{

})



module.exports = router;