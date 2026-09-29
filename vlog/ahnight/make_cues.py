# make_cues.py (v2) — hoja creativa de ahnight: set-pieces ancladas por FRASE del guion -> vlog/ahnight/cues.json
#   + vlog/ahnight/base_v2.json: planos base forzados por momento ("i_part" -> referencia)
# Referencias: "@img:@near" foto IA del momento · "@jpg:NNN_P" foto IA puntual · "@v2:<nombre>" imagen v2 (D:/rtmp/ahnight/v2img)
#              "@foot:<tag>" metraje real por etiqueta · "@file:<id>" metraje real puntual (parte del nombre de archivo)
import json, os
C = []
def card(comp, at, props, until=None, dur=None, pad=0.3, marks=None, mind=None, mx=None):
    c = {"t": "card", "comp": comp, "at": at, "props": props}
    if until: c["until"] = until; c["pad"] = pad
    if dur: c["dur"] = dur
    if marks: c["marks"] = marks
    if mind: c["mindur"] = mind
    if mx: c["max"] = mx
    C.append(c)
def ov(comp, at, props, dur=4.0, until=None, marks=None, pad=0.3):
    c = {"t": "overlay", "comp": comp, "at": at, "props": props, "dur": dur}
    if until: c["until"] = until; c["pad"] = pad
    if marks: c["marks"] = marks
    C.append(c)
FIRE = "@foot:fire"; EMB = "@foot:embers"
# durmientes en v2_camp_top (x,y normalizados, medidos sobre la imagen)
SLEEP = [[0.184, 0.253], [0.327, 0.21], [0.452, 0.13], [0.646, 0.185], [0.84, 0.315], [0.792, 0.562], [0.809, 0.815], [0.552, 0.901], [0.354, 0.864], [0.202, 0.821], [0.09, 0.593]]

# ══ HOOK · mini-película ══════════════════════════════════════════════════════
ov("TitleCard", "Imagine it's six forty-eight", {"title": "6:48 PM", "sub": "40,000 YEARS AGO", "pos": "center", "size": 230}, until="Forty thousand years ago.", pad=0.5)
ov("Nightfall", "and the sun just left.", {"to": 0.75}, dur=1.6)
card("Shot", "No lights.", {"src": "@file:px_33637800", "kb": "out"}, until="No lights.", pad=0.15)
card("Shot", "No phone.", {"src": "@v2:v2_you_hook_phone_off", "kb": "in"}, until="No phone.", pad=0.15)
card("Shot", "No door to lock.", {"src": "@v2:v2_you_door", "kb": "in"}, until="No door to lock.", pad=0.3)
card("Shot", "And somewhere up the valley,", {"src": "@v2:v2_eyes", "kb": "in", "zoom": 1.25, "filter": "brightness(1.5)"}, until="very big teeth", pad=0.1)
# flash-forward: los dos bucles abiertos (18 minutos · el segundo sueño) y lo que viene
card("FlashSeq", "is waking up.", {"items": [{"src": "@v2:v2_camp_top", "text": "18 MIN"}, {"src": "@file:wm_blanchard_plaque"}, {"src": "@file:wm_chauvet_lions_panel"}, {"src": "@jpg:051_0"}]}, until="is waking up.", pad=0.35)
card("Globe3D", "For most of human history, this was every single night.", {"label0": "EUROPE · TONIGHT", "label1": "EUROPE · 40,000 YEARS AGO", "pin": "OUR VALLEY", "sub": "SOUTHERN FRANCE", "to": [44.4, 4.4, 1.28]}, until="Twelve hours of dark,", pad=0.2, mx=8.5)
card("Shot", "with nothing to fill them but a fire", {"src": "@v2:flint_1", "kb": "in", "zoom": 1.2}, until="but a fire", pad=0.1)
card("Shot", "and the people sitting around it.", {"src": "@v2:tinder_1", "kb": "in", "zoom": 1.15}, until="sitting around it.", pad=0.1)
card("EmberType", "So what did ancient humans actually do all night?", {"text": "WHAT DID THEY", "sub": "DO ALL NIGHT?", "size": 230, "subSize": 190, "bed": "@file:px_6900893", "formAt": 30}, until="actually do all night?", pad=0.9, mx=4.6)
card("CampWatch", "We'll also get to eighteen minutes.", {"bed": "@v2:v2_camp_top", "sleepers": SLEEP, "mode": "watch", "counter": False, "allAsleepAt": 0.5,
     "lines": [{"text": "18 MINUTES", "hot": True}, {"text": "IN 20 NIGHTS"}]}, until="at the same time.", pad=0.3, mx=8.2,
     marks={"l0": "eighteen minutes.", "l1": "in twenty whole nights"})
