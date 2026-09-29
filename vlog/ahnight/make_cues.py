# make_cues.py — hoja creativa de ahnight: componentes anclados por FRASE del guion -> vlog/ahnight/cues.json
# Referencias de medio: "@img:@near" = foto IA del momento · "@foot:<tag>" = metraje real del catálogo · "@now:<q>" = plano actual
import json, os
N = "@img:@near"
C = []
def card(comp, at, props, until=None, dur=None, pad=0.3, marks=None, mind=None):
    c = {"t": "card", "comp": comp, "at": at, "props": props}
    if until: c["until"] = until; c["pad"] = pad
    if dur: c["dur"] = dur
    if marks: c["marks"] = marks
    if mind: c["mindur"] = mind
    C.append(c)
def ov(comp, at, props, dur=4.0, until=None, marks=None):
    c = {"t": "overlay", "comp": comp, "at": at, "props": props, "dur": dur}
    if until: c["until"] = until
    if marks: c["marks"] = marks
    C.append(c)

# ── gancho
ov("PlaceStamp", "You're standing in a river valley", {"place": "SOUTHERN FRANCE", "when": "40,000 YEARS AGO · 6:48 PM"}, dur=4.5)
card("Globe3D", "For most of human history, this was every single night.", {"label0": "EUROPE · TONIGHT", "label1": "EUROPE · 40,000 YEARS AGO", "pin": "SOUTHERN FRANCE", "sub": "OUR VALLEY"}, until="the people sitting around it.", pad=0.4, mind=9.0)
card("Words", "So what did ancient humans actually do all night?", {"text": "WHAT DID THEY DO ALL NIGHT?", "keys": ["NIGHT?"], "bed": N}, until="actually do all night?", pad=0.6)
card("Counter", "We'll also get to eighteen minutes.", {"to": 18, "suffix": " MIN", "label": "EVERYONE ASLEEP AT ONCE", "sub": "IN 20 NIGHTS · ONE HUNTER-GATHERER CAMP", "bed": N}, until="completely asleep at the same time.", pad=0.3)
card("YouThem", "we look at two things.", {"you": {"src": "@foot:flute", "tag": "CLUE 1", "line": "What the ground remembers"}, "them": {"src": "@foot:hadza", "tag": "CLUE 2", "line": "Hunter-gatherers today"}}, until="spend their nights today.", pad=0.3)
ov("PlaceStamp", "You're a hunter, about thirty years old.", {"place": "YOU · THE HUNTER", "when": "ABOUT 30 YEARS OLD"}, dur=3.4)
ov("PlaceStamp", "There's an old woman in your group", {"place": "THE STORYTELLER", "when": "KNOWS EVERY STORY WORTH KNOWING"}, dur=3.6)
ov("PlaceStamp", "And there's a kid, maybe ten,", {"place": "THE KID", "when": "ABOUT 10 · TOO MANY QUESTIONS"}, dur=3.4)

# ── capítulos del reloj (la firma del canal)
CH = [("Six forty-eight PM.", "The sun is gone.", "6:48 PM", "THE SUN IS GONE"), ("Seven twenty PM.", "The fire wakes up.", "7:20 PM", "THE FIRE WAKES UP"),
      ("Eight thirty PM.", "Story time.", "8:30 PM", "STORY TIME"), ("Nine forty PM.", "Hands stay busy.", "9:40 PM", "HANDS STAY BUSY"), ("Ten fifteen PM.", "The bed.", "10:15 PM", "THE BED"),
      ("Twelve forty AM.", "The night shift.", "12:40 AM", "THE NIGHT SHIFT"), ("Two forty AM.", "The second sleep?", "2:40 AM", "THE SECOND SLEEP?"), ("Three fourteen AM.", "The hour of the hyena.", "3:14 AM", "THE HOUR OF THE HYENA"),
      ("Five ten AM.", "The coldest hour.", "5:10 AM", "THE COLDEST HOUR"), ("Six thirty AM.", "Dawn.", "6:30 AM", "DAWN")]
prev = "5:40 PM"
for k, (a, u, t, ti) in enumerate(CH):
    card("NightClock", a, {"time": t, "title": ti, "prev": prev, "n": k + 1, "bed": N}, until=u, pad=0.4, mind=4.2)
    prev = t

