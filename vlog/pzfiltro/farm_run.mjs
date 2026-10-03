import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/pzfiltro/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "pzfiltro", "Pzfiltro", "19613", "60", "@_pzfiltro_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "pzfiltro-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/pzfiltro/farm.log", `\n[farm_run] exit ${c}\n`); });
