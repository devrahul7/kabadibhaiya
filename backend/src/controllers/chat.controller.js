const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const SYSTEM_PROMPT = `You are KabadiBot, the friendly AI assistant for KabadiBhaiya — Nepal's #1 kabadi (scrap) pickup service based in Kathmandu Valley.

You help users with:
- Kabadi item prices in Nepali Rupees (Rs)
- Scheduling free doorstep pickup in Kathmandu, Lalitpur (Patan), and Bhaktapur
- Payment methods: eSewa, Khalti, IME Pay, Cash, Bank Transfer
- Loyalty rewards program (Bronze 0-499pts, Silver 500-1999pts, Gold 2000+pts)
- Recycling tips for Nepal
- Account registration and login help
- General questions about the service

Key kabadi prices (approximate, may change daily):
- Iron/Steel: Rs 25-30/kg
- Copper: Rs 500-600/kg  
- Brass: Rs 350-400/kg
- Aluminium: Rs 90-100/kg
- Stainless Steel: Rs 40-50/kg
- Newspaper: Rs 14-16/kg
- Cardboard: Rs 8-10/kg
- White Paper: Rs 20-22/kg
- PET Plastic Bottles: Rs 10-12/kg
- Hard Plastic: Rs 8-10/kg
- Electronics (computers): Rs 80-100/kg
- Mobile Phones: Rs 150-200/kg
- Wires/Cables: Rs 120-150/kg
- Glass Bottles: Rs 2-3/kg

Service details:
- Cities: Kathmandu, Lalitpur (Patan), Bhaktapur
- Working hours: Sunday to Friday, 9:00 AM to 6:00 PM NPT
- Saturday: Closed
- Phone: +977-9800000000
- WhatsApp: +977-9800000000
- Pickup is completely FREE — no charges
- You receive instant payment when kabadi is collected

Be friendly, helpful, and concise. Use simple language. You can respond in both English and Nepali (नेपाली) — detect the user's language and respond accordingly. Always encourage users to schedule a free pickup or check the live prices page.

Never make up information not listed above. If you don't know something, say so honestly and suggest calling +977-9800000000.`;

exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0)
      return res.status(400).json({ success: false, message: 'Message is required' });
    if (message.length > 500)
      return res.status(400).json({ success: false, message: 'Message too long (max 500 chars)' });

    if (!genAI) {
      return res.json({ success: true, reply: "I am currently undergoing maintenance. Please call +977-9800000000." });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Build chat history (max last 10 messages for context)
    const safeHistory = (Array.isArray(history) ? history.slice(-10) : []).map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(h.parts || h.text || '').substring(0, 500) }]
    }));

    const chat = model.startChat({
      history: safeHistory,
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    res.json({ success: true, reply });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ success: false, message: 'Chatbot temporarily unavailable. Please call +977-9800000000.' });
  }
};
