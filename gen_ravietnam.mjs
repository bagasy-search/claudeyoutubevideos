// gen_ravietnam.mjs — beatsheet/ravietnam.json (canal "Retire Abroad", look theme_ben SESGADO CÁLIDO).
// "I Retired on $1,300 a Month in Vietnam — Here's Exactly How". Avatar (presentador real) +
// b-roll Da Nang (gpt-image-2 LOW) + ~25% avatar-ref. Anclaje por frase a captions_ravietnam.json.
// Emite: beatsheet/ravietnam.json · public/img/prompts_ravietnam_full.json (no-ref, gen_images.mjs)
//        · public/img/prompts_ravietnam_ref.json (avatar-ref, gen_images_ref.mjs).
// Sesgo cálido: accent AMBER(oro)/GOOD(verde)/COLD(azul) para lo aspiracional; RED/DANGER SOLO en avisos.
import fs from "fs";

const SLUG = "ravietnam";
const IMPERF = "Shot like a real casual phone photo: slight blur in places, uneven natural light, low saturation, soft muted colors, natural skin texture, natural hands, a bit messy, nothing polished, no AI look, no text, no watermark.";
const P = (d) => `Very realistic documentary photo, 16:9 horizontal. ${d}. ${IMPERF}`;
const AVREF = "_avatar_ref_rav.png";
const AVD = "the SAME man from the reference image (a white man in his early 60s, thick wavy silver-gray hair, clean-shaven, warm ruddy complexion, friendly relaxed expression, light linen button-up shirt)";
const PAV = (d) => `Very realistic documentary photo, 16:9 horizontal. ${AVD}, ${d}. ${IMPERF}`;
const DP = (d) => `Create a hand-drawn but professional infographic illustration, EXACT 16:9 aspect ratio (1792x1024), high-contrast premium editorial travel/finance news-graphic style. Near-black background, clean white linework, WARM AMBER/GOLD accents and soft teal, RED used ONLY for a warning element. ${d}. Communicate with simple ICONS, drawings and arrows, MINIMAL text (1-3 words per element, in English). Leave the TOP-RIGHT corner clean and empty for an avatar. Understandable in 1 second, premium, cinematic, warm, NOT schoolish.`;

// ── colectores de prompts (los junto YO, beatsheet.mjs no lee todo) ──
const IMGS = [];      // {name,prompt}      → gen_images.mjs (gpt-image-2 low)
const REFIMGS = [];   // {name,ref,prompt}  → gen_images_ref.mjs (cara del presentador)
const seen = new Set();
const addImg = (name, prompt) => { if (name && !seen.has(name)) { seen.add(name); IMGS.push({ name, prompt }); } };
const addRef = (name, prompt) => { if (name && !seen.has(name)) { seen.add(name); REFIMGS.push({ name, ref: [AVREF], prompt }); } };

// ── helpers de beat ──
const r = (name, prompt, o = {}) => { addImg(name, P(prompt)); return { t: "raw", name, ...o }; };            // foto Vietnam
const rav = (name, prompt, o = {}) => { addRef(name, PAV(prompt)); return { t: "raw", name, ...o }; };          // él haciendo algo
const half = (name, prompt, o = {}) => { addImg(name, P(prompt)); return { t: "half", name, side: o.side || "right", ...o }; };
const c = (kind, props = {}) => ({ t: kind, ...props });
// keyphrase con su propia foto de fondo
const kp = (text, name, prompt, o = {}) => { addImg(name, P(prompt)); return { t: "keyphrase", text, src: `img/${name}.png`, ...o }; };
const kpav = (text, name, prompt, o = {}) => { addRef(name, PAV(prompt)); return { t: "keyphrase", text, src: `img/${name}.png`, ...o }; };
// diorama (PngDiorama: degradé + imagen + titular)
const dio = (name, prompt, o = {}) => { addImg(name, P(prompt)); return { t: "diorama", src: `img/${name}.png`, ...o }; };
// diagrama ilustrado (gpt-image-2)
const dg = (name, desc) => { addImg(name, DP(desc)); return `img/${name}.png`; };
const D = (name, eyebrow, desc) => c("diagram", { eyebrow, slides: [{ image: dg(name, desc), eyebrow }] });
// waypoint de journey (imagen flotante)
const wp = (x, y, z, name, prompt, label, num, dwell = 2.6, travel = 1.5, ref = false) => {
  if (ref) addRef(name, PAV(prompt)); else addImg(name, P(prompt));
  return { x, y, z, image: `img/${name}.png`, label, num, dwell, travel };
};

const GOLD = "amber", GREEN = "good", BLUE = "cold", RED = "accent", ALARM = "danger";

