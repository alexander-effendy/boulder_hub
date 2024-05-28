const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const auth = require('./auth');
const pool = require('../db');
const { append } = require('vary');

/*

WORKING ROUTES SO FAR:

1. User can create an account by logging in using Google Sign In
2. User can see the list of all users

3. Admin can add gym

4. Admin can add boulder into gym
5. Admin can remove boulder from gym

*/

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // cuz now http later https set to true ez
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use('/auth', auth); // use this first then /profile

app.get('/', (req, res) => {
  res.send('Welcome to the Boulder Hub app!');
});

// ---------------------------------------------------------------------- //
// -------------------------------- USER -------------------------------- //
// ---------------------------------------------------------------------- //

app.get('/profile', (req, res) => {
  console.log('Authenticated:', req.isAuthenticated());
  // console.log(req);
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/alluser', (req, res) => {
  if (req.isAuthenticated()) {
    const query = 'SELECT * FROM Users';
    pool.query(query, (err, result) => {
      if (err) {
        return res.status(500).send('Error in retrieving users');
      }
      res.status(200).json(result.rows);
    })
  } else {
    res.status(401).send('Unauthorized');
  }
})

// ---------------------------------------------------------------------- //
// -------------------------------- GYM --------------------------------- //
// ---------------------------------------------------------------------- //

app.post('/gym', (req, res) => {
  console.log('here is req: ', req);

  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden: Only admins can create gyms');
  }

  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).send('Name and location are required');
  }

  const query = 'INSERT INTO Gyms (name, location) VALUES ($1, $2) RETURNING *';
  pool.query(query, [name, location], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error creating gym');
    }
    res.status(201).json(result.rows[0]);
  });
});

// ---------------------------------------------------------------------- //
// ------------------------------ BOULDER ------------------------------- //
// ---------------------------------------------------------------------- //

app.post('/boulder', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden: Only admins can create gyms');
  }

  const { gym_id, color, grade, description } = req.body;
  if (!gym_id || !color || !grade) {
    return res.status(400).send('WARNING: All inputs need to be filled in');
  }

  const query = 'INSERT INTO boulders (gym_id, color, grade, description) VALUES ($1, $2, $3, $4) RETURNING *';
  pool.query(query, [gym_id, color, grade, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding boulder into the gym');
    }
    res.status(201).json(result.rows[0]);
  });
});

app.delete('/boulder', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden: Only admins can create gyms');
  }

  const { boulder_id } = req.body;

  if (!boulder_id) {
    return res.status(400).send('WARNING: Boulder id to be deleted cannot be found');
  }

  const query = 'DELETE FROM boulders where boulder_id = $1';
  pool.query(query, [boulder_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error removing boulder from the gym');
    }
    res.status(200).send('Boulder removed successfully');
  });
});

// ---------------------------------------------------------------------- //
// ------------------------------ COMMENT ------------------------------- //
// ---------------------------------------------------------------------- //

app.post('/comment', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  const { boulder_id, content } = req.body;
  if (!boulder_id || !content) {
    return res.status(400).send('User inputs fail to satisfy comment posting');
  }

  const query = 'INSERT INTO comments (boulder_id, user_id, content) VALUES ($1, $2, $3) RETURNING *';
  pool.query(query, [boulder_id, req.user.user_id, content], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Error: Fail to add comment for this boulder');
    }
    res.status(200).json(result.rows[0]);
  });
});

app.delete('/comment', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  const { comment_id } = req.body;

  const userId = req.user.user_id;

  const searchCommentQuery = 'select * from comments where comment_id = $1';
  pool.query(searchCommentQuery, [comment_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    if (result.rows.length === 0) {
      return res.status(404).send('Not found: Comment not found');
    }

    const comment = result.rows[0];
    console.log(comment);
    if (Number(comment.user_id) !== Number(userId)) {
      return res.status(403).send('Forbidden: This comment was not authored by user')
    }

    const deleteQuery = 'DELETE FROM comments where comment_id = $1';
    pool.query(deleteQuery, [comment_id], (err, result) => {
      if (err) {
        console.error('Internal Server Error');
        return res.status(500).send('Internal Server Error');
      }
      return res.status(200).send('Comment deleted successfully');
    })
  })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});