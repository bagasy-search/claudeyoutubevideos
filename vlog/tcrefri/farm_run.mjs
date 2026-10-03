import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tcrefri/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tcrefri", "Tcrefri", "17147", "60", "@_tcrefri_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tcrefri-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tcrefri/farm.log", `\n[farm_run] exit ${c}\n`); });
