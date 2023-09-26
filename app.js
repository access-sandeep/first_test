const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksData = require('./routes/books');
const categories = require('./routes/categories');
const addbookform = require('./routes/addbookform');
const addbookaction = require('./routes/addbookaction');
const savecategory = require('./routes/savecategory');
const editbooksData = require('./routes/editbooks');
const addbookimageaction = require('./routes/addbookimageaction');
const removeImage = require('./routes/removeImage');

const app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(jsonParser);
app.use((req, res, next)=>{
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/booksdata', booksData);
app.use('/categories', categories);
app.use('/editbooksdata', editbooksData);
app.use('/addbookform', addbookform);
app.use('/addbookaction', addbookaction);
app.use('/savecategory', savecategory);
app.use('/addbookimageaction', addbookimageaction);
app.use('/removeimage', removeImage);

module.exports = app;
