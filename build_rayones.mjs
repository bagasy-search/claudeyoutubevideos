// build_rayones.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Constructor Libre").
// Video #6: cómo sacar rayones del auto sin ir al taller. Avatar Tomás + b-roll dominante
// REAL: clips YouTube (matchfarm proxies) + cientos de imágenes web (fetch_bing). AI solo
// diagramas. Queries ANALIZADAS del guion (específicas, EN inglés, ancladas al TEMA: pintura
// y carrocería de auto) — no random. Pacing ~4-5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_rayones.mjs match  |  node build_rayones.mjs
import fs from "fs";

const SLUG = "rayones";
const AVATAR = `${SLUG}_opt.mp4`;
const MODE = process.argv[2] === "match" ? "match" : "build";
const MINGAP = Number(process.env.OX_MINGAP) || 2.2;
const OPEN = 1.6, OV = 0.4, DLDUR = 6;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); for (let i = 0; i <= Wc.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; } if (ok) return Wc[i].ms / 1000; } throw new Error("ANCHOR NOT FOUND: " + phrase); };
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ anchor missing:", p); return null; } };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) { const prev = caps[i - 1]; const punct = prev ? /[.,;:!?…"]$/.test(prev.text.trim()) : true; const gap = prev ? caps[i].startMs - prev.endMs : 9999; if (i === 0 || punct || gap > 200) PHRASE_BOUNDS.push(caps[i].startMs / 1000); }

