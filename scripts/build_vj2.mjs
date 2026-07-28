// build_vj2.mjs — DIRECTOR por secciones para vj2l6qtv0c98 (Levi Lapp Jardín · Amish avatar).
// Lee captions, arma beats anclados al ms de la voz, cicla pools de b-roll/imgs por sección,
// coloca tarjetas de componentes autoradas, calcula ventanas de avatar (full/hidden) para ~32%.
// Emite: beatsheet/vj2l6qtv0c98.json · _v3/vj2l6qtv0c98_plan.json · src/VideoEdit/avatar_vj2l6qtv0c98.gen.ts
import fs from "fs";

const SLUG = "vj2l6qtv0c98";
const T = 1136.703;              // duración exacta (ffprobe)
const TARGET_AVATAR = 0.33;    // apunta alto; tras merges/clamps aterriza ~29-30% (ref vki4 32.8%)

// palabras VISIBLES de una tarjeta (para fijar su duración = legible por construcción)
function cardWords(c){
  const bag = [];
  const push = (v)=>{ if(typeof v==="string") bag.push(v); };
  for (const k of ["title","eyebrow","text","caption","figure","heading","label"]) push(c[k]);
  for (const it of (c.chips||[])) push(it);
  for (const it of (c.items||[])) push(typeof it==="string"?it:it.text);
  for (const st of (c.steps||[])) { push(st.title); push(st.desc); }
  for (const ln of (c.lines||[])) push(ln.text);
  for (const wp of (c.waypoints||[])) push(wp.label);
  for (const s of [c.left,c.right]) if(s){ push(s.tag); push(s.title); push(s.sub); }
  for (const b of (c.bars||[])) { push(b.label); push(b.display); }
  for (const l of (c.layers||[])) push(l.label);
  if (c.marker) push(c.marker.label);
  return bag.join(" ").split(/\s+/).filter((w)=>/[a-zA-Z0-9áéíóúñ]/.test(w)).length;
}
const compDur = (c)=> Math.min(8.0, Math.max(3.0, +(0.8 + cardWords(c)/2.5 + 0.35).toFixed(1)));
// recorte de TITULAR: los componentes con estructura (steps/items/lines) acumulan texto.
// Quito lo redundante para que cada cartel se LEA en ~4-5s (regla: titular, no párrafo).
function trimCard(c){
  if (c.steps){ c.steps = c.steps.slice(0,3).map((s)=>({ title:s.title })); } // sin desc
  if (c.lines){ c.lines = c.lines.slice(0,2); }
  if (c.items){ c.items = c.items.slice(0,3); }
  // TITULAR, no párrafo: topá en ~11 palabras sacrificando lo secundario (la voz lo dice).
  const CAP = 10;
  const drops = ["eyebrow","label","caption"]; // orden de sacrificio (conserva title/text/figure/heading)
  for (const k of drops){ if (cardWords(c) <= CAP) break; delete c[k]; }
  if (cardWords(c) > CAP && c.items) c.items = c.items.slice(0,2);
  if (cardWords(c) > CAP && c.steps) c.steps = c.steps.slice(0,2);
  if (cardWords(c) > CAP && c.chips) c.chips = c.chips.slice(0,2);
  return c;
}
const words = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const wStart = words.map((w) => w.startMs / 1000);
const snap = (t) => {           // ancla t al inicio de palabra más cercano
  let best = t, bd = 1e9;
  for (const s of wStart) { const d = Math.abs(s - t); if (d < bd) { bd = d; best = s; } }
  return +best.toFixed(2);
};

// ── clips de stock disponibles (public/broll/vj2_*.mp4) ──
const CLIPS = fs.readdirSync("public/broll").filter((f) => /^vj2_.*\.mp4$/.test(f)).map((f) => "broll/" + f);
const clip = (name) => { const hit = CLIPS.find((c) => c.includes(name)); return hit || CLIPS[0]; };
// imágenes personales (pueden faltar si el lote aún corre; se filtran al final)
const IMG = (n) => `img/${SLUG}_p_${n}.png`;

