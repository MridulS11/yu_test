const express = require('express');
const db = require('../db');
const { currentUser, requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin', requireLogin, (req, res) => {
  const u = currentUser(req);
  const role = req.cookies.role || 'user';

  if (role !== 'admin') {
    return res.status(403).type('html').send(`
      <h1>Forbidden</h1>
      <p>User ${u} is not admin.</p>
      <p><a href="/">Home</a></p>
    `);
  }


  db.all(`SELECT id, username, password, email, role, ssn FROM users`, (err, rows) => {
    if (err) return res.status(500).send('DB error: ' + err.message);
    const list = rows.map(r => `<li>${r.username} (${r.role}) — pass: ${r.password} — ssn: ${r.ssn}</li>`).join('');
    res.type('html').send(`
      <h1>Admin Panel</h1>
      <p><a href="/">Home</a></p>
      <ul>${list}</ul>
    `);
  });
});

module.exports = router;
