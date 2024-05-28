// const express = require('express');
// const pool = require('../db');
// const bodyParser = require('body-parser');
// const passport = require('passport');
// const dotenv = require('dotenv');
// const auth = require('./auth');

// dotenv.config();

// // Log environment variables to verify they are loaded
// console.log('GOOGLE_CLIENT_IDss:', process.env.GOOGLE_CLIENT_ID);
// console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_HOST:', process.env.DB_HOST);

// const app = express();
// // app.use(express.json());
// app.use(bodyParser.json());
// app.use(passport.initialize());

// app.use((req, res, next) => {
//   req.db = pool;
//   next();
// });

// // OAuth routes
// app.use('/auth', auth);

// // -------------------------------------------------------------- //
// // ---------------------------- USER ---------------------------- //
// // -------------------------------------------------------------- //
// app.post('/createaccount', async (req, res) => {
//   const { username, email } = req.body;
//   try {
//     const query = 'INSERT INTO Users (username, email) VALUES ($1, $2)';
//     await pool.query(query, [username, email]);
//     res.status(200).send('Account created successfully');
//   } catch (err) {
//     console.error('cibai', err);
//     res.status(500).send('Error creating account');
//   }
// });

// /*
// curl -X POST http://localhost:3000/createaccount \
//   -H "Content-Type: application/json" \
//   -d '{
//     "username": "alex",
//     "email": "alex@example.com",
//     "password": "password123"
//   }'
// */

// app.get('/getuser', async (req, res) => {
//   const { username } = req.query;
//   try {
//     const query = 'SELECT * from users WHERE username = $1';
//     const result = await pool.query(query, [username]);
//     if (result.rows.length > 0) {
//       res.status(200).json(result.rows[0]);
//     } else {
//       res.status(404).send('User not found');
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Search user error');
//   }
// });

// // curl "http://localhost:3000/getuser?username=alex"


// // -------------------------------------------------------------- //
// // ---------------------------- GYM ----------------------------- //
// // -------------------------------------------------------------- //
// app.post('/create_gym', async (req, res) => {
//   const { name, location } = req.body;
//   try {
//     const query = 'INSERT INTO gyms (name, location) VALUES ($1, $2)';
//     await pool.query(query, [name, location]);
//     res.status(200).send('Gym created successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error creating gym');
//   }
// });

// /*
// curl -X POST http://localhost:3000/create_gym \
//   -H "Content-Type: application/json" \
//   -d '{
//     "name": "9 Degrees Waterloo",
//     "location": "Sydney"
//   }'
// */

// // Start the server
// const port = process.env.PORT;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const auth = require('./auth'); // Import the auth routes
const pool = require('../db'); // Import your PostgreSQL pool configuration

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET, // Use the session secret from your .env file
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.db = pool;
  console.log('Session:', req.session);
  // console.log('User:', req.user);
  next();
});

app.use('/auth', auth); // Use the auth routes

app.get('/', (req, res) => {
  res.send('Welcome to the Boulder Hub app!');
});

// Protected route to get user profile
app.get('/profile', (req, res) => {
  console.log('Authenticated:', req.isAuthenticated());
  // console.log(req);
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// curl localhost:3000/auth
// curl localhost:3000/profile

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});