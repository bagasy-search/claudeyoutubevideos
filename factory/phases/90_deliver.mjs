// 90_deliver — re-encode de entrega (CFR, tv/bt709, GOP 2 s, audio = WAV MÁSTER mono→estéreo con pan),
// compuertas de entrega, hoja de contactos para UNA revisión de visión, release con ?v=N y (opcional) Bagasy.
// ⛔ Nunca sube a YouTube (--no-youtube siempre): el creador sube la FINAL.
import fs from "node:fs";
import path from "node:path";
import { run, durSec } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { gh, releaseAsset, releaseAssetPublic } from "../lib/gh.mjs";
import { diskFreeGB, BlockedError } from "../lib/budget.mjs";
import { NeedsError } from "../lib/phase.mjs";
import { ROOT, env } from "../lib/env.mjs";
import { REPO } from "./80_render.mjs";

const mezclaDe = (P) => { const f = path.join(P.work, "audio", `${P.slug}_mix.wav`); return fs.existsSync(f) ? f : null; };

export default {
  id: "90_deliver",
  deps: ["80_render"],
  inputs: ({ P, state }) => [P.rawMp4, P.wav, mezclaDe(P), P.meta, state.get("80_render")?.runId || ""],
  async run({ slug, spec, P, state, log }) {
    if (!fs.existsSync(P.meta)) throw new NeedsError("falta el meta (título/descripción: creativo)", `Escribí ${P.meta} ({title, description, tags}) y: node factory/run.mjs run ${slug} --from 90_deliver`);
    const libre = await diskFreeGB("D");
    if (libre < 2) throw new BlockedError(`D: con ${libre.toFixed(1)} GB: no entra el re-encode`);
    // máster de audio: la MEZCLA (voz + efectos + sonido de clips, estéreo) si la armó 60_build; si no, la voz.
    const mix = mezclaDe(P);
    const MASTER = mix || P.wav;
    if (mix) log(`audio de entrega = máster de MEZCLA (${path.basename(mix)})`);
    const wavSec = await durSec(P.wav);
    fs.mkdirSync(path.dirname(P.finalMp4), { recursive: true });
    // Codificador: NVENC (RTX de la máquina) si está, si no libx264. Mismo contrato de entrega: CFR, tv/bt709,
    // GOP 2 s, SIN B-frames (pts==dts: el "lageado" real), audio = máster. FACTORY_ENCODER=x264 fuerza CPU.
    // ⛔ que ffmpeg LISTE h264_nvenc no alcanza (15-sep-2026: driver con API 12.2, ffmpeg pide 13.1 → no abre):
    // se prueba abriendo el encoder con 1 segundo sintético.
    const nvenc = env("FACTORY_ENCODER") !== "x264" && (await run("ffmpeg", ["-v", "error", "-f", "lavfi", "-i", "testsrc=s=320x180:d=1:r=30", "-c:v", "h264_nvenc", "-f", "null", "-"], { timeoutMs: 60_000, allowFail: true })).code === 0;
    const vcodec = nvenc
      ? ["-c:v", "h264_nvenc", "-preset", "p5", "-tune", "hq", "-rc", "vbr", "-cq", "21", "-b:v", "5M", "-maxrate", "6M", "-bufsize", "12M", "-bf", "0", "-g", "60", "-profile:v", "high"]
      : ["-c:v", "libx264", "-preset", "faster", "-crf", "21", "-maxrate", "6M", "-bufsize", "12M", "-g", "60", "-keyint_min", "60", "-sc_threshold", "0", "-threads", "0"];   // todos los hilos: 120 s de video 69 s → 32 s (Ryzen 7 6800H, 15-sep-2026)
    const t0 = Date.now();
    // re-encode ya hecho y POSTERIOR al render crudo → no se repite (reanudación tras un fallo de compuerta/subida).
    // ⛔ (18-sep-2026) mtime + tamaño NO alcanzan: un re-encode cortado a mitad deja un mp4 SIN moov, más nuevo que
    //    el crudo y de 489 MB, y esta rama lo daba por bueno para siempre (cmecaja murió así en check_entrega).
    //    Ahora se EXIGE que ffprobe lo lea y que dure lo que tiene que durar; y el encode escribe en .part y recién
    //    al terminar renombra, así una corrida interrumpida no deja nunca un archivo trunco en el nombre final.
    let yaHecho = false;
    if (fs.existsSync(P.finalMp4) && fs.statSync(P.finalMp4).mtimeMs > fs.statSync(P.rawMp4).mtimeMs && fs.statSync(P.finalMp4).size > 1e7) {
      try {
        const dPrev = await durSec(P.finalMp4);
        yaHecho = Math.abs(dPrev - wavSec) <= 1;
        log(yaHecho ? `re-encode de entrega ya hecho (${dPrev.toFixed(1)} s, posterior al render): no se repite`
                    : `entrega en disco dura ${dPrev.toFixed(1)} s y se esperaban ${wavSec.toFixed(1)}: la rehago`);
      } catch (e) { log(`entrega en disco ILEGIBLE (${String(e.message || e).replace(/\s+/g, " ").slice(0, 90)}): la rehago`); }
    }
    const parcial = P.finalMp4 + ".part";
    if (!yaHecho) { try { fs.unlinkSync(parcial); } catch { /* no estaba */ } }
    if (!yaHecho) await run("ffmpeg", ["-v", "error", "-y", "-i", P.rawMp4, "-i", MASTER, "-map", "0:v:0", "-map", "1:a:0",
      "-vf", "setpts=N/30/TB,scale=in_range=full:out_range=limited:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p", "-fps_mode", "passthrough",
      "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
      ...vcodec,
      "-af", mix ? "aformat=channel_layouts=stereo" : "pan=stereo|c0=c0|c1=c0", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", String(wavSec), "-movflags", "+faststart",
      // ⛔ el archivo de salida es "<final>.mp4.part": ffmpeg infiere el formato por EXTENSION y ".part" no le
      // dice nada -> "Unable to choose an output format". Medido en tfbsilicona (entrega frenada). Va explicito.
      "-f", "mp4", parcial], { timeoutMs: 3 * 3600_000 });
    if (!yaHecho) {
      const dPart = await durSec(parcial);   // si el .part no se deja leer, acá revienta y el nombre final queda intacto
      assertMeasured("entregaDesvioSec", +Math.abs(dPart - wavSec).toFixed(3), { max: 1, allowZero: true, log });
      fs.renameSync(parcial, P.finalMp4);
      log(`re-encode de entrega con ${nvenc ? "NVENC (GPU)" : "libx264 (CPU)"}: ${Math.round((Date.now() - t0) / 1000)} s`);
    }

    await run("node", ["scripts/check_entrega.mjs", P.finalMp4], { cwd: ROOT, timeoutMs: 30 * 60_000 });
    const pts = await run("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "frame=pts_time", "-of", "csv=p=0", P.finalMp4], { timeoutMs: 60 * 60_000 });
    // ⛔ (15-sep-2026) una línea VACÍA de ffprobe daba Number("") = 0 → un cuadro "0" de más y un salto falso.
    const v = pts.stdout.split(/\r?\n/).map((x) => x.replace(/[,\s]/g, "")).filter((x) => x !== "" && x !== "N/A").map(Number).filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
    let saltos = 0;
    for (let i = 1; i < v.length; i++) if (Math.abs(v[i] - v[i - 1] - 1 / 30) > 0.004) saltos++;
    assertMeasured("cuadrosEntrega", v.length, { min: Math.floor(wavSec * 30) - 3, log });
    assertMeasured("saltosPts", saltos, { max: 0, allowZero: true, log });
    const bd = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", P.finalMp4, "-vf", "scale=320:-2,blackdetect=d=0.5:pix_th=0.10", "-an", "-f", "null", "-"], { timeoutMs: 60 * 60_000 });
    const negros = (bd.stderr.match(/black_start/g) || []).length;
    assertMeasured("tramosNegros", negros, { max: 1, allowZero: true, log });

    const audit = path.join(P.work, "audit");
    fs.mkdirSync(audit, { recursive: true });
    await run("ffmpeg", ["-v", "error", "-y", "-i", P.finalMp4, "-vf", `fps=1/${Math.max(10, Math.round(wavSec / 48))},scale=320:-2,tile=8x6`, "-frames:v", "1", path.join(audit, "hoja.jpg")], { timeoutMs: 60 * 60_000 });

    const repo = REPO();
    const size = fs.statSync(P.finalMp4).size;
    const rel = await gh(["release", "view", slug, "-R", repo], { allowFail: true, log });
    if (rel.failed) await gh(["release", "create", slug, "-R", repo, "--title", slug, "--notes", "entrega de la fábrica"], { log });
    await gh(["release", "upload", slug, P.finalMp4, "-R", repo, "--clobber"], { log, timeoutMs: 2 * 3600_000 });
    // verificación por la URL pública (no gasta la API); si no da el tamaño, recién ahí la API
    let a = await releaseAssetPublic(repo, slug, `${slug}.mp4`);
    if (!a.size) a = await releaseAsset(repo, slug, `${slug}.mp4`, { log });
    log(`release: ${a.size} bytes publicados · local ${size}`);
    assertMeasured("releaseBytesIguales", a.size === size ? 1 : 0, { min: 1, log });
    // re-entregas: la versión arranca DESPUÉS de la ya usada (FACTORY_V_START), si no el navegador sirve la vieja de caché.
    // ⛔ `state.get("90_deliver")` NO sirve para esto: cuando esta función corre, la fase YA se marcó
    // `running` y su `medido` anterior se perdió, así que la cuenta daba 0+1=1 SIEMPRE. Medido 21-sep
    // en tdccadena: la segunda entrega (avatar re-sincronizado, mp4 distinto byte a byte) volvió a
    // salir con `?v=1` y la tarjeta quedó apuntando a una URL que el navegador ya tenía cacheada —
    // justo el defecto que este sufijo existe para evitar. El número vive ahora en un sidecar propio.
    const verFile = path.join(P.workDir || audit, `${slug}_entrega_version.json`);
    let previa = 0;
    try { previa = Number(JSON.parse(fs.readFileSync(verFile, "utf8")).version) || 0; } catch { /* primera entrega */ }
    const version = Math.max(previa + 1, Number(env("FACTORY_V_START") || 1));
    fs.mkdirSync(path.dirname(verFile), { recursive: true });
    fs.writeFileSync(verFile, JSON.stringify({ version, ts: new Date().toISOString() }));
    const url = `https://github.com/${repo}/releases/download/${slug}/${slug}.mp4?v=${version}`;

    // el mensaje dice CUÁL de las dos cosas falta y cómo se arregla: "sin spec.bagasy o FACTORY_DELIVER≠1"
    // obligaba a adivinar, y con la tarjeta sin enganchar el video queda entregado a medias.
    let bagasy = !spec.bagasy
      ? 'no: al spec le falta el bloque `bagasy` ({ channelKey, cardId }) — se pone con `new --card <cardId> --channel <clave>` o a mano, y se re-entrega'
      : 'no: falta FACTORY_DELIVER=1';
    if (spec.bagasy && env("FACTORY_DELIVER") === "1") {
      await run("node", ["scripts/deliver_card.mjs", spec.bagasy.channelKey, spec.bagasy.cardId, slug, "--no-youtube"], { cwd: ROOT, timeoutMs: 30 * 60_000, env: { MP4_SUFIJO: `?v=${version}` } });
      bagasy = "entregado (--no-youtube)";
    }
    log(`✅ ENTREGA ${slug}: ${url} · hoja de contactos ${path.join(audit, "hoja.jpg")} · Bagasy: ${bagasy}`);
    return { url, version, bytes: size, durSec: +(await durSec(P.finalMp4)).toFixed(2), saltosPts: saltos, tramosNegros: negros, hoja: path.join(audit, "hoja.jpg"), bagasy };
  },
};
