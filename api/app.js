var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var session = require('express-session')
const { rateLimit } = require('express-rate-limit');
require('dotenv').config()
const { csrfSync } = require('csrf-sync');
const {csrfSynchronisedProtection} = csrfSync({
    getTokenFromRequest: (req) => {
        return req.body["CSRFToken"];
    },
})
const mysql_options = {
    host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};
const connection = mysql.createConnection(mysql_options)
const MySQLStore = require('express-mysql-session')(session)
const options = {
    host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
    createDatabaseTable: true,
    expiration:3600000,
    clearExpired:true,
    schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data',
		}
	},
}
const sessionStore = new MySQLStore(options,connection.promise())
var passport = require('passport')
var LocalStrategy = require('./strategies/localStrategy')
// Route files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register')
var loginRouter = require('./routes/login');
var authRouter = require('./routes/authRoute');
var adminRouter = require('./routes/admin');
var paymentRouter = require('./routes/paymentRoute');
const { webhook } = require('./controllers/paymentController');
var app = express();
// rate limiter
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
	limit: process.env.RATE_LIMIT, 
	standardHeaders: true, 
	legacyHeaders: false, 
    message:"Too many requests"
})
// CORS and Session
app.use(cors({
    origin: [process.env.CLIENT_URL], 
    credentials: true,
    optionsSuccessStatus: 204,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
}));
if(process.env.NODE_ENV === "production"){
    app.set("trust proxy",1);
}
app.use(session({
    secret:process.env.APP_SECRET,
    resave:process.env.RESAVE,
    saveUninitialized:process.env.SAVE_UN,
    store:sessionStore,
    cookie:{
        httpOnly:true,
        sameSite:process.env.SAME_SITE,
        secure:process.env.NODE_ENV === 'production',
        maxAge:3600000
    }
}))
app.use(passport.initialize())
app.use(passport.session())
// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter)
app.post('/payment/webhook',webhook)
// csrfProtection
app.use(csrfSynchronisedProtection)
// route definitions
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/payment',paymentRouter)

module.exports = app;
