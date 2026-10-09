// Corre comandos EN SERIE (para lanzar desacoplado con bg.mjs): node chain.mjs "cmd1 args" "cmd2 args" ...
import { spawnSync } from "node:child_process";
for (const c of process.argv.slice(2)) {
  console.log(new Date().toISOString(), "▶", c);
  const r = spawnSync(c, { shell: true, stdio: "inherit", windowsHide: true });
  console.log(new Date().toISOString(), "◀ exit", r.status);
}
