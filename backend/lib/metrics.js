const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const otpRequests = new client.Counter({
  name: 'ztae_otp_requests_total',
  help: 'Total OTP requests',
});
const logins = new client.Counter({
  name: 'ztae_logins_total',
  help: 'Total successful logins',
});
const anomalyScores = new client.Histogram({
  name: 'ztae_anomaly_scores',
  help: 'Distribution of anomaly scores',
  buckets: [0, 0.25, 0.5, 0.75, 1.0]
});
register.registerMetric(otpRequests);
register.registerMetric(logins);
register.registerMetric(anomalyScores);
module.exports = { register, otpRequests, logins, anomalyScores };
