import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/plinodoro/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "plinodoro", "Plinodoro", "12405", "60", "@_plinodoro_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "plinodoro-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/plinodoro/farm.log", `\n[farm_run] exit ${c}\n`); });
