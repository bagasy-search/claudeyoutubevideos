import { spawn } from "node:child_process"; import fs from "node:fs";
const out = fs.openSync("vlog/plregadera/voz_full.log", "a");
const ch = spawn("python", ["fish_factory.py", "--script", "guiones/plregadera.txt", "--voice", "claudio_definitiva", "--out", "D:/Proyectos/video2-wt/plregadera/out/plregadera", "--concurrency", "3", "--block-chars", "900", "--temperature", "0.7", "--top-p", "0.7"], { stdio: ["ignore", out, out], windowsHide: true });
ch.on("exit", c => fs.appendFileSync("vlog/plregadera/voz_full.log", `\n[voz] exit ${c}\n`));
