import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/plregadera/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "plregadera", "Plregadera", "17506", "60", "@_plregadera_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "plregadera-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/plregadera/farm.log", `\n[farm_run] exit ${c}\n`); });