const H_WARM = "amber", H_COLD = "cold", H_RED = "red";

// ── SECCIONES (t en segundos; pools de visuales + tarjetas de componentes autoradas) ──
const SEC = [
  {
    id: "hook", obj: "Cold-open del súper vacío + agosto como mes bisagra + abuelo Amos: enganchar y prometer el error del final",
    t0: 0, t1: 168, hue: H_COLD,
    clips: ["supermarket_produce","empty_shelves","frost_field_sunrise","snow_garden","countryside_farm","furrow_hoe","old_hands_garden","hands_sowing_seeds","seed_packet_hand","low_sun_field","soil_closeup","harvest_basket","wheelbarrow_garden"],
    imgs: [IMG("13"),IMG("10"),IMG("11"),IMG("12"),IMG("00")],
    cards: [
      { kind:"headline", eyebrow:"Agosto", tokens:["5","semillas.","Comida","hasta","marzo."], hue:H_WARM, size:120 },
      { kind:"quote", image:IMG("13"), eyebrow:"La creencia que sale cara", text:"La huerta *no* se acaba en septiembre", accent:"danger", hue:H_COLD },
      { kind:"chips", bg:"image", image:clipImg("supermarket_produce"), title:"En enero el súper te cobra", chips:["el doble","por menos"], hue:H_RED },
      { kind:"callout", figure:"6 meses", eyebrow:"Lo que está en juego", caption:"Comer de tu tierra el medio año más caro", accent:"good", hue:H_WARM },
      { kind:"aged", eyebrow:"El abuelo Amos", heading:"Plantaba en agosto", lines:[{text:"Los vecinos se reían"},{text:"En enero comía de su huerta",mark:true},{text:"Nunca le cobró a nadie"}], accent:"accent", hue:H_WARM },
      { kind:"splitlist", title:"Antes no había", items:["Nevera","Góndola","Camión frigorífico"], palette:"D", cross:true },
      { kind:"quote", image:IMG("10"), eyebrow:"Al final del video", text:"El *error* que arruina el 90%", accent:"danger", hue:H_COLD },
    ],
  },
  {
    id: "espinaca", obj: "Cultivo 1: la espinaca fabrica anticongelante — más dulce con el frío; riego escaso en invierno",
    t0: 168, t1: 335, hue: H_WARM, rule: { number:"01", title:"La espinaca", label:"CULTIVO" },
    clips: ["spinach_leaves","spinach_frost","spinach_seedbed","spinach_harvest_hand","frost_leaf_macro","watering_seedbed","rain_garden_soil","frost_grass_macro","hands_harvest_greens"],
    imgs: [IMG("01"),IMG("00")],
    cards: [
      { kind:"process", eyebrow:"Por qué se endulza", title:"El anticongelante de la planta", accent:"good", hue:H_COLD, steps:[{title:"Baja la temperatura",desc:"llega el frío"},{title:"Bombea azúcar",desc:"a las hojas"},{title:"No se congela",desc:"más dulce"}] },
      { kind:"journey", eyebrow:"Una siembra de agosto", title:"Hojas hasta marzo", accent:"good", waypoints:[{label:"Agosto"},{label:"Nov"},{label:"Enero"},{label:"Marzo"}] },
      { kind:"stat", value:8, prefix:"−", suffix:" °C", label:"Aguanta sin manta", eyebrow:"Con 4 o 5 hojas", accent:"good", hue:H_COLD },
      { kind:"chips", bg:"image", image:clipImg("spinach_frost"), title:"La de enero es", chips:["más dulce","más gruesa"], hue:H_WARM },
      { kind:"checklist", eyebrow:"Cómo se cosecha", title:"Hoja a hoja, todo el invierno", accent:"good", hue:H_WARM, items:[{text:"Quitá las hojas de fuera",state:"done"},{text:"Deja el centro",state:"done"},{text:"Sigue produciendo",state:"doing"}] },
      { kind:"callout", figure:"El charco", eyebrow:"El error que mata más que la helada", caption:"En invierno regá poco: pudre las raíces", accent:"danger", hue:H_COLD },
      { kind:"quote", image:clipImg("spinach_leaves"), eyebrow:"El secreto de todo", text:"En invierno no cultivás: *conservás*", accent:"accent", hue:H_WARM },
    ],
  },
  {
    id: "zanahoria", obj: "Cultivo 2: la zanahoria como despensa viva bajo paja; el frío la endulza",
    t0: 335, t1: 430, hue: H_WARM, rule: { number:"02", title:"La zanahoria", label:"CULTIVO" },
    clips: ["carrots_soil","carrot_harvest","carrot_bunch","carrot_seeds_sowing","straw_mulch","soil_closeup","wooden_crate_veg","compost_soil_dark"],
    imgs: [IMG("03"),IMG("15")],
    cards: [
      { kind:"chips", bg:"image", image:clipImg("carrots_soil"), title:"El suelo es tu", chips:["despensa","viva"], hue:H_WARM },
      { kind:"checklist", eyebrow:"No necesitás", title:"Ni nevera ni frascos", accent:"good", hue:H_WARM, items:[{text:"Se queda enterrada",state:"done"},{text:"La sacás el día que la usás",state:"done"},{text:"Fresca en enero",state:"doing"}] },
      { kind:"callout", figure:"1 o 2 heladas", eyebrow:"El truco", caption:"El frío convierte su almidón en azúcar", accent:"good", hue:H_COLD },
      { kind:"process", eyebrow:"La siembra", title:"Directa, nunca de plantín", accent:"accent", hue:H_WARM, steps:[{title:"Surco poco profundo",desc:"apenas tapás"},{title:"Riego fino",desc:"hasta que asome"},{title:"Manto de paja",desc:"cuando llega el frío"}] },
      { kind:"stat", value:0, prefix:"$", suffix:"", label:"Un manto de paja", eyebrow:"La mejor nevera", accent:"good", hue:H_WARM },
    ],
  },
  {
    id: "col", obj: "Cultivo 3: la col rizada, el rey del invierno; aguanta -15 y se endulza con la helada",
    t0: 430, t1: 525, hue: H_COLD, rule: { number:"03", title:"La col rizada", label:"CULTIVO" },
    clips: ["kale_garden","kale_frost","kale_curly_macro","kale_winter_garden","frost_plants","snow_garden","frost_leaf_macro"],
    imgs: [IMG("02")],
    cards: [
      { kind:"stat", value:15, prefix:"−", suffix:" °C", label:"Sigue de pie, verde", eyebrow:"El rey del invierno", accent:"good", hue:H_COLD },
      { kind:"quote", image:clipImg("kale_frost"), eyebrow:"El frío no la castiga", text:"La *endulza*", accent:"good", hue:H_COLD },
      { kind:"vs", eyebrow:"Por qué la odian", title:"El kale que probaste estaba mal", left:{ tag:"Primavera", title:"Amargo", sub:"el del súper" }, right:{ tag:"Enero", title:"Dulce", sub:"tras tres heladas" }, hue:H_WARM },
      { kind:"callout", figure:"6 meses", eyebrow:"De una sola semilla", caption:"Da hojas hasta que florece en primavera", accent:"good", hue:H_WARM },
      { kind:"checklist", eyebrow:"Cómo se planta", title:"Dale su espacio", accent:"accent", hue:H_WARM, items:[{text:"Palmo y medio entre plantas",state:"done"},{text:"Cosechá las de abajo",state:"done"},{text:"Deja el cogollo central",state:"doing"}] },
    ],
  },
  {
    id: "puerro", obj: "Cultivo 4: el puerro, el soldado del caldo; se queda de pie todo el invierno",
    t0: 525, t1: 640, hue: H_WARM, rule: { number:"04", title:"El puerro", label:"CULTIVO" },
    clips: ["leek_field","leek_harvest","leek_rows","leek_soup","leek_cutting","winter_soup_pot","soup_steam"],
    imgs: [IMG("05"),IMG("06")],
    cards: [
      { kind:"chips", bg:"image", image:clipImg("leek_field"), title:"El soldado del", chips:["huerto","frío"], hue:H_WARM },
      { kind:"checklist", eyebrow:"Lo bueno del puerro", title:"No hay que guardarlo", accent:"good", hue:H_WARM, items:[{text:"Se queda plantado",state:"done"},{text:"No se pudre",state:"done"},{text:"Lo sacás cuando querés",state:"doing"}] },
      { kind:"quote", image:clipImg("winter_soup_pot"), eyebrow:"La cocina de invierno", text:"No hay caldo sin un *puerro* dentro", accent:"accent", hue:H_WARM },
      { kind:"process", eyebrow:"El otro truco", title:"Cuanto más hondo, más blanco", accent:"accent", hue:H_WARM, steps:[{title:"Un agujero hondo",desc:"de un palmo"},{title:"Dejá caer el plantín",desc:"no rellenes"},{title:"El riego tapa solo",desc:"tallo largo"}] },
      { kind:"callout", figure:"Lento", eyebrow:"Por eso agosto", caption:"El puerro pide tiempo: es el último tren", accent:"danger", hue:H_COLD },
    ],
  },
  {
    id: "acelga", obj: "Cultivo 5: la acelga, la generosa; y matar la excusa del balcón",
    t0: 640, t1: 757, hue: H_WARM, rule: { number:"05", title:"La acelga", label:"CULTIVO" },
    clips: ["chard_rainbow","chard_leaves","chard_garden_row","hands_harvest_greens","planter_box","harvest_basket","hands_harvest_basket"],
    imgs: [IMG("08"),IMG("09")],
    cards: [
      { kind:"chips", bg:"image", image:clipImg("chard_rainbow"), title:"La más", chips:["generosa","de todas"], hue:H_WARM },
      { kind:"checklist", eyebrow:"Cortar y volver", title:"Da y da durante meses", accent:"good", hue:H_WARM, items:[{text:"Quitá las hojas de fuera",state:"done"},{text:"Vuelven en el centro",state:"done"},{text:"Explota a fin de invierno",state:"doing"}] },
      { kind:"chips", bg:"image", image:clipImg("chard_leaves"), title:"Penca", chips:["blanca","roja","amarilla"], hue:H_WARM },
      { kind:"splitlist", title:"«Yo solo tengo balcón»", items:["Espinaca en jardinera","Acelga contra la pared","Zanahoria en cajón hondo"], palette:"G" },
      { kind:"callout", figure:"4 macetas", eyebrow:"No hace falta terreno", caption:"Agosto y un puñado de tierra. Punto.", accent:"good", hue:H_WARM },
    ],
  },
  {
    id: "limites", obj: "Límites honestos: no es huerta de verano; producción lenta; ventilar el túnel",
    t0: 757, t1: 840, hue: H_COLD,
    clips: ["greenhouse_tunnel","greenhouse_interior","fleece_cover","fleece_row_cover","frost_plants","watering_garden","snowy_garden_beds"],
    imgs: [IMG("07")],
    cards: [
      { kind:"splitlist", title:"Lo que esto NO hace", items:["Sin tomate","Sin pimiento","Sin calabacín"], palette:"D", cross:true },
      { kind:"aged", eyebrow:"Comida honesta de invierno", heading:"Hoja, raíz y caldo", lines:[{text:"La de siempre"},{text:"Sin avión ni fresas de enero",mark:true}], accent:"accent", hue:H_WARM },
      { kind:"quote", image:clipImg("snowy_garden_beds"), eyebrow:"Guardate esta frase", text:"En enero no cultivás: *cosechás*", accent:"accent", hue:H_COLD },
      { kind:"callout", figure:"¡Ventilá!", eyebrow:"Advertencia de verdad", caption:"El túnel al sol cuece las plantas. Abrí de día.", accent:"danger", hue:H_RED },
    ],
  },
  {
    id: "error", obj: "El error del 90%: el periodo Perséfone — sin luz no crece; llegar crecida antes del apagón; el enemigo (vivero)",
    t0: 840, t1: 1015, hue: H_COLD,
    clips: ["low_sun_field","short_winter_day","frost_field_sunrise","seedling_growing","green_sprouts_row","garden_bed_rows","snow_garden","rain_garden_soil"],
    imgs: [IMG("07"),IMG("13")],
    cards: [
      { kind:"quote", image:clipImg("short_winter_day"), eyebrow:"El error que arruina el 90%", text:"No depende del frío. Depende de la *luz*", accent:"danger", hue:H_COLD },
      { kind:"stat", value:10, prefix:"<", suffix:" h", label:"Horas de luz al día", eyebrow:"Y la planta se para", accent:"danger", hue:H_COLD },
      { kind:"aged", eyebrow:"Eliot Coleman · Maine", heading:"El periodo de Perséfone", lines:[{text:"Menos de 10 h de luz"},{text:"No crece nada. Nada.",mark:true}], accent:"accent", hue:H_COLD },
      { kind:"process", eyebrow:"Lo que significa", title:"Tiene que llegar ya crecida", accent:"danger", hue:H_COLD, steps:[{title:"Sembrás en agosto",desc:"con luz"},{title:"Crece grande",desc:"antes del apagón"},{title:"La cosechás viva",desc:"todo el invierno"}] },
      { kind:"vs", eyebrow:"Agosto, no octubre", title:"El mismo cultivo, dos siembras", left:{ tag:"Septiembre", title:"Enano parado", sub:"pasás hambre" }, right:{ tag:"Agosto", title:"Ya hecha", sub:"comés en enero" }, hue:H_WARM },
      { kind:"callout", figure:"Vacío", eyebrow:"Por qué no te lo cuentan", caption:"En agosto el vivero ya vendió lo del año", accent:"danger", hue:H_RED, image:IMG("13") },
      { kind:"quote", image:clipImg("garden_bed_rows"), eyebrow:"El secreto entero", text:"Cosechás lo que guardaste *vivo* en la tierra", accent:"accent", hue:H_WARM },
      { kind:"cross", eyebrow:"Menos de 10 h de luz", title:"La planta se para, no se muere", hue:H_COLD, layers:[{label:"Luz de invierno",depth:"escasa",color:"rgba(150,160,170,0.4)",weight:0.7},{label:"La planta",depth:"viva, parada",color:"rgba(120,170,90,0.55)",weight:1},{label:"La tierra",color:"rgba(90,70,50,0.8)",weight:1.1}], marker:{label:"sin crecer",atDepth:0.5,color:"danger"} },
    ],
  },
  {
    id: "cierre", obj: "Recap numerado + carnada de comentarios + teaser del próximo + firma",
    t0: 1015, t1: T, hue: H_WARM,
    clips: ["harvest_basket","hands_harvest_greens","hands_harvest_basket","root_cellar_crates","countryside_farm","wheelbarrow_garden"],
    imgs: [IMG("09"),IMG("14"),IMG("04")],
    cards: [
      { kind:"checklist", eyebrow:"Este fin de semana", title:"Los 5, en orden", accent:"good", hue:H_WARM, items:[{text:"Espinaca directa",state:"done"},{text:"Zanahoria bajo paja",state:"done"},{text:"Col rizada, la más dura",state:"done"},{text:"Puerro, hondo",state:"done"},{text:"Acelga, la generosa",state:"doing"}] },
      { kind:"quote", image:clipImg("harvest_basket"), eyebrow:"La regla de oro", text:"Sembrá en agosto, no en *octubre*", accent:"accent", hue:H_WARM },
      { kind:"chips", bg:"image", image:clipImg("countryside_farm"), title:"Contame", chips:["dónde vivís","cuándo hiela"], hue:H_WARM },
      { kind:"aged", eyebrow:"El próximo video", heading:"Una caja, arena y hojas secas", lines:[{text:"Zanahorias crujientes en marzo"},{text:"Sin nevera, sin electricidad",mark:true}], accent:"accent", hue:H_WARM, image:IMG("14") },
      { kind:"callout", figure:"Agosto", eyebrow:"La gente sencilla sabía", caption:"Todavía estás a tiempo, por unas semanas", accent:"good", hue:H_WARM },
      { kind:"bars", eyebrow:"La cuenta de invierno", title:"Tu huerta vs el súper", orientation:"horizontal", hue:H_WARM, bars:[{label:"Tu tierra",value:100,display:"6 meses",tone:"good",winner:true},{label:"El súper",value:35,display:"el doble caro",tone:"danger"}] },
    ],
  },
];

