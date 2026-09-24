import { S1_S3 } from "./scenes/s1_s3.mjs";
import { S4_S6 } from "./scenes/s4_s6.mjs";
import { S7_S11 } from "./scenes/s7_s11.mjs";
import { EXTRA } from "./scenes/extra.mjs";
export const SCENES = [...S1_S3, ...S4_S6, ...S7_S11];
for (const x of EXTRA) {
  const s = SCENES.find(s => s.lines.some(l => l.id === x.after)); if (!s) throw new Error("after? " + x.after);
  const i = s.lines.findIndex(l => l.id === x.after); const { after, ...l } = x; s.lines.splice(i + 1, 0, l);
}
