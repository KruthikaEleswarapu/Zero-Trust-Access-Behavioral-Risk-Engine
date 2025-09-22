const mongoose = require('mongoose');
const riskEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  action: { type: String, required: true },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('RiskEvent', riskEventSchema);
