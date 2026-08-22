// build_goldpower.mjs — "7 Cheap Amish Items Worth More Than Gold When the Power Goes Out"
// Canal Claudio Yoder (@claudioyoder-amish · INGLÉS). Avatar EN BUCLE (10:10 ×2.05) como FONDO
// GARANTIZADO + b-roll real (Pexels) + imágenes gpt-image-2 low (presentador con ref del avatar)
// + kit premium THEME_EARTH con labels en INGLÉS. CTA = The Plain Almanac (sin precio/link en voz).
// ⛔ DIFERENCIA CLAVE vs build_raingutter: los componentes OVERLAY **no** ocultan el avatar
//    (ahí estaba la 2ª causa de pantalla negra). Sólo el b-roll real tapa al avatar.
// Salida: beatsheet/goldpower.json + src/VideoEdit/avatar_goldpower.gen.ts
import fs from "fs";

const SLUG = "goldpower";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = [];
for (const c of caps) { for (const w of norm(c.text).split(" ").filter(Boolean)) Wc.push({ n: w, ms: c.startMs, e: c.endMs }); }
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase.slice(0, 55)); return v; };

const AV_DUR = 1251.05;                       // avatar en bucle, ya encodeado a este largo
const TOTAL = Math.min(+((Wc[Wc.length - 1].e) / 1000 + 0.7).toFixed(2), AV_DUR);

const P = (x) => `img/${x}.jpg`;   // gpt-image-2 low (presentador con ref del avatar / escenas)
const S = (x) => `broll/${x}.mp4`; // stock real Pexels

