const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use();









app.listen(3000, () => {
    console.log('Listening on port 3000');
  });