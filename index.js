const express= require('express');
const app = express();
const mongoose= require('mongoose');
const path = require('path');
const MONGODB_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const listingRoutes= require('./routes/listings.js');
const reviewRoutes= require('./routes/reviews.js');
const userRouters = require('./routes/users.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStartegy = require('passport-local');
const User= require('./models/user.js');


app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const sessionOptions = {
    secret: 'mysessioncode',
    resave: false,
    saveUninitialized: true,
    cookie :{
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//connection to db
async function main() {
    await mongoose.connect(MONGODB_URL);
}
main()
    .then(()=> console.log('connection successful'))
    .catch(err => console.log(err));



//server setup
app.listen(3000,()=>{
    console.log('app is listening');
});

app.use((req,res,next)=>{
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    res.locals.curruser= req.user;
    next();
})

//home route
app.get('/', (req, res) => {
    res.send("working");
});

//demouser
app.get('/demo', async (req,res)=>{
    const user1 = new User({
        email:'nithin@gmailcom',
        username:'nithin'
    });

    let user = await User.register(user1,'nithin123');
    res.send(user);
});

//other routes
app.use('/listings',listingRoutes);
app.use('/listings/:id/reviews',reviewRoutes);
app.use('/',userRouters);


app.all("/{*splat}",(req,res,next)=>{
    let error = new ExpressError(404,'page not found!');
    next(error);
    
})

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render('listings/error.ejs',{message});

});