// clipImg: para componentes que piden imagen pero quiero un frame de un clip → uso una img personal
// de respaldo (los componentes con image usan png). Si no hay match, cae a una img personal genérica.
function clipImg(_name) { return IMG("00"); }

// ── filtrar imágenes personales que no existen todavía (el lote gpt-image puede seguir) ──
const imgExists = (rel) => fs.existsSync("public/" + rel);
const fallbackClip = (pool) => "broll/" + (CLIPS.map((c)=>c.replace("broll/","")).find((c)=>pool.some((p)=>c.includes(p))) || CLIPS[0].replace("broll/",""));

// ── ventanas de avatar: reparto el presupuesto de talk (~32%) ──
const openTalk = [0, 4];
const closeTalk = [T - 16, T];
let budget = TARGET_AVATAR * T - (openTalk[1]-openTalk[0]) - (closeTalk[1]-closeTalk[0]);
const secLen = SEC.map((s)=> s.t1 - s.t0);
const totLen = secLen.reduce((a,b)=>a+b,0);
// cada sección: intro talk (arranque) + mid talk (~58%)
const talkWins = [openTalk];
for (let i=0;i<SEC.length;i++){
  const s = SEC[i];
  const share = budget * (secLen[i]/totLen);
  const intro = Math.max(8, share*0.5);
  const mid = Math.max(6, share - intro);
  const a0 = i===0 ? 6 : s.t0 + 0.5;           // en el hook, después del open
  talkWins.push([snap(a0), snap(a0+intro)]);
  const m0 = s.t0 + secLen[i]*0.58;
  talkWins.push([snap(m0), snap(m0+mid)]);
}
talkWins.push(closeTalk);
talkWins.sort((a,b)=>a[0]-b[0]);
// fusionar solapes
const talk = [];
for (const w of talkWins){ const last=talk[talk.length-1]; if(last && w[0]<=last[1]+0.3){ last[1]=Math.max(last[1],w[1]); } else talk.push([...w]); }
const inTalk = (t)=> talk.some(([a,b])=> t>=a-0.01 && t<b);

