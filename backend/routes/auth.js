const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sendSms = require('../lib/twilio').sendSms;
const jwtLib = require('../lib/jwt');
const User = require('../models/User');
const { otpRequests, logins } = require('../lib/metrics');
const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_SEC || '300', 10);
router.post('/register', async (req, res) =>{
  const { username, password, phone } = req.body;
  if (!username || !password || !phone) return res.status(400).json({ error: 'missing' });
  try{
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, phone });
    await user.save();
    return res.json({ ok: true });
  }catch(err){
    console.error(err);
    return res.status(400).json({ error: 'user-exists' });
  }
});
router.post('/request-otp', async (req, res) =>{
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: 'no-user' });
  const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
  const redis = req.app.get('redis');
  await redis.set(`otp:${user._id}`, otp, 'EX', OTP_EXPIRY);
  await sendSms(user.phone, `Your ZTAE login OTP is ${otp}`);
  otpRequests.inc();
  return res.json({ ok: true });
});
router.post('/verify-otp', async (req, res) =>{
  const { username, otp } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: 'no-user' });
  const redis = req.app.get('redis');
  const stored = await redis.get(`otp:${user._id}`);
  if (!stored) return res.status(400).json({ error: 'expired' });
  if (stored !== otp) return res.status(400).json({ error: 'invalid' });
  await redis.del(`otp:${user._id}`);
  const token = jwtLib.sign({ sub: user._id, username: user.username }, { expiresIn: '2h' });
  logins.inc();
  return res.json({ token });
});
module.exports = router;
