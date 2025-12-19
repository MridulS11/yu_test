const express = require('express');

const router = express.Router();

router.get('/debug/env', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    secretKey: process.env.SECRET_KEY,
    databaseUrl: process.env.DATABASE_URL
  });
});

// (NOT a real-world safe pattern; intentionally unsafe)
router.post('/debug/eval', (req, res) => {
  const expr = (req.body && req.body.expr) || '';
  try {
  
    // eslint-disable-next-line no-eval
    const out = eval(expr);
    res.json({ ok: true, out });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

module.exports = router;