// ── generar beats por sección ──
const beats = [];
const durPat = [2.4,3.2,4.0,2.6,3.6,4.8,2.5,3.4,2.8,4.4,2.7,3.0];
let dpi = 0;
let cardIdx = {};
for (const s of SEC){
  cardIdx[s.id]=0;
  const rawPool = s.clips.map((c)=>clip(c)).filter(Boolean);
  const imgPool = (s.imgs||[]).filter(imgExists);
  let ri=0, ii=0, rawCount=0; // rawCount independiente del patrón de componentes
  let t = s.t0;
  let placedRule = false;
  let beatN = 0;
  // ¿esta sección requiere primer beat = rule card? (crop reveal) tras el intro-talk
  while (t < s.t1 - 0.2){
    if (inTalk(t)){ // saltar ventana de talk (avatar full, sin cue)
      const w = talk.find(([a,b])=> t>=a-0.01 && t<b);
      t = w[1];
      continue;
    }
    // crop reveal: primera vez fuera de talk en la sección
    if (s.rule && !placedRule){
      const st = snap(t); const dur = 4.6;
      beats.push({ id:`${s.id}_rule`, start:st, dur, kind:"rule", number:s.rule.number, title:s.rule.title, label:s.rule.label, hue:H_WARM });
      placedRule = true; t = st + dur; beatN++; continue;
    }
    const st = snap(t);
    if (st >= s.t1 - 0.2) break;
    // ¿componente o raw? patrón ~ 5 comp cada 7 beats (para comp/min ≥7 sobre el total)
    const wantComp = (beatN % 4 < 3);
    let dur, beat;
    if (wantComp && s.cards.length){
      const card = trimCard(JSON.parse(JSON.stringify(s.cards[cardIdx[s.id] % s.cards.length]))); cardIdx[s.id]++;
      dur = compDur(card); // duración EXACTA que pide su texto → legible por construcción
      if (card.kind === "cross") dur = 8.0; // CrossSection: legibilidad cuenta los colores rgba → dale el máximo
      beat = { id:`${s.id}_c${beatN}`, start:st, ...card };
      beat.dur = dur;
    } else {
      dur = durPat[dpi++ % durPat.length];
      // alternar clip / imagen personal (cada 3ª RAW es imagen; el resto clip)
      let src;
      if (imgPool.length && (rawCount % 3 === 2)) { src = imgPool[ii++ % imgPool.length]; }
      else { src = rawPool[ri++ % rawPool.length]; }
      rawCount++;
      beat = { id:`${s.id}_r${beatN}`, start:st, dur, kind:"raw", src, hue:s.hue, darken:0 };
    }
    // no pasar el fin de sección; si un COMP queda clampado corto sería ilegible → pasalo a raw
    if (st + dur > s.t1){
      const clamped = Math.max(2.4, +(s.t1 - st).toFixed(2));
      if (beat.kind !== "raw" && beat.kind !== "rule" && clamped < dur - 0.3){
        const src = rawPool[ri++ % rawPool.length];
        beat = { id:`${s.id}_rc${beatN}`, start:st, dur:clamped, kind:"raw", src, hue:s.hue, darken:0 };
      } else beat.dur = clamped;
    }
    beats.push(beat); t = st + beat.dur; beatN++;
  }
}
beats.sort((a,b)=>a.start-b.start);

