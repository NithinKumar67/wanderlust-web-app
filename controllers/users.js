const User= require('../models/user.js');

module.exports.renderSignupPage = async (req, res)=>{
    res.render('users/signup.ejs')
};

module.exports.addUser = async (req, res) =>{
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
}

module.exports.renderLoginPage = async (req, res)=>{
    res.render('users/login.ejs')
}

module.exports.login = async(req,res)=>{
    req.flash('success', `welcome back ${req.user.username}`);
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
}

module.exports.logout = async (req,res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success' , 'logged out successfully!');
        res.redirect('/listings');
    });
}    