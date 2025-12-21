import clientPromise from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { target, intendedCount } = req.body;
  if (!target)
    return res.status(400).json({ error: "Target required" });

  const db = (await clientPromise).db("nexa");

  await db.collection("targets").insertOne({
    target,
    intendedCount: Number(intendedCount || 0),
    created_at: new Date()
  });

  res.json({ ok: true });
}