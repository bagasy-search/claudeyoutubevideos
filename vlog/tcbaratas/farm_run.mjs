import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tcbaratas/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tcbaratas", "Tcbaratas", "15950", "60", "@_tcbaratas_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tcbaratas-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tcbaratas/farm.log", `\n[farm_run] exit ${c}\n`); });
