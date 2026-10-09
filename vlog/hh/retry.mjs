// Re-corre un comando hasta que salga 0 (cortes de red: fetch failed / ConnectTimeout). node vlog/hh/retry.mjs <intentos> <cmd> [args…]
import { spawnSync } from "node:child_process";
const [, , n, cmd, ...args] = process.argv;
for (let t = 1; t <= +n; t++) {
  console.log(new Date().toISOString(), `▶ intento ${t}/${n}:`, cmd, args.join(" "));
  const r = spawnSync(cmd, args, { stdio: "inherit", windowsHide: true });
  if (r.status === 0) process.exit(0);
  console.log(new Date().toISOString(), "✗ exit", r.status, "→ espero 60 s");
  await new Promise((res) => setTimeout(res, 60000));
}
process.exit(1);
