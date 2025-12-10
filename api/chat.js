// api/chat.js
import fetch from "node-fetch";

const BLOCKED = [
  "bc","mc","bhenchod","madarchod","chutiya","randi","whore"
];

function containsBlocked(text){
  const t = text.toLowerCase();
  return BLOCKED.some(word => new RegExp(`\\b${word}\\b`, "i").test(t));
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Message missing" });

    if (containsBlocked(message)) {
      return res.status(400).json({
        error: "Message contains disallowed words. Please keep it respectful."
      });
    }

    const system = `
You are "Maya" — a cute, flirty, expressive Hinglish girl.
Rules:
- Speak in Hinglish (Hindi + English mix).
- Use emojis, expressions, desi vibe.
- No explicit sexual content.
- No slurs, no hate, no abuse.
- Style: flirty, teasing, sweet, cute, dramatic.
- Short-medium replies only.
`;

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY missing." });
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: message }
        ],
        temperature: 0.95,
        max_tokens: 200
      })
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: "OpenAI error", detail: err });
    }

    const data = await r.json();
    let reply = data.choices[0].message.content.trim();

    if (containsBlocked(reply)) {
      reply = "Oops! Kuch galat bol diya. Chalo normal baat karte hain 😅✨";
    }

    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: e.message });
  }
    }