ov("TitleCard", "What the ground remembers.", {"title": "What the ground remembers", "sub": "CLUE 1 · ARCHAEOLOGY"}, until="What the ground remembers.", pad=0.8)
ov("TitleCard", "And how people who still live by hunting", {"title": "Hunter-gatherers today", "sub": "CLUE 2 · STUDIES OF LIVING PEOPLES"}, until="spend their nights today.", pad=0.4)
ov("TitleCard", "You're a hunter, about thirty years old.", {"title": "The hunter", "sub": "THAT'S YOU · ABOUT 30"}, dur=2.8)
ov("TitleCard", "There's an old woman in your group", {"title": "The storyteller", "sub": "KNOWS EVERY STORY"}, dur=3.4)
ov("TitleCard", "And there's a kid, maybe ten,", {"title": "The kid", "sub": "ABOUT 10 · TOO MANY QUESTIONS"}, dur=3.2)

# ══ RELOJ DE LA NOCHE · SkyClock variado (el 1º y la hora de la hiena, los más grandes) ═══════════════
CH = [
 ("Six forty-eight PM.", "The sun is gone.", {"time": "6:48 PM", "title": "THE SUN IS GONE", "bed": "@file:px_857251", "mode": "sky", "big": True, "moon": {"x0": 260, "x1": 420, "phase": 0.12}, "spin": 7}, 4.2),
 ("Seven twenty PM.", "The fire wakes up.", {"time": "7:20 PM", "title": "THE FIRE WAKES UP", "bed": "@v2:cliff_night_3", "mode": "rock"}, 3.0),
 ("Eight thirty PM.", "Story time.", {"time": "8:30 PM", "title": "STORY TIME", "bed": "@file:px_32063954", "mode": "sky", "align": "left", "moon": {"x0": 1500, "x1": 1600, "phase": 0.28}, "spin": 10, "pole": [2100, -250]}, 2.8),
 ("Nine forty PM.", "Hands stay busy.", {"time": "9:40 PM", "title": "HANDS STAY BUSY", "bed": "@v2:wall_ochre_2", "mode": "rock"}, 2.2),
 ("Ten fifteen PM.", "The bed.", {"time": "10:15 PM", "title": "THE BED", "bed": "@v2:cliff_night_1", "mode": "sky", "align": "right", "spin": 6, "pole": [300, -500]}, 2.8),
 ("Twelve forty AM.", "The night shift.", {"time": "12:40 AM", "title": "THE NIGHT SHIFT", "bed": "@file:px_30262970", "mode": "sky", "moon": {"x0": 900, "x1": 1060, "phase": 0.5}, "spin": 12}, 3.0),
 ("Two forty AM.", "The second sleep?", {"time": "2:40 AM", "title": "THE SECOND SLEEP?", "bed": "@v2:cliff_night_2", "mode": "rock"}, 1.8),
 ("Three fourteen AM.", "The hour of the hyena.", {"time": "3:14 AM", "title": "THE HOUR OF THE HYENA", "bed": "@v2:v2_eyes", "mode": "sky", "big": True, "spin": 14, "pole": [960, -900], "moon": {"x0": 1450, "x1": 1650, "phase": 0.58}}, 4.2),
 ("Five ten AM.", "The coldest hour.", {"time": "5:10 AM", "title": "THE COLDEST HOUR", "bed": "@v2:frost_1", "mode": "rock"}, 2.4),
 ("Six thirty AM.", "Dawn.", {"time": "6:30 AM", "title": "DAWN", "bed": "@file:px_11320881", "mode": "rock"}, 3.0),
]
for a, u, props, mx in CH:
    card("SkyClock", a, props, until=u, pad=0.35, mx=mx, mind=min(mx, 1.8))

