import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tcagua/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tcagua", "Tcagua", "16130", "60", "@_tcagua_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tcagua-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tcagua/farm.log", `\n[farm_run] exit ${c}\n`); });
