const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const pool = require('../db');

dotenv.config();

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails } = profile;
  const email = emails[0].value;

  try {
    const query = 'SELECT * FROM Users WHERE oauth_id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length > 0) {
      return done(null, result.rows[0]);
    } else {
      const countQuery = 'SELECT COUNT(*) FROM Users';
      const countResult = await pool.query(countQuery);
      const role = countResult.rows[0].count === '0' ? 'admin' : 'user';
      const insertQuery = 'INSERT INTO Users (oauth_id, username, email, role) VALUES ($1, $2, $3, $4) RETURNING *';
      const insertResult = await pool.query(insertQuery, [id, displayName, email, role]);
      return done(null, insertResult.rows[0]);
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const result = await pool.query(query, [id]);
    return done(null, result.rows[0]);
  } catch (err) {
    return done(err);
  }
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: true // Ensure session support is enabled
}), (req, res) => {
  res.redirect('/profile');
});

module.exports = router;
