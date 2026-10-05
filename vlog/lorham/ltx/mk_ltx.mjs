// Listas del lote LTX-2.5 desde los planes M1/MV (anclas ya hechas). node vlog/lorham/ltx/mk_ltx.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lorham/";
const out = { a2v: [], i2v: [] };
// frames (8n+1 a 24 fps) = lo que dura la toma más larga que usa el clip + 0,6 s de cola (tope 10 s = 241)
const SH = JSON.parse(fs.readFileSync(R + "_v3/lorham_shots.json", "utf8")).shots;
const need = {}; for (const s of SH) if (s.kind === "kf") need[s.name] = Math.max(need[s.name] || 0, s.dur);
const DET = new Proxy({}, { get: (_, id) => Math.min(241, Math.max(73, Math.ceil(((need[id] || 4) + 0.6) * 24 / 8) * 8 + 1)) });
const WAV = JSON.parse(fs.readFileSync(R + "_v3/lorham_m1.json", "utf8"));
for (const plan of ["M1"]) {
  const P = JSON.parse(fs.readFileSync(R + `vlog/lorham/${plan}/plan.json`, "utf8"));
  for (const c of P.clips) {
    const ancla = (id) => R + `vlog/lorham/${plan}/anc/${id}.png`;
    if (c.audio) {
      const dur = WAV[c.id].e - WAV[c.id].s;
      out.a2v.push({ id: c.id, image: ancla(c.a), audio: R + "vlog/lorham/ltx/aud/" + c.id + ".wav", dur: +dur.toFixed(2), seed: 7,
        prompt: `${P.look} ${c.action} She is the woman of the first frame, same face, same glasses, same lilac cardigan, pearl necklace and floral apron with green trim, and the same kitchen. Her voice is the audio: she is speaking warmly in American English to her grandson behind the camera, lips in sync with the audio, natural small head movements and gestures with her old hands, real skin.` });
    } else {
      out.i2v.push({ id: c.id, image: ancla(c.a), frames: DET[c.id] || 97, seed: 7,
        prompt: `${P.look} Close-up on the kitchen table, only hands and food, her face is out of frame. ${c.d1}, then ${c.d2}. One continuous slow handheld shot, real home-kitchen sounds only: ${c.sound}. Absolutely no dialogue, no voices, no mumbling, no music, nobody speaks.` });
    }
  }
}
fs.writeFileSync(R + "_v3/ltx_a2v.json", JSON.stringify(out.a2v, null, 1));
fs.writeFileSync(R + "_v3/ltx_i2v.json", JSON.stringify(out.i2v, null, 1));
console.log("a2v", out.a2v.length, "i2v", out.i2v.length, out.a2v.map((x) => x.id + ":" + x.dur).join(" "));
