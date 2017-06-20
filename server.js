const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const MAINTENANCE = false;
require('./hbsHelpers/nestedOperations');
var app = express();

app.set('view engine', 'hbs');
// middleware
// it runs in order of app.use calls
// express middleware example
app.use((req, res, next) => {
  var log = `${new Date().toString()}: ${req.method}, ${req.url}`
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) console.log("can't append to server.log")
  });
  next(); // only when you call next will the middleware be done
});

app.use((req, res, next) => {
  if (MAINTENANCE) res.render('maintenance.hbs',{})
  else next();
})

app.use(express.static(`${__dirname}/public`)); // load in static resources from public dir (e.g css/js etc.)

hbs.registerPartials(`${__dirname}/views/partials`)

app.get(
  '/',
  (req, res) => {
    res.render('home.hbs', {
      pageTitle: 'Home Page',
      welcomeMessage: 'Welcome to this bad ass website, fam.',
    });
  }
)
app.get(
  '/exampleUsingJson',
  (req, res) => {
    res.send({name: 'Fred', likes: ['Pizza', 'Kick boxing']})
  })


app.get(
  '/about',
  (req, res) => {
    res.render('about.hbs', {
      pageTitle: 'About Page',
    });
  }
)

app.get(
  '/bad',
  (req, res) => {
    res.send({ errorMessage: "can't handle request" })
  }
)

app.listen(3000, () => {
  console.log('server is up on port 3000')
});
