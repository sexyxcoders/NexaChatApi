import { useEffect, useState } from "react";

export default function Home() {
  const [session, setSession] = useState("");
  const [target, setTarget] = useState("");
  const [count, setCount] = useState("");
  const [data, setData] = useState({ accounts: [], targets: [] });

  async function load() {
    const r = await fetch("/api/dashboard");
    setData(await r.json());
  }

  async function addAccount() {
    await fetch("/api/add-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session })
    });
    setSession("");
    load();
  }

  async function addTarget() {
    await fetch("/api/add-target", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, intendedCount: count })
    });
    setTarget("");
    setCount("");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="container">
      <h1>Nexa Account & Target Tracker</h1>

      <section>
        <h3>Add Account (Session)</h3>
        <input
          value={session}
          onChange={e => setSession(e.target.value)}
          placeholder="session string"
        />
        <button onClick={addAccount}>Add Account</button>
      </section>

      <section>
        <h3>Add Target</h3>
        <input
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="username / channel / group / id"
        />
        <input
          value={count}
          onChange={e => setCount(e.target.value)}
          placeholder="intended count"
        />
        <button onClick={addTarget}>Add Target</button>
      </section>

      <section>
        <h3>Accounts</h3>
        <ul>
          {data.accounts.map(a => (
            <li key={a._id}>
              {a.session_hash.slice(0, 12)}… — {a.status}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Targets</h3>
        <ul>
          {data.targets.map(t => (
            <li key={t._id}>
              {t.target} — intended: {t.intendedCount}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}