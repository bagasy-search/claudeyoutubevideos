// fetch_e7hdoc_stock.mjs — b-roll EN MOVIMIENTO (Pexels) para el documental de 25 min.
// Complementa a las fotos de Commons: acá va el movimiento genérico on-topic de cada bloque.
// Prefijo e7hd_ para no pisar la carpeta compartida public/broll (colisión conocida entre videos).
import fs from 'fs';
const KEY = (fs.readFileSync('.env', 'utf8').match(/PEXELS_API_KEY=(\S+)/) || [])[1];
if (!KEY) { console.error('sin PEXELS_API_KEY'); process.exit(1); }
fs.mkdirSync('public/broll', {recursive: true});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const usados = new Set();

// [name, [queries...]] — queries con los SUSTANTIVOS del momento, no conceptos
const CLIPS = [
  // -- prólogo: la vara moderna --
  ['pro_crane_big',    ['heavy lift crane construction', 'mobile crane lifting']],
  ['pro_survey',       ['surveyor total station site', 'land surveying tripod']],
  ['pro_blueprint',    ['architect blueprint drawing hands', 'technical drawing plans']],
  ['pro_quarry_saw',   ['stone cutting machine marble', 'diamond saw stone']],
  // -- 1 Baalbek --
  ['bk_roman_cols',    ['roman temple columns ruins', 'ancient roman ruins columns']],
  ['bk_limestone',     ['limestone quarry blocks', 'stone quarry cut blocks']],
  ['bk_ruins_dusk',    ['ancient ruins sunset silhouette', 'roman ruins golden hour']],
  ['bk_stone_detail',  ['megalithic stone wall closeup', 'huge stone block texture']],
  ['bk_rope_wood',     ['old rope pulley wood', 'wooden winch rope']],
  // -- 2 Guiza --
  ['gz_pyramids_air',  ['giza pyramids aerial', 'pyramids egypt drone']],
  ['gz_pyramid_base',  ['pyramid stone blocks close', 'pyramid base blocks']],
  ['gz_desert_sand',   ['desert sand dunes wind', 'sahara sand blowing']],
  ['gz_star_north',    ['night sky stars rotation timelapse', 'polaris star trails']],
  ['gz_concrete_pour', ['concrete pouring formwork', 'wet concrete mold']],
  ['gz_limestone_mac', ['limestone rock macro', 'sedimentary rock closeup']],
  // -- 3 Sacsayhuamán --
  ['sq_cusco_walls',   ['cusco inca stone wall', 'inca masonry wall peru']],
  ['sq_andes_terraces',['andes terraces peru', 'inca terraces mountain']],
  ['sq_stone_hammer',  ['stone carving hammer chisel', 'hand carving stone tool']],
  ['sq_earthquake',    ['cracked wall damage', 'old building crack']],
  ['sq_andean_grass',  ['andean highland grass wind', 'mountain grass wind peru']],
  // -- 4 Puma Punku --
  ['pp_altiplano',     ['bolivian altiplano landscape', 'altiplano andes plain']],
  ['pp_titicaca',      ['lake titicaca bolivia', 'titicaca shore']],
  ['pp_andesite',      ['volcanic rock texture dark', 'basalt rock closeup']],
  ['pp_precision',     ['precision machining metal', 'cnc machine cutting']],
  ['pp_sand_abrasive', ['sand grinding stone', 'wet sand abrasive polishing']],
  // -- 5 Kailasa --
  ['kl_india_temple',  ['ancient indian temple carving', 'hindu temple stone sculpture']],
  ['kl_rock_cave',     ['rock cut cave temple india', 'cave temple pillars india']],
  ['kl_elephant_st',   ['stone elephant sculpture temple', 'carved elephant statue']],
  ['kl_basalt_cliff',  ['basalt cliff rock face', 'volcanic cliff wall']],
  ['kl_chisel_dust',   ['stone dust chisel carving', 'sculptor working stone dust']],
  // -- 6 Yonaguni --
  ['yg_underwater',    ['underwater rock formation diver', 'diver underwater ruins']],
  ['yg_ocean_surface', ['ocean surface waves aerial', 'deep blue sea waves']],
  ['yg_seabed',        ['seabed rocks underwater', 'underwater rocky terrain']],
  ['yg_sandstone',     ['sandstone layers cliff', 'stratified rock cliff']],
  ['yg_coast_japan',   ['rocky coast island cliff', 'island coastline waves']],
  // -- 7 Göbekli Tepe --
  ['gt_excavation',    ['archaeological excavation site', 'archaeology dig brush']],
  ['gt_anatolia',      ['anatolia landscape hills turkey', 'dry hills steppe']],
  ['gt_stone_pillar',  ['ancient stone pillar carved', 'standing stone monolith']],
  ['gt_relief_carve',  ['stone relief carving animal', 'ancient carved relief']],
  ['gt_wheat_field',   ['wild wheat field wind', 'grain field wind']],
  ['gt_night_fire',    ['campfire night people silhouette', 'fire at night sparks']],
  ['gt_burial_soil',   ['soil dirt falling hands', 'digging soil shovel']],
  // -- cierre --
  ['cl_hands_stone',   ['hands touching old stone', 'hand on ancient wall']],
  ['cl_timelapse_sky', ['clouds timelapse over ruins', 'fast clouds sky timelapse']],
  ['cl_modern_city',   ['modern city construction skyline', 'skyscraper construction']],
  ['cl_sunset_ruins',  ['ancient ruins sunset wide', 'ruins silhouette dusk']],
];

async function pex(url) {
  for (let a = 0; a < 5; a++) {
    try {
      const r = await fetch(url, {headers: {Authorization: KEY}});
      if (r.status === 429) { await sleep(4000); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { await sleep(1500); }
  }
  return null;
}
async function bajar(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url);
      if (!r.ok) { await sleep(1000); continue; }
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 100000) return false;
      fs.writeFileSync(dest, b);
      return true;
    } catch { await sleep(1200); }
  }
  return false;
}

const creditos = [];
let ok = 0, fail = 0;
for (const [name, queries] of CLIPS) {
  const dest = `public/broll/e7hd_${name}.mp4`;
  if (fs.existsSync(dest)) { console.log('ya está', name); ok++; continue; }
  let hecho = false;
  for (const q of queries) {
    if (hecho) break;
    const j = await pex(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=15&orientation=landscape&size=medium`);
    if (!j || !j.videos) continue;
    for (const v of j.videos) {
      if (usados.has(v.id)) continue;
      if (v.duration < 5) continue;                       // hace falta margen para el Ken-Burns
      const files = (v.video_files || []).filter((f) => f.file_type === 'video/mp4' && f.width >= 1280);
      files.sort((a, b) => Math.abs(1920 - a.width) - Math.abs(1920 - b.width));
      const pick = files[0];
      if (!pick) continue;
      if (await bajar(pick.link, dest)) {
        usados.add(v.id);
        creditos.push({name, dest, id: v.id, url: v.url, author: v.user && v.user.name, query: q, w: pick.width, h: pick.height, dur: v.duration});
        console.log('OK', name, '<-', q, `${pick.width}x${pick.height} ${v.duration}s`);
        hecho = true; ok++;
        break;
      }
    }
    await sleep(400);
  }
  if (!hecho) { console.log('FALTA', name); fail++; }
}
fs.writeFileSync('_e7hdoc_stock.json', JSON.stringify(creditos, null, 1));
console.log(`\n${ok} ok · ${fail} faltan · créditos en _e7hdoc_stock.json`);
