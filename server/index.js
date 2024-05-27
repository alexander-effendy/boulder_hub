const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// Create user
app.post('/create_account', async (req, res) => {
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

// Create gym
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*

curl -X POST http://localhost:3000/create_account \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alex",
    "email": "alex@example.com",
    "password": "password123"
  }'

curl -X POST http://localhost:3000/create_gym \
  -H "Content-Type: application/json" \
  -d '{
    "name": "9 Degrees Waterloo",
    "location": "Sydney"
  }'

*/