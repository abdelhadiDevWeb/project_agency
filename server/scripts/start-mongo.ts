import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const dbPath = join(import.meta.dir, "..", ".data", "mongo");
mkdirSync(dbPath, { recursive: true });

const mongod =
  process.env.MONGOD_PATH ??
  "C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe";

const child = spawn(
  mongod,
  ["--dbpath", dbPath, "--port", "27017", "--bind_ip", "127.0.0.1"],
  { stdio: "inherit", windowsHide: true }
);

child.on("error", (err) => {
  console.error("Failed to start mongod:", err.message);
  console.error("Set MONGOD_PATH or start the MongoDB Windows service as admin.");
  process.exit(1);
});

child.on("exit", (code) => process.exit(code ?? 1));
