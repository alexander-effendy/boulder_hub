const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// -------------------------------------------------------------- //
// ---------------------------- USER ---------------------------- //
// -------------------------------------------------------------- //
app.post('/createaccount', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    await pool.query(query, [username, email, password]);
    res.status(200).send('Account created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating account');
  }
});

/*
curl -X POST http://localhost:3000/createaccount \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alex",
    "email": "alex@example.com",
    "password": "password123"
  }'
*/

app.get('/getuser', async (req, res) => {
  const { username } = req.query;
  try {
    const query = 'SELECT * from users WHERE username = $1';
    const result = await pool.query(query, [username]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Search user error');
  }
});

// curl "http://localhost:3000/getuser?username=alex"


// -------------------------------------------------------------- //
// ---------------------------- GYM ----------------------------- //
// -------------------------------------------------------------- //
app.post('/create_gym', async (req, res) => {
  const { name, location } = req.body;
  try {
    const query = 'INSERT INTO gyms (name, location) VALUES ($1, $2)';
    await pool.query(query, [name, location]);
    res.status(200).send('Gym created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating gym');
  }
});

/*
curl -X POST http://localhost:3000/create_gym \
  -H "Content-Type: application/json" \
  -d '{
    "name": "9 Degrees Waterloo",
    "location": "Sydney"
  }'
*/


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
