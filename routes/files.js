const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { currentUser, requireLogin } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '..', 'uploads'),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB
});

router.get('/files', requireLogin, (req, res) => {
  const u = currentUser(req);
  const files = fs.readdirSync(path.join(__dirname, '..', 'uploads'), { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name);

  res.type('html').send(`
    <h1>File Vault</h1>
    <p><a href="/">Home</a></p>
    <p><b>User:</b> ${u}</p>

    <h3>Upload a file</h3>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>

    <h3>Browse uploads</h3>
    <ul>
      ${files.map(f => `<li><a href="/uploads/${f}">${f}</a></li>`).join('')}
    </ul>

    <h3>Download by name</h3>
    <form method="GET" action="/download">
      <input name="name" placeholder="filename" />
      <button type="submit">Download</button>
    </form>
  `);
});

router.post('/upload', requireLogin, upload.single('file'), (req, res) => {

  console.log('UPLOAD:', req.file);


  res.redirect('/files');
});

router.get('/download', requireLogin, (req, res) => {
  const name = req.query.name || '';
  const base = path.join(__dirname, '..', 'uploads');
  const target = path.join(base, name);

  fs.readFile(target, (err, data) => {
    if (err) return res.status(404).send('Not found');
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    res.send(data);
  });
});

module.exports = router;
