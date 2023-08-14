var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var agreementsRouter = require('./routes/agreements');
var submissionsRouter = require('./routes/submissions');
var balancesRouter = require('./routes/balances');
var adminRouter = require('./routes/admin');

var app = express();

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/agreements', agreementsRouter);
app.use('/submissions', submissionsRouter);
app.use('/balances', balancesRouter);
app.use('/admin', adminRouter);

module.exports = app;
