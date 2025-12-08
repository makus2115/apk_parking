const path = require("path");
const crypto = require("crypto");

async function start() {
  // json-server 1.x jest modułem ESM bez domyślnego wejścia, więc korzystamy z konkretnych ścieżek.
  const { createApp } = await import("json-server/lib/app.js");
  const { Low } = await import("lowdb");
  const { JSONFile } = await import("lowdb/node");

  const PORT = process.env.MOCK_API_PORT || 3050;
  const dbFile = path.join(__dirname, "db.json");
  const adapter = new JSONFile(dbFile);
  const db = new Low(adapter, { users: [], sessions: [] });

  await db.read();
  db.data ||= { users: [], sessions: [] };

  const app = createApp(db, { logger: false });

  app.post("/login", (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email i haslo sa wymagane" });
    }

    const users = db.data?.users || [];
    const user = users.find(
      (u) =>
        u.email?.toLowerCase() === String(email).toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "Nieprawidlowe dane logowania" });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const session = { token, userId: user.id, createdAt: Date.now() };

    db.data.sessions = [session, ...(db.data.sessions || [])];
    void db.write();

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  });

  app.listen(PORT, () => {
    console.log(`Mock API (json-server) slucha na http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Mock API failed to start:", err);
  process.exit(1);
});
