import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pzterm/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pzterm", "Pzterm", "20153", "60", "@_pzterm_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pzterm-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pzterm/farm.log", `\n[farm_run] exit ${c}\n`); });
