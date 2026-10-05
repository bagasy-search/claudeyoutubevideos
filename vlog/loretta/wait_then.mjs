// Espera a que exista <archivo> (sondeo cada 60 s) y recién ahí corre el comando: node vlog/loretta/wait_then.mjs <archivo> <cmd> [args…]
import fs from "node:fs"; import { spawnSync } from "node:child_process";
const [, , file, cmd, ...args] = process.argv;
while (!fs.existsSync(file)) await new Promise((r) => setTimeout(r, 60000));
console.log(new Date().toISOString(), "listo", file, "→", cmd, args.join(" "));
process.exit(spawnSync(cmd, args, { stdio: "inherit", windowsHide: true }).status ?? 1);