const C = (name, query, concept, o = {}) => ({ k: "c", name, query, concept, ...o });
const I = (name, query, concept, o = {}) => ({ k: "i", name, query, concept, ...o });
const G = (name, o = {}) => ({ k: "g", name, ...o });
const X = (props) => ({ k: "comp", ...props });
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto) para colocar después el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido. Evitá verse escolar/infantil/sobrecargado.`;
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const HUES = ["amber", "red", "blue"];

const SECTIONS = [
  // ░░ 1) COLD OPEN — pará, no lleves el auto al taller ░░
  { a: "antes de llevar el auto al taller por ese rayon", start: 0, beats: [
    C("ra_finger_scratch_paint", "close up finger running across a scratch on car paint", "a finger tracing a scratch on the car's paint", { at: "antes de llevar el auto al taller por ese rayon" }),
    C("ra_worried_owner_scratch", "worried car owner looking at scratch on door panel", "watch this a minute, it'll save you a fortune", { at: "mira esto un minuto" }),
    C("ra_body_shop_repaint_panel", "auto body shop spray painting a whole car door panel", "they'll charge you to repaint the whole panel", { at: "por repintar el panel entero" }),
    I("ra_scratch_only_clearcoat", "shallow scratch only in clear coat of car paint macro", "most scratches don't even reach the paint", { at: "ni siquiera llegan a la pintura" }),
    C("ra_polish_scratch_curb", "man buffing out a car scratch on the street outside", "removed on the curb, alone, in ten minutes", { at: "se sacan en la vereda vos solo en 10 minutos" }),
    C("ra_coffee_cheap_price", "cup of coffee on a table cheap price metaphor", "for less than a coffee costs", { at: "por menos de lo que sale un cafe" }),
    C("ra_shop_wont_tell_you", "mechanic at counter not telling customer the truth", "the shop will never tell you this", { at: "en el taller no te lo van a contar nunca" }),
    I("ra_wipe_scratch_with_rag", "wiping a light car scratch away with a cloth rag", "a scratch that wipes off with a rag", { at: "un aranazo que se borra con un trapo" }),
    G("ra_tomas_hook", { kicker: "Lo que el taller no te cuenta" }),
    I("ra_old_body_man_portrait", "old experienced auto body man in overalls portrait", "an old body-shop man taught it to me", { at: "un chapista viejo" }),
  ]},
  // ░░ 2) EL CHAPISTA VIEJO / promesa ░░
  { a: "listo para pagar una locura", beats: [
    C("ra_wallet_in_hand_pay", "hand holding wallet about to pay big car repair bill", "wallet in hand, ready to pay a crazy amount", { at: "listo para pagar una locura" }),
    C("ra_man_stops_you_gesture", "older man raising hand to stop someone save your money", "he stopped me and said one thing: save your money", { at: "guarda la plata" }),
    I("ra_fingernail_on_scratch", "fingernail dragging across a car paint scratch close up", "it comes out with your nail and two things at home", { at: "eso se saca con la una y dos cosas que ya tenes en casa" }),
    I("ra_three_scratch_types", "comparing three different depths of car paint scratches", "you'll learn the three types of scratch", { at: "distinguir los tres tipos de rayon" }),
    C("ra_white_scuff_mark_car", "white scuff transfer mark on car paint from wall", "how to remove that white scuff mark", { at: "como sacar esa marca blanca" }),
    C("ra_scratch_car_worse_mistake", "hand rubbing car paint making swirl scratches worse", "the mistake that scratches the car even more", { at: "te raya el auto todavia mas" }),
    C("ra_stay_until_end_ruin", "finger pointing keep watching could ruin paint forever", "stay till the end: that point can ruin your paint forever", { at: "quedate hasta el final" }),
  ]},
  // ░░ 3) LAS TRES CAPAS DE PINTURA ░░
  { a: "tu auto no tiene una sola capa de pintura", beats: [
    C("ra_car_paint_glossy_panel", "close up glossy deep car paint finish on a panel", "your car doesn't have just one layer of paint", { at: "tu auto no tiene una sola capa de pintura" }),
    X({ kind: "diagram", at: "abajo de todo esta el metal", eyebrow: "Tu pintura tiene tres capas", slides: [{ image: dg("dg_ra_layers", "Diagrama en corte de la pintura de un auto en tres capas apiladas, vista de perfil ampliada. Abajo del todo la CHAPA DE METAL con una base gris antioxido. Encima el COLOR (la pintura propiamente dicha). Y arriba de todo una CAPA TRANSPARENTE gruesa, el barniz o clear coat, brillante, que es lo que tocas con la mano. El sol arriba. Etiquetas 'metal + base antioxido', 'color', 'barniz transparente (clear coat)'. Transmite que lo que tocas es el barniz, no el color."), eyebrow: "Metal + base · color · barniz transparente" }] }),
    C("ra_bare_metal_primer_base", "bare car body metal with grey primer base coat", "at the bottom, metal with an anti-rust base", { at: "abajo de todo esta el metal" }),
    C("ra_color_coat_spray", "spraying the color coat of paint on a car panel", "above goes the color, the paint itself", { at: "arriba va el color" }),
    I("ra_clearcoat_hand_touch", "hand touching the glossy clear coat surface of a car", "on top, what you touch when you run your hand", { at: "lo que vos tocas cuando pasas la mano" }),
    C("ra_clearcoat_layer_shine", "transparent clear coat layer glossy protective car", "a clear layer called barniz, or clear coat", { at: "una capa transparente que se llama barniz" }),
    C("ra_sun_rain_on_paint", "sun and rain hitting a car's painted surface protection", "clear plastic that protects the color from sun and rain", { at: "protege el color del sol" }),
  ]},
  // ░░ 4) EL SECRETO — 90% solo en el barniz ░░
  { a: "y aca esta el secreto que el taller no te explica", beats: [
    X({ kind: "diagram", at: "estan solamente en esa capa transparente", eyebrow: "El 90% de los rayones", slides: [{ image: dg("dg_ra_90_clearcoat", "Diagrama con un gran numero '90%' y un corte de la pintura del auto donde un rayon apenas raya la CAPA TRANSPARENTE de arriba (el barniz), sin llegar al color ni al metal. Flechas que muestran que el rayon queda arriba de todo. Al lado un 10% chico con un rayon mas profundo. Etiquetas '90% de los rayones: solo el barniz', 'no tocan el color ni el metal'. Transmite alivio: casi todos son superficiales."), eyebrow: "Solo tocan el barniz, no el color ni el metal" }] }),
    C("ra_scratch_only_surface", "very shallow scratch only on top clear coat car", "the ones that scare you are only in the clear layer", { at: "estan solamente en esa capa transparente" }),
    C("ra_barniz_takes_hits", "clear coat taking scratches protecting the paint color", "the barniz is there to take the hits instead of the paint", { at: "para llevarse los golpes en lugar de la pintura" }),
    I("ra_scratch_buffed_out_gone", "car scratch fully buffed out and gone shiny paint", "a scratch only in the barniz comes right out", { at: "un rayon que esta solo en el barniz se saca" }),
    C("ra_no_paint_no_shop", "no repainting needed no body shop confident owner", "no painting, no going anywhere", { at: "no hay que pintar nada" }),
  ]},
  // ░░ 5) EL TRUCO DE LA UÑA ░░
  { a: "como sabes en cual estas con la una", beats: [
    I("ra_fingernail_test_close", "fingernail testing depth of scratch on car paint macro", "how do you know which one you have? With your nail", { at: "como sabes en cual estas con la una" }),
    C("ra_nail_across_scratch", "fingernail dragging slowly across a car scratch crosswise", "run your nail over the scratch, slowly, crossing it", { at: "pasa la una por encima del rayon" }),
    C("ra_nail_glides_smooth", "fingernail gliding smoothly over shallow car scratch", "if the nail glides smooth, it's only in the barniz, easy", { at: "si la una pasa lisa" }),
    C("ra_ten_minutes_yourself", "person fixing car scratch alone in ten minutes driveway", "you fix it yourself in ten minutes", { at: "lo sacas vos en diez minutos" }),
    C("ra_nail_catches_slightly", "fingernail catching slightly on a car paint scratch", "if the nail catches a bit, it reached the color", { at: "si la una se engancha apenas un poquito" }),
    C("ra_nail_deep_catches_metal", "fingernail dropping into a deep scratch down to metal car", "if the nail sinks in, the scratch reached the metal", { at: "y si la una se mete adentro" }),
    C("ra_deep_scratch_bare_metal", "deep car scratch exposing bare metal underneath paint", "that one reached the metal, needs something else", { at: "ese rayon llego hasta el metal" }),
    I("ra_do_the_nail_first", "doing the fingernail test before buying anything car", "do this before buying anything, before calling anyone", { at: "hace esto antes que nada" }),
    C("ra_almost_paid_500", "car owner about to overpay 500 dollars for tiny scratch", "you were about to pay 500 for a rag fix", { at: "vos estabas a punto de pagar 500 dolares" }),
  ]},
  // ░░ 6) NIVEL 1 — pomada de pulir ░░
  { a: "vamos al primero el mas comun", beats: [
    C("ra_most_common_clearcoat", "shallow common clear coat scratch on car door", "let's go to the first, the most common: only the barniz", { at: "vamos al primero el mas comun" }),
    I("ra_polishing_compound_tube", "tube of car polishing rubbing compound close up", "for this you need one thing: a polishing compound", { at: "una pomada de pulir" }),
    C("ra_hardware_store_polish", "hardware store shelf with car polish rubbing compound", "at the hardware store, ask for pulimento or compound", { at: "en la ferreteria" }),
    I("ra_cheap_polish_pot", "small cheap pot of polishing paste on workbench", "costs two or three dollars, a pot lasts years", { at: "un pote que te dura anos" }),
    X({ kind: "diagram", at: "es una pasta con un abrasivo finito", eyebrow: "Cómo trabaja la pomada de pulir", slides: [{ image: dg("dg_ra_polish", "Diagrama: primer plano de la pomada de pulir con una lupa que revela las particulas ABRASIVAS finisimas adentro, y al lado esas particulas desgastando apenas la capa de BARNIZ alrededor del rayon hasta emparejarla, como una lija suavisima. Etiquetas 'abrasivo finito', 'desgasta el barniz alrededor del rayon y lo empareja'. Transmite que no pinta, solo pule y nivela el barniz."), eyebrow: "Un abrasivo finito que empareja el barniz" }] }),
    I("ra_creamy_between_fingers", "creamy polishing paste rubbed between fingers texture", "like sandpaper, but so soft it feels creamy", { at: "como una lija pero tan suave" }),
    C("ra_wash_area_first", "washing the car panel area before polishing a scratch", "the method: wash the area well first", { at: "lavas bien la zona primero" }),
    C("ra_dust_becomes_sandpaper", "dust and grit on car paint acting like sandpaper", "dirt turns into sandpaper and scratches more", { at: "esa tierra se convierte en lija y te raya mas" }),
  ]},
  // ░░ 7) EL MÉTODO DE PULIDO ░░
  { a: "lavas secas pones un poco de pomada en un trapo limpio", beats: [
    I("ra_microfiber_cloth_polish", "microfiber cloth with polishing paste for car scratch", "put polish on a clean microfiber cloth", { at: "lavas secas pones un poco de pomada en un trapo limpio" }),
    C("ra_rub_along_scratch", "rubbing car scratch firmly back and forth along direction", "rub with a bit of force, following the scratch", { at: "frotas sobre el rayon con un poquito de fuerza" }),
    C("ra_not_in_circles_straight", "polishing car in straight lines not circles warning", "not in circles, twenty or thirty seconds", { at: "no en circulos" }),
    C("ra_wipe_dry_look", "wiping car paint with dry side of cloth checking scratch", "wipe with the dry side and look", { at: "limpias con la parte seca del trapo y miras" }),
    C("ra_scratch_fading_away", "car scratch fading and disappearing after buffing", "the scratch lightens, erases on its own", { at: "el rayon se va aclarando" }),
    C("ra_repeat_two_three_passes", "repeating polishing passes on car scratch until gone", "two or three passes and the scratch that drove you crazy is gone", { at: "dos o tres pasadas" }),
  ]},
  // ░░ 8) INJERTO 1 — la guía / manual ░░
  { a: "es uno de los arreglos que junte en una guia que arme", beats: [
    C("ra_handwritten_repair_notes", "handwritten notebook of home repair tricks and measures", "this is one of the fixes I gathered in a guide I made", { at: "es uno de los arreglos que junte en una guia que arme" }),
    I("ra_notes_scratch_headlight_rust", "notebook pages sketches car scratch headlight rust wood", "for years I wrote down each of these tricks", { at: "fui anotando cada uno de estos trucos" }),
    I("ra_manual_stacked_fixes", "home repair manual with forty cheap fixes stacked", "forty fixes gathered in a single manual", { at: "40 de esos arreglos en un solo manual" }),
    C("ra_industry_hides_fixes", "industry hiding cheap DIY repairs to keep charging", "the one to five dollar fixes the industry hides", { at: "los 40 arreglos de un dolar a cinco dolares" }),
    C("ra_link_below_description", "phone showing link in video description and pinned comment", "the link's below, in the description and pinned comment", { at: "te dejo el link abajo" }),
  ]},
  // ░░ 9) NIVEL 2 — llegó al color / retoque ░░
  { a: "el rayon donde la una se engancho un poco llego al color", beats: [
    C("ra_scratch_reached_color", "car scratch deep enough to show color coat under clear", "the scratch where the nail caught: it reached the color", { at: "el rayon donde la una se engancho un poco llego al color" }),
    C("ra_replace_lost_paint_seal", "touching up lost paint in a scratch then sealing it car", "you replace the bit of paint lost, then seal it", { at: "reponer ese poquito de pintura que se fue y despues sellarlo" }),
    I("ra_touchup_paint_pens", "car touch up paint pens and small bottles color match", "there are pens and little bottles called touch-up paint", { at: "hay unos lapices y unos frasquitos que se llaman pintura de retoque" }),
    X({ kind: "diagram", at: "tu auto tiene un codigo de color una plaquita", eyebrow: "El código de color de tu auto", slides: [{ image: dg("dg_ra_colorcode", "Diagrama: el marco de la puerta del conductor de un auto abierto, con una PLAQUITA/etiqueta senalada por una flecha, donde figura el CODIGO DE COLOR del auto. Al lado, tambien abajo del capo como segundo lugar posible. Un frasquito de pintura de retoque al costado con ese mismo codigo, mostrando que el color sale identico. Etiquetas 'plaquita en el marco de la puerta', 'anota el codigo, pedis el color identico'. Transmite donde encontrar el codigo."), eyebrow: "La plaquita en el marco de la puerta del conductor" }] }),
    I("ra_door_jamb_color_plate", "color code sticker plate on driver door jamb of car", "a plate, usually on the driver's door frame", { at: "casi siempre en el marco de la puerta del conductor" }),
    C("ra_identical_color_match", "matching identical car paint color from code at counter", "note the code, they give you the identical color", { at: "te dan el color identico" }),
  ]},
  // ░░ 10) RETOQUE EN CAPAS ░░
  { a: "el truco para que quede bien no es embadurnar", beats: [
    I("ra_dont_glob_touchup", "warning against globbing too much touch up paint on car", "the trick isn't to smear it on, it's the opposite", { at: "el truco para que quede bien no es embadurnar" }),
    I("ra_toothpick_tiny_drop", "toothpick applying tiny drop of touch up paint in scratch", "with a toothpick, a fine little drop inside the scratch", { at: "con un palillo o con la punta del pincelito" }),
    C("ra_thin_drop_inside_scratch", "fine drop of paint placed precisely inside car scratch", "a thin drop right inside, without going past the edges", { at: "pones una gotita finita justo adentro del rayon" }),
    C("ra_layers_dry_between", "building touch up paint in thin layers letting dry car", "let it dry, another drop, in layers, level with the rest", { at: "pones otra gotita despacio en capas" }),
    C("ra_glob_makes_bump", "too much touch up paint forming an ugly bump on car", "rush it and it forms a bump that shows more", { at: "queda un bulto y se nota mas que el rayon" }),
    C("ra_clearcoat_over_seal", "brushing clear coat over touched up car scratch to seal", "when dry, clear coat on top to seal, then polish", { at: "le pasas un poquito de barniz transparente arriba para sellarlo" }),
    C("ra_five_not_five_hundred", "restored car paint five dollars instead of five hundred", "almost invisible, five dollars instead of five hundred", { at: "te gastaste cinco dolares en vez de quinientos" }),
  ]},
  // ░░ 11) LA MARCA BLANCA — transferencia de pintura ░░
  { a: "rosaste una pared una columna del estacionamiento", beats: [
    C("ra_scuff_wall_parking", "car scuffing against a parking garage concrete column", "you brushed a wall, a parking column, another bumper", { at: "rosaste una pared una columna del estacionamiento" }),
    I("ra_white_transfer_mark", "white paint transfer scuff mark on colored car door", "and a white mark stuck onto your paint", { at: "te quedo una marca blanca" }),
    C("ra_owner_thinks_ruined", "car owner distressed thinking paint is ruined by scuff", "you look and think: I wrecked the car. It's a lie", { at: "la miras y pensas me arruine el auto" }),
    X({ kind: "diagram", at: "eso se llama transferencia de pintura", eyebrow: "No es un rayón: es pintura pegada", slides: [{ image: dg("dg_ra_transfer", "Diagrama en corte: la pintura del auto propia INTACTA abajo, y encima, solo APOYADA, una capa de pintura blanca de otro objeto (la pared o el otro auto) que quedo pegada arriba, sin meterse. Una mano frotando con un trapo la levanta y aparece la pintura sana debajo. Etiquetas 'transferencia: pintura del otro apoyada arriba', 'tu pintura esta intacta debajo', 'se frota y se va'. Transmite alivio total."), eyebrow: "La pintura del otro quedó apoyada, no metida" }] }),
    C("ra_paint_sitting_on_top", "other object's paint sitting on top of car surface not in", "it's the other's paint sitting on top of yours", { at: "la pintura del otro se quedo pegada arriba de la tuya" }),
    C("ra_polish_scuff_off_easy", "buffing white scuff transfer off car paint with cloth", "sometimes polish and a rag take it off instantly", { at: "a veces con la pomada de pulir y un trapo sale al toque" }),
    C("ra_alcohol_corner_test", "testing alcohol on a hidden corner before scuff removal car", "alcohol or a mild nail remover, test in a corner first", { at: "hasta sirve un poco de alcohol" }),
    C("ra_scuff_gone_paint_intact", "white scuff gone revealing intact car paint underneath", "rub it and your paint appears intact, so satisfying", { at: "frotas esa marca blanca y vas a ver como se va" }),
  ]},
  // ░░ 12) MITOS — pasta de dientes ░░
  { a: "la pasta de dientes y el doble ud40", beats: [
    I("ra_toothpaste_wd40_myths", "toothpaste tube and lubricant spray car scratch myths", "two things you've heard: toothpaste and WD-40", { at: "la pasta de dientes y el doble ud40" }),
    C("ra_toothpaste_on_scratch", "rubbing white toothpaste on a car paint scratch cloth", "yes, toothpaste does remove scratches", { at: "la pasta de dientes saca rayones" }),
    X({ kind: "diagram", at: "la pasta de dientes tiene un abrasivo finito", eyebrow: "Por qué la pasta de dientes 'funciona'", slides: [{ image: dg("dg_ra_toothpaste", "Diagrama comparativo: a la izquierda la POMADA DE PULIR con un abrasivo fino y controlado (pule parejo el barniz). A la derecha la PASTA DE DIENTES con un abrasivo mas debil y descontrolado (lima poquito y disparejo). Un rayon chiquito de auto arriba de cada una. Etiquetas 'pomada: abrasivo fino, controlado', 'pasta de dientes: mas debil y descontrolado, es un parche'. Transmite que la pasta es una version peor de lo que ya mostro."), eyebrow: "Un abrasivo más débil que la pomada de pulir" }] }),
    C("ra_worse_version_polish", "toothpaste as a worse expensive version of car polish", "it's a worse version of what I already showed you", { at: "una version cara y peor de lo que ya te mostre" }),
    C("ra_tiny_scratch_emergency", "toothpaste on a very tiny car scratch emergency fix", "for a tiny scratch, in an emergency, it gets you by", { at: "para un rayon muy chiquito en una emergencia" }),
    C("ra_weak_sandpaper_not_magic", "toothpaste as weak sandpaper not a magic scratch cure", "it's not magic, just weak sandpaper", { at: "es apenas una lija floja" }),
    I("ra_dont_believe_videos", "phone with fake toothpaste scratch hack video skeptical", "don't believe videos selling it as the secret of the universe", { at: "no le creas a los videos" }),
  ]},
  // ░░ 13) MITOS — WD-40 ░░
  { a: "y el doble ud40 peor todavia", beats: [
    I("ra_wd40_can_scratch", "multipurpose lubricant spray can next to car scratch", "and WD-40, even worse: it removes no scratch", { at: "y el doble ud40 peor todavia" }),
    C("ra_oily_film_fills_scratch", "oily film filling a car scratch hiding it temporarily", "it just leaves an oily film that hides the scratch a while", { at: "dejar una capa aceitosa que rellena el rayon" }),
    C("ra_shine_two_days_rain", "shiny car scratch fading when rain washes off oil", "looks great for two days, until it rains or you wash it", { at: "se ve hermoso por dos dias" }),
    C("ra_scratch_back_same", "car scratch reappearing exactly the same after oil gone", "and the scratch is back exactly as before", { at: "y el rayon vuelve a estar igual que antes" }),
    C("ra_trick_for_photo_only", "car scratch oil trick only good for a photo not repair", "a trick for a photo, not to fix anything", { at: "es un truco para una foto" }),
    C("ra_nail_polish_touchup_recap", "fingernail test polish touch up sealing car scratch recap", "what works: the nail, the polish, the touch-up in layers", { at: "lo que sirve es lo que te dije" }),
  ]},
  // ░░ 14) NIVEL 3 — llegó al metal / óxido ░░
  { a: "cuando un rayon llega al metal", beats: [
    C("ra_deep_scratch_to_metal", "deep car scratch cutting all the way down to bare metal", "when a scratch reaches the metal, the real problem isn't the look", { at: "cuando un rayon llega al metal" }),
    X({ kind: "diagram", at: "es que ese metal quedo desnudo", eyebrow: "El metal desnudo se oxida", slides: [{ image: dg("dg_ra_rust", "Diagrama en corte de un rayon profundo que atraviesa barniz, color y base, dejando la CHAPA DE METAL desnuda y expuesta. Gotas de humedad y aire entrando en la ranura. Una flecha de tiempo ('pocas semanas') que muestra como aparece el OXIDO naranja que empieza a comerse la chapa desde el rayon. Etiquetas 'metal desnudo expuesto al aire y la humedad', 'en semanas empieza el oxido'. Transmite urgencia de tapar el metal."), eyebrow: "Expuesto al aire y la humedad, empieza a oxidarse" }] }),
    C("ra_bare_metal_exposed", "bare exposed car body metal in a deep paint scratch", "that metal is left bare, open to air and humidity", { at: "es que ese metal quedo desnudo" }),
    C("ra_rust_eats_the_body", "rust spreading and eating into a car body panel", "once rust gets in, it eats the body and gets truly expensive", { at: "ahi si se te come la chapa" }),
    C("ra_cheap_play_meanwhile", "quick cheap protective fix for a deep car scratch meanwhile", "even for that, you have a cheap play meanwhile", { at: "tenes una jugada barata mientras tanto" }),
    C("ra_cover_metal_touchup", "dabbing touch up paint or clear coat to cover bare metal", "cover the bare metal with touch-up or clear coat", { at: "tapae el metal con una gotita de pintura de retoque" }),
    C("ra_buys_time_stops_rust", "sealed bare metal scratch buying time stopping rust car", "it buys time and stops the rust until you fix it right", { at: "le compra tiempo y frena el oxido" }),
    I("ra_cover_bare_metal_always", "always cover bare metal on a car scratch as soon as possible", "cover bare metal, always, as soon as possible", { at: "tapar el metal desnudo siempre cuanto antes" }),
  ]},
  // ░░ 15) EL ERROR — frotar en seco, en círculos ░░
  { a: "y ahora si el error", beats: [
    C("ra_now_the_mistake", "hand about to make the big car scratch mistake reveal", "and now, the mistake that can ruin your paint forever", { at: "y ahora si el error" }),
    C("ra_rub_dry_any_rag_circles", "rubbing car paint dry with any rag in circles bad", "the mistake: rubbing dry, with any rag, in circles", { at: "el error es frotar en seco con cualquier trapo y en circulos" }),
    C("ra_dry_abrasive_scratches", "dry abrasive scratching car paint without lubrication", "dry, any abrasive scratches more without lubrication", { at: "sin lubricacion cualquier abrasivo raya de mas" }),
    C("ra_dirty_rag_grit_inside", "old dirty flannel rag full of grit and dust for car", "an old rag has dust and grit stuck in it", { at: "una franela que estuvo tirada juntando tierra" }),
    C("ra_grit_like_sandpaper", "grit in a cloth acting like sandpaper on car paint", "that grit is like taking sandpaper to the car", { at: "es como pasarle papel de lija al auto" }),
    I("ra_swirl_marks_sun", "swirl marks on car paint catching sunlight worst", "circles make swirls, the worst in the sun and hardest to remove", { at: "esos remolinos son los que mas se notan" }),
    C("ra_do_it_wet_straight", "polishing car wet in straight lines clean microfiber right", "do it the opposite: wet, clean microfiber, always straight", { at: "hacelo siempre al reves" }),
    I("ra_straight_never_circles", "buffing car paint straight in one direction never circles", "always straight, one direction, never in circles", { at: "y siempre derecho en el mismo sentido nunca en circulos" }),
    C("ra_like_new_vs_swirls", "car looking like new versus full of swirl marks compare", "the difference between like-new and full of swirls", { at: "un auto que quedo como nuevo" }),
  ]},
  // ░░ 16) REPASO / PLAN COMPLETO ░░
  { a: "hagamos un repaso rapido el plan completo", beats: [
    C("ra_recap_plan_scratch", "person inspecting their car ready to check scratches plan", "let's do a quick recap, the complete plan", { at: "hagamos un repaso rapido el plan completo" }),
    C("ra_first_the_nail", "fingernail test on car scratch first step recap", "first: run your nail, it tells you everything", { at: "primero pasa la una" }),
    C("ra_second_polish_barniz", "polishing compound on microfiber for clear coat scratch", "second: for the barniz scratch, polish and microfiber", { at: "para el rayon de barniz pomada de pulir y trapo de microfibra" }),
    C("ra_third_touchup_color", "touch up paint in fine layers for a color scratch car", "third: for the color, touch-up in fine layers", { at: "para el que llego al color pintura de retoque" }),
    C("ra_fourth_white_rubs_off", "white scuff mark rubbing off car paint fourth step", "fourth: the white mark is stuck paint, rubs off", { at: "la marca blanca de rosar algo no es un rayon" }),
    C("ra_fifth_myths_waste", "toothpaste and lubricant myths a waste of time car", "fifth: toothpaste is weak, WD-40 lasts two days", { at: "la pasta de dientes es una lija floja" }),
    C("ra_sixth_cover_metal", "covering bare metal scratch then taking to a shop", "sixth, most important: if it reached metal, cover it now", { at: "si llego al metal" }),
  ]},
  // ░░ 17) CIERRE — la industria / manual ░░
  { a: "todo eso es la misma idea repetida", beats: [
    C("ra_scratch_headlight_wood_rust", "montage of car scratch headlight wood rust cheap fixes", "everything today: the scratch, and before the headlights, wood, rust", { at: "todo eso es la misma idea repetida" }),
    C("ra_industry_wins_you_doubt", "industry profits when you doubt you can do it yourself", "the industry wins when you think you can't do it alone", { at: "la industria gana cuando vos crees que no podes hacer las cosas solo" }),
    C("ra_two_dollar_ten_minutes", "two dollar ten minute DIY car fix instead of shop", "most of the time it's a two-dollar, ten-minute fix", { at: "es un arreglo de dos dolares y diez minutos" }),
    I("ra_manual_cover_repairs", "home repairs manual cover with forty cheap fixes", "that's why I gathered the forty in the Home Repairs Manual", { at: "el manual de reparaciones caseras" }),
    C("ra_exact_measures_steps", "manual pages with exact measures what to buy each step", "each fix with exact measures, what to buy, every step", { at: "cada arreglo con las medidas exactas" }),
    C("ra_guarantee_refund", "money back guarantee refund on home repair manual", "costs less than one shop visit, with a guarantee", { at: "cuesta menos que una sola visita al taller y tiene garantia" }),
    C("ra_next_video_ac", "man recharging his own car air conditioning at home", "next: recharge your car's A/C yourself for a fraction", { at: "como cargar vos mismo el aire acondicionado del auto" }),
    C("ra_independence_built", "independent DIY car owner one fix at a time driveway", "independence isn't bought, it's built, one fix at a time", { at: "la independencia no se compra se construye" }),
  ]},
];

// ── motor (anclaje + placement + salida + avatar windows) ───────────────────
for (const s of SECTIONS) { if (s.start == null) s.start = atc(s.a); }
const SEC = SECTIONS.filter((s) => s.start != null).sort((a, b) => a.start - b.start);
const beats = [];
const MATCH = [], BING = [];
const seenM = new Set(), seenB = new Set();
const addM = (name, query, concept) => { if (!seenM.has(name)) { seenM.add(name); MATCH.push({ name, concept, query: Array.isArray(query) ? query : [query], dur: DLDUR }); } };
const addB = (name, query, concept) => { if (name && !seenB.has(name)) { seenB.add(name); BING.push({ name, query: Array.isArray(query) ? query[0] : query, concept: concept || query, count: 1 }); } };
for (let si = 0; si < SEC.length; si++) {
  const sec = SEC[si];
  const start = sec.start;
  const end = si + 1 < SEC.length ? SEC[si + 1].start : TOTAL;
  if (sec.full || !sec.beats.length) continue;
  const N = sec.beats.length;
  let secB = PHRASE_BOUNDS.filter((b) => b >= start + 0.05 && b <= end - 0.3);
  if (!secB.length) secB = [start];
  const placed = [];
  let lastT = start - 99;
  for (let i = 0; i < N; i++) {
    const b = sec.beats[i];
    let t = null;
    if (b.at) { const a = atc(b.at); if (a != null && a >= start && a < end) t = a; }
    if (t == null) {
      const target = start + ((i + 0.5) / N) * (end - start);
      let best = null, bd = 1e9;
      for (const bb of secB) { if (bb <= lastT + 0.4) continue; const d = Math.abs(bb - target); if (d < bd) { bd = d; best = bb; } }
      t = best != null ? best : Math.max(target, lastT + MINGAP * 0.6);
    }
    if (t <= lastT + 0.4) t = lastT + Math.max(MINGAP * 0.6, 1.0);
    lastT = t;
    placed.push({ b, t: +t.toFixed(2) });
  }
  for (let i = 0; i < placed.length; i++) {
    const { b, t } = placed[i];
    const nextT = i + 1 < placed.length ? placed[i + 1].t : end;
    const dur = +Math.min(nextT - t + OV, TOTAL - t).toFixed(2);
    const hue = b.hue || HUES[(si + i) % HUES.length];
    if (b.k === "c") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `broll/${b.name}.mp4`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addM(b.name, b.query, b.concept); addB(b.name, b.query, b.concept); }
    else if (b.k === "i") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `real/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addB(b.name, b.query, b.concept); }
    else if (b.k === "g") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `img/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); }
    else if (b.k === "comp") {
      const { kind, at: _at, _bg, ...props } = b;
      if (_bg) addB(_bg.name, _bg.query, _bg.concept);
      const scanBg = (o) => { if (!o || typeof o !== "object") return; if (o._bg) { addB(o._bg.name, o._bg.query, o._bg.concept); delete o._bg; } for (const k of Object.keys(o)) scanBg(o[k]); };
      scanBg(props);
      const beat = { id: `cmp_${kind}_${si}_${i}`, start: t, dur: +Math.min(dur, 7.2).toFixed(2), kind, hue, ...props };
      if (kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((x) => (typeof x === "string" ? { t: x } : { t: x.t, hl: true }));
      if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      beats.push(beat);
    }
  }
}
beats.sort((a, b) => a.start - b.start);

// ── OVERLAYS A MEDIDA encima del clip vivo (overlay:true → no roban slot, el clip corre detrás borroso) ──
const OVL = [
  // ── HOOK — la frase del chapista ──
  { kind: "oxquote", at: "guarda la plata", dur: 5.2, quote: "Guardá la plata. Eso se saca con *la uña y dos cosas que ya tenés en casa*.", image: "real/ra_old_body_man_portrait.png", attribution: "Un chapista viejo", side: "right", accent: "amber" },
  // ── CONFIRMACIÓN — antes/después ──
  { kind: "oxbefore", at: "un rayon que esta solo en el barniz se saca", dur: 4.4, before: "real/ra_scratch_only_clearcoat.png", after: "real/ra_scratch_buffed_out_gone.png", accent: "green" },
  // ── EL SECRETO — 90% ──
  { kind: "oxstat", at: "estan solamente en esa capa transparente", dur: 4.2, value: 90, suffix: " %", label: "de los rayones están solo en el barniz, no tocan el color", glyph: "🚗", accent: "green" },
  // ── EL TRUCO DE LA UÑA ──
  { kind: "oxrule", at: "como sabes en cual estas con la una", dur: 4.4, text: "Pasá *la uña* cruzando el rayón. Tarda dos segundos y vale oro.", accent: "amber" },
  { kind: "oxside", at: "pasa la una por encima del rayon", dur: 5.2, image: "real/ra_fingernail_test_close.png", title: "El truco de la uña", lines: ["Pasa lisa: es barniz, fácil", "Engancha apenas: llegó al color", "Se traba fuerte: llegó al metal"], side: "right", accent: "amber" },
  { kind: "oxstat", at: "vos estabas a punto de pagar 500 dolares", dur: 4.0, value: 8, suffix: "/10", label: "veces la uña pasa lisa: era un arreglo de un trapo", glyph: "👍", accent: "green" },
  // ── NIVEL 1 — pomada ──
  { kind: "oxmethod", at: "vamos al primero el mas comun", dur: 4.6, num: "01", title: "Rayón en el barniz", chips: ["Pomada de pulir", "Trapo de microfibra", "Derecho, no en círculos"], cost: "$2-3", accent: "blue" },
  { kind: "oxrule", at: "esa tierra se convierte en lija y te raya mas", dur: 4.2, text: "Lavá *primero*: la tierra se convierte en lija y raya más.", accent: "red" },
  { kind: "oxtag", at: "una pomada de pulir", dur: 4.0, name: "La pomada de pulir", what: "Un abrasivo finísimo que empareja el barniz alrededor del rayón", side: "left", accent: "blue" },
  // ── INJERTO 1 — manual (mid, sin chip) ──
  { kind: "manualcard", at: "es uno de los arreglos que junte en una guia que arme", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos de $1 a $5 del hogar y el auto, con los pasos y las medidas exactas.", accent: "amber" },
  // ── NIVEL 2 — color / retoque ──
  { kind: "oxmethod", at: "el rayon donde la una se engancho un poco llego al color", dur: 4.8, num: "02", title: "Rayón que llegó al color", chips: ["Pintura de retoque", "Código de tu auto", "En gotitas, en capas"], cost: "$5", accent: "amber" },
  { kind: "oxrule", at: "el truco para que quede bien no es embadurnar", dur: 4.4, text: "No *embadurnes*: gotita fina, dejar secar, *en capas*. La paciencia es todo.", accent: "amber" },
  // ── MARCA BLANCA ──
  { kind: "oxrule", at: "eso se llama transferencia de pintura", dur: 4.6, text: "No es un rayón: es *transferencia*. La pintura del otro quedó apoyada, se frota y se va.", accent: "green" },
  // ── MITOS ──
  { kind: "oxrule", at: "es apenas una lija floja", dur: 4.2, text: "La pasta de dientes es *una lija floja*: solo un parche de urgencia.", accent: "red" },
  { kind: "oxstat", at: "se ve hermoso por dos dias", dur: 4.0, value: 2, suffix: " días", label: "el WD-40 tapa el rayón hasta que llueve: no arregla nada", glyph: "💧", accent: "red" },
  // ── NIVEL 3 — metal / óxido ──
  { kind: "oxmethod", at: "cuando un rayon llega al metal", dur: 4.8, num: "03", title: "Rayón hasta el metal", chips: ["Limpiá el rayón", "Tapá el metal desnudo", "Llevalo a arreglar bien"], cost: "urgente", accent: "red" },
  { kind: "oxrule", at: "tapar el metal desnudo siempre cuanto antes", dur: 4.6, text: "Tapá el metal desnudo, *siempre*, cuanto antes. Es el consejo que vale por todo el video.", accent: "red" },
  // ── EL ERROR ──
  { kind: "oxrule", at: "el error es frotar en seco con cualquier trapo y en circulos", dur: 4.6, text: "El error: *en seco*, con *cualquier trapo*, y *en círculos*. Las tres son veneno.", accent: "red" },
  // ── CIERRE ──
  { kind: "manualcard", at: "el link esta abajo en la descripcion y en el comentario que deje fijado", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos, incluido el del rayón, con las medidas exactas.", chip: "Accedé en la descripción", accent: "amber" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── MAXIMUM DENSITY: imágenes ancladas en CADA mini-frase del shotlist aún sin cubrir ──
// [name, query EN visual, concept resuelto al contexto, frase ancla exacta de captions]
const FILL = [
  // ── COLD OPEN ──
  ["ra_fill_save_a_fortune", "car owner saving a fortune avoiding body shop scratch", "it'll save you a fortune", "porque te va a ahorrar una fortuna"],
  ["ra_fill_charge_200_500", "expensive car repaint estimate 200 to 500 dollars invoice", "they'll charge 200, 300, even 500 dollars", "te van a querer cobrar 200"],
  ["ra_fill_not_because_bad", "honest look at a car service counter not evil just business", "not because they're bad, it's the business", "no es porque sean malos"],
  ["ra_fill_scratch_wipes_rag", "light car scratch wiped away with a cloth rag driveway", "a scratch that erases with a rag", "que se borra con un trapo"],
  ["ra_fill_gone_body_men", "old craftsman body man the kind that's gone now portrait", "the kind of old body-man that's almost gone", "de esos que ya casi no quedan"],
  // ── PROMESA ──
  ["ra_fill_two_second_trick", "quick two second fingernail test on a car scratch", "a trick that takes two seconds", "un truco que tarda dos segundos"],
  ["ra_fill_which_you_fix", "deciding which car scratch you can fix yourself or not", "which you can fix alone and which you can't", "cual podes arreglar solo y cual no"],
  ["ra_fill_mirror_scuff", "car side mirror scuffing another car leaving a mark", "when you brush a wall or another car's mirror", "el espejo de otro auto"],
  ["ra_fill_ruin_paint_forever", "warning a wrong move could ruin car paint forever", "the last point can ruin your paint forever", "arruinar la pintura para siempre"],
  // ── TRES CAPAS ──
  ["ra_fill_this_changes_head", "aha moment understanding car paint layers explainer", "start with the most important, it changes your head", "empecemos por lo mas importante"],
  ["ra_fill_it_has_three", "cross section of car paint showing three distinct layers", "it has three layers", "tiene tres"],
  ["ra_fill_color_paint_itself", "the color coat of car paint being applied panel", "the color, the paint properly speaking", "la pintura propiamente dicha"],
  ["ra_fill_clearcoat_name", "glossy transparent clear coat top layer on car paint", "a clear layer called barniz or clear coat", "hay una capa transparente que se llama barniz o clear coat"],
  ["ra_fill_protects_from_rain", "clear coat protecting car color from rain and scratches", "protects the color from rain and scratches", "de la lluvia y de los rayones"],
  // ── EL SECRETO ──
  ["ra_fill_secret_shop_hides", "the secret the body shop hides about shallow scratches", "the secret the shop won't explain", "y aca esta el secreto que el taller no te explica"],
  ["ra_fill_didnt_touch_color", "scratch that didn't reach color or metal only clear coat", "they didn't touch the color, didn't touch the metal", "no tocaron el color no tocaron el metal"],
  ["ra_fill_no_need_go_anywhere", "confident owner no need to go to a body shop scratch", "no need to go anywhere", "no hay que ir a ningun lado"],
  ["ra_fill_most_are_like_that", "most car scratches are shallow clear coat only", "and most of them are like that", "y la mayoria son asi"],
  // ── UÑA ──
  ["ra_fill_worth_gold_trick", "the two second fingernail trick that's worth gold", "the trick that takes two seconds and is worth gold", "y que vale oro"],
  ["ra_fill_slowly_crossing", "fingernail slowly crossing over a car scratch macro", "slowly, crossing it", "despacio cruzandolo"],
  ["ra_fill_easy_ones", "shallow easy car scratch only in the clear coat", "that scratch is only in the barniz, the easy ones", "ese rayon esta solo en el barniz y es de los faciles"],
  ["ra_fill_reached_color_level", "scratch reaching the color coat another level car", "it reached the color, another level", "llego al color todavia hay algo para hacer"],
  ["ra_fill_needs_other_thing", "deep metal scratch needing a different approach honest", "that one needs something else, I won't lie", "necesita otra cosa que tambien te voy a explicar"],
  ["ra_fill_before_call_anyone", "doing the nail test before calling anyone about scratch", "before buying, before calling anyone", "antes de comprar algo antes de llamar a nadie"],
  // ── NIVEL 1 pomada ──
  ["ra_fill_ask_pulimento", "asking for polishing compound pulimento at hardware store", "ask for pulimento or polishing compound", "la pedis como pulimento o compuesto para pulir"],
  ["ra_fill_two_three_dollars", "cheap two three dollar tub of car polishing paste", "costs two, three dollars, lasts years", "y te cuesta dos tres dolares"],
  ["ra_fill_wears_barniz_even", "compound wearing down clear coat around scratch even", "wears the barniz around the scratch till it's even", "desgastar apenas la capa de barniz alrededor del rayon"],
  ["ra_fill_important_wash", "washing car area first important before polishing", "wash first, this matters", "esto es importante"],
  // ── MÉTODO pulido ──
  ["ra_fill_follow_scratch_dir", "rubbing along the direction of the car scratch not circles", "following the scratch, not in circles", "siguiendo el sentido del rayon"],
  ["ra_fill_20_30_seconds", "polishing a car scratch for twenty thirty seconds", "twenty, thirty seconds", "20 30 segundos"],
  ["ra_fill_erasing_by_itself", "car scratch visibly erasing on its own after buffing", "it lightens, erasing by itself", "se va borrando solo"],
  ["ra_fill_repeat_if_visible", "repeating the polish pass if scratch still visible car", "if it still shows, repeat", "si todavia se ve repetis"],
  ["ra_fill_drove_crazy_gone", "the annoying car scratch finally gone after passes", "that scratch that drove you crazy disappears", "ese rayon que te tenia loco desaparece"],
  // ── INJERTO 1 ──
  ["ra_fill_stop_a_second", "pausing to talk about the collected repair guide notebook", "let me stop a second here", "y aca quiero frenar un segundo"],
  ["ra_fill_wood_rust_leaks", "notes on wood rot rust leaks pipes cheap fixes", "the scratch, headlights, wood, rust, leaks, pipes", "el de la madera que no se pudre el del oxido las goteras las canerias"],
  ["ra_fill_exact_measures_note", "handwriting exact measures what to buy each step repair", "I wrote them with exact measures, what to buy", "yo lo anotaba con las medidas exactas que comprar cuanto poner"],
  ["ra_fill_industry_prefers", "the industry preferring you don't learn cheap fixes", "the fixes the industry prefers you don't do alone", "que la industria preferiria que no sepas hacer solo"],
  ["ra_fill_still_the_best", "keep watching the best part is coming scratch video", "keep going, the best is still to come", "sigamos que todavia falta lo mejor"],
  // ── NIVEL 2 color ──
  ["ra_fill_not_repaint_panic", "no need to repaint or panic over a color scratch car", "no panic, no repainting the whole thing", "pero tampoco es para entrar en panico ni para repintar nada"],
  ["ra_fill_exact_color_car", "touch up paint bottle in the exact color of the car", "they come in the exact color of your car", "y vienen en el color exacto de tu auto"],
  ["ra_fill_under_the_hood", "color code plate hidden under the car hood alternative", "or under the hood, in odd spots on some cars", "adentro o abajo del capo"],
  ["ra_fill_write_code_ask", "writing down the color code and asking for the paint", "note the code, ask for it", "anotas ese codigo lo pedis"],
  ["ra_fill_manual_where_plate", "manual noting where the color code plate hides by model", "the manual notes where the plate hides by model", "te deje anotado donde esta la plaquita segun el modelo"],
  // ── RETOQUE en capas ──
  ["ra_fill_let_it_dry", "letting a drop of touch up paint dry inside scratch", "let it dry, another drop", "deja secar pones otra gotita"],
  ["ra_fill_flush_with_rest", "touch up paint built up flush with rest of car paint", "in layers, until it's flush with the rest", "hasta que el color del rayon quede al ras del resto"],
  ["ra_fill_seal_and_polish", "clear coat sealing then polishing a touched up scratch", "seal with clear coat, even it with polish", "y con la pomada de pulir emparejas"],
  ["ra_fill_almost_invisible", "touched up car scratch almost invisible result close", "it comes out almost invisible", "queda casi invisible"],
  // ── MARCA BLANCA ──
  ["ra_fill_seems_terrible", "scuff mark that seems terrible but fixes in seconds car", "something that seems terrible but fixes in seconds", "que parece gravisimo pero se arregla en segundos"],
  ["ra_fill_stuck_on_paint", "colored scuff stuck on top of car paint from wall", "a white mark stuck on your paint", "pegada en tu pintura"],
  ["ra_fill_resting_not_in", "other paint resting on top not dug into car surface", "it's resting, not dug in", "esta apoyada no metida"],
  ["ra_fill_mild_products", "mild scuff removal products for car paint transfer", "if there's a lot, there are mild products", "si es mucha hay unos productos suaves"],
  ["ra_fill_test_corner_first", "testing remover on a hidden corner of car paint first", "testing first in a little corner", "probando primero en una esquinita"],
  ["ra_fill_intact_no_scratch", "car paint intact underneath scuff no scratch at all", "underneath your paint appears intact, not a scratch", "aparece tu pintura intacta sin un solo rayon"],
  ["ra_fill_most_satisfying", "very satisfying scuff removal revealing clean car paint", "one of the most satisfying things to do", "es de las cosas mas satisfactorias que vas a hacer"],
  // ── MITOS ──
  ["ra_fill_internet_full", "internet full of car scratch hacks toothpaste videos", "the internet is full of it", "porque internet esta lleno de eso"],
  ["ra_fill_why_it_works", "toothpaste fine abrasive explaining why it polishes", "you know why? A fine abrasive", "sabes por que"],
  ["ra_fill_gets_you_by", "toothpaste getting you by for a tiny scratch emergency", "for a tiny one, in an emergency, it gets you by", "te puede sacar del paso"],
  ["ra_fill_wont_reach_serious", "toothpaste not enough for a serious deep car scratch", "for something serious it won't reach", "para algo serio no te va a alcanzar"],
  ["ra_fill_no_scratch_wd40", "WD-40 removing no scratch just oily film on car", "WD-40 removes no scratch at all", "el doble ud40 no saca ningun rayon"],
  ["ra_fill_dont_forget_oil", "don't cover a scratch with oil and forget it still there", "don't cover a scratch with oil and forget, it's still there", "no tapes un rayon con aceite y te olvides"],
  // ── NIVEL 3 metal ──
  ["ra_fill_honest_part_now", "the honest part the shop won't tell you scratch metal", "now the honest part, the one the shop won't tell you", "porque ahora viene la parte honesta"],
  ["ra_fill_not_lie_to_you", "not selling a rag fix for a deep metal scratch honest", "I won't sell you a rag fix, I'd be lying", "porque te estaria mintiendo"],
  ["ra_fill_rust_in_weeks", "bare car metal starting to rust within a few weeks", "bare metal starts rusting in a few weeks", "en pocas semanas empieza a oxidarse"],
  ["ra_fill_truly_expensive", "rust making a car repair truly expensive body panel", "then it gets truly expensive", "ahi si termina siendo caro de verdad"],
  ["ra_fill_clean_deep_scratch", "cleaning a deep car scratch before sealing bare metal", "clean that deep scratch well first", "limpia bien ese rayon profundo"],
  ["ra_fill_metal_not_touch_air", "clear coat so bare metal doesn't touch the air car", "just so the metal doesn't touch the air", "solo para que el metal no toque el aire"],
  ["ra_fill_not_perfect_time", "temporary fix not perfect but buys time on scratch", "it's not perfect, but it buys time", "eso no lo deja perfecto"],
  // ── EL ERROR ──
  ["ra_fill_ruin_forever_warn", "the mistake that could ruin car paint forever warning", "the one I said could ruin your paint forever", "el que te dije que podia arruinarte la pintura para siempre"],
  ["ra_fill_three_together", "three bad habits together dry any rag circles car", "the three together are poison", "las tres cosas juntas son veneno"],
  ["ra_fill_old_rag_grit", "old rag with dust and grit dragged over car paint", "an old rag has dust and grit in it", "un trapo viejo o una franela que estuvo tirada juntando tierra"],
  ["ra_fill_circles_swirls", "circular rubbing creating swirl marks on car paint", "circles make swirls, the hardest to remove after", "y son los mas dificiles de sacar despues"],
  ["ra_fill_wet_clean_microfiber", "wet clean microfiber only for scratches car straight", "wet, clean microfiber used only for this", "con un trapo de microfibra limpio que uses solo para esto"],
  ["ra_fill_saved_bad", "car full of swirls from trying to save money badly", "or full of swirls from trying to save wrong", "por querer ahorrar mal"],
  // ── REPASO ──
  ["ra_fill_when_you_check", "person going out to check their car for scratches", "so you're clear when you go look at your car", "cuando salgas a mirar tu auto"],
  ["ra_fill_smooth_is_barniz", "nail passing smooth means barniz easy scratch car", "passes smooth: it's barniz, easy", "si pasa lisa es barniz facil"],
  ["ra_fill_two_dollars_ten", "two dollars ten minutes DIY car scratch fix recap", "two dollars, ten minutes", "dos dolares diez minutos"],
  ["ra_fill_patience_seal_polish", "patience sealing with clear coat and polishing scratch", "patience, then seal with clear coat and polish", "paciencia despues sellas con barniz y pulis"],
  ["ra_fill_stuck_paint_rubs", "white stuck paint rubbing off a car surface recap", "it's stuck paint, rubs off", "es pintura pegada se borra frotando"],
  ["ra_fill_dont_waste_time", "don't waste time on toothpaste and WD-40 myths car", "don't waste your time", "no pierdas el tiempo"],
  ["ra_fill_take_to_fix_well", "taking a rusted metal scratch to be properly fixed car", "and that one, take it to be fixed well", "y eso si llevalo a arreglar bien"],
  // ── CIERRE ──
  ["ra_fill_no_stomach_drop", "no more stomach drop seeing a scratch confident owner", "no more that stomach drop of how much it'll cost", "no vas a sentir ese vacio en el estomago"],
  ["ra_fill_solve_at_home", "solving a car scratch at home for pocket change", "you'll solve it yourself, at home, for coins", "lo vas a resolver vos en tu casa por monedas"],
  ["ra_fill_close_with_this", "wrapping up with the bigger idea cheap fixes car house", "before you go, let me close with this", "dejame cerrar con esto"],
  ["ra_fill_need_the_shop", "believing you need the shop the specialist repaint", "that you need the shop, the specialist, a full repaint", "que necesitas el taller el especialista el panel entero repintado"],
  ["ra_fill_someone_decided", "someone decided it was better you didn't know cheap fix", "a fix someone decided was better you didn't know", "que alguien decidio que era mejor que vos no supieras"],
  ["ra_fill_all_in_one_place", "forty cheap home and car fixes gathered in one place", "that's why I gathered the forty in one place", "por eso junte esos 40 arreglos en un solo lugar"],
  ["ra_fill_no_depend_anyone", "having every fix on hand not depending on anyone manual", "so you have it on hand and depend on no one", "lo arme para que tengas todo a mano y no dependas de nadie"],
  ["ra_fill_refund_every_peso", "money back refund every peso guarantee repair manual", "if it doesn't help, I refund every peso", "si no te sirve te devuelvo cada peso"],
  ["ra_fill_ac_no_ripoff", "recharging car AC yourself without being ripped off shop", "recharge your AC for a fraction, no rip-off", "por una fraccion de lo que te cobra el taller sin que te vean la cara"],
  ["ra_fill_one_fix_at_time", "building independence one cheap car fix at a time", "one fix at a time, see you in the next one", "un arreglo a la vez"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 3, kind: "raw", src: `real/${name}.png`, darken: 0, hue: HUES[Math.round(s) % 3] }); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── BURSTS extra (oxstack) para flashes sub-1s en momentos de lista ──
const BURSTS = [
  { at: "distinguir los tres tipos de rayon", images: ["real/ra_scratch_only_clearcoat.png", "real/ra_scratch_reached_color.png", "real/ra_deep_scratch_bare_metal.png"], captions: ["Solo el barniz", "Llegó al color", "Llegó al metal"], accent: "amber" },
  { at: "una pomada de pulir", images: ["real/ra_polishing_compound_tube.png", "real/ra_microfiber_cloth_polish.png", "real/ra_scratch_fading_away.png"], captions: ["Pomada de pulir", "Trapo microfibra", "El rayón se va"], accent: "blue" },
  { at: "la pasta de dientes y el doble ud40", images: ["real/ra_toothpaste_on_scratch.png", "real/ra_wd40_can_scratch.png", "real/ra_scratch_back_same.png"], captions: ["Pasta: lija floja", "WD-40: aceite", "Vuelve igual"], accent: "red" },
  { at: "hagamos un repaso rapido el plan completo", images: ["real/ra_fingernail_test_close.png", "real/ra_polishing_compound_tube.png", "real/ra_touchup_paint_pens.png"], captions: ["Pasá la uña", "Pomada de pulir", "Retoque en capas"], accent: "amber" },
];
for (const b of BURSTS) { const s = atc(b.at); if (s == null) continue; beats.push({ id: `burst_${Math.round(s)}`, start: +s.toFixed(2), dur: 4.2, kind: "oxstack", overlay: true, hue: "amber", images: b.images, captions: b.captions, accent: b.accent }); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "bars", at: "por repintar el panel entero", hue: "red", title: "Lo que pagás de más", bars: [{ label: "Repintar el panel entero", value: 100, display: "$500", tone: "danger" }, { label: "Sacarlo vos mismo", value: 3, display: "café", winner: true }] },
  { kind: "bars", at: "estan solamente en esa capa transparente", hue: "amber", title: "Qué tan hondo va el rayón", bars: [{ label: "Solo el barniz (se saca)", value: 90, display: "90%", winner: true }, { label: "Llega al color o al metal", value: 10, display: "10%", tone: "danger" }] },
  { kind: "bars", at: "es un truco para una foto", hue: "red", title: "El WD-40 vs el arreglo real", bars: [{ label: "WD-40: dura", value: 5, display: "2 días", tone: "danger" }, { label: "Pomada y retoque: dura", value: 100, display: "años", winner: true }] },
  { kind: "process", at: "vamos al primero el mas comun", hue: "blue", title: "El rayón de barniz, en 10 minutos", eyebrow: "Por monedas, en la vereda", steps: [{ title: "Lavá la zona", desc: "si hay tierra, se convierte en lija y raya más" }, { title: "Pomada en microfibra", desc: "frotá derecho, siguiendo el rayón, no en círculos" }, { title: "Dos o tres pasadas", desc: "el rayón se va aclarando hasta desaparecer" }] },
  { kind: "process", at: "el rayon donde la una se engancho un poco llego al color", hue: "amber", title: "El rayón que llegó al color", eyebrow: "Pintura de retoque, con paciencia", steps: [{ title: "Código de color", desc: "la plaquita en el marco de la puerta del conductor" }, { title: "Gotitas finitas", desc: "con un palillo, adentro del rayón, en capas" }, { title: "Sellá y pulí", desc: "barniz transparente arriba y empatalo con la pomada" }] },
  { kind: "aged", at: "eso se saca con la una y dos cosas que ya tenes en casa", hue: "amber", heading: "EL TRUCO DE LA UÑA", eyebrow: "Tarda dos segundos y vale oro", lines: ["Pasa lisa: es barniz, fácil", "Engancha apenas: llegó al color", { text: "Se traba fuerte: llegó al metal", mark: true }] },
  { kind: "aged", at: "el error es frotar en seco con cualquier trapo y en circulos", hue: "red", heading: "EL ERROR FATAL", eyebrow: "Las tres cosas juntas son veneno", lines: ["En seco, sin lubricación", "Con cualquier trapo con arenilla", { text: "Y en círculos: quedan remolinos para siempre", mark: true }] },
  { kind: "callout", at: "se sacan en la vereda vos solo en 10 minutos", figure: "10 min", caption: "En la vereda, vos solo, por menos que un café.", accent: "good", image: "real/ra_polish_scratch_curb.png" },
  { kind: "callout", at: "para llevarse los golpes en lugar de la pintura", figure: "El barniz", caption: "Está ahí para llevarse los golpes en lugar de la pintura.", accent: "cold", image: "real/ra_clearcoat_layer_shine.png" },
  { kind: "callout", at: "te gastaste cinco dolares en vez de quinientos", figure: "$5", caption: "Retoque en capas: cinco dólares en vez de quinientos.", accent: "good", image: "real/ra_five_not_five_hundred.png" },
  { kind: "callout", at: "es que ese metal quedo desnudo", figure: "Óxido", caption: "El metal desnudo, expuesto al aire, empieza a oxidarse.", accent: "danger", image: "real/ra_bare_metal_exposed.png" },
  { kind: "callout", at: "cuesta menos que una sola visita al taller y tiene garantia", figure: "< 1 visita", caption: "El manual cuesta menos que una sola visita al taller.", accent: "good", image: "real/ra_manual_cover_repairs.png" },
  { kind: "callout", at: "esos remolinos son los que mas se notan", figure: "Remolinos", caption: "Los círculos dejan remolinos: lo más difícil de sacar después.", accent: "danger", image: "real/ra_swirl_marks_sun.png" },
  { kind: "checklist", at: "hagamos un repaso rapido el plan completo", hue: "blue", title: "El plan completo", items: [{ text: "Pasá la uña: te dice todo", state: "done" }, { text: "Barniz: pomada de pulir, derecho, no en círculos", state: "done" }, { text: "Color: retoque del código, en gotitas y capas", state: "done" }, { text: "Marca blanca: es pintura pegada, se frota", state: "done" }, { text: "Metal: tapalo ya y llevalo a arreglar bien", state: "done" }] },
  { kind: "callout", at: "la industria gana cuando vos crees que no podes hacer las cosas solo", figure: "La industria", caption: "Gana cuando creés que no podés hacer las cosas solo.", accent: "danger", image: "real/ra_industry_wins_you_doubt.png" },
  { kind: "callout", at: "eso se llama transferencia de pintura", figure: "Se frota", caption: "La marca blanca es pintura pegada arriba: se frota y se va.", accent: "good", image: "real/ra_white_transfer_mark.png" },
  { kind: "splitlist", at: "pasta de dientes y el doble", title: "Lo que NO te sirve para un rayón", items: ["Pasta de dientes: apenas una lija floja", "WD-40: lo tapa 2 días y se va con la lluvia", "Frotar en seco: raya el auto más", "Trapo viejo sucio: mete arenilla"], palette: "D" },
  { kind: "cross", at: "no tiene una sola capa", hue: "cold", title: "Tu pintura tiene 3 capas", eyebrow: "De arriba hacia abajo", layers: [{ label: "Barniz (clear coat)", depth: "casi todo rayón", color: "#dfe7ee" }, { label: "Color", depth: "la pintura", color: "#c94f4f" }, { label: "Metal + base", depth: "si llega, se oxida", color: "#8a8f96" }] },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

fs.mkdirSync("public/broll", { recursive: true }); fs.mkdirSync("public/real", { recursive: true }); fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));
if (MODE === "match") { console.log(`=== build_rayones MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
const haveClip = (n) => fs.existsSync(`public/broll/${n}.mp4`);
const haveReal = (n) => fs.existsSync(`public/real/${n}.png`) || fs.existsSync(`public/real/${n}.jpg`);
const haveImg = (n) => fs.existsSync(`public/img/${n}.png`);
let nClip = 0, nReal = 0, nImg = 0, nMiss = 0; const miss = [];
for (const b of beats) { if (b.kind !== "raw") continue; if (b.src.startsWith("broll/")) { if (haveClip(b.id)) nClip++; else if (haveReal(b.id)) { b.src = `real/${b.id}.png`; nReal++; } else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("real/")) { if (haveReal(b.id)) nReal++; else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("img/")) { if (haveImg(b.id)) nImg++; else { nMiss++; miss.push(b.id); } } }
// DENSIDAD MÁXIMA: recomputar dur por beat raw (permite flashes sub-1s, min 0.8s).
{ const ord = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
  for (let i = 0; i < ord.length; i++) { const b = ord[i]; if (b.kind !== "raw") continue; const next = i + 1 < ord.length ? ord[i + 1].start : TOTAL; b.dur = +Math.max(0.8, Math.min(next - b.start + 0.3, 7)).toFixed(2); } }
// SEGURIDAD: dropear beats raw cuyo asset no existe (evita 404 en el farm).
for (let i = beats.length - 1; i >= 0; i--) { const b = beats[i]; if (b.kind === "raw" && !fs.existsSync("public/" + b.src)) beats.splice(i, 1); }
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, clipsfirst: true, beats }, null, 1));
const AVF = [[0, OPEN]];
for (let i = 0; i < SEC.length; i++) { if (!SEC[i].full) continue; const st = SEC[i].start; const end = i + 1 < SEC.length ? SEC[i + 1].start : TOTAL; AVF.push([st, end]); }
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
for (let i = 0; i < beats.length; i++) { if (beats[i].kind !== "raw") continue; if (i % 5 === 2) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; } }
const firstClip = beats.length ? beats[0].start : OPEN;
const inAvf = (t) => AVF.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
// cobertura por beats raw; en huecos SIN clip el avatar va FULL (nunca negro)
const cov = beats.filter((b) => b.kind === "raw").map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
const covered = (t) => cov.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const modeAt = (t) => { if (t < firstClip - 1e-6) return "full"; if (inAvf(t)) return "full"; if (!covered(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...cov.flat(), TOTAL].map((x) => +(+x).toFixed(2)))].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_rayones BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
