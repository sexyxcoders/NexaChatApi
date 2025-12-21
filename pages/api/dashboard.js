import clientPromise from "../../lib/db";

export default async function handler(req, res) {
  const db = (await clientPromise).db("nexa");

  const accounts = await db
    .collection("accounts")
    .find()
    .sort({ created_at: -1 })
    .toArray();

  const targets = await db
    .collection("targets")
    .find()
    .sort({ created_at: -1 })
    .toArray();

  res.json({ accounts, targets });
}