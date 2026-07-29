import fs from "node:fs";

const slug = "v7ior5j7vkw9";
const plan = JSON.parse(fs.readFileSync(`_v3/${slug}_plan.json`, "utf8"));
const personalImages = plan.secciones
  .flatMap((s) => s.momentos)
  .filter((m) => m.tipo === "imagen" && m.personal);

const prompts = personalImages.map((m, i) => {
  const suffix = i === 2 ? "02b" : String(i).padStart(2, "0");
  const name = `${slug}_personal_${suffix}`;
  return {
    name,
    ref: `public/ref_${slug}.png`,
    prompt:
      `Natural candid phone photograph, 16:9 landscape. Keep the EXACT SAME young Amish man and facial identity from the reference image: Levi Lapp, short dark beard without moustache, simple straw hat, plain muted blue work shirt, dark suspenders. Lancaster vegetable garden beside a weathered wooden barn, real tomato plants and real soil. Scene requested: ${m.muestra} Warm imperfect available light, casual framing, subtle sensor grain, believable skin and hands, slightly uneven homemade composition, documentary realism. NO 3D, NO render, NO glossy advertising, NO illustration, NO fantasy, NO readable text, NO watermark, NO extra fingers.`,
  };
});

const map = personalImages.map((m, i) => ({
  beat: m.name,
  ms: m.ms,
  dur: m.seg,
  file: `img/${slug}_personal_${i === 2 ? "02b" : String(i).padStart(2, "0")}.png`,
  dice: m.dice,
  personal: true,
  reason:
    "Momento personal/demostrativo: usa la cara del avatar como referencia para no inventar otra identidad.",
}));

fs.writeFileSync(
  `_v3/${slug}_image_prompts.json`,
  JSON.stringify(prompts, null, 2),
);
fs.writeFileSync(`_v3/${slug}_image_map.json`, JSON.stringify(map, null, 2));
console.log(`imágenes personales: ${prompts.length}`);
