const jsonServer = require("json-server");
const path = require("path");
const crypto = require("crypto");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const PORT = process.env.MOCK_API_PORT || 3001;

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email i hasło są wymagane" });
  }

  const users = router.db.get("users").value();
  const user = users.find(
    (u) => u.email?.toLowerCase() === String(email).toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
  }

  const token = crypto.randomBytes(16).toString("hex");
  const session = { token, userId: user.id, createdAt: Date.now() };

  router.db.get("sessions").push(session).write();

  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

server.use(router);

server.listen(PORT, () => {
  console.log(`Mock API (json-server) słucha na http://localhost:${PORT}`);
});