# ══ c1 ════════════════════════════════════════════════════════════════════════
card("EmberType", "Your eyes need twenty to thirty minutes", {"text": "20–30 MIN", "sub": "TO SEE IN THE DARK", "size": 280, "subSize": 90, "bed": FIRE}, until="to adjust to the dark.", pad=0.8, mx=5.2)
card("OchreWall", "In one cave in Italy,", {"lines": [{"text": "NEANDERTHALS", "size": 150}, {"text": "DRAGGED IN BY HYENAS", "size": 96}], "tally": 9, "bed": "@v2:wall_ochre_1"}, until="gnawed and dragged inside.", pad=0.5, mx=7.4)
# ══ c2 ════════════════════════════════════════════════════════════════════════
card("EmberType", "The earliest solid evidence,", {"text": "1,000,000", "sub": "YEARS OF FIRE", "size": 270, "subSize": 100, "bed": EMB}, until="a million years old.", pad=0.5, mx=6.0)
card("Shot", "And to anything else that happens to be watching.", {"src": "@v2:eyes_2", "kb": "in", "zoom": 1.2, "filter": "brightness(1.25)"}, until="to be watching.", pad=0.3)
# ══ c3 ════════════════════════════════════════════════════════════════════════
card("OchreWall", "recorded one hundred and seventy-four conversations", {"lines": [{"text": "174", "size": 300}, {"text": "CONVERSATIONS", "size": 120}], "bed": "@v2:wall_ochre_2"}, until="in the Kalahari.", pad=0.4, mx=6.2)
card("ShadowWall", "Thirty-one percent was about economic matters,", {"bed": "@v2:wall_shadow_day", "firelit": False,
     "stats": [{"value": "31%", "label": "WORK"}, {"value": "34%", "label": "GOSSIP"}, {"value": "6%", "label": "STORIES", "hot": True}]},
     until="Six percent.", pad=0.9, mx=13, marks={"s0": "Thirty-one percent", "s1": "Thirty-four percent", "s2": "Six percent."})
card("Shot", "Basically, a group chat.", {"src": "@v2:v2_you_chat", "kb": "in"}, until="a group chat.", pad=0.3)
card("ShadowWall", "Eighty-one percent of night talk was stories.", {"bed": "@v2:wall_shadow_night", "align": "big", "stats": [{"value": "81%", "label": "STORIES", "hot": True}]},
     until="sat together and listened.", pad=0.4, mx=6.4, marks={"s0": "Eighty-one percent"})
card("MatchCut", "Every night you sit in the glow of a screen", {"a": {"src": "@v2:v2_you_tv", "tag": "YOU · TONIGHT"}, "b": {"src": "@jpg:051_0", "tag": "THEM · 40,000 YEARS AGO"}},
     until="has a remote.", pad=0.5, mx=8.5, marks={"cutAt": "The only difference"})
# ══ c4 ════════════════════════════════════════════════════════════════════════
ov("TitleCard", "from Denisova Cave in Siberia,", {"title": "Denisova Cave", "sub": "EYED NEEDLES · 40,000 YEARS OLD"}, until="forty thousand years old.", pad=0.4)
card("EmberType", "it was eleven to fourteen degrees Celsius colder than today.", {"text": "−11 TO −14°C", "sub": "COLDER THAN TODAY", "size": 230, "subSize": 100, "bed": "@foot:frost", "frost": True},
     until="northern Scandinavia today.", pad=0.4, mx=7.0)
ov("TitleCard", "Today, we call it Chauvet.", {"title": "Chauvet Cave", "sub": "PAINTED ~36,000 YEARS AGO"}, dur=4.2)
ov("TitleCard", "Later, in the cave of Lascaux,", {"title": "Lascaux", "sub": "100+ STONE LAMPS · ~21,000 YEARS AGO"}, until="more than a hundred lamps.", pad=0.4)
card("MatchCut", "A torch lasted around forty minutes.", {"a": {"src": "@jpg:077_0", "tag": "TORCH · ~40 MIN"}, "b": {"src": "@jpg:075_0", "tag": "FAT LAMP · 1 HOUR+"}},
     until="steady enough to paint by.", pad=0.4, mx=7.5, marks={"cutAt": "A fat lamp"})