// ── CUADRÍCULA DEL DIRECTOR: [frase(ancla verbatim), src, maxTok, isVid] ──────────────────
// Cada plano tiene SU propia frase y SU propio asset: los sustantivos de la frase mandan.
const VIS = [
  // ══ S0 · HOOK / COLD OPEN (0–65) — empaque trailer: cortes cortos, los siete objetos ══
  ["there is a wooden crate on the floor", P("cy_p_crate"), 8, false],
  ["right beside the door", S("gp_s_darkroom"), 4, true],
  ["and there is not one thing in it that cost more", P("cy_i_crate_seven"), 9, false],
  ["a wool blanket", S("gp_s_woolblanket"), 3, true],
  ["a dozen plain candles", S("gp_s_candlesmany"), 4, true],
  ["a piece of clear hose about five feet long", P("cy_i_tubing_coil"), 9, false],
  ["a box of salt", P("cy_i_saltbox"), 4, false],
  ["a cast iron pot", S("gp_s_dutchoven"), 4, true],
  ["a little white alarm about the size of my palm", P("cy_i_coalarm_wall"), 9, false],
  ["and a glass jug", P("cy_i_jug_glass"), 4, false],
  ["that is it seven things", P("cy_i_seven_bench"), 5, false],
  ["all seven came to under", P("cy_p_seven_bench"), 5, false],
  ["and i am going to tell you something that sounds like bragging", P("cy_p_talk_stove"), 10, false],
  ["the last time the power went out around here", S("gp_s_snowstorm"), 9, true],
  ["for four days in january", S("gp_s_winterhouse"), 5, true],
  ["that crate did more for this house", P("cy_i_crate2"), 7, false],
  ["generator did for the fellow at the end of the road", S("gp_s_generator"), 6, true],
  ["did for the fellow at the end of the road", P("cy_i_generator_snow"), 9, false],
  ["it ran about 11 hours", P("cy_i_cord_window"), 5, false],
  ["and then it sat there a very expensive lawn ornament", P("cy_i_generator_snow"), 9, false],
  ["because he could not get fuel", S("gp_s_gaspump"), 6, true],
  ["because the pumps at the station run on", P("cy_i_gasstation_dark"), 8, false],
  ["and that is the part nobody thinks about", P("cy_p_window_storm"), 8, false],
  ["until they are standing in the cold thinking about it", S("gp_s_windowfrost"), 9, true],
  ["seven cheap things", P("cy_p_seven_bench"), 3, false],
  ["no moving parts except the one that has a battery", P("cy_i_coalarm_display"), 9, false],
  ["because that one is what keeps the other six from killing you", P("cy_p_alarm"), 11, false],

  // ══ S1 · CREDENCIALES + TESIS (65–136) ══
  ["now i am amish", P("cy_i_amishfarm"), 4, false],
  ["this house has never had a meter on it", P("cy_p_talk2"), 8, false],
  ["not because i am making a point", P("cy_i_amishfarm"), 7, false],
  ["is for us a tuesday", P("cy_i_1890_kitchen"), 5, false],
  ["nothing changes here when the lines come down", S("gp_s_powerlines"), 8, true],
  ["and over the years i have watched neighbors go through it", P("cy_i_darkhall"), 10, true],
  ["the panic buying", P("cy_i_hardware_shelf"), 3, false],
  ["the extension cords running through a window in the rain", P("cy_i_cord_window"), 9, false],
  ["and i have come to believe the whole modern approach", P("cy_p_talk3"), 9, false],
  ["people try to replace the electricity", P("cy_i_furnace_new"), 6, false],
  ["that is the mistake", P("cy_i_generator2"), 4, true],
  ["you are never going to replace it", P("cy_i_generator_snow"), 7, false],
  ["and every dollar you spend trying", S("gp_s_moneybills"), 6, true],
  ["you do not replace the power", P("cy_p_window_storm"), 6, false],
  ["you make the house not need it", P("cy_i_room_small"), 7, false],
  ["and it is older than the grid itself", S("gp_s_oldkitchen"), 8, false],
  ["so stay with me", P("cy_p_talk5"), 4, false],
  ["you can put that same crate together this weekend", P("cy_i_hardware_shelf"), 9, false],
  ["at a hardware store in a thrift shop", S("gp_s_thrift"), 8, true],
  ["and in the middle i am going to tell you about the third one", P("cy_i_tubing2"), 13, false],
  ["because that is the one where people write to me", P("cy_p_hose_heater"), 9, false],
  ["there are 40 to 50 gallons of clean drinking water", P("cy_i_waterheater"), 9, false],
  ["sitting in your house right now", S("gp_s_basement"), 6, true],

  // ══ S2 · DE DÓNDE SALE LA LISTA (136–210) ══
  ["let me back up though", P("cy_p_talk6"), 5, false],
  ["this is not a prepper list", P("cy_i_seven_bench"), 6, false],
  ["no buckets of freeze dried food", P("cy_i_hardware_shelf"), 6, false],
  ["this is a household list and it is old", P("cy_i_1890_kitchen"), 9, false],
  ["was standard equipment in an ordinary american home", S("gp_s_oldkitchen"), 8, true],
  ["not a farmhouse an ordinary house in an ordinary town", S("gp_s_oldkitchen"), 9, false],
  ["it was not emergency equipment", P("cy_i_crate2"), 5, false],
  ["all got replaced one item at a time", P("cy_i_bulb"), 8, false],
  ["the blanket by the furnace", P("cy_i_furnace_new"), 5, false],
  ["the candles by the bulb", P("cy_i_house_dark"), 5, false],
  ["the salt by the refrigerator", S("gp_s_fridgeopen"), 5, true],
  ["the pot by the range", P("cy_i_gasrange_on"), 5, false],
  ["a furnace is better than a blanket", S("gp_s_woodstove"), 7, true],
  ["but when you replace a thing", P("cy_p_talk7"), 6, false],
  ["you eventually stop knowing the old thing", S("gp_s_oldkitchen"), 7, false],
  ["so we ended up with houses full of excellent machines", P("cy_i_bulb"), 9, false],
  ["and nobody left in them who knows what to do", S("gp_s_darkroom"), 9, true],
  ["it is not a supply problem", P("cy_i_hardware_shelf"), 6, false],
  ["the stuff is cheap and it is at the store right now", P("cy_i_hardware_shelf"), 11, false],
  ["it is the knowing that got expensive", P("cy_p_almanac"), 7, false],
  ["so seven things", P("cy_i_seven_bench"), 3, false],
  ["because the why is what lets you figure out the eighth one", P("cy_p_seven_bench"), 11, false],

  // ══ S3 · ITEM 1 · LA MANTA DE LANA (210–331) ══
  ["number one is the wool blanket", P("cy_i_blanket2"), 6, true],
  ["and i will bet money you are already doing it wrong", P("cy_p_talk4"), 10, false],
  ["the blanket is easy", S("gp_s_blanketfold"), 4, true],
  ["everybody s instinct when the heat goes off is to wrap up in it", S("gp_s_bedquilt"), 12, true],
  ["around the shoulders sit in the chair wait it out", P("cy_i_handsfire"), 9, false],
  ["and the actual problem is that you are trying to heat", P("cy_i_house_dark"), 10, false],
  ["with a human body", P("cy_i_darkhall"), 4, true],
  ["you always lose that fight", S("gp_s_windowfrost"), 5, true],
  ["and this is what you will still see in a plain house in january", P("cy_i_amishfarm"), 12, false],
  ["you do not wrap the blanket around a person", S("gp_s_blanketfold"), 9, true],
  ["you hang it in a doorway", P("cy_p_blanket_door"), 6, false],
  ["you shrink the house", P("cy_i_blanket_doorway"), 4, false],
  ["so let me put a number on it", P("cy_i_blanket_doorway"), 7, false],
  ["close off one room hang a heavy blanket over the doorway", P("cy_p_blanket_door"), 10, false],
  ["and another over the window", P("cy_i_room_small"), 5, false],
  ["whatever heat you can make from candles", P("cy_i_candle_alone"), 7, false],
  ["from a jug of hot water", P("cy_i_jug2"), 6, false],
  ["now goes 12 times further", S("gp_s_thermometer"), 5, true],
  ["and wool specifically and i do mean wool not fleece", P("cy_i_wool_macro"), 9, false],
  ["a wool blanket still insulates when it is damp", S("gp_s_woolmacro"), 9, true],
  ["synthetics quit on you", S("gp_s_woolblanket"), 4, true],
  ["you are insulating with the air the wool is holding still", S("gp_s_woolmacro"), 10, true],
  ["at a thrift store", P("cy_p_thrift"), 4, false],
  ["look for army surplus", S("gp_s_thrift"), 4, true],
  ["and the honest limit", P("cy_p_talk3"), 4, false],
  ["a blanket in a doorway is drafty at the edges", P("cy_i_blanket_doorway"), 9, false],
  ["tack the top edge do not just drape it", P("cy_p_blanket_door"), 8, false],
  ["and put something heavy along the bottom", P("cy_p_blanket_floor"), 7, false],
  ["the gap at the floor is where you lose it", P("cy_p_blanket_floor"), 9, false],
  ["cold air falls", S("gp_s_windowfrost"), 3, true],

  // ══ S4 · ITEM 2 · VELAS + ESPEJO (331–466) ══
  ["number two", S("gp_s_candleflame"), 2, true],
  ["candles and something shiny", P("cy_i_candle_mirror"), 4, false],
  ["now one candle is not a lot of light", P("cy_i_candle_stub"), 8, false],
  ["i am not going to stand here and tell you a candle is a lamp", S("gp_s_candleflame"), 13, true],
  ["a candle puts out something like 13 lumens", P("cy_i_candle_alone"), 8, false],
  ["so you are at about one and a half percent", P("cy_i_darkhall"), 9, true],
  ["that is why people give up on candles after one night", S("gp_s_flashlight"), 11, true],
  ["which is to set it in the middle of the room", P("cy_i_candle_stub"), 10, false],
  ["put a mirror behind it", P("cy_i_candle_mirror"), 5, false],
  ["that is it any mirror", S("gp_s_mirror"), 5, true],
  ["take one off the wall", P("cy_p_candle_mirror"), 5, false],
  ["prop it up behind the candle", P("cy_i_candle_mirror"), 6, false],
  ["and you have just about doubled your useful light", S("gp_s_mirror"), 8, true],
  ["set that candle and mirror on a shelf at eye level", P("cy_p_candle_mirror"), 11, false],
  ["and you are bouncing it twice", P("cy_i_three_candles"), 6, false],
  ["three candles arranged that way will let you read", S("gp_s_bookcandle"), 8, true],
  ["it is not comfortable reading", P("cy_i_three_candles"), 5, false],
  ["the old timers went further than a mirror", P("cy_p_jug_lens"), 7, false],
  ["they would put a clear glass jug of water in front of the flame", P("cy_i_lacemaker"), 12, false],
  ["and the water acts as a crude lens", S("gp_s_waterglassjug"), 8, true],
  ["it gathers the light and throws a bright circle", P("cy_i_lacemaker"), 8, false],
  ["they called them lace makers lamps", P("cy_i_lacemaker"), 5, false],
  ["and there are ones in museums", S("gp_s_lantern"), 6, true],
  ["cost you nothing", P("cy_p_jug_lens"), 3, false],
  ["beeswax if you can get it", P("cy_i_candles_box"), 6, false],
  ["a dozen plain white household candles", P("cy_i_candles_box"), 6, false],
  ["do not buy the scented ones", S("gp_s_candlesmany"), 6, true],
  ["and look i have to say this part straight", P("cy_p_talk2"), 9, false],
  ["an open flame in a room you have just sealed up with blankets", P("cy_i_blanket_doorway"), 12, false],
  ["never leave a candle burning when you are asleep", S("gp_s_candleblow"), 9, true],
  ["put them out every one every time you lie down", S("gp_s_candleblow"), 10, true],
  ["the blanket over the doorway does not care", P("cy_i_blanket_doorway"), 8, false],
  ["it will catch just the same", S("gp_s_candleflame"), 6, true],

  // ══ S5 · ITEM 3 · LA MANGUERA / TERMOTANQUE (466–625) ══
  ["which brings me to the one i said i would tell you about", P("cy_p_hardware"), 12, false],
  ["a piece of clear food grade tubing", P("cy_i_tubing_coil"), 7, false],
  ["it is in the aquarium aisle", P("cy_i_hardware_shelf"), 6, false],
  ["and here is why it is in that crate", P("cy_p_hose_heater"), 9, false],
  ["if you are on a well your pump stops", S("gp_s_basement"), 9, true],
  ["what is less obvious is that on city water", S("gp_s_faucetdry"), 9, true],
  ["because those systems are pumped too", S("gp_s_plumbingvalve"), 6, true],
  ["either way the tap goes quiet", P("cy_i_tap_dry"), 6, false],
  ["and the standard advice is go fill your bathtub", S("gp_s_bathtubfill"), 9, true],
  ["and useless if it happened while you were at work", P("cy_i_tap_dry"), 9, false],
  ["but there is a tank in your house", P("cy_p_talk9"), 8, false],
  ["standing in a closet or a basement or a garage", S("gp_s_basement"), 9, true],
  ["and that water is clean", S("gp_s_waterclean"), 5, true],
  ["it came out of the same line your drinking water came out of", P("cy_i_waterheater"), 12, false],
  ["it has just been sitting there warm", P("cy_p_talk9"), 7, false],
  ["or drinking and cooking and washing for a family of four", S("gp_s_waterpour"), 10, true],
  ["now how you get it out", P("cy_p_hose_heater"), 6, false],
  ["first you shut off the incoming water valve at the top of the tank", P("cy_p_heater_valve"), 13, false],
  ["if it is gas turn the gas to pilot or off", S("gp_s_plumbingvalve"), 10, true],
  ["if it is electric shut the breaker off", P("cy_p_heater_valve"), 8, false],
  ["you will burn the elements right out of it", P("cy_p_talk9"), 9, false],
  ["then open a hot water tap somewhere upstairs", S("gp_s_faucetdry"), 8, true],
  ["and that lets air into the system", P("cy_i_tap_dry"), 7, false],
  ["same as putting your thumb over a straw", S("gp_s_waterclean"), 8, true],
  ["if you do not vent it you will get a trickle", S("gp_s_faucetdry"), 11, true],
  ["at the bottom of the tank there is a drain valve", P("cy_i_drainvalve"), 11, false],
  ["your tubing goes on there into a clean bucket", P("cy_i_bucket_clear"), 9, false],
  ["and you open it up", S("gp_s_waterpour"), 5, true],
  ["the first bit will be rusty with sediment", P("cy_i_bucket_rusty"), 8, false],
  ["let it run into a separate bucket and throw it out", P("cy_i_bucket_rusty"), 10, false],
  ["after that it runs clear", P("cy_i_bucket_clear"), 5, false],
  ["and the honest limits again", P("cy_p_talk3"), 5, false],
  ["that water has been sitting warm", P("cy_i_waterheater"), 6, false],
  ["boil it or treat it before you drink it", S("gp_s_kettlesteam"), 9, true],
  ["and some of the plastic drain valves will drip", P("cy_i_drainvalve"), 8, false],
  ["it is still forty gallons", S("gp_s_waterpour"), 5, true],
  ["every house has it almost nobody knows", P("cy_p_talk9"), 7, false],
  ["and this is about where people ask me where to write all this down", P("cy_p_almanac"), 13, false],
  ["there is a guide a family put together", P("cy_i_almanac_lamp"), 8, false],

  // ══ S6 · ITEM 4 · LA SAL (625–745) ══
  ["number four", P("cy_i_salt_scoop"), 2, false],
  ["when the power goes off you have got about four hours", S("gp_s_fridgeopen"), 10, true],
  ["in a full refrigerator before it turns", S("gp_s_fridgeopen"), 7, true],
  ["and what people do is eat everything as fast as they can", P("cy_i_fridge_dark"), 11, false],
  ["every big outage the dumpsters behind the houses fill up with meat", S("gp_s_meatbutcher"), 11, true],
  ["and a two dollar box of salt would have kept most of it", P("cy_i_saltbox"), 12, false],
  ["here is the principle", P("cy_p_talk5"), 4, false],
  ["bacteria and mold need free water", S("gp_s_saltmacro"), 6, true],
  ["salt takes it away", S("gp_s_saltpour"), 4, true],
  ["salt outside the cell pulls the water out from inside", S("gp_s_saltmacro"), 10, true],
  ["get enough salt in and nothing lives", P("cy_i_saltmeat"), 7, false],
  ["that is why salted meat keeps at room temperature for a year", P("cy_i_hangmeat"), 11, false],
  ["and everybody s great grandmother knew it", P("cy_i_1890_kitchen"), 6, false],
  ["the rough proportion for a dry cure", P("cy_p_salt"), 7, false],
  ["is about an ounce of salt per pound of meat", S("gp_s_saltpour"), 10, true],
  ["packed on all surfaces", P("cy_p_salt"), 4, false],
  ["you rub it in like you are annoyed with it", P("cy_p_salt"), 9, false],
  ["then lay it in a crock fat side up", P("cy_i_salt_scoop"), 9, false],
  ["keep it somewhere cellar cold", S("gp_s_cellar"), 5, true],
  ["then rinse it and hang it somewhere cool", P("cy_i_hangmeat"), 8, false],
  ["now the honest part", P("cy_p_talk6"), 4, false],
  ["curing takes a cold place", S("gp_s_cellar"), 5, true],
  ["salt curing a big cut of meat is asking for trouble", S("gp_s_meatbutcher"), 11, true],
  ["when a cellar or an unheated back room", S("gp_s_cellar"), 8, true],
  ["it works exactly like it always did", P("cy_i_hangmeat"), 7, false],
  ["and that reason was botulism", P("cy_i_saltmeat"), 5, false],
  ["for a short outage you are not really curing anyway", P("cy_i_salt_scoop"), 9, false],
  ["heavy salt on a piece of meat in a cold room", S("gp_s_meatbutcher"), 11, true],
  ["and salt does more than meat", S("gp_s_saltpour"), 6, true],
  ["it packs eggs it keeps butter under a brine", S("gp_s_cellar"), 9, true],

  // ══ S7 · ITEM 5 · HIERRO FUNDIDO (745–836) ══
  ["number five", P("cy_i_dutchoven2"), 2, true],
  ["the one that costs the most", P("cy_p_castiron"), 6, false],
  ["here is the thing about cooking in an outage", S("gp_s_campstove"), 9, true],
  ["everybody s plan is a camp stove", S("gp_s_campstove"), 6, true],
  ["and that is a fine plan for about two days", P("cy_i_propane_empty"), 10, false],
  ["then you are out and the store is out", P("cy_i_propane_empty"), 9, false],
  ["a cast iron dutch oven does not care what the heat is", P("cy_i_dutchoven_coals"), 12, false],
  ["it will cook on a wood fire", S("gp_s_castironfire"), 7, true],
  ["on coals in a fireplace", S("gp_s_embers"), 5, true],
  ["on a wood stove", P("cy_i_dutchoven_stove"), 4, false],
  ["on a bed of embers in the yard", P("cy_i_dutchoven_coals"), 8, false],
  ["it is the one cooking tool completely indifferent to the fuel", S("gp_s_castironfire"), 10, true],
  ["and the reason it works is mass", P("cy_p_castiron"), 7, false],
  ["heavy means it holds heat", S("gp_s_castironfire"), 5, true],
  ["comes out the other side as steady even cooking", P("cy_i_dutchoven2"), 9, true],
  ["a thin pan over a campfire scorches one side", S("gp_s_campstove"), 9, true],
  ["the iron averages it for you", P("cy_i_dutchoven_coals"), 6, false],
  ["you are cooking on the iron", S("gp_s_embers"), 6, true],
  ["15 at a farm sale", P("cy_i_castiron_rust"), 5, false],
  ["if you find a rusty one do not walk away", P("cy_i_castiron_rust"), 10, false],
  ["and underneath is a pan that will outlive you", S("gp_s_dutchoven"), 9, true],
  ["season it before you need it", P("cy_i_seasoning"), 6, false],
  ["thin coat of any cooking oil", P("cy_i_seasoning"), 6, false],
  ["into a hot oven upside down for an hour", P("cy_i_seasoning"), 9, false],

  // ══ S8 · ITEM 6 · ALARMA DE MONÓXIDO (836–943) — la sección de SEGURIDAD ══
  ["number 6 and this is the one i said", P("cy_p_alarm"), 9, false],
  ["a battery carbon monoxide alarm", P("cy_i_alarm_pack"), 5, false],
  ["i have talked about sealing a room with blankets", P("cy_i_room_small"), 9, false],
  ["about open flames", S("gp_s_candleflame"), 3, true],
  ["about cooking on a fire", S("gp_s_castironfire"), 5, true],
  ["and every one will kill you quietly if you do it wrong", S("gp_s_smokedark"), 11, true],
  ["is that you cannot smell it you cannot see it", S("gp_s_smokedark"), 10, true],
  ["and the first symptom feels exactly like being tired and cold", P("cy_p_window_storm"), 10, false],
  ["so let me be very direct here", P("cy_p_alarm"), 6, false],
  ["you do not run a generator in a garage", P("cy_i_generator_snow"), 9, false],
  ["not with the door open not part way open not ever", S("gp_s_generator"), 11, true],
  ["you do not bring a charcoal grill inside", P("cy_i_grill_garage"), 8, false],
  ["not into a garage not onto a porch", P("cy_i_grill_garage"), 8, false],
  ["charcoal is the worst one", S("gp_s_embers"), 5, true],
  ["and it is silent about it", S("gp_s_smokedark"), 6, true],
  ["and you do not use a gas oven or a gas range to heat a room", P("cy_i_gasrange_on"), 15, false],
  ["it is designed to run 20 minutes with the kitchen fan on", P("cy_i_gasrange_on"), 11, false],
  ["and when you seal a room the way i described", P("cy_i_blanket_doorway"), 9, false],
  ["and also better at holding everything else", S("gp_s_smokedark"), 7, true],
  ["if you have any flame in a sealed room", P("cy_i_candle_stub"), 9, false],
  ["you crack a window", P("cy_p_window_crack"), 4, false],
  ["an inch", P("cy_p_window_crack"), 2, false],
  ["and you will not go to sleep and not wake up", S("gp_s_windowfrost"), 10, true],
  ["and buy the kind that runs on batteries", P("cy_i_coalarm_display"), 8, false],
  ["and has a digital number on it", P("cy_i_coalarm_display"), 7, false],
  ["because the number lets you watch it climb", P("cy_i_coalarm_wall"), 8, false],
  ["every winter there are families who survive the cold", S("gp_s_winterhouse"), 9, true],
  ["and do not survive the heating", S("gp_s_smokedark"), 6, true],
  ["buy the alarm", P("cy_p_alarm"), 3, false],
  ["put a fresh battery in it in october", P("cy_i_alarm_pack"), 8, false],

  // ══ S9 · ITEM 7 · LA JARRA DE VIDRIO (943–1035) ══
  ["number seven", P("cy_i_jug_glass"), 2, false],
  ["and this is my favorite", P("cy_p_jug_bed"), 5, false],
  ["here is the problem the jug solves", P("cy_i_bed_quilts"), 7, false],
  ["it is nine at night the house is cold", S("gp_s_darkroom"), 9, true],
  ["you have got your one room and your blankets", P("cy_i_room_small"), 9, false],
  ["and a bed in a cold room is miserable", S("gp_s_bedquilt"), 9, true],
  ["because you are spending your own body heat", P("cy_i_bed_quilts"), 8, false],
  ["warming a mattress that takes it all", S("gp_s_bedquilt"), 7, true],
  ["so you heat water", S("gp_s_kettlesteam"), 4, true],
  ["on the fire on the wood stove", S("gp_s_woodstove"), 7, true],
  ["you fill a jug a heavy glass one", P("cy_i_jug2"), 8, false],
  ["or an old hot water bottle", P("cy_i_stonebottle"), 6, false],
  ["and you put it in the bed 20 minutes before you get in", P("cy_p_jug_bed"), 12, false],
  ["is that water is unreasonably good at holding heat", P("cy_i_jug2"), 8, false],
  ["and it lets that go slowly over six or eight hours", S("gp_s_sleeping"), 10, true],
  ["into a space the size of a bed", P("cy_i_bed_quilts"), 8, false],
  ["think about what we just did", P("cy_p_talk7"), 6, false],
  ["we started this list heating a house", P("cy_i_house_dark"), 7, false],
  ["then we shrank it to a room", P("cy_i_blanket_doorway"), 7, false],
  ["now we have shrunk it to a bed", P("cy_i_bed_quilts"), 8, false],
  ["every step you stop heating you are not in", S("gp_s_sleeping"), 9, true],
  ["warm the glass first with warm water", P("cy_i_jug_glass"), 7, false],
  ["wrap it in a towel so it is not against skin", P("cy_i_jug_towel"), 10, false],
  ["they use stone bottles for hundreds of years", P("cy_i_stonebottle"), 8, false],
  ["just because it is a sensible way to go to bed", S("gp_s_sleeping"), 10, true],

  // ══ S10 · RECAP + COMPARACIÓN + CTA#2 (1035–1122) ══
  ["so that is the seven", P("cy_p_seven_bench"), 5, false],
  ["and look at what you have when they are all in one box", P("cy_p_seven_bench"), 12, false],
  ["a way to make the house small", P("cy_i_room_small"), 7, false],
  ["40 gallons of water", P("cy_i_bucket_clear"), 4, false],
  ["a way to keep food from spoiling", P("cy_i_salt_scoop"), 7, false],
  ["a way to cook that does not care what you burn", P("cy_i_dutchoven_coals"), 10, false],
  ["the alarm that makes all of it safe", P("cy_i_alarm_pack"), 8, false],
  ["and a way to sleep warm on almost nothing", P("cy_i_bed_quilts"), 9, false],
  ["that is a complete household", P("cy_p_talk8"), 5, false],
  ["and there is not one part in it that can fail", P("cy_p_seven_bench"), 10, false],
  ["now i am not against generators", P("cy_i_generator2"), 6, true],
  ["if you have got medical equipment that needs power", P("cy_i_generator2"), 9, true],
  ["but for a normal house with normal people in it", P("cy_p_talk4"), 9, false],
  ["and the crate is trying to make you not need it", P("cy_i_crate2"), 10, false],
  ["is that this one feels like giving up", P("cy_p_window_storm"), 8, false],
  ["like a step down", S("gp_s_moneybills"), 4, true],
  ["the blanket in the doorway is not a worse furnace", P("cy_i_blanket_doorway"), 9, false],
  ["it is a different idea about what a house is for", S("gp_s_oldkitchen"), 10, false],
  ["and it happens to be an idea that worked for four hundred years", P("cy_i_amishfarm"), 12, false],
  ["we just stopped needing it and then we stopped knowing it", P("cy_i_bulb"), 10, false],
  ["if you want the whole thing written down", P("cy_p_almanac"), 8, false],
  ["that is what the plain almanac is", P("cy_i_almanac_lamp"), 7, false],
  ["the link is up at the top of the description", P("cy_p_almanac"), 10, false],

  // ══ S11 · EL FIN DE SEMANA, 7 PASOS (1122–1176) ══
  ["so here is what i would do this week", P("cy_p_seven_bench"), 9, false],
  ["two wool blankets from a thrift store", S("gp_s_thrift"), 7, true],
  ["a dozen plain candles and find a mirror", P("cy_i_candle_mirror"), 8, false],
  ["five feet of half inch clear food grade tubing", P("cy_i_tubing2"), 9, false],
  ["then go look at your water heater", P("cy_p_talk9"), 7, false],
  ["find the drain valve at the bottom", P("cy_i_drainvalve"), 7, false],
  ["so you are not learning it by flashlight", S("gp_s_flashlight"), 8, true],
  ["a box of salt the big cheap one", P("cy_i_salt_scoop"), 8, false],
  ["watch for one at a yard sale", P("cy_i_castiron_rust"), 7, false],
  ["the carbon monoxide alarm with the display", P("cy_i_coalarm_display"), 7, false],
  ["put a glass jug in the box and you are done", P("cy_i_jug2"), 11, false],
  ["and you are genuinely better prepared than most of your street", P("cy_p_talk8"), 10, false],

  // ══ S12 · COMENTARIOS + TEASE + CIERRE (1176–1251) ══
  ["now i read all of these", P("cy_p_talk3"), 6, false],
  ["tell me roughly where you live", S("gp_s_winterhouse"), 6, true],
  ["and the longest you have ever gone without power", P("cy_i_darkhall"), 9, true],
  ["and if you have got an eighth thing for that crate", P("cy_i_crate2"), 10, false],
  ["next time i want to show you the one people do not believe", P("cy_p_talk2"), 12, false],
  ["there is a way to cook a pot of beans", P("cy_i_dutchoven2"), 9, true],
  ["on about 15 minutes of fire", S("gp_s_embers"), 6, true],
  ["you bring it to a boil take it off", S("gp_s_kettlesteam"), 8, true],
  ["put it in a box go do your work", P("cy_i_bed_quilts"), 8, false],
  ["and come back at supper and it is done", S("gp_s_castironfire"), 9, true],
  ["none of these seven things are clever", P("cy_i_seven_bench"), 7, false],
  ["there is no invention in that crate", P("cy_p_crate"), 7, false],
  ["that is exactly why they got forgotten", S("gp_s_oldkitchen"), 7, false],
  ["and exactly why they still work", P("cy_i_crate2"), 6, false],
  ["they just knew where the water was", P("cy_i_waterheater"), 7, false],
  ["and how to make a room small", P("cy_i_blanket_doorway"), 7, false],
  ["and which way to face a candle", P("cy_i_candle_mirror"), 7, false],
  ["and every bit of it is still on a shelf at the hardware store", P("cy_i_hardware_shelf"), 13, false],
  ["waiting for somebody to want it again", P("cy_p_almanac"), 7, false],
];

