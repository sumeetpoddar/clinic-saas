import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).json({ error: 'Missing "to" or "body"' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const client = twilio(accountSid, authToken);

  try {
    // Try sending WhatsApp first
    const message = await client.messages.create({
      body: body,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`
    });

    return res.status(200).json({ success: true, messageId: message.sid });
  } catch (error) {
    console.error('Twilio WhatsApp Error:', error.message);
    
    // Fallback to standard SMS
    try {
      const fallbackMsg = await client.messages.create({
        body: body,
        from: fromNumber,
        to: to
      });
      return res.status(200).json({ success: true, messageId: fallbackMsg.sid, type: 'sms_fallback' });
    } catch (fallbackError) {
      return res.status(500).json({ error: fallbackError.message });
    }
  }
}