// post-pase: garantizar ≥40 clips distintos usando TODOS los del disco (density: 1 clip/30s ≈ 38).
{
  const TARGET_CLIPS = 42;
  const distinct = () => new Set(beats.filter((b)=>b.kind==="raw"&&b.src.startsWith("broll/")).map((b)=>b.src));
  let unused = CLIPS.filter((c)=>!distinct().has(c));
  const rawBeats = beats.filter((b)=>b.kind==="raw");
  // 1) beats-clip DUPLICADOS → clip no usado (no baja distintos)
  const seen = new Set(); const dup = [];
  for (const b of rawBeats){ if (b.src.startsWith("broll/")){ if (seen.has(b.src)) dup.push(b); else seen.add(b.src); } }
  for (const b of dup){ if (!unused.length) break; b.src = unused.shift(); }
  // 2) si aún faltan, convertí beats-IMAGEN a clip no usado (conservando variedad de imgs)
  const imgBeats = rawBeats.filter((b)=>b.src.startsWith("img/"));
  let ib = imgBeats.length - 1; // desde el final, para no tocar las primeras (hook)
  while (distinct().size < TARGET_CLIPS && unused.length && ib >= 4){ imgBeats[ib--].src = unused.shift(); }
}

// sanear imágenes inexistentes en componentes (image/bg) → quita image (chips vuelve a bg color)
for (const b of beats){
  if (b.image && !imgExists(b.image)) { delete b.image; if (b.bg==="image") delete b.bg; }
}

