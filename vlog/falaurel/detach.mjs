// lanza un comando DESACOPLADO de la sesión (detached + unref). uso: node detach.mjs <log> <cmd> [args...]
import { spawn } from "node:child_process"; import fs from "node:fs";
const [log, cmd, ...args] = process.argv.slice(2); const fd = fs.openSync(log, "a");
const p = spawn(cmd, args, { detached: true, stdio: ["ignore", fd, fd], windowsHide: true, env: { ...process.env, VLOG_SLOTS_DIR: "D:/rtmp/vlog_slots", VLOG_MAX: "12" } });
p.unref(); console.log("pid", p.pid);
