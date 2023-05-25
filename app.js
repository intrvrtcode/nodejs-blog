require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const session = require('express-session');

const connectDB = require('./server/config/db');
const {isActiveRoute, addGreeting} = require('./server/helpers/routeHelpers');

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'))

app.use(session({
  secret: 'NodeJs Blog Page by Intrvrtcode',
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  unset: 'destroy'
}))

app.use(express.static('public'));

// Template Engine
app.use(expressLayout);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;
app.locals.greeting = addGreeting();

app.use('/', require( './server/routers/main'));
app.use('/', require('./server/routers/admin'));

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
})