# c1
card("Counter", "Your eyes need twenty to thirty minutes", {"from": 0, "to": 30, "prefix": "20–", "suffix": " MIN", "label": "FOR YOUR EYES TO ADJUST TO THE DARK", "sub": "ONE LOOK AT THE FIRE RESETS THE CLOCK", "bed": N}, until="to adjust to the dark.", pad=0.8)
card("Counter", "In one cave in Italy,", {"to": 9, "label": "NEANDERTHALS GNAWED BY HYENAS", "sub": "GROTTA GUATTARI · ITALY", "bed": "@foot:hyena"}, until="gnawed and dragged inside.", pad=0.4)
# c2
card("Counter", "The earliest solid evidence,", {"to": 1, "suffix": " MILLION YEARS", "label": "EARLIEST SOLID EVIDENCE OF FIRE", "sub": "WONDERWERK CAVE · SOUTH AFRICA · BERNA ET AL. 2012", "bed": "@foot:fire"}, until="about a million years old.", pad=0.4)
card("Words", "It's the stove.", {"text": "THE STOVE. THE HEATER. THE ONLY LIGHT FOR MILES.", "keys": ["LIGHT"], "bed": "@foot:fire", "size": 100}, until="the only light for miles.", pad=0.5)
# c3
card("StudyCard", "recorded one hundred and seventy-four conversations", {"kicker": "THE STUDY", "quote": "174 conversations recorded around Kalahari campfires", "source": "WIESSNER · PNAS · 2014", "noQuote": True, "bed": N}, until="hunter-gatherers in the Kalahari.", pad=0.4)
DAY = [{"label": "ECONOMIC", "pct": 31}, {"label": "COMPLAINTS & GOSSIP", "pct": 34}, {"label": "JOKES", "pct": 16}, {"label": "STORIES", "pct": 6, "hot": True}, {"label": "OTHER", "pct": 13}]
card("TalkBars", "Thirty-one percent was about economic matters,", {"title": "BY DAY, WHAT DID THEY TALK ABOUT?", "day": DAY, "source": "WIESSNER · PNAS · 2014"}, until="Six percent.", pad=0.5)
card("TalkBars", "Eighty-one percent of night talk was stories.", {"title": "AFTER DARK, EVERYTHING FLIPPED", "day": DAY, "night": [{"label": "STORIES", "pct": 81, "hot": True}, {"label": "EVERYTHING ELSE", "pct": 19}], "source": "WIESSNER · PNAS · 2014"}, dur=4.8)
card("YouThem", "Every night you sit in the glow of a screen", {"you": {"src": "@now:screen", "tag": "YOU · 2026", "line": "Strangers on a screen"}, "them": {"src": "@jpg:051_0", "tag": "THEM · 40,000 YEARS AGO", "line": "Stories by the fire"}}, until="your campfire has a remote.", pad=0.5)
# c4
ov("PlaceStamp", "the oldest eyed needles we know of,", {"place": "DENISOVA CAVE, SIBERIA", "when": "EYED NEEDLES · ~40,000 YEARS OLD"}, dur=4.5)
card("Counter", "it was eleven to fourteen degrees Celsius colder than today.", {"from": 0, "to": 14, "prefix": "11–", "suffix": "°C", "label": "COLDER THAN TODAY", "sub": "BULGARIA · ~45,000 YEARS AGO · PEDERZANI ET AL. 2021", "bed": N}, until="Think northern Scandinavia today.", pad=0.4)
ov("PlaceStamp", "Today, we call it Chauvet.", {"place": "CHAUVET CAVE, FRANCE", "when": "PAINTED ~36,000 YEARS AGO"}, dur=4.0)
ov("PlaceStamp", "Later, in the cave of Lascaux,", {"place": "LASCAUX, FRANCE", "when": "100+ STONE LAMPS · ~21,000 YEARS AGO"}, dur=4.5)
card("YouThem", "A torch lasted around forty minutes.", {"you": {"src": "@jpg:077_0", "tag": "TORCH", "line": "About 40 minutes"}, "them": {"src": "@foot:lamp", "tag": "FAT LAMP", "line": "More than an hour"}, "source": "MEDINA-ALCAIDE ET AL. · PLOS ONE · 2021"}, until="steady enough to paint by.", pad=0.4)
# c5
ov("PlaceStamp", "In Border Cave, in South Africa,", {"place": "BORDER CAVE, SOUTH AFRICA", "when": "GRASS BEDS ON ASH · 200,000+ YEARS"}, dur=4.5)
ov("PlaceStamp", "And at Sibudu Cave,", {"place": "SIBUDU CAVE, SOUTH AFRICA", "when": "INSECT-REPELLING LEAVES · ~77,000 YEARS"}, dur=4.5)
card("YouThem", "Compare that to your bed.", {"you": {"src": "@now:phone", "tag": "YOU · 2026", "line": "A phone six inches away"}, "them": {"src": "@jpg:087_1", "tag": "THEM · 40,000 YEARS AGO", "line": "Furs, fire, and family"}}, until="an alarm set for six fifteen.", pad=0.4)
card("SleepBars", "On average, they fall asleep three point three hours after it.", {"title": "WHEN DO THEY FALL ASLEEP?", "rows": [{"label": "THEM", "from": 22.1, "to": 5.6, "note": "asleep ~3.3 h after sunset · 5.7–7.1 h of sleep"}, {"label": "YOU", "from": 23.5, "to": 7, "you": True, "note": "a typical modern night"}], "marks": [{"at": 18.8, "label": "SUNSET"}, {"at": 6.5, "label": "SUNRISE"}], "source": "YETISH ET AL. · CURRENT BIOLOGY · 2015"}, until="That's about the same as you.", pad=0.5)
card("Words", "The San and the Tsimane don't even have a word for insomnia.", {"text": "NO WORD FOR INSOMNIA", "keys": ["INSOMNIA"], "bed": N}, until="it doesn't exist.", pad=0.5)
# c6
card("SentinelRing", "And in all that time, how long was the whole camp asleep", {"n": 12, "title": "SOMEONE IS ALWAYS AWAKE", "stat": "18 MINUTES", "statSub": "ALL ASLEEP AT ONCE · 20 NIGHTS · 33 ADULTS", "source": "SAMSON ET AL. · PROC. R. SOC. B · 2017"}, until="a median of eight people were awake.", pad=0.5)
card("StudyCard", "The researchers call it the sentinel hypothesis.", {"kicker": "THE SENTINEL HYPOTHESIS", "quote": "Different body clocks mean someone is always on watch.", "source": "SAMSON ET AL. · PROC. R. SOC. B · 2017", "noQuote": True, "bed": N}, until="without anybody having to take a turn.", pad=0.4)
card("YouThem", "So when your grandpa is up at five in the morning,", {"you": {"src": "@now:elderly man awake early", "tag": "GRANDPA · 5:00 AM", "line": "Not broken"}, "them": {"src": "@now:teenager phone awake", "tag": "TEENAGER · 2:00 AM", "line": "On watch"}}, until="the oldest security system on Earth.", pad=0.5)
# c7
card("StudyCard", "That idea comes from the historian Roger Ekirch,", {"kicker": "THE HISTORY", "quote": "First sleep. Second sleep. In hundreds of old European texts.", "source": "EKIRCH · AT DAY'S CLOSE · 2005", "noQuote": True, "bed": N}, until="in old European writing.", pad=0.4)
card("Words", "Honestly, we don't know.", {"text": "VERDICT: WE DON'T KNOW (YET)", "keys": ["KNOW"], "bed": N}, until="It's still being debated.", pad=0.5)
# c8
ov("PlaceStamp", "The Hadza do most of their hunting from blinds", {"place": "WATERHOLE BLINDS · TANZANIA", "when": "DRY SEASON · MOSTLY AT NIGHT"}, dur=4.5)
card("MoonTally", "In southern Africa, archaeologists found a baboon bone", {"title": "THE FIRST CALENDAR?", "caption": "29 notches · about 43,000 years old", "source": "LEBOMBO BONE · D'ERRICO ET AL. · PNAS 2012 · DEBATED", "bed": "@jpg:129_0"}, until="Others think it's just a tally.", pad=0.4)
ov("PlaceStamp", "In France, a little carved plate", {"place": "ABRI BLANCHARD, FRANCE", "when": "30,000+ YEARS OLD · A MOON RECORD? DEBATED"}, dur=5.0)
# c9
card("Words", "Your ancestors didn't need a phone to wake up.", {"text": "THEIR ALARM CLOCK WAS THE COLD", "keys": ["COLD"], "bed": N}, until="They had the cold.", pad=0.6)
# c10
ov("Recap", "They ate.", {"title": "ALL NIGHT, THEY...", "items": ["ATE", "FED THE FIRE", "MADE CLOTHES", "SLEPT ~7 HOURS", "TOLD STORIES"]}, until="told each other stories.",
   marks={"t0": "They ate.", "t1": "They fed the fire.", "t2": "They made clothes,", "t3": "They slept about as long as you do,", "t4": "told each other stories."})
card("YouThem", "are you the early bird on watch,", {"you": {"src": "@now:elderly coffee morning", "tag": "EARLY BIRD", "line": "On watch at 5 AM"}, "them": {"src": "@now:teen phone night", "tag": "NIGHT OWL", "line": "Second shift at 2 AM"}}, until="the night owl on the second shift?", pad=1.2)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cues.json")
json.dump(C, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(C), "cues ·", sum(c["t"] == "card" for c in C), "cards")