const rawList = [];
let missImg = 0, missAnchor = 0;
for (const [phrase, src, mt, isVid] of VIS) {
  if (!fs.existsSync("public/" + src)) { console.warn("⚠ asset missing:", src, "←", phrase.slice(0, 40)); missImg++; continue; }
  const t = at(phrase, mt);
  if (t == null) { console.warn("⚠ anchor missing:", phrase.slice(0, 50)); missAnchor++; continue; }
  rawList.push({ start: +t.toFixed(2), src, vid: !!isVid });
}
rawList.sort((a, b) => a.start - b.start);

// ── PACING AMISH + VENTANAS RESERVADAS DE AVATAR ─────────────────────────────────────────
// El canal es MODO AVATAR: el presentador SOSTIENE los tramos retóricos (apertura personal,
// las advertencias de seguridad, las dos menciones a la guía, el cierre). Ahí NO entra b-roll.
// Fuera de esos tramos, espaciado mínimo para el ritmo pausado amish (5–8s), salvo el HOOK,
// que es un trailer y va cortado corto.
const AVATAR_HOLD = [
  [65, 95],    // "now I am Amish" — credenciales, la cara vende
  [128, 142],  // "so stay with me" + "let me back up"
  [205, 215],  // "so, seven things"
  [300, 318],  // el límite honesto de la manta
  [440, 462],  // la advertencia de la llama abierta
  [600, 625],  // CTA #1 — The Plain Almanac
  [700, 715],  // "now the honest part" (sal)
  [745, 760],  // entrada al item cinco
  [836, 862],  // entrada al item seis + "let me be very direct here"
  [900, 928],  // crack a window / buy the alarm
  [1000, 1015],// "think about what we just did"
  [1035, 1050],// "so that is the seven"
  [1100, 1122],// CTA #2 — la guía
  [1223, 1e9], // el cierre
];
const inHold = (t) => AVATAR_HOLD.some(([s, e]) => t >= s && t < e);
const nextHoldStart = (t) => { let b = Infinity; for (const [s] of AVATAR_HOLD) if (s > t + 0.01 && s < b) b = s; return b; };
const HOOK_END = 66, MINGAP_HOOK = 2.4, MINGAP_BODY = 3.6;
const kept = [];
for (const r of rawList) {
  if (inHold(r.start)) continue;
  const min = r.start < HOOK_END ? MINGAP_HOOK : MINGAP_BODY;
  if (kept.length && r.start - kept[kept.length - 1].start < min) continue;
  kept.push(r);
}
console.log(`grid: ${rawList.length} planos escritos -> ${kept.length} tras hold de avatar + espaciado`);

