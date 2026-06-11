const fs = require("fs/promises");
const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const linkToken = process.env.PRIVATE_LINK_TOKEN;
const dataFile = process.env.DATA_FILE || path.join(__dirname, "data", "sizing.json");

app.use(express.json({ limit: "2mb" }));

function isAuthorized(req) {
  if (!linkToken) return false;
  return req.header("x-access-token") === linkToken;
}

async function readDocument() {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function writeDocument(data) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2) + "\n", "utf8");
}

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.get("/api/sizing", async (req, res, next) => {
  try {
    if (!isAuthorized(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.json({ data: await readDocument() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/sizing", async (req, res, next) => {
  try {
    if (!isAuthorized(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!req.body || typeof req.body.data !== "object" || Array.isArray(req.body.data)) {
      res.status(400).json({ error: "Expected JSON object in data" });
      return;
    }

    await writeDocument(req.body.data);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(__dirname, {
  extensions: ["html"]
}));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Indi redesign sizing is running on port ${port}`);
});
