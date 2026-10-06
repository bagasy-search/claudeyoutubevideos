import fs from "node:fs";

const ID = "The man is EXACTLY the person in the reference image: a Latino man in his late 40s, dark curly hair, short greying beard and moustache, wearing a clean white doctor's coat over a plain brown sweater. Keep his exact face and identity, same nose, same eyes, same hairline.";

const LIGHT = "PHOTOGRAPHY: shot on a full-frame camera with a 35mm lens at f/2.8, RAW colour, NEUTRAL white balance. The only light is large SOFT DAYLIGHT coming through a window - broad soft key, gentle falloff, soft natural shadows with detail in them. Realistic skin with visible pores, fine lines and natural specular sheen. Everything looks like an unretouched documentary photograph.";

const NEG = "STRICTLY AVOID: no glowing objects, no neon, no rim glow, no lens flares, no HDR look, no heavy contrast, no oversaturated colours, no orange-and-teal grade, no yellow or amber colour cast, no floating anatomical organ renders, no 3D CGI elements, no arrows, no checkmarks or cross icons, no coloured boxes or panels, no vignette. Colours are natural and slightly restrained, like a real kitchen photo. NO TEXT of any kind anywhere in the image, no letters, no numbers, no captions, no watermark, no logo, no commercial brands, no readable packaging or labels - all containers are plain and unbranded. Correct human hands with exactly five fingers.";

const FRAME = "FRAMING: horizontal 16:9. He occupies the RIGHT side of the frame. The LEFT third is deliberately calm and slightly darker with a simple uncluttered background, empty space reserved for a caption to be added later - keep it free of important detail.";

const S = (scene) => scene + "\n\n" + ID + "\n\n" + LIGHT + "\n\n" + FRAME + "\n\n" + NEG;

const REF = ["public/img/ref_bastida_small.png"];

const items = [
  { name: "01_pescados", ref: REF, prompt: S(
    "A candid vlog-style photograph inside a real home kitchen. The doctor stands at a wooden counter holding up a fresh raw salmon fillet in one hand at chest height, while looking DOWN at the cutting board with his eyebrows raised and his mouth slightly open - a genuine 'wait, look at this' reaction caught mid-moment, NOT a posed smile, NOT looking at the camera. On the board in front of him lie a few fresh silver sardines and, clearly visible in the foreground, an OPEN PLAIN METAL TIN of preserved fish with its lid curled back. Daylight comes from a window on the left; the wet fish has a natural moist sheen from that window, not from any added glow.") },

  { name: "02_heladera", ref: REF, prompt: S(
    "A candid vlog-style photograph in a real family kitchen. The doctor stands in front of an OPEN REFRIGERATOR, leaning slightly forward and looking inside with genuine alarm on his face - furrowed brow, lips parted. With one hand he is pulling out a large PLAIN unlabelled bottle of dark cola. The fridge shelves behind are stocked with ordinary household food: packs of sliced cold cuts, processed cheese slices, plastic bottles. The pale interior fridge light mixes with soft daylight from a kitchen window; the overall image stays neutral and natural, never blue or clinical.") },

  { name: "03_limon", ref: REF, prompt: S(
    "A candid vlog-style photograph in a real kitchen, early morning. The doctor is caught MID-ACTION squeezing half a lemon over a tall clear glass of water that sits on the counter in sharp focus in the foreground; a thin stream of juice is falling. He has just lifted his eyes to the camera with his eyebrows raised, like someone sharing a secret. The window is behind him to the left, so soft daylight backlights the glass and the falling juice, giving them a natural bright edge - real backlight, absolutely no artificial glow. Another whole lemon rests on the counter. Nothing else on the counter.") },

  { name: "04_agua", ref: REF, prompt: S(
    "A candid vlog-style photograph at a real dining table. On the table in front of the doctor stands a very large two-litre glass jug full of water; he holds up a small ordinary drinking glass beside it with one hand, directly comparing the two sizes for the camera. His expression is sceptical - one eyebrow raised, mouth closed, his other hand open in a small 'hold on' gesture. Midday daylight from a side window rakes across the wooden table, casting long clean natural shadows from the jug and the glass.") },

  { name: "05_tes", ref: REF, prompt: S(
    "A candid vlog-style photograph in a real kitchen. The doctor is pouring hot tea from a plain kettle into a simple ceramic cup, and REAL VISIBLE STEAM rises from the cup, lit from behind by the window so the steam reads softly white - genuine backlit steam, not smoke effects. He glances sideways at the camera with a knowing look. With the back of his other hand he is nudging a SECOND cup away from himself across the counter. Loose dried herbs and tea leaves are scattered on the wooden counter.") },

  { name: "06_analisis", ref: REF, prompt: S(
    "A candid documentary photograph at a real wooden desk in a doctor's office. The doctor holds up a printed BLOOD TEST REPORT - a plain white sheet of paper with rows of small printed lines, tilted towards the camera - and reads it with a deeply concerned frown; real worry, not exaggerated shock. In his other hand he holds a red ballpoint pen and has just drawn a rough RED INK CIRCLE around one single line on the sheet - real ink on real paper, slightly uneven. A desk lamp lights the paper while daylight comes from a window behind him. The paper is well exposed and crisp.") },

  { name: "07_tobillo", ref: REF, prompt: S(
    "A candid clinical documentary photograph in a bright consulting room. The doctor is crouched down beside an elderly patient's bare lower leg, which rests on a footstool, and he is PRESSING HIS THUMB firmly into the SWOLLEN ANKLE, leaving a clear visible DENT in the puffy skin. Just above the ankle there is a deep horizontal ridge left by a sock elastic. He has just looked up towards the camera with a serious expression. Grazing soft daylight from a window reveals the dent and the swelling purely through natural shadow. Skin looks real and elderly, with texture and natural mottling.") },

  { name: "08_sal", ref: REF, prompt: S(
    "A candid vlog-style photograph in a bright real kitchen. The doctor holds up a small PLAIN WHITE unlabelled shaker of salt substitute in one hand and points at it directly with the index finger of his other hand, his mouth open and eyebrows high in genuine surprise. A few grains of salt are caught in mid-air falling from the shaker, frozen crisply by the daylight. On the counter beside him stands a plain clear glass jar of dried green herbs. Soft frontal-side daylight from a window, bright clean kitchen, natural colours with no yellow cast.") },

  { name: "09_desayuno", ref: REF, prompt: S(
    "A candid vlog-style photograph. The doctor stands over a breakfast table, arms slightly opened with both palms turned up, giving the camera an exasperated 'are you serious?' look - eyebrows up, head tilted. On the table below him is a beautiful, appetising 'healthy' breakfast styled like a food blog photo: avocado toast on wholegrain bread, a bowl of granola with nuts, a tall green smoothie, a bowl of bran cereal with milk. Soft daylight falls from a window above and to the side, three-quarter view down onto the table, natural food-photography look, appetising and completely normal - no warning marks of any kind.") },
];

fs.writeFileSync("_bas_thumbs.json", JSON.stringify(items, null, 2));
console.log("items:", items.length, "| avg prompt chars:", Math.round(items.reduce((a, i) => a + i.prompt.length, 0) / items.length));
