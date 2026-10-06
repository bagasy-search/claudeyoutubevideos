// Lanza un proceso DESACOPLADO (sobrevive al agente) con log a disco: node vlog/rhonda/bg.mjs <log> <cmd> [args...]
// ⛔ Va por wscript + .vbs con ventana OCULTA (0): el proceso tiene consola propia invisible y sus hijos (ffmpeg, ffprobe…)
// la heredan. Con spawn detached (DETACHED_PROCESS, sin consola) cada hijo de consola abría una terminal que parpadeaba.
import { spawn } from "node:child_process"; import fs from "node:fs"; import path from "node:path"; import os from "node:os";
const [, , log, cmd, ...args] = process.argv;
const q = (s) => (/[\s"&|<>^]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
const line = `cmd /d /c "cd /d ${q(process.cwd())} && ${[cmd, ...args].map(q).join(" ")} >> ${q(path.resolve(log))} 2>&1"`;
const vbs = path.join(os.tmpdir(), `bg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.vbs`);
fs.writeFileSync(vbs, `CreateObject("WScript.Shell").Run ${JSON.stringify(line).replace(/\\"/g, '""')}, 0, False\n`);
const p = spawn("wscript.exe", [vbs], { detached: true, windowsHide: true, stdio: "ignore" }); p.unref();
console.log("lanzado oculto →", log);
