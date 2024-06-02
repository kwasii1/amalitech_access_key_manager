var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
require('dotenv').config()
const MySQLStore = require('express-mysql-session')(session)
const options = {
    host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'akm',
    createDatabaseTable: true,
    schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data',
		}
	},
}
const sessionStore = new MySQLStore(options)
var passport = require('passport')
var LocalStrategy = require('./strategies/localStrategy')
// Route files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register')
var loginRouter = require('./routes/login');
var authRouter = require('./routes/authRoute');
var adminRouter = require('./routes/admin');
var paymentRouter = require('./routes/paymentRoute')
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
    store:sessionStore
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
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/payment',paymentRouter)

module.exports = app;