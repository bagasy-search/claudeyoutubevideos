// PROBE v3 — una sola miniatura para validar el molde antes de rehacer las 9.
// Estructura del molde ganador del canal: Bastida a la DERECHA, la CONSECUENCIA fea
// en macro abajo-izquierda, y el texto arriba-izquierda. La foto amenaza, no decora.
import fs from "node:fs";
import "dotenv/config";

const KEY = process.env.OPENAI_API_KEY;
const OUT = "_basthumbs/raw";
fs.mkdirSync(OUT, { recursive: true });

const ID = "The man on the right is EXACTLY the person in the reference image: a Latino man in his late 40s, dark curly hair, short greying beard and moustache, wearing a clean white doctor's coat over a plain brown sweater. Keep his exact face and identity.";

const LIGHT = "PHOTOGRAPHY: full-frame camera, 35mm lens, RAW colour, NEUTRAL white balance. Lit only by large SOFT DAYLIGHT from a window - broad soft key, gentle falloff, soft natural shadows. Realistic skin with visible pores. Looks like an unretouched documentary photograph.";

const NEG = "STRICTLY AVOID: no glowing objects, no neon, no rim glow, no HDR look, no heavy contrast, no oversaturated colours, no orange-and-teal grade, no yellow colour cast, no floating anatomical organ renders, no 3D CGI, no arrows, no checkmarks or crosses, no coloured boxes, no vignette. NO TEXT anywhere - no letters, no numbers, no captions, no watermark, no logo, no brands, no readable labels. Correct hands with five fingers.";

const LAYOUT = "COMPOSITION (obey strictly): horizontal 16:9. The doctor stands on the RIGHT THIRD of the frame. The LOWER-LEFT quadrant is filled by the second subject shot LARGE and MACRO, brutally close and detailed, so it reads instantly at thumbnail size. The UPPER-LEFT quadrant is calm, simple and slightly darker - empty space reserved for a caption, keep it free of detail.";

const scene =
  "A candid documentary photograph in a real kitchen. On the RIGHT, the doctor holds a simple ceramic cup of freshly poured dark tea, looking straight at the camera with a grave, warning expression - brow furrowed, lips pressed. " +
  "In the LOWER-LEFT, shot in unflinching MACRO and filling that whole area, a STAINLESS STEEL kidney-shaped medical tray lined with white surgical GAUZE, holding only THREE OR FOUR LARGE surgically removed KIDNEY STONES. " +
  "The stones are UNMISTAKABLY MEDICAL, never food: dark brown and blackish with rust-red blood staining, sharp jagged spiky staghorn shapes with crystalline points, wet and glistening, sitting on gauze that is faintly stained. " +
  "A pair of stainless steel surgical FORCEPS lies across the tray gripping one stone, which makes it read instantly as a clinical specimen. " +
  "The tray sits on the same wooden counter as the tea cup, so the connection between the tea and the stones is immediate. Lit by the same soft daylight, clinically real, unpleasant and detailed - repellent up close, never stylised, never appetising.";

const prompt = [scene, ID, LIGHT, LAYOUT, NEG].join("\n\n");

const fd = new FormData();
fd.set("model", "gpt-image-2");
fd.set("prompt", prompt);
fd.set("n", "1");
fd.set("size", "1792x1008");
fd.set("quality", "low");
fd.append("image[]", new Blob([fs.readFileSync("public/img/ref_bastida_small.png")], { type: "image/png" }), "ref.png");

const res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: fd });
if (!res.ok) { console.error("HTTP", res.status, (await res.text()).slice(0, 300)); process.exit(1); }
const d = (await res.json()).data?.[0];
const buf = d?.b64_json ? Buffer.from(d.b64_json, "base64") : Buffer.from(await (await fetch(d.url)).arrayBuffer());
fs.writeFileSync(`${OUT}/05_tes_v3b.png`, buf);
fs.writeFileSync("_bas_probe_v3_prompt.txt", prompt);
console.log("✓ 05_tes_v3b.png", Math.round(buf.length / 1024), "KB");