// ── TAPA DE COSTURA DEL BUCLE ────────────────────────────────────────────────────────────
// El avatar es un LOOP de 610.16s: en 610.16 y 1220.33 el video salta al frame 0. Se tapa con
// b-roll on-topic para que el corte no se lea. (El de 610.16 cae en la CTA de la guía.)
const SEAMS = [[610.0, "img/cy_i_almanac_lamp.jpg"], [1220.1, "img/cy_i_dutchoven2.jpg"]];
for (const [t, src] of SEAMS) {
  if (!fs.existsSync("public/" + src)) { console.warn("⚠ seam cover missing:", src); continue; }
  kept.push({ start: t, src, vid: false, seam: true });
}
kept.sort((a, b) => a.start - b.start);
rawList.length = 0; rawList.push(...kept);

const rawBeats = [];
let nStock = 0;
for (let i = 0; i < rawList.length; i++) {
  const nx = i + 1 < rawList.length ? rawList[i + 1].start : TOTAL;
  const next = rawList[i].seam ? Math.min(nx, rawList[i].start + 3.4) : Math.min(nx, nextHoldStart(rawList[i].start));
  const gap = next - rawList[i].start;
  const dur = +Math.max(2.2, Math.min(gap, 8)).toFixed(2); // Amish: sostener 5–8s, techo 8
  if (rawList[i].vid) nStock++;
  rawBeats.push({ id: `${SLUG}_${i}`, start: rawList[i].start, kind: "raw", src: rawList[i].src, hue: "amber", darken: 0, dur, ...(rawList[i].vid ? { noSplit: true } : {}) });
}
console.log(`b-roll: img ${rawBeats.length - nStock} · stock ${nStock} · total ${rawBeats.length} · missing img ${missImg} anchor ${missAnchor}`);

