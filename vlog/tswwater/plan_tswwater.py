# tswwater · PLAN DE MONTAJE (Claude, 15-oct-2026). Cada entrada arranca en la 1ª palabra de su frase y dura hasta la siguiente.
#   AV = presentador a cámara · "L:k"/"N:k" = foto (zoom/paneo) · "V:k" = clip agnes (public/clips/tswwater/k.mp4) · dict = componente/héroe
#   Regla Bertha: cuadro 0 = AV hablando; AV 3-6 s cada ~11-13 s (nunca >20 s sin él); b-roll 2,3-5,2 s; ~15 cortes/min; 72 % fotos + 28 % clips.
import json, re, sys, unicodedata, os
from collections import Counter
R = "C:/Users/bauti/tswwater_tmp/w"
WORDS = json.load(open(f"{R}/words.json", encoding="utf8"))
SECS = {s["sec"]: s for s in json.load(open(f"{R}/secs.json", encoding="utf8"))}
END = WORDS[-1]["e"] + 0.6
def _n(w): return re.sub(r"[^a-z0-9]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
NW = [_n(w["w"]) for w in WORDS]
ERR = []
def T(sec, phrase, end=False):
    q = [_n(x) for x in phrase.split() if _n(x)]
    s = SECS[sec]; i0 = next(i for i, w in enumerate(WORDS) if w["s"] >= s["a"] - 0.05)
    for i in range(i0, len(NW) - len(q) + 1):
        if WORDS[i]["s"] > s["b"] + 0.5: break
        if NW[i:i + len(q)] == q:
            return WORDS[i + len(q) - 1]["e"] if end else WORDS[i]["s"]
    ERR.append(f"{sec}: '{phrase}'"); return s["a"]
def snap(t):
    if t <= 0.05: return 0.0
    i = min(range(len(WORDS)), key=lambda j: abs(WORDS[j]["s"] - t))
    return round((WORDS[i - 1]["e"] + WORDS[i]["s"]) / 2, 3) if i else 0.0

P = []
def S(sec, *pairs):
    for i in range(0, len(pairs), 2):
        P.append((T(sec, pairs[i]), pairs[i + 1], sec))
def C(c, **props): return {"c": c, **props}
def HERO(c, k0, **props): return {"hero": c, "bed": k0, "props": props}
def r(x): return round(x, 3)
def CH(sec, phrase, n, title, sub, k):
    return C("Chapter", n=str(n), label="STEP", title=title, sub=sub, k=k, av=False)

# ── HOOK ─────────────────────────────────────────────────────────────────
S("HOOK",
  "This blue flame is burning", "AV",
  "and plain tap water", "V:n_blue_flame_tube",
  "A few drops of it", "V:n_drop_plate",
  "and the same liter of oil", "N:n_liter_oil",
  "now runs this stove for almost six", "V:l_stove_running",
  "Most people think water", "AV",
  "And in the fuel tank", "N:n_jug_water_oil",
  "makes a burner spit", "V:n_orange_smoky",
  "But put the water in the right place", "AV",
  "It turns a lazy", "V:n_orange_lazy",
  "into this", "V:n_blue_ring",
  "Today I am going to build", "AV",
  "A brake drum, a piece of pipe", C("Lineup", head="FROM THE SCRAP PILE", items=[
        {"t": r(T("HOOK", "A brake drum")), "name": "A brake drum", "use": "the burn pot", "k": "n_drum_pile"},
        {"t": r(T("HOOK", "a piece of pipe")), "name": "A piece of pipe", "use": "the burner", "k": "n_pipe_tape"},
        {"t": r(T("HOOK", "two old jugs")), "name": "Two old jugs", "use": "oil and water", "k": "n_two_jugs"},
        {"t": r(T("HOOK", "two little valves")), "name": "Two little valves", "use": "the drips", "k": "n_needle_valves"}]),
  "Then we light it", "V:l_light_match",
  "and I will show you my numbers", "N:n_notebook_numbers",
  "Hours per liter", "N:n_thermometer_wall",
  "And stay for the part", "AV",
  "There is one moment", "V:n_pop_spit",
  "and almost everybody who tries", "AV")
# ── INTRO ────────────────────────────────────────────────────────────────
S("INTRO",
  "If you are new here", "AV",
  "I build heat out of things", "L:l_scrap_pile",
  "Old oil, old metal, old parts", C("PhotoSeq", photos=[
        {"k": "n_oil_buckets", "cap": "old oil"},
        {"k": "n_scrap_metal", "t": r(T("INTRO", "old metal")), "cap": "old metal"},
        {"k": "n_old_parts", "t": r(T("INTRO", "old parts")), "cap": "old parts"},
        {"k": "n_frost_yard", "t": r(T("INTRO", "Winter is coming in")), "cap": "winter is coming"}]),
  "and the cheapest heat there is", "L:l_frost_window",
  "This water trick is old", "AV",
  "Mechanics have been doing it", "N:n_old_shop",
  "The old timers I learned from", "AV",
  "They just had a little can of water", "V:n_can_drip",
  "while everybody else had soot", "N:n_soot_ceiling")
# ── SAFETY ───────────────────────────────────────────────────────────────
S("SAFETY",
  "One quick word", "AV",
  "This stove goes in a garage", C("Checklist", head="BEFORE YOU BUILD", page="SAFETY", k="n_chimney_wall", items=[
        {"t": r(T("SAFETY", "chimney going outside")), "txt": "Chimney goes outside"},
        {"t": r(T("SAFETY", "never in a bedroom")), "txt": "Never in a bedroom"},
        {"t": r(T("SAFETY", "carbon monoxide alarm")), "txt": "CO alarm on the wall"}]),
  "a fire extinguisher by the door", "N:n_extinguisher",
  "and never, ever pour water", "AV",
  "The water only drips", C("Careful", k="n_hot_oil_pan", tag="NEVER INTO HOT OIL", txt="Water only drips onto hot steel.", t=r(T("SAFETY", "onto hot steel"))))
# ── MATERIALS ────────────────────────────────────────────────────────────
S("MATERIALS",
  "Here is everything on the bench", "L:l_bench_materials",
  "One old brake drum", "V:l_drum_carry",
  "Any shop has a pile", "N:n_drum_pile2",
  "A piece of steel pipe", "N:n_pipe_tape2",
  "A steel plate a quarter inch", "N:n_steel_plate",
  "A small thick steel disc", "N:n_disc_hand",
  "That is the heart", "AV",
  "Then the plumbing", C("Lineup", head="THE PLUMBING", items=[
        {"t": r(T("MATERIALS", "Two plastic jugs")), "name": "Two plastic jugs", "use": "one oil, one water", "k": "n_two_jugs2"},
        {"t": r(T("MATERIALS", "About six feet")), "name": "Copper line", "use": "six feet, 1/4 inch", "k": "n_copper_coil"},
        {"t": r(T("MATERIALS", "Two small brass needle valves")), "name": "Two needle valves", "use": "off a dead compressor", "k": "n_needle_valves2"},
        {"t": r(T("MATERIALS", "A short piece of half inch")), "name": "Half inch pipe", "use": "the feed tube", "k": "n_half_pipe"}]),
  "Some bolts, a tube of stove cement", "N:n_bolts_cement",
  "and a few lengths of five inch", "N:n_stovepipe_lengths",
  "Tools are simple", "N:n_tools_bench",
  "No welding", "AV",
  "If you can drill a hole", "L:l_drill_ready")
# ── STEP1 ────────────────────────────────────────────────────────────────
S("STEP1",
  "Step one, the burn pot", CH("STEP1", "Step one", 1, "The burn pot", "AN OLD BRAKE DRUM", "n_drum_flat"),
  "The center hole in the bottom", "N:n_drum_center_hole",
  "I cut a square", "V:l_grinder_plate",
  "and drill four holes", "V:l_drill_corner",
  "Put the plate under the drum", "L:l_mark_holes",
  "and bolt it tight", "V:l_wrench_bolt",
  "Then a thick bead of stove cement", "V:l_cement_bead",
  "That seam has to be sealed", "AV",
  "Any gap down there", "N:n_seam_gap",
  "The drum sits up on three bricks", "L:l_drum_bricks",
  "Iron that thick holds heat", "N:n_drum_edge_thick",
  "That is why we use a brake drum", "AV",
  "A thin can burns through", "N:n_burnt_bucket")
# ── STEP2 ────────────────────────────────────────────────────────────────
S("STEP2",
  "Step two, the splash plate", CH("STEP2", "Step two", 2, "The splash plate", "THE SECRET", "n_disc_bolts"),
  "The thick little disc sits", "AV",
  "Drill three holes near its edge", "V:l_drill_disc",
  "put a bolt down through each", "N:n_disc_nuts",
  "Why raised", "AV",
  "In ten minutes this plate glows", "V:n_plate_red",
  "Every drop of oil that lands", "AV",
  "And later every drop of water", HERO("Focus", "n_plate_red2", k="n_plate_red2", cx=960, cy=600, r0=320, r1=150,
        beats=[{"t": r(T("STEP2", "A small")), "txt": "small"}, {"t": r(T("STEP2", "thick, red")), "txt": "thick"}, {"t": r(T("STEP2", "red hot plate")), "txt": "red hot"}],
        ring=r(T("STEP2", "red hot plate")), tag="THE HEART OF THE STOVE", tagT=r(T("STEP2", "That is the whole trick") + 0.4),
        drop=r(T("STEP2", "every drop of water")), vid="n_drop_plate2", vidEnd=r(T("STEP2", "That is the whole trick")))),
# ── STEP3 ────────────────────────────────────────────────────────────────
S("STEP3",
  "Step three, the burner tube", "AV",
  "and it is where the real flame lives", "V:n_tube_flame",
  "Mark five rings around it", HERO("HoleCount", "n_pipe_marked", k="n_pipe_marked",
        a1={"t": r(T("STEP3", "five rings")), "txt": "5 RINGS"}, a2={"t": r(T("STEP3", "one inch apart")), "txt": "1 INCH APART"},
        b1={"t": r(T("STEP3", "eight holes")), "txt": "× 8 HOLES"}, tot={"t": r(T("STEP3", "forty holes")), "txt": "40"}),
  "Quarter inch bit", "V:l_drill_pipe",
  "Do not rush this", "AV",
  "Each one of those holes", "N:n_holes_close",
  "When the stove is running", "V:n_holes_flame",
  "That is what gives you the roaring", "V:n_blue_ring2")
# ── STEP4 ────────────────────────────────────────────────────────────────
S("STEP4",
  "Step four, the lid", CH("STEP4", "Step four", 4, "The lid", "QUARTER INCH PLATE", "n_lid_round"),
  "and drill a three inch hole", "V:l_cut_lid",
  "The burner tube drops through", "L:l_tube_into_lid",
  "Next to the tube I drill", "N:n_feed_hole",
  "That is where the feed tube goes in", "N:n_feed_tube_lid",
  "Then the top of the burner tube", "L:l_stovepipe_fit",
  "and the stove pipe goes out", "N:n_pipe_wall",
  "A tall chimney means strong draft", "AV",
  "This stove has no fan at all", "N:n_chimney_outside")
# ── STEP5 ────────────────────────────────────────────────────────────────
S("STEP5",
  "Step five, the oil line", CH("STEP5", "Step five", 5, "The oil line", "GRAVITY FEED", "n_jug_shelf"),
  "Gravity does the pushing", "AV",
  "Drill the cap", "V:l_drill_cap",
  "and seal it with a bit of epoxy", "N:n_epoxy_cap",
  "Then the needle valve", "L:l_valve_mount",
  "and then the copper runs down", "N:n_copper_down",
  "Keep that valve far from the heat", "AV",
  "You will be touching it a lot", "V:l_valve_turn",
  "The copper line should drop", "L:l_copper_feed",
  "so every drop lands right", "V:n_oil_drip_line")
# ── STEP6 ────────────────────────────────────────────────────────────────
S("STEP6",
  "Step six, the water line", CH("STEP6", "Step six", 6, "The water line", "SEPARATE", "n_water_jug"),
  "Second jug, second valve", "N:n_two_lines",
  "Two lines, two valves, never mixed", C("DoDont", k="n_two_lines_feed",
        no={"k": "n_jug_water_oil2", "txt": "Water in the oil jug", "t": r(T("STEP6", "never in a jug"))},
        yes={"k": "n_two_lines_feed", "txt": "Two lines, meet on the plate", "t": r(T("STEP6", "only meet on the hot plate"))}),
  "I put a strip of red tape", "V:l_red_tape",
  "In the dark, with cold hands", "L:l_dark_valve")
# ── STEP7 ────────────────────────────────────────────────────────────────
S("STEP7",
  "Step seven, the oil itself", CH("STEP7", "Step seven", 7, "The oil itself", "SETTLE AND STRAIN", "n_oil_bucket_settle"),
  "Let it sit in a bucket", "N:n_bucket_week",
  "The water and sludge sink", "N:n_sludge_bottom",
  "Pour off the top, then strain", "V:l_strain_shirt",
  "Clean oil means", "N:n_clean_oil_jug",
  "And here is the funny part", "AV",
  "and now we are going to drip water", "L:l_water_fill",
  "But not mixed", "AV",
  "Water in the oil makes the drip uneven", "V:n_sputter_drip",
  "Water on its own line", "V:n_drop_plate3")
# ── STEP8 ────────────────────────────────────────────────────────────────
S("STEP8",
  "Step eight, a dry run", CH("STEP8", "Step eight", 8, "A dry run", "BEFORE ANY FIRE", "n_coffee_can_under"),
  "and open each valve on its own", "AV",
  "Find the spot on the oil valve", C("StepCard", head="DRIP RATES", page="DRY RUN", steps=[
        {"t": r(T("STEP8", "on the oil valve")), "txt": "Oil: 1 drop a second", "k": "n_oil_drip_close"},
        {"t": r(T("STEP8", "on the water valve")), "txt": "Water: 1 drop every 3 s", "k": "n_red_tape_valve"}]),
  "Mark both spots with a paint pen", "V:l_paint_pen",
  "Now you are not guessing", "AV",
  "Check every fitting", "L:l_fitting_check",
  "A copper line that weeps oil", C("MistakeStamp", k="n_weeping_fitting", txt="A weeping fitting is a fire", cx=50, cy=50, t=r(T("STEP8", "weeps oil"))))
# ── FIRE ─────────────────────────────────────────────────────────────────
S("FIRE",
  "Time to light it", "AV",
  "I put a handful of torn cardboard", "L:l_cardboard",
  "and a rag with a little", "N:n_oily_rag",
  "Never gasoline", "AV",
  "Light it, drop the lid on", "V:l_light_rag",
  "and open the oil valve just a little", "V:n_first_drip",
  "For the first ten minutes", "V:n_orange_lazy2",
  "a little smoke out of the top", "V:n_chimney_smoke",
  "The drum is still cold", "AV",
  "It is just burning in a puddle", "V:n_puddle_burn",
  "This is how most homemade", "N:n_sooty_stove",
  "Give it time", "AV",
  "Open the oil to about two drops", "N:n_valve_quarter",
  "Listen", "L:l_listen",
  "Look in the feed hole", "L:l_look_feed",
  "When the splash plate is glowing", "V:n_plate_red3")
# ── WATER ────────────────────────────────────────────────────────────────
S("WATER",
  "I open the water valve", "V:l_red_valve_open",
  "Roughly one part water", C("BigNumber", num=10, unit="TO 1", txt="parts oil to one part water", k="n_two_lines_drip", t=r(T("WATER", "eight or ten parts"))),
  "Watch the flame", "AV",
  "Hear that", "V:n_flame_jump",
  "The flame jumps up the burner tube", "V:n_holes_blue",
  "A few more minutes", "V:n_blue_white_ring",
  "The smoke at the top", "AV",
  "Now the magic part", "AV",
  "I can turn the oil down", "V:l_valve_down",
  "and the drum is still too hot", "L:l_hands_warm",
  "Same heat, less oil", "AV")
# ── WHY ──────────────────────────────────────────────────────────────────
S("WHY",
  "So why does a little water", "AV",
  "Water does not burn", "N:n_glass_water",
  "Here is what it does", "AV",
  "When a drop of water hits steel", "V:n_drop_macro",
  "and steam takes up around", C("BigNumber", num=1600, unit="TIMES", txt="more room as steam", k="n_steam_burst", t=r(T("WHY", "sixteen hundred times"))),
  "That little burst happens", "V:n_mist_burst",
  "Big drops and puddles", C("DoDont", k="n_drum_inside",
        no={"k": "n_puddle_burn2", "txt": "Big drops: soot and smoke", "t": r(T("WHY", "leave soot and smoke"))},
        yes={"k": "n_blue_ring3", "txt": "Fine mist: a blue flame", "t": r(T("WHY", "A mist burns all"))}),
  "That is why the flame turns blue", "V:n_blue_close",
  "People argue about the chemistry", "AV",
  "What I can show you", "N:n_jug_level",
  "So let us measure it", "L:l_tape_thermo")
# ── OILS ─────────────────────────────────────────────────────────────────
S("OILS",
  "What can you burn in it", "AV",
  "Used motor oil is the main one", C("Checklist", head="WHAT IT BURNS", page="STRAINED", k="n_oil_cans_row", items=[
        {"t": r(T("OILS", "Used motor oil")), "txt": "Used motor oil"},
        {"t": r(T("OILS", "Old transmission fluid")), "txt": "Transmission fluid"},
        {"t": r(T("OILS", "hydraulic oil")), "txt": "Hydraulic oil"},
        {"t": r(T("OILS", "Old cooking oil")), "txt": "Old cooking oil"}]),
  "What you never put in it", C("Careful", k="n_bad_cans", tag="NEVER IN THIS STOVE", txt="No gasoline, thinner, antifreeze or brake fluid.", t=r(T("OILS", "is gasoline"))),
  "None of those belong", "AV",
  "and the drip slows down", "N:n_thick_oil",
  "The fix is simple", "AV",
  "Mix in a little diesel", "V:l_pour_diesel",
  "and keep the oil jug inside", "N:n_jug_door",
  "Thin oil drips steady", "V:n_steady_drip")
# ── TEST ─────────────────────────────────────────────────────────────────
S("TEST",
  "Here is how I tested it", "AV",
  "Same stove, same garage", C("Checklist", head="THE TEST", page="TWO NIGHTS", k="n_garage_wide", items=[
        {"t": r(T("TEST", "Same stove")), "txt": "Same stove"},
        {"t": r(T("TEST", "same garage")), "txt": "Same garage"},
        {"t": r(T("TEST", "same chimney")), "txt": "Same chimney"},
        {"t": r(T("TEST", "thirty two degrees")), "txt": "32°F outside"}]),
  "My garage is about twenty four", "N:n_garage_wide2",
  "with an old roll up door", "N:n_door_gap",
  "First night, oil only", "V:n_orange_night",
  "To hold the garage at sixty two", "N:n_thermo_62",
  "One liter lasted me three hours", "N:n_clock_jug",
  "And the inside of the burner tube was black", "N:n_tube_black",
  "Second night, with the water drip", "V:n_blue_night",
  "I brought the garage from thirty eight", C("BigNumber", num=64, unit="°F", txt="from 38°F in 50 minutes", k="n_thermo_64", t=r(T("TEST", "up to sixty four"))),
  "then turned the oil down", "L:l_turn_down_night",
  "One liter of oil lasted five hours", "AV",
  "And I used about one cup", "N:n_cup_water",
  "Three hours ten, against", HERO("TestBoard", "n_garage_night", bed="n_garage_night",
        left={"k": "n_tube_black", "txt": "OIL ONLY", "val": "3 h 10 min", "t": r(T("TEST", "Three hours ten")), "frac": 0.56},
        right={"k": "n_tube_gray", "txt": "WITH WATER", "val": "5 h 40 min", "t": r(T("TEST", "five hours forty. That")), "frac": 1.0},
        foot={"txt": "almost double · same liter", "t": r(T("TEST", "almost double"))}),
  "Less soot means less cleaning", "L:l_chimney_check",
  "Your numbers will be different", "AV",
  "Your garage, your weather", "N:n_snowy_driveway",
  "But if you build it right", "V:n_plate_red",
  "you will see the difference", "AV")
# ── MISTAKES ─────────────────────────────────────────────────────────────
S("MISTAKES",
  "Now the mistakes", "AV",
  "The big one is the cold plate", C("MistakeStamp", k="n_cold_plate_puddle", txt="Water on a cold plate", cx=50, cy=58, t=r(T("MISTAKES", "the cold plate"))),
  "Then the plate heats up", "V:n_puddle_steam",
  "Pop", "V:n_pop_spit",
  "Wait for red", "AV",
  "Mistake two, too much water", C("MistakeStamp", k="n_yellow_flicker", txt="Too much water", cx=50, cy=50, t=r(T("MISTAKES", "too much water"))),
  "Back the water off", "V:l_red_valve_close",
  "More water is not more heat", "AV",
  "Mistake three, a weak chimney", C("MistakeStamp", k="n_smoke_rolling", txt="A weak chimney", cx=50, cy=45, t=r(T("MISTAKES", "a weak chimney"))),
  "Make the chimney taller", "L:l_ladder_chimney",
  "and make sure the top is higher", "N:n_chimney_roofline",
  "A short chimney is the number one", "AV",
  "Mistake four, shutting down wrong", C("StepCard", head="SHUTTING DOWN", page="IN THIS ORDER", steps=[
        {"t": r(T("MISTAKES", "close the water first")), "txt": "Close the water first", "k": "n_red_valve_hand"},
        {"t": r(T("MISTAKES", "Let the oil burn")), "txt": "Two more minutes on oil", "k": "n_flame_dying"},
        {"t": r(T("MISTAKES", "then close the oil")), "txt": "Then close the oil", "k": "n_valve_close_oil"}]),
  "If you close the oil first", "N:n_wet_puddle_drum",
  "And one more, the jugs", "AV",
  "Keep them high, keep the lids on", "N:n_jugs_shelf_lids",
  "A frozen water line", "N:n_frozen_jug",
  "Nothing bad happens", "AV")
# ── CLEAN / COOK ─────────────────────────────────────────────────────────
S("CLEAN",
  "Keeping it running is easy", "AV",
  "lift the lid and scrape", "V:l_scrape_plate",
  "You will find a thin crust", "N:n_carbon_flakes",
  "Push a piece of wire", "V:l_wire_holes",
  "and once a month take the chimney down", "L:l_knock_soot",
  "With the water drip there is so much less", "AV",
  "On oil only, I was scraping", C("DoDont", k="n_drum_inside2",
        no={"k": "n_tar_crust", "txt": "Oil only: every 3 days", "t": r(T("CLEAN", "every three days"))},
        yes={"k": "n_carbon_flakes2", "txt": "With water: once a week", "t": r(T("CLEAN", "With water, once a week"))}))
S("COOK",
  "And a little bonus", "AV",
  "The lid of this stove gets hot", "N:n_lid_shelf",
  "and a full kettle of water boils", "V:l_kettle",
  "Coffee in the shop", "V:l_coffee_mug",
  "It does not get much better", "AV")
# ── CLOSE ────────────────────────────────────────────────────────────────
S("CLOSE",
  "So that is the old mechanic's secret", "AV",
  "A brake drum on three bricks", C("Checklist", head="THE WHOLE STOVE", page="RECAP", k="n_stove_full", items=[
        {"t": r(T("CLOSE", "A brake drum on three bricks")), "txt": "Brake drum on 3 bricks"},
        {"t": r(T("CLOSE", "a small thick splash plate")), "txt": "Splash plate, raised ½ inch"},
        {"t": r(T("CLOSE", "a three inch burner tube")), "txt": "3 inch tube, 40 holes"},
        {"t": r(T("CLOSE", "a tall chimney")), "txt": "A tall chimney"},
        {"t": r(T("CLOSE", "two separate drips")), "txt": "Oil + water, separate"}]),
  "Oil first, red plate", "AV",
  "Here is your homework", "AV",
  "go ask the nearest shop", "L:l_shop_ask",
  "Let the oil settle for a week", "N:n_bucket_week",
  "By the time it is clean", "AV",
  "And tell me in the comments", C("Comment", q="How cold does your garage get in January?", k="l_stove_evening", opts=[
        {"t": r(T("CLOSE", "the coldest it gets")), "txt": "Below zero"},
        {"t": r(T("CLOSE", "in January")), "txt": "Around 20°F"},
        {"t": r(T("CLOSE", "where you live")), "txt": "Above freezing"}]),
  "Next time I am putting", "N:n_pc_fan",
  "and we are going for one liter", "V:n_blue_ring",
  "Stay warm out there", "AV")

# ── RELLENOS por sección (el densificador parte fotos largas y pone éstas) ──
FILL = {
 "HOOK": ["n_stove_side", "n_blue_ring_wide", "l_stove_proud"], "INTRO": ["l_garage_door", "n_old_parts", "n_frost_yard"],
 "SAFETY": ["n_co_alarm", "n_chimney_wall", "l_garage_door"], "MATERIALS": ["n_parts_layout", "l_bench_materials2", "n_tools_bench2"],
 "STEP1": ["n_sparks_floor", "n_plate_square", "l_drum_lift", "n_bolts_tight"], "STEP2": ["l_disc_in_drum", "n_disc_top", "l_disc_check"],
 "STEP3": ["n_pipe_vise", "n_shavings", "l_tube_look", "n_holes_rows", "n_pipe_vertical"], "STEP4": ["n_lid_on", "l_lid_place", "n_thimble"],
 "STEP5": ["n_jug_shelf", "n_valve_brass", "l_shelf_jug"], "STEP6": ["n_water_jug", "n_two_lines", "l_two_valves"],
 "STEP7": ["n_oil_bucket_settle", "n_shirt_strain", "n_clean_oil_jug"], "STEP8": ["l_count_watch", "n_drops_can", "l_dryrun_look"],
 "FIRE": ["n_drum_glow", "n_feed_hole_glow", "l_crouch_fire"], "WATER": ["n_blue_ring_wide", "n_stove_running_wide", "l_stove_proud"],
 "WHY": ["n_steam_burst", "n_drop_hand", "l_explain_stove"], "OILS": ["n_oil_cans_row", "n_diesel_can", "l_jug_check"],
 "TEST": ["n_thermometer_wall", "n_garage_night", "l_watch_night", "n_jug_marks"], "MISTAKES": ["n_feed_hole_glow", "n_drum_glow", "l_explain_stove", "n_valve_brass"],
 "CLEAN": ["n_putty_knife", "n_holes_rows", "n_soot_can"], "COOK": ["n_kettle_close", "l_mug_warm", "n_lid_shelf"],
 "CLOSE": ["n_stove_full", "l_stove_evening", "n_blue_ring_wide", "l_garage_door"]}

# ── armado ───────────────────────────────────────────────────────────────
def shots():
    Q = sorted(P, key=lambda x: x[0])
    out = []; z = 0
    for i, (t, spec, sec) in enumerate(Q):
        a = 0.0 if i == 0 else snap(t)
        b = END if i == len(Q) - 1 else snap(Q[i + 1][0])
        if b - a < 0.3: ERR.append(f"toma de {b-a:.2f}s en {a:.1f} ({sec})"); continue
        s = {"a": a, "b": round(b, 3)}
        if spec == "AV":
            s["kind"] = "AV"; s["z"] = "cw"[z % 2]; z += 1
        elif isinstance(spec, str):
            kd, k = spec.split(":")
            s["kind"] = "L" if k.startswith("l_") else "N"; s["k"] = k
            if kd == "V": s["vid"] = True
        elif "hero" in spec:
            s["kind"] = "N"; s["k"] = spec["bed"]; s["hero"] = spec["hero"]; s["hprops"] = spec["props"]
        else:
            s["kind"] = "C"; s["c"] = spec["c"]; s["props"] = {k: v for k, v in spec.items() if k != "c"}
        out.append(s)
    return out


def sec_at(t):
    cur = None
    for k, v in SECS.items():
        if v["a"] - 0.1 <= t: cur = k if cur is None or v["a"] >= SECS[cur]["a"] else cur
    return cur or "HOOK"
def gaps_in(a, b):
    return [round((WORDS[i - 1]["e"] + WORDS[i]["s"]) / 2, 3) for i in range(1, len(WORDS)) if a < WORDS[i]["s"] < b]
def sent_gaps_in(a, b):
    return [round((WORDS[i - 1]["e"] + WORDS[i]["s"]) / 2, 3) for i in range(1, len(WORDS)) if a < WORDS[i]["s"] < b and re.search(r"[.?!:;,]$", WORDS[i - 1]["w"])]
def _ks(s):
    return set(re.findall(r'"([nl]_[a-z0-9_]+)"', json.dumps({kk: v for kk, v in s.items() if kk not in ("a", "b")}, ensure_ascii=False)))
def used_ok(Sh, k, t):
    if sum(1 for s in Sh if k in _ks(s)) >= 3: return False
    return not any(k in _ks(s) and (abs(s["a"] - t) < 60 or abs(s["b"] - t) < 60) for s in Sh)
def pick(Sh, t, avoid=()):
    sec = sec_at(t); ks = list(FILL); i = ks.index(sec) if sec in ks else 0
    near = [ks[j] for j in (i - 1, i + 1, i - 2, i + 2) if 0 <= j < len(ks)]
    order = FILL.get(sec, []) + [k for n in near for k in FILL.get(n, [])] + [k for v in FILL.values() for k in v]
    for k in order:
        if k not in avoid and used_ok(Sh, k, t): return k
    return None
def split_at(Sh, i, t, second):
    s = Sh[i]; s2 = dict(second); s2["a"] = t; s2["b"] = s["b"]; s["b"] = t; Sh.insert(i + 1, s2)
def is_still(s): return s["kind"] in ("N", "L") and not s.get("hero") and not s.get("vid")
def densify(Sh):
    # 1) clips ≤4,2 s y fotos ≤5,2 s y PageUp ≤6,5 s: partir en hueco de palabra
    i = 0
    while i < len(Sh):
        s = Sh[i]; d = s["b"] - s["a"]
        lim = 4.2 if s.get("vid") else (5.2 if is_still(s) else (7.5 if s.get("c") == "PageUp" else None))
        if lim and d > lim:
            tgt = s["a"] + min(lim - 0.4, max(2.6, d / 2 if d < 2 * lim else lim - 0.6))
            g = [x for x in gaps_in(s["a"] + 2.3, min(s["b"] - 2.3, s["a"] + lim)) ]
            if g:
                t = min(g, key=lambda x: abs(x - tgt)); k = pick(Sh, t, avoid=(s.get("k"),))
                if k: split_at(Sh, i, t, {"kind": "L" if k.startswith("l_") else "N", "k": k}); continue
        i += 1
    # 2) avatar: nunca >12,5 s sin AV → la toma de foto/clip que cruza ese punto pasa a AV (3,5-5 s)
    last = 0.0; i = 0
    while i < len(Sh):
        s = Sh[i]
        if s["kind"] == "AV": last = s["b"]; i += 1; continue
        if s["a"] - last >= 9.5 and is_still(s) and not s.get("vid") and s["b"] - s["a"] >= 2.4:
            d = s["b"] - s["a"]
            if d <= 5.4: s.clear(); s.update({"a": Sh[i - 1]["b"], "b": d + Sh[i - 1]["b"], "kind": "AV"}); last = s["b"]
            else:
                g = gaps_in(s["a"] + 3.4, s["a"] + 5.2)
                if g: split_at(Sh, i, g[0], {"kind": s["kind"], "k": s.get("k"), **({"vid": True} if s.get("vid") else {})}); Sh[i] = {"a": Sh[i]["a"], "b": Sh[i]["b"], "kind": "AV"}; last = Sh[i]["b"]
            i += 1; continue
        if s["a"] - last >= 12.5:
            # buscar hacia atrás la última foto/clip que se pueda convertir
            for j in range(i - 1, -1, -1):
                q = Sh[j]
                if q["kind"] == "AV" or q["a"] < last + 4: break
                if is_still(q) and not q.get("vid") and 2.4 <= q["b"] - q["a"] <= 5.6:
                    a_, b_ = q["a"], q["b"]; q.clear(); q.update({"a": a_, "b": b_, "kind": "AV"}); last = b_; break
            else:
                pass
            if Sh[i]["a"] - last >= 12.5: last = Sh[i]["a"] - 6   # no se pudo: seguir sin colgarse
        i += 1
    # 3) tomas <2,2 s: se funden con la anterior (o la siguiente) si no es clip
    i = 1
    while i < len(Sh):
        s = Sh[i]
        if s["kind"] == "AV" and s["b"] - s["a"] < 3.3:
            need = 3.4 - (s["b"] - s["a"])
            nx = Sh[i + 1] if i + 1 < len(Sh) else None
            p = Sh[i - 1]
            if nx and is_still(nx):
                g = [x for x in gaps_in(s["b"] + need - 0.05, s["b"] + need + 2.0) if nx["b"] - x >= 2.3]
                if g: s["b"] = nx["a"] = g[0]; i += 1; continue
                if nx["b"] - nx["a"] < 5.6 and not (i + 2 < len(Sh) and Sh[i + 2]["kind"] == "AV" and False):
                    s["b"] = nx["b"]; Sh.pop(i + 1); i += 1; continue
            if is_still(p):
                g = [x for x in gaps_in(s["a"] - need - 2.0, s["a"] - need + 0.05) if x - p["a"] >= 2.3]
                if g: p["b"] = s["a"] = g[-1]; i += 1; continue
            i += 1; continue
        if s["b"] - s["a"] < 2.2 and not s.get("hero") and s["kind"] != "C":
            p = Sh[i - 1]
            if not p.get("vid") or p["b"] - p["a"] + (s["b"] - s["a"]) <= 4.4:
                p["b"] = s["b"]; Sh.pop(i); continue
            if i + 1 < len(Sh) and not Sh[i + 1].get("vid") and Sh[i + 1]["kind"] != "C":
                Sh[i + 1]["a"] = s["a"]; Sh.pop(i); continue
        i += 1
    # 4) AV consecutivos se funden; z alterna
    out = []
    for s in Sh:
        if out and s["kind"] == "AV" and out[-1]["kind"] == "AV": out[-1]["b"] = s["b"]; continue
        out.append(s)
    i = 1
    while i < len(out):
        s = out[i]
        if s["kind"] == "AV" and s["b"] - s["a"] > 5.0 and s["a"] > 0.5:
            g = gaps_in(s["a"] + 3.1, s["a"] + 4.3)
            k = pick(out, s["a"] + 4.5)
            if g and k:
                t1 = g[len(g) // 2]
                g2 = [x for x in gaps_in(t1 + 2.6, t1 + 4.6) if s["b"] - x >= 3.2] if s["b"] - t1 > 8.5 else []
                split_at(out, i, t1, {"kind": "L" if k.startswith("l_") else "N", "k": k})
                if g2: split_at(out, i + 1, g2[0], {"kind": "AV"})
        i += 1
    z = 0
    for s in out:
        if s["kind"] == "AV": s["z"] = "cw"[z % 2]; z += 1
    return out

def report(Sh):
    tot = Counter(); n_cut = len(Sh)
    for s in Sh: tot["AV" if s["kind"] == "AV" else ("clip" if s.get("vid") else ("C" if s["kind"] == "C" or s.get("hero") else "foto"))] += s["b"] - s["a"]
    print(f"{len(Sh)} tomas · {END:.0f}s · cortes/min {60*n_cut/END:.1f} · " + " ".join(f"{k} {v:.0f}s ({100*v/END:.0f}%)" for k, v in tot.items()))
    br = tot["clip"] + tot["foto"]; print(f"  clips {100*tot['clip']/max(1,br):.0f}% de las fotos+clips")
    last = 0.0
    for s in Sh:
        if s["kind"] == "AV":
            if s["a"] - last > 20: print(f"  ⚠ {s['a']-last:.1f}s sin avatar ({last:.0f}-{s['a']:.0f})")
            last = s["b"]
    for s in Sh:
        d = s["b"] - s["a"]
        if s["kind"] in ("N", "L") and not s.get("hero") and not (2.2 <= d <= 5.6): print(f"  · {s['kind']} {s.get('k')} {d:.1f}s @ {s['a']:.0f}")
        if s["kind"] == "AV" and not (2.8 <= d <= 7): print(f"  · AV {d:.1f}s @ {s['a']:.0f}")

if __name__ == "__main__":
    import os
    os.makedirs(f"{R}/plan", exist_ok=True)
    Sh = densify(densify(shots()))
    if ERR: print("⛔ ANCLAS NO ENCONTRADAS:", ERR)
    report(Sh)
    heroes = [{"a": s["a"], "b": s["b"], "c": s["hero"], "props": s["hprops"]} for s in Sh if s.get("hero")]
    json.dump(heroes, open(f"{R}/heroes.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
    plan = [{k: v for k, v in s.items() if k not in ("hero", "hprops")} for s in Sh]
    json.dump(plan, open(f"{R}/plan/shots.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
    clips = sorted({s["k"] for s in Sh if s.get("vid")})
    json.dump(clips, open(f"{R}/plan/clips.json", "w", encoding="utf8"), ensure_ascii=False)
    print("clips distintos", len(clips), "· héroes", len(heroes))
    sys.exit(1 if ERR else 0)
