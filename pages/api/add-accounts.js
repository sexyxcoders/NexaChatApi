import clientPromise from "../../lib/db";
import { hashSession } from "../../lib/hash";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { session } = req.body;
  if (!session)
    return res.status(400).json({ error: "Session required" });

  const db = (await clientPromise).db("nexa");
  const sessionHash = hashSession(session);

  const exists = await db
    .collection("accounts")
    .findOne({ session_hash: sessionHash });

  if (exists)
    return res.json({ ok: true, message: "Already exists" });

  await db.collection("accounts").insertOne({
    session_hash: sessionHash,
    status: "unchecked",
    created_at: new Date()
  });

  res.json({ ok: true });
}