// ── ventanas avatar: full durante talk; hidden durante beats ──
const wins = [];
let mode = null;
const evAt = (t, m) => { if (m!==mode){ wins.push({ start:+t.toFixed(2), mode:m }); mode=m; } };
// construir línea de tiempo por muestreo de límites de beats/talk
const marks = new Set([0]);
for (const b of beats){ marks.add(+b.start.toFixed(2)); marks.add(+(b.start+b.dur).toFixed(2)); }
for (const w of talk){ marks.add(+w[0].toFixed(2)); marks.add(+w[1].toFixed(2)); }
const sorted = [...marks].filter((x)=>x<T).sort((a,b)=>a-b);
const covered = (t) => beats.some((b)=> t>=b.start-0.001 && t < b.start+b.dur-0.001);
for (const t of sorted){ evAt(t, covered(t+0.01) ? "hidden" : "full"); }
if (wins[0].start!==0) wins.unshift({start:0,mode:"full"});
if (wins[0].mode!=="full") wins[0]={start:0,mode:"full"}; // garantía: abre con avatar full

// ── emitir archivos ──
fs.mkdirSync("beatsheet",{recursive:true});
const bs = { video: SLUG, avatar: `avatar_${SLUG}.mp4`, captions: `public/captions_${SLUG}.json`, beats };
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify(bs,null,1));

