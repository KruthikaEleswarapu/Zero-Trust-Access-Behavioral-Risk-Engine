const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwtLib = require('../lib/jwt');
const { decideAction } = require('../lib/policy');
const RiskEvent = require('../models/RiskEvent');
const { anomalyScores } = require('../lib/metrics');
router.post('/ingest', async (req, res) =>{
  const { token, events, meta } = req.body;
  if (!token) return res.status(400).json({ error: 'no-token' });
  let payload;
  try { payload = jwtLib.verify(token); } catch(e){ return res.status(401).json({ error: 'invalid-token' }); }
  const userId = payload.sub;
  const redis = req.app.get('redis');
  const features = extractFeatures(events, meta);
  try{
    const resp = await axios.post(process.env.ANOMALY_SERVICE_URL, { userId, features });
    const score = resp.data.score;
    const action = decideAction(score, { meta });
    const event = new RiskEvent({ userId, score, action: action.action, meta });
    await event.save();
    await redis.set(`risk:${userId}`, JSON.stringify({ score }), 'EX', 300);
    anomalyScores.observe(score);
    return res.json({ score, action });
  }catch(err){
    console.error('anomaly call failed', err.message);
    return res.status(500).json({ error: 'anomaly-failed' });
  }
});
function extractFeatures(events = [], meta = {}){
  const keystrokes = events.filter(e => e.type === 'keystroke').map(e => e.payload.interval).filter(Boolean);
  const meanInterval = keystrokes.length ? keystrokes.reduce((a,b)=>a+b,0)/keystrokes.length : 0;
  const eventCount = events.length;
  const uaHash = meta.ua ? (meta.ua.length % 100) : 0;
  const ipHash = meta.ip ? (meta.ip.split('.').reduce((a,b)=>a+parseInt(b||0,10),0) % 100) : 0;
  return { meanInterval, eventCount, uaHash, ipHash };
}
module.exports = router;
