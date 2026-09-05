const express= require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({mergeParams:true});
const User= require('../models/user.js');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const {urlredirect, userValidation}= require('../middlewares.js');



//user signup
router.get('/signup',wrapAsync(async (req, res)=>{
    res.render('users/signup.ejs')
}));
router.post('/signup',userValidation,wrapAsync(async (req, res) =>{
    try{
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email
        });

        let result =await User.register(newUser, password);
        console.log(result);
        req.login(result,(err)=>{
            if(err){return next(err)}
            req.flash('success' , 'successfully signedup!');
            res.redirect('/listings'); 
        });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
}))

//login
router.get('/login',wrapAsync(async (req, res)=>{
    res.render('users/login.ejs')
}));

router.post('/login',
    urlredirect,
    passport.authenticate('local', {failureRedirect: '/login',failureFlash:true}),
    wrapAsync(async(req,res)=>{
        req.flash('success', `welcome back ${req.user.username}`);
        let redirectUrl = res.locals.redirectUrl || '/listings'
        res.redirect(redirectUrl);
    })
);

//logout

router.get('/logout',wrapAsync(async (req,res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success' , 'logged out successfully!');
        res.redirect('/listings');
    });
}));


module.exports = router;