// ── pesos por kind (distribución de duración dentro de la sección) ──
const W = { raw: 1.3, keyphrase: 1.15, quote: 1.1, statpills: 1.15, callout: 1.25, chips: 1.05, diorama: 1.2,
  odometer: 1.35, bars: 1.5, vsmed: 1.6, checklist: 1.55, annotated: 1.5, journey: 2.9, diagram: 2.0,
  rule: 0.95, mistake: 1.45, goldvault: 1.3, signature: 1.7, half: 1.25 };

// ════════════════════════════════════════════════════════════════════════════
const SECTIONS = [
  // ░░ 1 · HOOK — montaje denso, cortes rápidos ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    c("odometer", { to: 1300, prefix: "$", eyebrow: "Everything, one month", label: "Da Nang, Vietnam", repeat: "$1,300", at: "Last month I spent" }),
    kp("*Everything.* Rent. Food. The doctor. The motorbike.", "rv_pho_stall", "a steaming bowl of pho on a little plastic table at a street food stall in Vietnam", { accent: GOLD, w: 0.5 }),
    r("rv_beach_aerial", "a long tropical city beach seen from above at golden hour, calm sea, Da Nang Vietnam", { w: 0.5, hold: true }),
    r("rv_dinner_out", "an older western man eating a cheap fresh seafood dinner at an outdoor restaurant in Vietnam, warm evening", { w: 0.5 }),
    kp("*Money left over.* First time since I was forty.", "rv_wallet_cash", "a hand holding a small stack of Vietnamese dong banknotes and some US dollars, casual", { accent: GOLD, at: "money left over at the end" }),
    c("statpills", { pills: ["$450 rent", "$300 food", "$1,300 all in"], accent: GOLD, at: "For the first time since I was maybe" }),
    c("infzoom", { images: [{ src: "img/rv_beach_aerial.png" }, { src: "img/rv_pho_stall.png" }, { src: "img/rv_dinner_out.png" }, { src: "img/rv_wallet_cash.png" }] }),
    kpav("Down here it makes me feel *RICH*.", "rv_him_beach_smile", "smiling on a tropical beach promenade at sunset, relaxed, looking at the sea", { accent: GOLD, fontSize: 120, at: "it makes me feel like a rich" }),
  ]},
  // ░░ 2 · THE CATCH (open loop — aviso ROJO) ░░
  { key: "catch", phrase: "one thing nobody puts", beats: [
    kp("One thing *nobody* puts in these videos.", "rv_dark_alley", "a quiet dim Vietnamese side street at night, a little uneasy, moody", { accent: RED, at: "There's one thing nobody" }),
    c("mistake", { number: "1", title: "The 90-Day Trapdoor", desc: "It can end the whole dream — fast.", eyebrow: "ONE MISTAKE", image: "img/rv_dark_alley.png" }),
    kp("It can blow this dream to pieces in *90 days flat*.", "rv_calendar_x", "a wall calendar with days crossed off, worried mood, close and casual", { accent: ALARM, at: "90 days flat" }),
    rav("rv_him_serious", "sitting on a balcony looking straight at the camera, serious and honest, morning light", { w: 0.7 }),
  ]},
  // ░░ 3 · WHO PROFITS (el enemigo) ░░
  { key: "angry", phrase: "Nobody tells us this", beats: [
    kp("Your whole life you get sold *one story*.", "rv_tv_fear", "an old man alone watching a loud tv in a dim american living room at night", { accent: BLUE, at: "Nobody tells us this" }),
    c("bars", { eyebrow: "The lie you were sold", title: "“You need this to retire”", unit: "$", accent: GOLD, bars: [{ label: "They say", value: 2000000 }, { label: "The truth", value: 23400 }] }),
    kp("A *not-enough* check buys a life that feels like *wealth*.", "rv_market_fruit", "a colorful vietnamese street market piled with tropical fruit, vivid everyday life", { accent: GOLD, at: "buys a life that feels like wealth" }),
    kp("Who makes money off you being *scared*?", "rv_suits_office", "faceless men in suits in a cold corporate office, low angle, unsettling", { accent: RED, at: "who makes money off you being scared" }),
  ]},
  // ░░ 4 · I'M IN VIETNAM (reveal + preview) ░░
  { key: "vietnam", phrase: "in Vietnam a city called", beats: [
    D("dg_map_danang", "Where I live", "A simple warm map of Vietnam with a glowing gold pin on the central coast city of Da Nang, small plane arc from the USA across the Pacific."),
    r("rv_danang_skyline", "a mid-size coastal city skyline with a river and bridges at dusk, palm trees, Da Nang Vietnam", { w: 0.6, hold: true }),
    c("chips", { title: "Exactly how — no brochure nonsense", image: "img/rv_danang_skyline.png", chips: ["The apartment", "The food", "The healthcare", "The visa trapdoor"], hue: "amber" }),
    kpav("I'll show you *exactly how* a regular guy pulls this off.", "rv_him_cafe_talk", "sitting at an outdoor cafe in vietnam talking to the camera, warm and honest", { accent: GOLD }),
  ]},
  // ░░ 5 · THE KITCHEN TABLE (miedo — azul somber) ░░
  { key: "kitchen", phrase: "Two years ago I was at a kitchen table", beats: [
    c("rule", { number: "01", title: "Two years ago", label: "Ohio" }),
    r("rv_kitchen_ohio", "a lonely older man at a kitchen table in a cold ohio house in winter, low light, staring at papers", { hold: true, w: 1.3 }),
    kp("Heat down to *62* — the gas bill scared me.", "rv_thermostat", "a hand turning down an old house thermostat, worried, dim room", { accent: BLUE, at: "with the heat turned down to" }),
    c("callout", { image: r("rv_bank_statement", "an older man's hands holding a bank statement at a kitchen table, stressed").name && "img/rv_bank_statement.png", figure: "$0", caption: "Nothing left over.", accent: BLUE, eyebrow: "After every bill", at: "there's just nothing" }),
    c("bars", { eyebrow: "The check ran out", title: "A check under $2,000", unit: "$", accent: BLUE, bars: [{ label: "The check", value: 1900 }, { label: "Property tax", value: 300 }, { label: "Insurance", value: 250 }, { label: "Medicine + car", value: 700 }, { label: "Left over", value: 0 }] }),
    kp("Forty years of work — living *check to check* at 70.", "rv_old_hands_coffee", "an older man's tired hands wrapped around a coffee mug, morning, melancholy", { accent: BLUE, at: "living check to check at" }),
    kp("That's not a retirement. That's a *waiting room*.", "rv_empty_chair", "an empty chair by a window in a quiet house, soft sad light, conceptual", { accent: BLUE, at: "That's a waiting room" }),
  ]},
  // ░░ 6 · THE NEPHEW (el giro) ░░
  { key: "nephew", phrase: "got a nephew good kid", beats: [
    r("rv_nephew_laptop", "a younger man showing an older uncle photos on a phone at a thanksgiving dinner table, warm family", { w: 0.9 }),
    kp("“Your problem is *where* you're trying to spend it.”", "rv_phone_photos", "an older man's hand holding a phone showing tropical beach photos, kitchen background", { accent: GOLD, at: "where you're trying to spend it" }),
    c("callout", { image: r("rv_apartment_listing", "a phone screen showing a bright modern apartment for rent, casual snapshot").name && "img/rv_apartment_listing.png", figure: "$400", caption: "A real apartment. Rent.", accent: GOLD, eyebrow: "He laughed and said", at: "A real apartment" }),
    kpav("“That can't be real. That's a *vacation price*.”", "rv_him_skeptic", "sitting at a kitchen table looking skeptical and amused, arms crossed", { accent: BLUE }),
    kp("“Buy *one plane ticket*. Come see for two weeks.”", "rv_plane_ticket", "a single round-trip paper plane ticket on a table, morning light, casual", { accent: GOLD, at: "Buy one plane ticket" }),
  ]},
  // ░░ 7 · ARRIVAL ░░
  { key: "arrival", phrase: "In January when Ohio", beats: [
    c("journey", { dark: true, eyebrow: "The leap", title: "Ohio → Da Nang", accent: GOLD, waypoints: [
      wp(0, 0, 0, "rv_ohio_ice", "a frozen icy suburban street in ohio in january, grey and cold", "Ohio, frozen", "1", 2.4, 1.6),
      wp(1.3, -0.3, 0.3, "rv_airport_window", "an older man looking out an airport window at a plane, hopeful, dawn", "One ticket", "2", 2.4, 1.6, true),
      wp(2.6, 0.3, -0.2, "rv_plane_wing_clouds", "a view out an airplane window over the ocean and clouds, long flight", "Halfway around the world", "3", 2.4, 1.6),
      wp(3.9, -0.2, 0.2, "rv_danang_arrival", "warm tropical air, palm trees outside an arrivals terminal in vietnam, evening", "Da Nang", "4", 2.8, 1.4),
    ]}),
    kpav("I went back to pack up. But in my head — *I never came back*.", "rv_him_beach_arrive", "standing on a tropical beach for the first time, sea breeze, quiet awe", { accent: GOLD }),
  ]},
  // ░░ 8 · DA NANG THE PLACE ░░
  { key: "danang", phrase: "where I actually live", beats: [
    r("rv_danang_beach_wide", "a wide clean tropical city beach with soft sand and calm warm water, morning, Da Nang", { hold: true, w: 1.2 }),
    kp("A real beach. *Soft sand, warm water.* For miles.", "rv_beach_walk", "an older western man walking barefoot on a quiet tropical beach at sunrise", { accent: GOLD, at: "Soft sand, warm water" }),
    r("rv_dragon_bridge", "a big dragon-shaped bridge lit up over a river in a vietnamese city at night", { w: 0.9 }),
    c("callout", { image: "img/rv_dragon_bridge.png", figure: "🐉", caption: "It breathes fire on weekends.", accent: GOLD, eyebrow: "The dragon bridge", at: "shaped like a giant dragon" }),
    c("splitlist", { title: "Why Da Nang", palette: "A", items: ["Miles of soft beach", "Walkable and calm", "The dragon bridge", "A real expat community"] }),
    c("chips", { title: "A whole community over here", image: r("rv_expats_cafe", "a friendly group of older western expats laughing at an outdoor cafe in vietnam").name && "img/rv_expats_cafe.png", chips: ["Americans", "Canadians", "Aussies", "Brits", "Koreans"], hue: "amber" }),
    kp("So you're *not alone*. That mattered more than I expected.", "rv_expats_walk", "two older expat couples chatting on a sunny palm-lined promenade in vietnam", { accent: GREEN, at: "So you're not alone" }),
  ]},
  // ░░ 9 · THE APARTMENT ░░
  { key: "apartment", phrase: "the apartment This is where", beats: [
    c("rule", { number: "02", title: "The apartment", label: "$450 / month" }),
    r("rv_apartment_interior", "a clean bright modern one-bedroom apartment with a small balcony, air conditioning, tidy", { hold: true, w: 1.2 }),
    c("annotated", { image: r("rv_apartment_balcony", "a small apartment balcony with a city and sea view in vietnam, plants, morning").name && "img/rv_apartment_balcony.png", eyebrow: "Furnished — didn't buy a stick", caption: "10-minute walk to the sand", annotations: [{ kind: "circle", x: 50, y: 55, label: "$450 / mo" }], at: "one bedroom, furnished" }),
    c("bars", { eyebrow: "The range is wide", title: "What rent costs in Da Nang", unit: "$", accent: GOLD, bars: [{ label: "Local nbhd", value: 275 }, { label: "Mine (beach-ish)", value: 450 }, { label: "Beachfront tower", value: 1000 }] }),
    kp("The *floor* is low. A clean, safe home is *$400*.", "rv_street_local", "a pleasant local vietnamese neighborhood street with apartments and cafes, daytime", { accent: GOLD, at: "The floor is low" }),
    c("vsmed", { eyebrow: "Renting here vs back home", leftTitle: "Back home", leftItems: [{ text: "Great credit", ok: false }, { text: "Cosigner", ok: false }, { text: "Bank + paperwork", ok: false }], rightTitle: "Da Nang", rightItems: [{ text: "Shake hands", ok: true }, { text: "Pay deposit", ok: true }, { text: "It's yours", ok: true }] }),
  ]},
  // ░░ 10 · THE FOOD ░░
  { key: "food", phrase: "Food Oh the food", beats: [
    c("rule", { number: "03", title: "The food", label: "~$300 / month" }),
    kpav("I'd move here for the *food* alone.", "rv_him_eating", "happily eating a bowl of noodles at a street food stall in vietnam, candid", { accent: GOLD }),
    c("journey", { dark: true, eyebrow: "A normal day of eating", title: "Under $10, all day", accent: GOLD, waypoints: [
      wp(0, 0, 0, "rv_pho_bowl", "a fresh bowl of beef pho with herbs and lime at a street stall, steam", "Pho · $2", "1", 2.3, 1.4),
      wp(1.3, -0.3, 0.3, "rv_viet_coffee", "a glass of strong vietnamese iced coffee with condensed milk on a cafe table", "Coffee · $1", "2", 2.3, 1.4),
      wp(2.6, 0.3, -0.2, "rv_banh_mi", "a crispy vietnamese banh mi sandwich with pork and pickled vegetables, close", "Banh mi · $1", "3", 2.3, 1.4),
      wp(3.9, -0.2, 0.2, "rv_seafood_dinner", "a cheap fresh sit-down dinner of fish rice and vegetables and a beer, outdoor table", "Dinner · $4-5", "4", 2.6, 1.4),
    ]}),
    c("callout", { image: r("rv_market_wonder", "a vietnamese wet market full of fresh fish fruit and vegetables, vivid, busy").name && "img/rv_market_wonder.png", figure: "$300", caption: "A whole month. Eating like a king.", accent: GOLD, eyebrow: "All my food", at: "Runs me right around" }),
    kp("Best food of my life — *cooked fresh, every day*.", "rv_food_spread", "a table full of colorful fresh vietnamese dishes shared among friends, warm", { accent: GOLD, at: "some of the best food I've had" }),
  ]},
  // ░░ 11 · GETTING AROUND ░░
  { key: "around", phrase: "Everybody here rides a motorbike", beats: [
    r("rv_motorbike_coast", "an older western man riding a scooter along a scenic coastal road at sunset in vietnam", { w: 1.0, hold: true }),
    c("statpills", { pills: ["Scooter $50-60/mo", "Gas $2/week", "Ride across town $1-2"], accent: GOLD, at: "You can rent a decent scooter" }),
    kp("For getting around, it's *freedom*. About *$60-70* a month.", "rv_scooters_street", "a river of scooters flowing through a busy vietnamese street, everyday traffic", { accent: GOLD, at: "call it $60" }),
  ]},
  // ░░ 12 · UTILITIES + CLEANER ░░
  { key: "utilities", phrase: "Utilities The electric bill", beats: [
    c("bars", { eyebrow: "The whole utility picture", title: "Under $100 a month", unit: "$", accent: GOLD, bars: [{ label: "Electric (AC)", value: 55 }, { label: "Water", value: 5 }, { label: "Internet", value: 10 }, { label: "Phone", value: 6 }] }),
    c("callout", { image: rav("rv_cleaner_home", "a smiling older western man in a clean tidy apartment, a home just cleaned").name && "img/rv_cleaner_home.png", figure: "$40", caption: "A clean house, twice a week.", accent: GOLD, eyebrow: "Someone cleans + laundry", at: "still about $40 a month" }),
    kp("It gives an old man his *time back*.", "rv_relax_balcony", "an older western man relaxing with a book and coffee on a sunny balcony in vietnam", { accent: GREEN, at: "gives an old man his time back" }),
  ]},
  // ░░ 13 · THE BUDGET (journey estrella) ░░
  { key: "budget", phrase: "let me actually add it up", beats: [
    c("rule", { number: "04", title: "Add it up — out loud", label: "The whole $1,300" }),
    c("journey", { dark: true, eyebrow: "Every dollar, nothing hidden", title: "$1,300 a month", accent: GOLD, waypoints: [
      wp(0, 0, 0, "rv_bud_rent", "a small clean apartment building in vietnam, warm daylight", "Rent · $450", "1", 2.2, 1.3),
      wp(1.2, -0.3, 0.2, "rv_bud_food", "a table of fresh cheap vietnamese food, market bags", "Food · $300", "2", 2.2, 1.3),
      wp(2.4, 0.3, -0.2, "rv_bud_bike", "a parked scooter by a cafe in vietnam", "Bike + rides · $60", "3", 2.2, 1.3),
      wp(3.6, -0.2, 0.2, "rv_bud_utils", "a modern apartment interior with AC and wifi router, tidy", "Utilities · $80", "4", 2.2, 1.3),
      wp(4.8, 0.2, 0.1, "rv_bud_health", "a clean modern private clinic waiting room in vietnam", "Health set-aside · $150", "5", 2.2, 1.3),
      wp(6.0, -0.1, 0.2, "rv_bud_fun", "an older couple on a weekend trip to green vietnamese mountains, happy", "Fun · $190", "6", 2.6, 1.4),
    ]}),
    c("odometer", { to: 1300, prefix: "$", eyebrow: "Add it all up", label: "and money left over", repeat: "$1,300", at: "you land right about" }),
    kp("Me — a guy afraid to run the *dryer* — with money to spare.", "rv_him_content", "an older western man smiling content on a balcony at golden hour in vietnam", { accent: GOLD, at: "Now I've got money left over" }),
  ]},
  // ░░ 14 · HEALTHCARE (bueno + aviso ROJO en lo grande) ░░
  { key: "health", phrase: "health care This is the one", beats: [
    c("rule", { number: "05", title: "Healthcare", label: "Honest — good and scary" }),
    r("rv_clinic_doctor", "an older western man talking with an english-speaking doctor in a bright modern clinic in vietnam", { w: 1.1, hold: true }),
    c("callout", { image: "img/rv_clinic_doctor.png", figure: "$30-40", caption: "A doctor visit. Cash. Same day.", accent: GOLD, eyebrow: "Day-to-day care", at: "a visit runs me maybe" }),
    kpav("Chest pain in the night. The whole night — *a few hundred dollars*.", "rv_him_hospital", "an older western man sitting on a hospital observation bed looking relieved, clean modern room", { accent: GOLD, at: "the tests, the doctors" }),
    kp("No fighting an insurance company. *No letter that ruins your Tuesday*.", "rv_mailbox", "an empty american mailbox, conceptual relief, soft light", { accent: GREEN, at: "No letter in the mail" }),
    c("mistake", { number: "!", title: "The BIG stuff is different", desc: "Surgery, cancer, a stroke — don't rely on the local system.", eyebrow: "HONEST WARNING", image: r("rv_serious_ward", "a serious hospital corridor, sober, clinical").name && "img/rv_serious_ward.png" }),
    c("checklist", { title: "What the smart expats do", eyebrow: "Two things", accent: RED, items: [{ text: "International health plan (~$100-200/mo)", state: "done" }, { text: "Plan MUST include medical evacuation", state: "done" }, { text: "Arrange it BEFORE you need it", state: "done" }], image: r("rv_medevac_plane", "a medical evacuation jet on a runway at dusk, dramatic").name && "img/rv_medevac_plane.png" }),
    D("dg_medevac", "If it's serious", "A gold arc from Vietnam to Bangkok and Singapore showing a medevac plane to world-class hospitals; icons of a jet, a cross, a hospital."),
    kp("The older you are, the more it costs. The time is *now*.", "rv_him_reading_policy", "an older western man reading an insurance document at a table, serious, morning", { accent: RED, at: "The older you are" }),
  ]},
  // ░░ 15 · THE VISA (LA TRAMPA — ROJO) ░░
  { key: "visa", phrase: "the trap door the visa", beats: [
    c("rule", { number: "06", title: "The trapdoor", label: "The visa", hue: "red" }),
    kp("Vietnam does *not* have a retirement visa.", "rv_passport_stamp", "a US passport and a vietnam visa page on a desk, official, close", { accent: ALARM, at: "does not have a retirement visa" }),
    c("callout", { image: "img/rv_passport_stamp.png", figure: "90", caption: "The tourist e-visa — up to 90 days.", accent: RED, eyebrow: "How we actually live here", at: "up to 90 days" }),
    D("dg_visa_cycle", "The 90-day cycle", "A warm circular diagram: arrive on a 90-day e-visa, then extend OR a quick 'visa run' flight to Thailand, then back. Icons: passport, plane, calendar, loop arrow. One red 'rules change' warning tag."),
    kp("Or use a local *agent* — pay them, stay legal, learn the ropes.", "rv_agent_desk", "an older western man at a small visa agency desk handing over papers, helpful staff", { accent: GOLD, at: "use a local agent" }),
    c("mistake", { number: "★", title: "DON'T sell your house and burn every bridge", desc: "The rules change. Treat year one like a long trial.", eyebrow: "THE ONE MISTAKE", image: r("rv_for_sale_no", "a house with a for-sale sign, conceptual caution, evening").name && "img/rv_for_sale_no.png" }),
    c("checklist", { title: "Keep a soft place to land", eyebrow: "Year one = a trial", accent: RED, items: [{ text: "Rent your house out — don't sell", state: "done" }, { text: "Learn this month's rules on the ground", state: "done" }, { text: "Don't trust a video that's a year old", state: "done" }] }),
    kp("That's the *honesty tax* on this dream.", "rv_him_honest2", "an older western man looking straight at camera, sincere, warm room", { accent: RED, at: "the honesty tax on this dream" }),
  ]},
  // ░░ 16 · THE FIRST TWO WEEKS (exactly how) ░░
  { key: "firstweeks", phrase: "how you do this step by step", beats: [
    c("rule", { number: "07", title: "The first two weeks", label: "Exactly how" }),
    c("journey", { dark: true, eyebrow: "If I were starting over", title: "One ticket. Two weeks.", accent: GREEN, waypoints: [
      wp(0, 0, 0, "rv_fw_ticket", "a round-trip plane ticket and a passport on a table, morning", "Round-trip ticket", "1", 2.2, 1.3),
      wp(1.2, -0.3, 0.2, "rv_fw_apartment", "a small booked apartment interior in vietnam, keys on the table", "Rent a month, not a hotel", "2", 2.2, 1.3),
      wp(2.4, 0.3, -0.2, "rv_fw_sim", "a hand buying a phone SIM card at an airport kiosk in vietnam", "SIM at the airport", "3", 2.2, 1.3),
      wp(3.6, -0.2, 0.2, "rv_fw_beach6", "an older man walking a tropical beach at six in the morning, peaceful", "Walk the beach, dawn & dusk", "4", 2.2, 1.3),
      wp(4.8, 0.2, 0.1, "rv_fw_expat_coffee", "an older western man buying coffee for expats at a cafe and asking questions", "Ask the expats everything", "5", 2.6, 1.4, true),
    ]}),
    kp("At the end of two weeks, *your body will know*.", "rv_feet_sand", "an older man's bare feet in warm tropical sand at the water's edge, casual", { accent: GREEN, at: "Your body will know" }),
    kp("It costs one ticket and a month's rent to find out your life just got *bigger*.", "rv_horizon", "an older western man looking out at a bright tropical sea horizon, hopeful, wide", { accent: GOLD, at: "just got a whole lot bigger" }),
  ]},
  // ░░ 17 · THE WARNINGS (avisos — rojo puntual) ░░
  { key: "warnings", phrase: "give you all of them", beats: [
    c("rule", { number: "08", title: "The honest warnings", label: "A friend tells you", hue: "red" }),
    kp("The *heat*. It's hot. It's humid.", "rv_heat_sun", "a hazy hot humid tropical afternoon in a vietnamese city, bright sun, sweat", { accent: GOLD, at: "It's hot. It's humid" }),
    c("callout", { image: r("rv_traffic_river", "a chaotic river of motorbikes at a vietnamese intersection, everyday, a little scary").name && "img/rv_traffic_river.png", figure: "⚠", caption: "Go slow. Wear the real helmet.", accent: ALARM, eyebrow: "The motorbikes", at: "every year people get hurt" }),
    kp("“A live coward beats a *brave statistic*.”", "rv_helmet", "a proper motorcycle helmet on a scooter seat in vietnam, close, casual", { accent: RED, at: "a brave statistic" }),
    c("chips", { title: "The language — learn a little", image: r("rv_market_smile", "an older western man smiling and pointing to order at a vietnamese market stall").name && "img/rv_market_smile.png", chips: ["Hello", "Thank you", "Your numbers", "Smile + point"], hue: "amber" }),
    kp("The *taxes* — you're still an American. Get a real accountant.", "rv_tax_papers", "US tax paperwork and a laptop on a table, boring but important, soft light", { accent: BLUE, at: "You still file a" }),
    c("mistake", { number: "$", title: "The scams", desc: "Nobody legit needs you to wire money. Keep your head.", eyebrow: "STAY SHARP", image: r("rv_phone_scam", "an older man's hand on a phone with a suspicious message, cautious mood").name && "img/rv_phone_scam.png" }),
  ]},
  // ░░ 18 · THE DISTANCE (emocional) ░░
  { key: "distance", phrase: "The distance My grandkids", beats: [
    kp("The *distance*. My grandkids are on the other side of the world.", "rv_videocall", "an older western man on a video call with grandkids on a laptop, bittersweet, evening", { accent: BLUE, at: "My grandkids are on the other" }),
    kp("A video call is a gift. But it's not the same as *holding them*.", "rv_photos_wall", "framed family photos of grandkids on an apartment wall in vietnam, tender", { accent: BLUE, at: "not the same as holding them" }),
    c("checklist", { title: "How folks handle the miles", eyebrow: "No perfect answer", accent: BLUE, items: [{ text: "Fly the family out once a year", state: "done" }, { text: "Split the year — 6 months here", state: "done" }, { text: "Go in with your eyes open", state: "done" }] }),
    kp("This life is cheaper. It is *not free*. You pay some of it in *miles*.", "rv_plane_sky", "a plane crossing a wide sky over the ocean, longing, warm light", { accent: BLUE, at: "you pay some of it in" }),
  ]},
  // ░░ 19 · THE COMMUNITY (verde — la riqueza real) ░░
  { key: "community", phrase: "come back to the people", beats: [
    kpav("The thing that *saved* me wasn't the rent. It was the *community*.", "rv_him_friends", "an older western man laughing with a diverse group of expat friends at dinner in vietnam", { accent: GREEN }),
    r("rv_coffee_morning", "a cheerful group of older expats at a morning coffee meetup on a sunny terrace in vietnam", { w: 1.0, hold: true }),
    c("chips", { title: "A whole life here", image: "img/rv_coffee_morning.png", chips: ["Coffee mornings", "Walking groups", "Friday dinners", "Poker night"], hue: "amber" }),
    kp("A neighbor leaves *fruit* on my doorstep. We talk in *smiles*.", "rv_neighbor", "an older western man and an elderly vietnamese grandmother smiling at a little shop, fruit basket", { accent: GREEN, at: "she leaves fruit on my doorstep" }),
    kp("More people who'd *notice* if I didn't show up — than in 40 years back home.", "rv_promenade_friends", "older expats walking and chatting on a palm promenade at sunset in vietnam", { accent: GREEN, at: "more people who'd notice" }),
    kp("That quiet back home is *not your only option*.", "rv_quiet_house", "a quiet empty american living room, soft lonely light, conceptual", { accent: GREEN, at: "that quiet is not your only" }),
  ]},
  // ░░ 20 · THE CLOSE (la foto) ░░
  { key: "close", phrase: "leave you with a picture", beats: [
    r("rv_morning_beach_ladies", "elderly vietnamese women doing morning exercises and laughing on a tropical beach at sunrise", { hold: true, w: 1.2 }),
    kpav("Feet in the sea, warm as a bath. Coffee. A book.", "rv_him_morning", "an older western man standing with feet in the warm sea at sunrise, peaceful, coffee in hand", { accent: GOLD }),
    kp("Grilled fish tonight by the river — *six dollars* — and we'll close the place down talking.", "rv_river_dinner", "a warm evening riverside grilled fish dinner under a lit bridge in vietnam, friends", { accent: GOLD, at: "cost us six dollars each" }),
    kp("Buddy — it *wasn't over*. You were just doing the math in the *wrong country*.", "rv_him_close", "an older western man looking warmly at the camera at golden hour on a balcony in vietnam", { accent: GOLD, fontSize: 108, at: "it wasn't over" }),
    c("signature", { eyebrow: "That's the secret", lines: [{ text: "A regular, ordinary,", gold: false }, { text: "“not enough” check", gold: true }, { text: "became a life that feels like wealth.", gold: false }] }),
  ]},
  // ░░ 21 · CTA (embudo suave — sin precio/link hablado) ░░
  { key: "cta", phrase: "wrote all of it out", beats: [
    kpav("I wrote *all of it* out — the budget, the visa steps, the checklist.", "rv_him_guide", "an older western man holding up a simple printed guide booklet, friendly, at a cafe", { accent: GOLD }),
    c("checklist", { title: "The free breakdown — down in the description", eyebrow: "No catch", accent: GREEN, items: [{ text: "The real month-by-month budget", state: "done" }, { text: "Every number in this video", state: "done" }, { text: "The visa steps + the checklist", state: "done" }] }),
    kpav("You are *not stuck*. You have more options than they ever told you.", "rv_him_cta_final", "an older western man speaking warmly and directly to the camera, sincere, sunset balcony", { accent: GOLD }),
    kp("The check you worked 40 years for might be a *first-class ticket*.", "rv_ticket_sunset", "a plane ticket on a table with a tropical sunset behind, hopeful, warm", { accent: GOLD, at: "might just be a first class" }),
    rav("rv_him_wave", "warm goodbye wave to the camera on a sunny balcony by the sea, kind smile", { hold: true, kicker: "The water's warm." }),
  ]},
];

