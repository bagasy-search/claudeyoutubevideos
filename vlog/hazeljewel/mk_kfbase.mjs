// fotos base (gpt-image-2, sin ref) de los 4 detalles keyframe de agnes 2.5 del minuto 1 → _v3/hz_kfbase.json
import fs from "node:fs";
import { BI, HOUSE } from "./dir_lib.mjs";
const L = [
  { name: "kf_rush", prompt: BI(`Inside ${HOUSE} the moment the front door opened: two men in their fifties in work vests, flannel shirts and jeans hurrying in fast through the open front door and across the living room straight toward a tall lit glass china cabinet full of silver and crystal on the right, one man already reaching out, a lamp, a sofa and a framed landscape painting on the left wall, daylight from the doorway.`) },
  { name: "kf_sticker", prompt: BI("Close view on an estate sale folding table covered with a bedsheet: a small shiny silver cream pitcher standing among old glass dishes and a brass candlestick, an older woman's hand with the wrist entering from the right edge holding a little round white price sticker with $2 written in marker just above the pitcher, other price stickers on nearby items, daylight from a window.") },
  { name: "kf_stamp", prompt: BI("Close view on a worn wooden worktable under a white swing-arm magnifier lamp: an older woman's hands in a rolled-up denim sleeve hold a small silver cream pitcher turned upside down under the round magnifier lens, the flat bottom of the pitcher facing up with small stamped hallmark letters, white cotton gloves and a loupe beside it.") },
  { name: "kf_magnet", prompt: BI("Close view on a worn wooden worktable with a white cloth: a thin gold-colored chain lying in loose curves, a small red horseshoe magnet held a few centimeters above it by an older woman's hand whose wrist enters from the top edge, a jeweler's loupe and a few rings at the side, daylight from a window on the left.") },
];
fs.writeFileSync("_v3/hz_kfbase.json", JSON.stringify(L, null, 1));
console.log(L.length);