# ══ c5 ════════════════════════════════════════════════════════════════════════
ov("TitleCard", "In Border Cave, in South Africa,", {"title": "Border Cave", "sub": "GRASS BEDS ON ASH · 200,000+ YEARS"}, dur=4.6)
ov("TitleCard", "And at Sibudu Cave,", {"title": "Sibudu Cave", "sub": "BUG-REPELLING LEAVES · 77,000 YEARS"}, dur=4.6)
card("MatchCut", "A phone six inches from your face,", {"a": {"src": "@v2:v2_you_bed_phone", "tag": "YOU · 11 PM"}, "b": {"src": "@v2:v2_hunter_bed_furs", "tag": "THEM · 10 PM"}},
     until="the people you trust.", pad=0.4, mx=11, marks={"cutAt": "So you lie down"})
card("CampWatch", "On average, they fall asleep three point three hours after it.", {"bed": "@v2:v2_camp_top", "sleepers": SLEEP, "mode": "sleep", "counter": False,
     "lines": [{"text": "3.3 H AFTER SUNSET", "hot": True}, {"text": "5.7–7.1 H OF SLEEP"}, {"text": "SAME AS YOU"}]},
     until="about the same as you.", pad=0.5, mx=10, marks={"l0": "three point three hours", "l1": "five point seven", "l2": "That's about the same as you."})
card("OchreWall", "The San and the Tsimane don't even have a word for insomnia.", {"lines": [{"text": "NO WORD FOR", "size": 130}, {"text": "INSOMNIA", "size": 230}], "bed": "@v2:wall_ochre_3"},
     until="it doesn't exist.", pad=0.5, mx=6.5)
# ══ c6 ════════════════════════════════════════════════════════════════════════
card("CampWatch", "And in all that time, how long was the whole camp asleep", {"bed": "@v2:v2_camp_top", "sleepers": SLEEP, "mode": "watch", "allAsleepAt": 0.42,
     "lines": [{"text": "18 MINUTES", "hot": True}, {"text": "IN 20 NIGHTS"}, {"text": "8 AWAKE AT ANY TIME"}]},
     until="people were awake.", pad=0.5, mx=11, marks={"l0": "Eighteen minutes.", "l1": "In twenty nights.", "l2": "a median of eight"})
ov("TitleCard", "The researchers call it the sentinel hypothesis.", {"title": "The sentinel hypothesis", "sub": "SAMSON ET AL. · 2017", "pos": "center"}, until="the sentinel hypothesis.", pad=1.0)
card("MatchCut", "So when your grandpa is up at five in the morning,", {"a": {"src": "@v2:v2_grandpa_5am", "tag": "GRANDPA · 5 AM"}, "b": {"src": "@v2:v2_teen_2am", "tag": "TEENAGER · 2 AM"}},
     until="they're not broken.", pad=0.4, mx=7, marks={"cutAt": "and your teenage son"})
# ══ c7 ════════════════════════════════════════════════════════════════════════
ov("TitleCard", "A first sleep,", {"title": "First sleep · Second sleep", "sub": "PRE-INDUSTRIAL EUROPE", "pos": "center"}, until="then a second sleep.", pad=0.4)
card("EmberType", "Honestly, we don't know.", {"text": "WE DON'T KNOW", "sub": "STILL DEBATED", "size": 230, "subSize": 100, "bed": EMB, "formAt": 22}, until="still being debated.", pad=0.6, mx=4.4)
# ══ c8 ════════════════════════════════════════════════════════════════════════
ov("TitleCard", "The Hadza do most of their hunting from blinds", {"title": "Waterhole blinds", "sub": "HADZA · DRY SEASON · AT NIGHT"}, until="during the dry season.", pad=0.3)
card("OchreWall", "In southern Africa, archaeologists found a baboon bone", {"lines": [{"text": "29 NOTCHES", "size": 170}, {"text": "43,000 YEARS OLD", "size": 100}], "tally": 29, "bed": "@v2:wall_ochre_3"},
     until="just a tally.", pad=0.3, mx=9)