const avatarTs = `// avatar_${SLUG}.gen.ts — GENERADO por build_vj2.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_${SLUG.toUpperCase()} = ${T};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(wins,null,2)};
`;
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, avatarTs);

// plan.json para plan_gate
const plan = { slug:SLUG, secciones: SEC.map((s)=>({
  id:s.id, objetivo:s.obj, inicio:s.t0, fin:s.t1,
  momentos: beats.filter((b)=> b.start>=s.t0 && b.start<s.t1).map((b)=>({
    dice:"(voz)", muestra: b.kind==="raw" ? b.src : `componente ${b.kind}`,
    tipo: b.kind==="raw" ? (b.src.startsWith("img/")?"imagen":"clip") : "componente",
    kind: b.kind==="raw" ? undefined : b.kind, seg:b.dur, porque:s.obj.slice(0,40)
  })),
})) };
fs.mkdirSync("_v3",{recursive:true});
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan,null,1));

// resumen
const nraw = beats.filter((b)=>b.kind==="raw").length;
const ncomp = beats.filter((b)=>b.kind!=="raw"&&b.kind!=="talk").length;
const fullS = wins.reduce((acc,w,i)=> acc + (w.mode==="full" ? ((wins[i+1]?.start ?? T)-w.start):0), 0);
const kinds = [...new Set(beats.filter((b)=>b.kind!=="raw").map((b)=>b.kind))];
console.log(`beats ${beats.length} · raw ${nraw} · comp ${ncomp} · kinds distintos ${kinds.length} (${kinds.join(",")})`);
console.log(`avatar full ${fullS.toFixed(0)}s = ${(100*fullS/T).toFixed(1)}% · ventanas ${wins.length}`);
console.log(`clips distintos ${new Set(beats.filter(b=>b.kind==="raw"&&b.src.startsWith("broll/")).map(b=>b.src)).size} · imgs ${new Set(beats.filter(b=>b.kind==="raw"&&b.src.startsWith("img/")).map(b=>b.src)).size}`);
console.log(`comp/min (sobre visible ${((T-fullS)/60).toFixed(1)}) = ${(ncomp/((T-fullS)/60)).toFixed(1)}`);
