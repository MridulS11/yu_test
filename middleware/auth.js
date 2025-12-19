/**
 * ❌ Example issue for reference: INTENTIONALLY INSECURE AUTH
 * Uses a cookie that directly stores the username; no signing, no expiry, no HttpOnly/SameSite/Secure.
 */
function currentUser(req) {
  return req.cookies.session || null;
}

function requireLogin(req, res, next) {
  if (!currentUser(req)) return res.status(401).send('Login required');
  next();
}

module.exports = { currentUser, requireLogin };
