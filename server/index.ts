import { createHash, createHmac, timingSafeEqual } from "crypto";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // Site-wide login (override credentials via env vars on the host)
  const authUser = process.env.SITE_USER || "nada";
  const authPass = process.env.SITE_PASS || "nada1122";
  const sessionToken = createHmac("sha256", authPass)
    .update(`${authUser}:${authPass}`)
    .digest("hex");
  const publicPaths = new Set(["/login", "/mewa-logo.jpg", "/vision2030.png"]);

  // Constant-time string compare (hash first so lengths always match)
  const safeEqual = (a: string, b: string) =>
    timingSafeEqual(
      createHash("sha256").update(a).digest(),
      createHash("sha256").update(b).digest()
    );

  const isAuthenticated = (req: express.Request) => {
    const cookie = (req.headers.cookie || "")
      .split(";")
      .map(part => part.trim())
      .find(part => part.startsWith(`${COOKIE_NAME}=`));
    return (
      !!cookie && safeEqual(cookie.slice(COOKIE_NAME.length + 1), sessionToken)
    );
  };

  // Only allow same-site relative redirects after login
  const safeNext = (next: unknown) =>
    typeof next === "string" && /^\/(?![\/\\])/.test(next) ? next : "/";

  app.set("trust proxy", 1);

  app.get("/login", (req, res) => {
    if (isAuthenticated(req)) return res.redirect(safeNext(req.query.next));
    res.sendFile(path.join(staticPath, "login.html"));
  });

  app.post("/login", express.urlencoded({ extended: false }), (req, res) => {
    const { username = "", password = "", next } = req.body ?? {};
    const userOk = safeEqual(String(username).trim(), authUser);
    const passOk = safeEqual(String(password), authPass);
    const target = safeNext(next);
    if (!(userOk && passOk)) {
      return res.redirect(
        303,
        `/login?error=1&next=${encodeURIComponent(target)}`
      );
    }
    res.cookie(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: req.secure,
      maxAge: ONE_YEAR_MS / 12,
      path: "/",
    });
    res.redirect(303, target);
  });

  app.get("/logout", (_req, res) => {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.redirect("/login");
  });

  app.use((req, res, next) => {
    if (publicPaths.has(req.path) || isAuthenticated(req)) return next();
    if (req.method === "GET" && req.accepts("html")) {
      return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
    }
    res.status(401).send("Authentication required");
  });

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
