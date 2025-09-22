function decideAction(riskScore, userContext = {}){
  if (riskScore > 0.8) return { action: 'block', reason: 'high risk' };
  if (riskScore > 0.5) return { action: 'step-up', reason: 'require_otp' };
  return { action: 'allow' };
}
module.exports = { decideAction };
