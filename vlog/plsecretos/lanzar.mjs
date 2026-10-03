// lanzar.mjs <log> <cmd> [args...] — arranca un proceso largo SIN ventana y con log a disco (sobrevive al cierre de la app).
import { spawn } from "node:child_process"; import fs from "node:fs";
const [, , log, cmd, ...args] = process.argv;
const out = fs.openSync(log, "a");
const ch = spawn(cmd, args, { stdio: ["ignore", out, out], windowsHide: true, env: process.env });
fs.writeFileSync(log + ".pid", String(ch.pid));
ch.on("exit", c => { fs.appendFileSync(log, `\n[lanzar] exit ${c}\n`); process.exit(0); });