const C = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// ── COMPONENTES (kit premium THEME_EARTH) — TODOS los textos en INGLÉS (los defaults del kit
//    están en español y las props no los cubren si no se pasan). Anclados al TEXTO REAL.
const PREMIUM = [
  C("HookCaption", "there is a wooden crate on the floor", 4.2, "top", {
    text: "Seven cheap things. No fuel. No moving parts.",
  }, 8),
  C("PhotoCarousel", "that is it seven things", 9.5, "full", {
    title: "What is in the crate", items: [
      { label: "Wool blanket", image: "img/cy_i_wool_macro.jpg" },
      { label: "A dozen candles", image: "img/cy_i_candles_box.jpg" },
      { label: "Five feet of hose", image: "img/cy_i_tubing_coil.jpg" },
      { label: "A box of salt", image: "img/cy_i_saltbox.jpg" },
      { label: "Cast iron pot", image: "img/cy_i_dutchoven_coals.jpg" },
      { label: "Carbon monoxide alarm", image: "img/cy_i_coalarm_wall.jpg" },
      { label: "A glass jug", image: "img/cy_i_jug_glass.jpg" },
    ],
  }, 5),
  C("DuelColumns", "generator did for the fellow at the end of the road", 6.2, "left", {
    title: "Two answers to the same night", leftName: "The crate", rightName: "The generator",
    rows: [
      { attr: "Costs about $110, all in", leftWins: true },
      { attr: "Needs no fuel, ever", leftWins: true },
      { attr: "Nothing in it can break", leftWins: true },
      { attr: "Dead once the pumps are dark", leftWins: false },
    ],
  }, 6),
  C("HighlightSweep", "you do not replace the power", 4.8, "top", {
    pre: "The whole idea:", highlight: "you do not replace the power — you make the house not need it", post: ".",
    note: "every dollar spent replacing the grid is a dollar not spent on what actually works",
  }, 6),
  C("BigStatReveal", "there are 40 to 50 gallons of clean drinking water", 5.0, "topLeft", {
    eyebrow: "Sitting in your house right now", value: 40, suffix: "–50 gallons", support: "clean, potable water in the water heater — and almost nobody knows how to get it out",
  }, 9),
  C("MythTruth", "this is not a prepper list", 5.4, "topLeft", {
    myth: "This is a prepper list — buckets of freeze-dried food and a bunker",
    truth: "Every one of these seven was ordinary household equipment in 1890. Not emergency gear. The gear",
    mythLabel: "MYTH", truthLabel: "TRUTH",
  }, 6),
  C("FlowSteps", "all got replaced one item at a time", 6.4, "full", {
    kicker: "HOW IT GOT LOST", title: "One item at a time, 1920 to 1960", nodes: [
      { label: "The blanket → the furnace", sub: "better, on a normal day" },
      { label: "The candle → the bulb", sub: "better, on a normal day" },
      { label: "The salt → the refrigerator", sub: "better, on a normal day" },
    ],
  }, 8),
  C("PullQuote", "it is the knowing that got expensive", 5.4, "topLeft", {
    quote: "The stuff is cheap and it is at the store right now. It is the knowing that got expensive.",
  }, 7),
  C("BigStatReveal", "so let me put a number on it", 5.2, "topLeft", {
    eyebrow: "Shrink the house from 1,800 sq ft to one room", value: 12, prefix: "", suffix: "× further", support: "whatever heat you can make — candles, bodies, a jug of hot water — now goes twelve times as far",
  }, 7),
  C("SplitPanel", "you hang it in a doorway", 6.4, "left", {
    eyebrow: "ITEM ONE", title: "The wool blanket", image: "img/cy_i_blanket_doorway.jpg",
    bullets: ["Do not wrap it around you — hang it", "One room, doorway and window", "Wool: still works when it is damp", "About $15, army surplus, buy two"],
  }, 6),
  C("ChecklistReveal", "and the honest limit", 6.2, "topLeft", {
    kicker: "GET IT RIGHT", title: "Hanging it so it actually works", items: [
      "Tack the top edge — do not drape it",
      "Weight the bottom: towel or firewood",
      "The floor gap is where you lose it",
      "Cold air falls — it pours through",
    ],
    stamp: "MIND THE GAP",
  }, 4),
  C("BeforeAfter", "put a mirror behind it", 5.4, "top", {
    eyebrow: "Same candle, same wax", beforeLabel: "Candle alone: lights a table", afterLabel: "Mirror behind: lights the room",
    caption: "the half going backwards into a dark wall gets folded forward — about double the light, for nothing",
  }, 5),
  C("SplitPanel", "candles and something shiny", 6.2, "left", {
    eyebrow: "ITEM TWO", title: "Candles — and a mirror", image: "img/cy_i_candle_mirror.jpg",
    bullets: ["One candle ≈ 13 lumens. A bulb ≈ 800", "A mirror behind roughly doubles it", "Shelf, eye level, pale wall opposite", "Three, arranged that way, let you read"],
  }, 4),
  C("ChecklistReveal", "and look i have to say this part straight", 6.4, "topLeft", {
    kicker: "THE ONE RULE", title: "Open flame in a sealed room", items: [
      "Never leave a candle burning while you sleep",
      "Put every one out, every time you lie down",
      "The blanket over the door will catch",
      "Discipline about the flame — not hope",
    ],
    stamp: "PUT THEM OUT",
  }, 9),
  C("CutawayCallouts", "but there is a tank in your house", 7.2, "full", {
    eyebrow: "ITEM THREE", title: "Where the forty gallons are", image: "img/cy_i_waterheater.jpg",
    callouts: [
      { text: "Shut the inlet valve", sub: "top of the tank, first thing", tx: 0.52, ty: 0.16, side: "right" },
      { text: "Gas to pilot / breaker off", sub: "or you burn the elements out", tx: 0.30, ty: 0.34, side: "left" },
      { text: "Drain valve", sub: "your tubing goes here", tx: 0.44, ty: 0.82, side: "right" },
    ],
  }, 8),
  C("NumberedSteps", "now how you get it out", 7.4, "left", {
    eyebrow: "Getting the water out", title: "In this order", steps: [
      { title: "Shut the inlet valve", sub: "top of the tank" },
      { title: "Gas to pilot, or breaker off", sub: "a $200 mistake if you skip it" },
      { title: "Crack a hot tap upstairs", sub: "vents it — thumb off the straw" },
      { title: "Tubing on the drain valve", sub: "first bucket is rust, throw it out" },
    ],
  }, 6),
  C("HighlightSweep", "that water has been sitting warm", 5.0, "top", {
    pre: "A six dollar hose and", highlight: "forty gallons you already paid for", post: ".",
    note: "sitting in a closet or a basement in almost every house in the country",
  }, 6),
  C("CtaCard", "and this is about where people ask me where to write all this down", 6.6, "topLeft", {
    eyebrow: "All of it, written down", title: "The Plain Almanac",
    bullet: "ninety household methods with the real measurements — heat, water, pantry, light. Link at the top of the description",
    price: 0, cta: "LINK IN THE DESCRIPTION",
  }, 13),
  C("SplitPanel", "and a two dollar box of salt would have kept most of it", 6.4, "left", {
    eyebrow: "ITEM FOUR", title: "A box of plain salt", image: "img/cy_i_saltmeat.jpg",
    bullets: ["Fridge turns in ~4 hours. Freezer in ~36", "Salt takes the free water away", "About 1 oz of salt per pound of meat", "A day and a half per pound, cellar cold"],
  }, 12),
  C("ChecklistReveal", "now the honest part", 6.4, "topLeft", {
    kicker: "THE HONEST LIMITS", title: "When salt curing does NOT apply", items: [
      "Summer, 80°F house — do not cure",
      "Winter, 40°F back room — works",
      "Long keeping? nitrite cure salt",
      "Short outage: salt just buys days",
    ],
    stamp: "MATCH IT TO THE WEATHER",
  }, 4),
  C("SplitPanel", "a cast iron dutch oven does not care what the heat is", 6.4, "left", {
    eyebrow: "ITEM FIVE", title: "The cast iron pot", image: "img/cy_i_dutchoven_coals.jpg",
    bullets: ["Wood fire, coals, grill, wood stove", "The one tool indifferent to the fuel", "Mass averages out a bad fire", "$15 at a farm sale — season it first"],
  }, 12),
  C("PullQuote", "you are cooking on the iron", 5.2, "topLeft", {
    quote: "You are not cooking on the fire. You are cooking on the iron — the fire just charges it up.",
  }, 6),
  C("HighlightSweep", "so let me be very direct here", 5.0, "top", {
    pre: "The one that keeps the other six from killing you:", highlight: "a battery carbon monoxide alarm", post: ".",
    note: "you cannot smell it, you cannot see it, and the first symptom feels exactly like being tired and cold",
  }, 6),
  C("ChecklistReveal", "you do not run a generator in a garage", 7.0, "topLeft", {
    kicker: "NEVER — NOT ONCE", title: "What kills people in an outage", items: [
      "A generator in a garage — even door open",
      "A charcoal grill inside, porch or fireplace",
      "A gas oven or range used to heat a room",
      "Any flame in a sealed room with no window cracked",
    ],
    stamp: "CRACK A WINDOW",
  }, 9),
  C("BigStatReveal", "and has a digital number on it", 5.0, "topLeft", {
    eyebrow: "Buy the one with a display — act at", value: 30, suffix: " ppm", support: "not the kind that only screeches when it is already too late — the number lets you act early",
  }, 7),
  C("SplitPanel", "every winter there are families who survive the cold", 6.2, "left", {
    eyebrow: "ITEM SIX", title: "The carbon monoxide alarm", image: "img/cy_i_coalarm_display.jpg",
    bullets: ["About $20, battery, with a display", "Fresh battery every October", "It makes the other six safe", "This is the one I will not be folksy about"],
  }, 9),
  C("SplitPanel", "and this is my favorite", 6.2, "left", {
    eyebrow: "ITEM SEVEN", title: "A glass jug of hot water", image: "img/cy_i_jug_towel.jpg",
    bullets: ["Heat it, wrap it, in the bed 20 min early", "A gallon at 160°F ≈ 600 BTU", "Gives it back over six to eight hours", "Warm the glass first — never boiling"],
  }, 5),
  C("LayerStack", "think about what we just did", 6.4, "full", {
    title: "Every step, you stop heating space you are not in", layers: [
      { label: "The whole house — 1,800 sq ft" },
      { label: "One room — about 140 sq ft" },
      { label: "One bed — where you actually are" },
    ],
  }, 6),
  C("StatGrid", "that is a complete household", 6.6, "full", {
    title: "What $110 actually buys", stats: [
      { value: 12, suffix: "×", label: "further your heat goes" },
      { value: 40, suffix: " gal", label: "water already in the house" },
      { value: 600, suffix: " BTU", label: "in one jug, for the night" },
      { value: 110, prefix: "$", label: "the whole crate" },
    ],
  }, 5),
  C("PullQuote", "it is a different idea about what a house is for", 5.6, "topLeft", {
    quote: "The blanket in the doorway is not a worse furnace. It is a different idea about what a house is for.",
  }, 10),
  C("CtaCard", "if you want the whole thing written down", 6.6, "topLeft", {
    eyebrow: "Ninety of these, written down", title: "The Plain Almanac",
    bullet: "the measurements, the amounts, what to buy and what it costs — heat, water, pantry, light. Link is up at the top of the description",
    price: 0, cta: "LINK IN THE DESCRIPTION",
  }, 8),
  C("NumberedSteps", "so here is what i would do this week", 7.6, "left", {
    eyebrow: "This weekend — in order", title: "Build the crate", steps: [
      { title: "Two wool blankets", sub: "thrift store, not fleece" },
      { title: "Candles + a mirror off the wall", sub: "keep them in the same place" },
      { title: "5 ft of clear tubing", sub: "then go find your drain valve" },
      { title: "Salt, iron pot, alarm, jug", sub: "and the crate is done" },
    ],
  }, 9),
  C("FlowSteps", "there is a way to cook a pot of beans", 6.4, "full", {
    kicker: "NEXT TIME", title: "Fifteen minutes of fire, all day of cooking", nodes: [
      { label: "Bring it to a boil", sub: "about fifteen minutes of fire" },
      { label: "Take it off, pack it in a box", sub: "what you pack is the whole trick" },
      { label: "Come back at supper", sub: "it has been cooking the entire time" },
    ],
  }, 9),
  C("PullQuote", "none of these seven things are clever", 5.6, "topLeft", {
    quote: "They were not tougher than us and they were not smarter than us. They just knew where the water was.",
  }, 7),
  C("HighlightSweep", "and every bit of it is still on a shelf at the hardware store", 5.4, "top", {
    pre: "Nothing patented, nothing anybody got rich on —", highlight: "still on a shelf at the hardware store", post: ".",
    note: "waiting for somebody to want it again",
  }, 13),
];

