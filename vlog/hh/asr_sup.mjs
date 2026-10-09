// Supervisor del ASR: si la cadena de voz de un slug murió sin terminar (log con "falló:" y sin out/voz_<slug>.done),
// re-corre SÓLO el ASR + alineación (voz.py --solo-asr, 10 intentos), de a uno, hasta que estén los 10. node vlog/hh/asr_sup.mjs
import fs from "node:fs"; import { spawnSync } from "node:child_process";
process.chdir("D:/Proyectos/video2-wt/lhh/");
const SL = ["hhdollar", "hhwinter", "hhexpire", "hhfreeze", "hhgrocery", "hhscraps", "hhvinegar", "hhperox", "hhtoilet", "hhnever"];
const PY = "C:/Users/bauti/AppData/Local/Programs/Python/Python311/python.exe";
for (;;) {
  const falta = SL.filter((s) => !fs.existsSync(`out/voz_${s}.done`));
  if (!falta.length) { console.log("ASR completo de los 10"); break; }
  for (const s of falta) {
    const log = fs.existsSync(`out/voz_${s}.log`) ? fs.readFileSync(`out/voz_${s}.log`, "utf8") : "";
    if (!/falló:/.test(log.slice(-600)) || !fs.existsSync(`public/${s}.wav`)) continue;
    if (!fs.existsSync(`public/${s}_16k.wav`)) spawnSync("ffmpeg", ["-v", "error", "-y", "-i", `public/${s}.wav`, "-ac", "1", "-ar", "16000", `public/${s}_16k.wav`], { windowsHide: true });
    console.log(new Date().toISOString(), "▶ re-ASR", s);
    fs.appendFileSync(`out/voz_${s}.log`, "\n[asr_sup] relanzo ASR\n");
    spawnSync(PY, ["vlog/hh/voz.py", s, "--solo-asr"], { stdio: "inherit", windowsHide: true, env: { ...process.env, VOZ_TRIES: "10", PYTHONUTF8: "1" } });
  }
  await new Promise((r) => setTimeout(r, 60000));
}
