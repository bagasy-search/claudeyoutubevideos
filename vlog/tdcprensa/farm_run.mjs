import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tdcprensa/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tdcprensa", "Tdcprensa", "24624", "60", "@_tdcprensa_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tdcprensa-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tdcprensa/farm.log", `\n[farm_run] exit ${c}\n`); });
