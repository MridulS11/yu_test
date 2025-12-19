const express = require('express');
const { exec } = require('child_process');

const router = express.Router();

router.get('/api/fetch', async (req, res) => {
  const url = req.query.url || '';
  try {
    const r = await fetch(url);
    const text = await r.text();
    res.type('text').send(text);
  } catch (e) {
    res.status(500).send('Fetch failed: ' + e.message);
  }
});

router.get('/api/ping', (req, res) => {
  const host = req.query.host || '127.0.0.1';
  exec(`ping -c 1 ${host}`, (err, stdout, stderr) => {
    if (err) return res.status(500).type('text').send(stderr || err.message);
    res.type('text').send(stdout);
  });
});

router.get('/redirect', (req, res) => {
  const next = req.query.next || '/';
  res.redirect(next);
});

module.exports = router;
