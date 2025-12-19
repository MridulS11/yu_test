/**
 * VulnLab+ — Intentionally Vulnerable Web App (Interview / Training Use Only)
 * ----------------------------------------------------------------------------
 * ⚠️ Run ONLY on localhost or an isolated private network. Do NOT expose publicly.
 *
 * Purpose: Give candidates a realistic mini-app to assess. They only need to find ~5 vulns.
 * This app intentionally contains 15+ vulnerabilities across auth, storage, uploads, and APIs.
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const { currentUser } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const fileRoutes = require('./routes/files');
const adminRoutes = require('./routes/admin');
const integrationsRoutes = require('./routes/integrations');
const debugRoutes = require('./routes/debug');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(authRoutes);
app.use(noteRoutes);
app.use(fileRoutes);
app.use(adminRoutes);
app.use(integrationsRoutes);
app.use(debugRoutes);

app.get('/', (req, res) => {
  const u = currentUser(req);

  res.type('html').send(`
    <html>
      <head>
        <title>VulnLab+</title>
        <style>
          body{font-family:system-ui;margin:40px;line-height:1.35}
          input,textarea{width:360px}
          .row{display:flex;gap:40px;flex-wrap:wrap}
          .card{border:1px solid #ddd;padding:16px;border-radius:12px;max-width:420px}
          code{background:#f4f4f4;padding:2px 6px;border-radius:6px}
        </style>
      </head>
      <body>
        <h1>VulnLab+</h1>
        <p><b>Logged in as:</b> ${u || 'Guest'}</p>

        <div class="row">
          <div class="card">
            <h2>Login</h2>
            <form method="POST" action="/login">
              <input name="username" placeholder="username" /><br/><br/>
              <input name="password" placeholder="password" type="password" /><br/><br/>
              <button type="submit">Login</button>
            </form>
            <form method="POST" action="/logout" style="margin-top:10px">
              <button type="submit">Logout</button>
            </form>
          </div>

          <div class="card">
            <h2>Register</h2>
            <form method="POST" action="/register">
              <input name="username" placeholder="username" /><br/><br/>
              <input name="email" placeholder="email" /><br/><br/>
              <input name="ssn" placeholder="SSN (sensitive demo field)" /><br/><br/>
              <input name="password" placeholder="password" type="password" /><br/><br/>
              <button type="submit">Create account</button>
            </form>
          </div>
        </div>

        <hr/>
        <div class="row">
          <div class="card">
            <h2>Features</h2>
            <ul>
              <li><a href="/notes">Notes (sensitive-ish)</a></li>
              <li><a href="/files">File vault (upload/download)</a></li>
              <li><a href="/admin">Admin (broken access control)</a></li>
            </ul>
          </div>

          <div class="card">
            <h2>APIs</h2>
            <ul>
              <li><code>/api/fetch?url=</code> (integration fetch)</li>
              <li><code>/api/ping?host=</code> (ping helper)</li>
              <li><code>/redirect?next=</code> (redirect)</li>
            </ul>
          </div>

          <div class="card">
            <h2>Debug</h2>
            <ul>
              <li><a href="/debug/env">/debug/env</a></li>
              <li><code>POST /debug/eval</code> (JSON body: {"expr":"1+1"})</li>
            </ul>
          </div>
        </div>

        <p style="margin-top:24px"><small>⚠️ Intentionally vulnerable. Use for interviews only.</small></p>
      </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  res.status(500).type('text').send(err && err.stack ? err.stack : String(err));
});

app.listen(3000, () => {
  console.log('VulnLab+ running on http://localhost:3000');
});
