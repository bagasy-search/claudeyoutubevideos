// Listas del lote LTX-2.5 desde M1/plan.json (anclas ya hechas) → _v3/<slug>_ltx_a2v.json / _ltx_i2v.json. SLUG=x node vlog/loretta/mk_ltx.mjs
import fs from "node:fs";
import { R, SLUG, V3, J, W } from "./env.mjs";
const SH = J(V3 + "shots.json").shots, M1 = J(V3 + "m1.json"), P = J(R + `vlog/${SLUG}/M1/plan.json`);
const need = {}; for (const s of SH) if (s.kind === "kf") need[s.name] = Math.max(need[s.name] || 0, s.dur);
const frames = (id) => Math.min(241, Math.max(73, Math.ceil(((need[id] || 4) + 0.6) * 24 / 8) * 8 + 1));
const anc = (id) => R + `vlog/${SLUG}/M1/anc/${id}.png`;
const a2v = [], i2v = [];
for (const c of P.clips) {
  if (!fs.existsSync(anc(c.a))) { console.log("⚠️ falta ancla", c.a); continue; }
  if (!c.detail) a2v.push({ id: c.id, image: anc(c.a), audio: R + `vlog/${SLUG}/ltx/aud/${c.id}.wav`, dur: +(M1[c.id].e - M1[c.id].s).toFixed(2), seed: 7,
    prompt: `${P.look} ${c.action} She is the woman of the first frame, same face, same glasses, same lilac cardigan, pearl necklace and floral apron with green trim, and the same kitchen. Her voice is the audio: she is speaking warmly in American English to her grandson behind the camera, lips in sync with the audio, natural small head movements and gestures with her old hands, real skin.` });
  else i2v.push({ id: c.id, image: anc(c.a), frames: frames(c.id), seed: 7,
    prompt: `${P.look} Close-up on the kitchen table, only hands and food, her face is out of frame. ${c.d1}, then ${c.d2}. One continuous slow handheld shot, real home-kitchen sounds only: ${c.sound}. Absolutely no dialogue, no voices, no mumbling, no music, nobody speaks.` });
}
W(V3 + "ltx_a2v.json", a2v); W(V3 + "ltx_i2v.json", i2v);
console.log("a2v", a2v.length, "i2v", i2v.length);
