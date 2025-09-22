const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'dev-secret';
function sign(payload, opts = {}){
  return jwt.sign(payload, secret, { expiresIn: opts.expiresIn || '1h' });
}
function verify(token){
  return jwt.verify(token, secret);
}
module.exports = { sign, verify };
