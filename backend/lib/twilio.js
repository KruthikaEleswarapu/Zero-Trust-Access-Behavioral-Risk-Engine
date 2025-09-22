const SID = process.env.TWILIO_SID;
const TOKEN = process.env.TWILIO_TOKEN;
const FROM = process.env.TWILIO_FROM || '+15005550006';
let client = null;
if (SID && TOKEN) {
  const twilio = require('twilio');
  client = twilio(SID, TOKEN);
}
async function sendSms(to, body) {
  if (client) {
    return client.messages.create({ to, from: FROM, body });
  }
  console.log(`[mock-sms] to=${to} body=${body}`);
  return Promise.resolve({ sid: 'MOCK-SID' });
}
module.exports = { sendSms };
