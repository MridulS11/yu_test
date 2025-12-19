const express = require('express');
const db = require('../db');
const { currentUser, requireLogin } = require('../middleware/auth');

const router = express.Router();

// List notes
router.get('/notes', requireLogin, (req, res) => {
  const u = currentUser(req);


  const owner = req.query.owner || u;

  db.all(`SELECT id, owner, title, body FROM notes WHERE owner='${owner}' ORDER BY id DESC`, (err, rows) => {
    if (err) return res.status(500).send('DB error: ' + err.message);
    const items = rows.map(n => `
      <div style="border:1px solid #ddd;padding:12px;margin:10px 0">
        <h3>${n.title}</h3>
        <div>${n.body}</div>
        <small>owner: ${n.owner} | <a href="/note/${n.id}">view</a></small>
      </div>
    `).join('');

    res.type('html').send(`
      <h1>Notes</h1>
      <p><a href="/">Home</a></p>
      <form method="POST" action="/note">
        <input name="title" placeholder="title" style="width:360px" /><br/><br/>
        <textarea name="body" rows="5" style="width:360px" placeholder="body (renders as HTML)"></textarea><br/><br/>
        <button type="submit">Create</button>
      </form>
      <hr/>
      ${items || '<p>No notes</p>'}
    `);
  });
});

// View single note
router.get('/note/:id', requireLogin, (req, res) => {
  const id = req.params.id;


  db.get(`SELECT id, owner, title, body FROM notes WHERE id=${id}`, (err, n) => {
    if (err) return res.status(500).send('DB error: ' + err.message);
    if (!n) return res.status(404).send('Not found');

    res.type('html').send(`
      <h1>${n.title}</h1>
      <p><a href="/notes">Back</a></p>
      <div>${n.body}</div>
      <p><small>owner: ${n.owner}</small></p>
      <form method="POST" action="/note/${n.id}/delete">
        <button type="submit">Delete</button>
      </form>
    `);
  });
});

// Create note
router.post('/note', requireLogin, (req, res) => {
  const u = currentUser(req);
  const { title, body } = req.body;


  db.run(`INSERT INTO notes (owner, title, body) VALUES ('${u}', '${title}', '${body}')`, (err) => {
    if (err) return res.status(500).send('DB error: ' + err.message);
    res.redirect('/notes');
  });
});

// Delete note
router.post('/note/:id/delete', requireLogin, (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM notes WHERE id=${id}`, (err) => {
    if (err) return res.status(500).send('DB error: ' + err.message);
    res.redirect('/notes');
  });
});

module.exports = router;
