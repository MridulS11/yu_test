const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const q = `SELECT username, role FROM users WHERE username='${username}' AND password='${password}'`;
  db.get(q, (err, row) => {
    if (err) return res.status(500).send('DB error: ' + err.message);
    if (!row) return res.status(401).send('Invalid credentials');
    res.cookie('session', row.username);
    res.cookie('role', row.role);       
    res.redirect('/');
  });
});

router.post('/register', (req, res) => {
  const { username, password, email, ssn } = req.body;


  const q = `INSERT INTO users (username, password, email, role, ssn)
             VALUES ('${username}', '${password}', '${email}', 'user', '${ssn || ''}')`;

  db.run(q, (err) => {
    if (err) {
      if (String(err.message).includes('UNIQUE')) return res.status(409).send('Username already exists');
      return res.status(500).send('DB error: ' + err.message);
    }
    res.redirect('/');
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.clearCookie('role');
  res.redirect('/');
});

module.exports = router;
