const fs = require("fs");
const files = process.argv.slice(2);
const PROHIB = /cinematic|photorealistic|35\s?mm|bokeh|\b8k\b|golden hour|highly detailed|shallow depth|soft focus|blurred background|stock photo/i;
const VIEJA = /grainy|dull colors|muted colors|nothing polished|low saturation|soft muted/i;
const FORMULA = /true-to-life colors|sharp focus|no filter|no ai look/i;
const PROFUND = /deep depth of field|whole room in focus|nothing blurred out|background cluttered/i;
const PERSONA = /\b(man|he |his |hands|middle-aged|presenter|claudio|guy)\b/i;
const EMOCION = /\b(smil\w*|frown\w*|surpris\w*|eyebrow\w*|squint\w*|grimac\w*|wide eyes|leaning|laugh\w*|worried|concentrat\w*|puzzl\w*|mouth open|talking|explaining|gesturing|pointing)\b/i;
const ACCION = /\b(clamping|holding|turning|opening|kneeling|writing|pressing|unplugging|plugging|measuring|reading|crouch\w*|wiping|carrying|lifting|screw\w*|flipping|checking)\b/i;

for (const f of files) {
  let d;
  try { d = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { console.log("ERR", f, e.message); continue; }
  const arr = (Array.isArray(d) ? d : d.items || []).filter((x) => x && typeof x.prompt === "string" && x.prompt.length);
  if (!arr.length) { console.log("=== " + f + " -> 0 prompts con texto (de " + (Array.isArray(d) ? d.length : "?") + " filas)"); continue; }
  const L = arr.map((x) => x.prompt.length).sort((a, b) => a - b);
  const q = (p) => L[Math.min(L.length - 1, Math.floor(L.length * p))];
  const pct = (n) => (100 * n / arr.length).toFixed(0) + "%";
  const c = (re) => arr.filter((x) => re.test(x.prompt)).length;
  console.log("=== " + f + "  (" + arr.length + " prompts con texto, de " + (Array.isArray(d) ? d.length : "?") + " filas)");
  console.log("   largo: min " + L[0] + " | p25 " + q(0.25) + " | mediana " + q(0.5) + " | p75 " + q(0.75) + " | max " + L[L.length - 1]);
  console.log("   persona en cuadro : " + c(PERSONA) + " (" + pct(c(PERSONA)) + ")");
  console.log("   emocion/gesto     : " + c(EMOCION) + " (" + pct(c(EMOCION)) + ")");
  console.log("   accion concreta   : " + c(ACCION) + " (" + pct(c(ACCION)) + ")");
  console.log("   formula definitiva: " + c(FORMULA) + " (" + pct(c(FORMULA)) + ")");
  console.log("   clausula profund. : " + c(PROFUND) + " (" + pct(c(PROFUND)) + ")");
  console.log("   tokens PROHIBIDOS : " + c(PROHIB));
  console.log("   formula VIEJA     : " + c(VIEJA));
  console.log("   --- 3 prompts al azar ---");
  for (const i of [0, Math.floor(arr.length / 2), arr.length - 1]) {
    console.log("   [" + (arr[i].name || i) + "] " + arr[i].prompt.slice(0, 300).replace(/\s+/g, " "));
  }
  console.log("");
}
