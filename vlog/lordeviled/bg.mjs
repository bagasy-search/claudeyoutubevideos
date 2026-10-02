// Lanza un proceso DESACOPLADO (sobrevive al agente) con log a disco: node vlog/lordeviled/bg.mjs <log> <cmd> [args...]
import { spawn } from "node:child_process"; import fs from "node:fs";
const [, , log, cmd, ...args] = process.argv;
const fd = fs.openSync(log, "a");
const p = spawn(cmd, args, { detached: true, windowsHide: true, stdio: ["ignore", fd, fd], cwd: process.cwd() });
p.unref(); console.log("PID", p.pid, "→", log);
