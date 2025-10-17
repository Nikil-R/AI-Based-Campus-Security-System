// utils/twilio.js
const Twilio = require("twilio");

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppMessage = async (to, body, mediaUrl = []) => {
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body,
    mediaUrl,
  });
};

module.exports = sendWhatsAppMessage;
