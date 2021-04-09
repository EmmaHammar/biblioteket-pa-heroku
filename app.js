var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let booksRouter = require('./routes/books');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

//FRÅGA: Varför görs detta i app.js och inte i books.js eller egen fil?  Detta kan göras i books.js men då måste vi ha XX före? 
//visa mer info om specifik bok, genom att skicka parametern id
// app.get('/books/:id', function(req, res) {
//     let showBook = req.params.id;

//     res.send("Visa info om bok nr: " + showBook);
// })

module.exports = app;
