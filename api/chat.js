import fetch from "node-fetch";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST only"});

  const { message } = req.body || {};
  if(!message) return res.status(400).json({error:"Message missing"});

  const prompt = `
You are "Maya", a flirty, expressive Indian Hinglish girl.
Rules:
- Hinglish, local expressions, cute, teasing.
- Emojis allowed.
- No explicit sexual content.
- Keep replies short to medium.
User said: "${message}"
Reply:`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage", {
    method:"POST",
    headers:{
      "Authorization": `Bearer ${process.env.GOOGLE_API_KEY}`,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      prompt: { text: prompt },
      temperature: 0.9,
      maxOutputTokens: 200
    })
  });

  if(!response.ok){
    const text = await response.text();
    return res.status(500).json({error:"Google AI error", detail:text});
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content || "Oops, try again 😅";

  return res.status(200).json({reply});
}