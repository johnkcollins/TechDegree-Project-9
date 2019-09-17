'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const Sequelize = require('sequelize');

//SEQUELIZE
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './fsjstd-restapi.db',
  logging: false
});

const db = {sequelize, Sequelize, models: {}};
db.models.User = require('./models/User')(sequelize);
db.models.Course = require('./models/Course')(sequelize);
const {User, Course} = db.models;

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

//This array is used to keep track of user records as they are created
let users = [];
let courses = [];
let messages = [];

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here
sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

//Async Handler
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      messages.length = 0;
      if (err.name === 'SequelizeValidationError') {
        messages = err.errors.map(err => err.message);
        console.error('Validation errors: ', messages);
        res.render('error');
      }
    }
  }
}

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


//Returns the current authenticated user
app.get('/api/users', asyncHandler(async (req, res) => {
  //return authenticated user
  let users = await User.findAll();
  res.json(users);
  res.status(200).end();
}));

app.post('/api/users'
//     [
//   check('firstName')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('Please provide a value for "first name"'),
//   check('lastName')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('Please provide a value for "last name"'),
//   check('emailAddress')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('Please provide a value for "email"')
//       .isEmail()
//       .withMessage('Please provide a valid email address for "email"'),
//   check('password')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('Please provide a value for "password"')
//       .isLength({ min: 8, max: 20 })
//       .withMessage('Please provide a value for "password" that is between 8 and 20 characters in length'),
//   check('passwordConfirmation')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('Please provide a value for "passwordConfirmation"')
//       .custom((value, { req }) => {
//         // Only attempt to compare the `password` and `passwordConfirmation`
//         // fields if they have values.
//         if (value && req.body.password && value !== req.body.password) {
//           throw new Error('Please provide values for "password" and passwordConfirmation" that match');
//         }
//
//         // Return `true` so the default "Invalid value" error message
//         // doesn't get returned
//         return true;
//       }),
// ]
    , (req, res) => {
      // Attempt to get the validation result from the Request object.
      // const errors = validationResult(req);

      // If there are validation errors...
      if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);

        // Return the validation errors to the client.
        res.status(400).json({errors: errorMessages});
      } else {
        // Get the user from the request body.
        const user = req.body;

        // Add the user to the `users` array.
        users.push(user);
        res.status(201).end();
        res.redirect('/');
      }
    });

//Returns the current authenticated user
app.get('/api/courses', asyncHandler(async (req, res) => {
      let courses = await Course.findAll();
      //return courses
      res.json(courses);
      res.status(200).end();
    }
));

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