const compBeats = [];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
  nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}

// ── NUNCA DOS COMPONENTES PESADOS A LA VEZ ───────────────────────────────────────────────
// Si dos overlays se pisan, el de atrás se recorta (o se descarta si le queda menos de 2.5s).
compBeats.sort((x, y) => x.start - y.start);
const trimmed = [];
for (let i = 0; i < compBeats.length; i++) {
  const b = compBeats[i], nx = compBeats[i + 1];
  if (nx && b.start + b.dur > nx.start - 0.15) {
    const nd = +(nx.start - 0.15 - b.start).toFixed(2);
    if (nd < 2.5) { console.warn(`↯ componente descartado por solape: ${b.comp} @${b.start}`); nOv--; compCount[b.comp]--; continue; }
    console.warn(`↯ recortado por solape: ${b.comp} @${b.start} ${b.dur}s -> ${nd}s`);
    b.dur = nd;
  }
  trimmed.push(b);
}
compBeats.length = 0; compBeats.push(...trimmed);

// ── COBERTURA SIN HUECOS ────────────────────────────────────────────────────────────────
// ⛔ El avatar es el FONDO GARANTIZADO: base = FULL. Sólo el B-ROLL REAL lo oculta.
//    Los componentes son OVERLAY y van ENCIMA del avatar → NO entran en `covered`.
//    (En build_raingutter sí entraban, y ahí es donde aparecían los segundos en negro.)
rawBeats.sort((a, b) => a.start - b.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = Math.min(i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL, nextHoldStart(rawBeats[i].start));
  if (rawBeats[i].start + rawBeats[i].dur > next) rawBeats[i].dur = +(next - rawBeats[i].start).toFixed(2);
  if (rawBeats[i].dur < 0.8) rawBeats[i].dur = 0.8;
  // sliver: si al avatar le quedarían <1.2s entre dos planos, estirar el plano actual
  const endB = rawBeats[i].start + rawBeats[i].dur;
  if (next - endB > 0 && next - endB < 1.2) rawBeats[i].dur = +(next - rawBeats[i].start).toFixed(2);
}
const rawSpans = rawBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const covered = (t) => rawSpans.some(([s, e]) => s <= t && e > t);
const STEP = 0.1;
const windows = [];
let cur = null;
for (let t = 0; t < TOTAL - 0.001; t = +(t + STEP).toFixed(2)) {
  const mode = covered(t) ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: +t.toFixed(2), mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: covered(0) ? "hidden" : "full" });