// ── ANCLAJE POR FRASE (clonado del pipeline) ────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || null;
const VIDEO_END = (CW[CW.length - 1]?.s || 1560) + 2.2;

let cursorSec = 0;
for (const s of SECTIONS) {
  if (s.start != null) { cursorSec = s.start; continue; }
  const ms = findMs(s.phrase, cursorSec + 1);
  if (ms == null) console.warn(`⚠ frase de sección no encontrada: "${s.phrase}" (${s.key})`);
  s.start = ms != null ? ms : cursorSec + 5;
  cursorSec = s.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const real = sec.beats.filter((b) => b.t !== "talk"); // talk no emite cue pero abre la ventana full
  const hasTalk = sec.beats.some((b) => b.t === "talk");
  const n = real.length;
  const ws = real.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  // primer beat real arranca un poco después si hay talk (avatar full ~1.5s)
  const realStart = hasTalk ? start + 2.6 : start;
  const pin = real.map((b, i) => {
    if (i === 0) return realStart;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > realStart + 1 && ms < end - 1.2 ? ms : null;
  });
  let lastPin = realStart;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.4) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  real.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const beat = { id, start: cursor, dur, key: id };
    if (b.t === "raw") {
      beat.kind = "raw";
      beat.src = `img/${b.name}.png`;
      if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = `img/${b.name}.png`; beat.side = b.side || "right"; if (b.kicker) beat.kicker = b.kicker;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = id;
      delete beat.at; delete beat.w; delete beat.name;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// normalizar rutas de imagen peladas → img/<name>.png
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) fixImg(o[k]); };
beats.forEach(fixImg);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, tutorial: false, beats }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/img/prompts_${SLUG}_full.json`, JSON.stringify(IMGS, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_ref.json`, JSON.stringify(REFIMGS, null, 2));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · imgs(no-ref): ${IMGS.length} · imgs(ref): ${REFIMGS.length} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
