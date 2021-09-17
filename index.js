'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
app.locals.moment = require('moment');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  req.countdowns = JSON.parse(req.cookies.countdowns || '[]')

  next()
})

app.get('/', (req, res) => {
  res.render('events', {
    today: moment().format('YYYY-MM-DDTHH:mm'),
    minDate: moment().format('YYYY-MM-DDTHH:mm'),
    maxDate: moment().add(7, 'day').format('YYYY-MM-DDTHH:mm'),
    countdowns: req.countdowns,
    moment: moment
  });
});


app.post('/events', (req, res) => {
  req.countdowns.push({
    name: req.body.name || 'Unknown',
    time: req.body.time || moment().add(1, 'minute').format('YYYY-MM-DDTHH:mm')
  });

  res.cookie('countdowns', JSON.stringify(req.countdowns), {
    maxAge: 24 * 60 * 60,
    httpOnly: true
  });

  res.redirect('/');

});


app.get('/reset', (req, res) => {
  req.countdowns = [];

  res.cookie('countdowns', JSON.stringify(req.countdowns), {
    maxAge: 24 * 60 * 60,
    httpOnly: true
  });

  res.redirect('/');

});

app.listen(3000, 'localhost', () => {
  console.log('Listening on port 3000');
});