card("DotTrail", "In France, a little carved plate", {"bed": "@file:wm_blanchard_plaque", "dots": "@dots:blanchard_chain", "label": "ABRI BLANCHARD · 30,000+ YEARS", "startAt": 30},
     until="a record of the Moon.", pad=0.5, mx=12)
# ══ c9 ════════════════════════════════════════════════════════════════════════
card("MatchCut", "Your ancestors didn't need a phone to wake up.", {"a": {"src": "@v2:v2_you_alarm", "tag": "YOUR ALARM"}, "b": {"src": "@jpg:141_0", "tag": "THEIR ALARM: THE COLD"}},
     until="They had the cold.", pad=0.7, mx=5, marks={"cutAt": "They had the cold."})
# ══ c10 ═══════════════════════════════════════════════════════════════════════
ov("EmberWords", "They ate.", {"items": ["THEY ATE", "FED THE FIRE", "MADE CLOTHES", "SLEPT ~7 HOURS", "TOLD STORIES"]}, until="told each other stories.", pad=0.8,
   marks={"t0": "They ate.", "t1": "They fed the fire.", "t2": "They made clothes,", "t3": "They slept about as long as you do,", "t4": "told each other stories."})
card("MatchCut", "Forty thousand years later, you still do all of that.", {"a": {"src": "@jpg:153_0", "tag": "40,000 YEARS AGO"}, "b": {"src": "@v2:v2_you_friends", "tag": "TONIGHT"}},
     until="you still do all of that.", pad=0.3, mx=4, marks={"cutAt": "you still do"})
card("Shot", "You just do it with the lights on.", {"src": "@v2:v2_you_switch", "kb": "in"}, until="with the lights on.", pad=0.4)

d = os.path.dirname(os.path.abspath(__file__))
json.dump(C, open(os.path.join(d, "cues.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)

# planos base forzados (momento_parte → referencia): elenco consistente y "YOU" siempre el mismo personaje
BASE = {
 "0_0": "@file:px_36382116", "1_0": "@jpg:001_0", "1_1": "@file:px_36463000",
 "7_0": "@jpg:021_0", "10_0": "@v2:v2_grandpa_5am",
 "13_0": "@file:wm_bordercave_exc", "13_1": "@file:wm_hadza_home",
 "16_0": "@v2:v2_hunter_face_fire", "17_0": "@jpg:051_0", "18_0": "@jpg:012_0", "19_0": "@jpg:043_0",
 "36_0": "@v2:v2_boy_bone", "64_1": "@v2:v2_boy_blow",
 "80_0": "@v2:v2_hunter_bedding", "80_1": "@v2:v2_hunter_bedding",
 "95_0": "@v2:v2_you_asleep",
 "109_0": "@v2:v2_grandpa_5am", "109_1": "@v2:v2_teen_2am",
 "143_0": "@v2:v2_you_alarm",
 "154_0": "@v2:v2_you_friends", "155_0": "@v2:v2_you_switch",
 "89_0": "@file:wm_actigraph_nasa", "90_0": "@file:wm_hadza_morning", "91_0": "@file:wm_san_fire",
 "114_0": "@jpg:114_0", "115_0": "@jpg:115_0",
 "125_0": "@jpg:123_1", "128_0": "@file:wm_bordercave00", "135_0": "@file:wm_blanchard_plaque", "137_0": "@jpg:133_0",
 "49_0": "@jpg:051_0", "63_1": "@file:px_19082237", "65_0": "@file:px_31381730",
 "74_1": "@file:wm_lascaux_lamp", "76_0": "@jpg:072_0", "79_0": "@jpg:078_0",
}
json.dump(BASE, open(os.path.join(d, "base_v2.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(C), "cues ·", sum(c["t"] == "card" for c in C), "cards ·", len(BASE), "bases forzadas")
