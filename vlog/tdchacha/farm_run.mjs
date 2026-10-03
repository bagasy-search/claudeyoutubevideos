import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/tdchacha/farm.log", "a");
const ch = spawn("node", ["scripts/farm.mjs", "tdchacha", "Tdchacha", "23742", "60", "@_tdchacha_assets.txt"], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, FARM_REF: "tdchacha-render" } });
ch.on("exit", c => { fs.appendFileSync("vlog/tdchacha/farm.log", `\n[farm_run] exit ${c}\n`); });