windows.push({ start: +TOTAL.toFixed(2), mode: "hidden" });

// ── COMPUERTA ANTI-HUECO: 0 instantes sin avatar y sin b-roll ───────────────────────────
let holes = 0;
for (let t = 0; t < TOTAL - 0.001; t = +(t + 0.2).toFixed(2)) {
  let mode = "full";
  for (const w of windows) { if (w.start <= t) mode = w.mode; else break; }
  if (mode === "hidden" && !covered(t)) { holes++; if (holes < 6) console.error("✗ HUECO en", t.toFixed(1), "s"); }
}
console.log(holes === 0 ? "✓ anti-hueco: 0 instantes con avatar oculto y sin contenido" : `✗ ANTI-HUECO: ${holes} instantes en negro`);

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const fullCount = windows.filter((w) => w.mode === "full").length;
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
const durs = rawBeats.map((b) => b.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.min(durs.length - 1, Math.floor(durs.length * p))];
console.log(`beats ${beats.length} (b-roll ${rawBeats.length}) · premium ${nOv} · avatar full x${fullCount} (${avSecs.toFixed(0)}s / ${TOTAL.toFixed(0)}s = ${(avSecs / TOTAL * 100).toFixed(0)}%) · dur ${(TOTAL / 60).toFixed(1)}min`);
console.log(`pacing b-roll: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · >=5s ${(durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0)}%`);
console.log("componentes:", JSON.stringify(compCount), "· tipos distintos:", Object.keys(compCount).length);
