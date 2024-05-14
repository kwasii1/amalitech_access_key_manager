var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('./strategies/localStrategy')
// Route files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register')
var loginRouter = require('./routes/login');
var authRouter = require('./routes/authRoute')
var app = express();
// CORS and Session
app.use(cors({
    origin: ['http://localhost:5173'], 
    credentials: true,
    optionsSuccessStatus: 204,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
}));
app.use(session({
    secret:"Mysecret",
    resave:true,
    saveUninitialized:true,
}))
app.use(passport.initialize())
app.use(passport.session())
// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// route definitions
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

module.exports = app;
