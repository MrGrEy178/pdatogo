const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');

// load config
dotenv.config({path: path.join(__dirname, 'config', 'config.env')});

// initialize express
const app = express();

// connect db
mongoose.connect(process.env.MONGO_URI);

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// handlebars
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require(path.join(__dirname, 'routes', 'index')));

const PORT = process.env.PORT || 5000;

app.listen(PORT);