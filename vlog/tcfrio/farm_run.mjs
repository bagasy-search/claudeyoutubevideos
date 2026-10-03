import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tcfrio/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tcfrio", "Tcfrio", "16348", "60", "@_tcfrio_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tcfrio-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tcfrio/farm.log", `\n[farm_run] exit ${c}\n`); });
