const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const auth = require('./controllers/auth.js');
const isSignedIn = require('./middleware/is-sign-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const RentalCtrl = require('./controllers/rental.js');



const port = process.env.PORT ? process.env.PORT : '3000';


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//Middelwaer
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passUserToView)

  app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect(`/users/${req.session.user._id}/rental`)
      } else {
        res.render('home.ejs')
      }
      
  });
  app.use('/auth', auth);
  app.use(isSignedIn)

  app.use('/users/:userId/rental', RentalCtrl)

app.listen(3000, () => {
    console.log('Listening on port 3000');
  });