# nrt_director.py — §0 DIRECTOR de `nrtinnitus` (STOP TINNITUS IN 60 SECONDS).
# Cada momento se ancla a la FRASE donde empieza (snippet literal del guion, cursor secuencial)
# y su ms sale de _v3/nrtinnitus_wordms.json (alineación global difflib, 99,1% exacta).
# Emite: _v3/nrt_moments.json (plan crudo) · _v3/nrt_gpt.json (lista gptimg) · _v3/nrt_stock.json
#        _v3/nrt_windows.json (ventanas de avatar) · _v3/nrt_agnes.json (lista agnes, <=50% de fotos)
import json, re, sys
SLUG = "nrtinnitus"
guion = open(f"guiones/{SLUG}.txt", encoding="utf-8").read()
words = json.load(open(f"_v3/{SLUG}_wordms.json", encoding="utf-8"))
# offsets de caracter de cada palabra del guion
offs = [m.start() for m in re.finditer(r"\S+", guion)]
assert len(offs) == len(words)

PRES = ("the same man from the reference image: about 35, short dark curly hair, a short dark beard, "
        "royal-blue short-sleeved medical scrubs, a black stethoscope around his neck")
HAR = ("the same 74-year-old man from the reference image: broad weathered face, thinning white hair combed back, "
       "a thick grey moustache, big hands, a faded navy cardigan over a red-and-black checked flannel shirt")
WIFE = "his wife, a 72-year-old woman with short silver curls, a lavender cardigan and reading glasses on a chain"
LOC = {
 "bed": "in his modest bedroom in the evening; around him a wooden nightstand with a lit lamp, a glass of water, reading glasses and a paperback, a small white desk fan on the dresser, a beige curtain half drawn over a window with dusk light, a framed family photo on the wall and a knitted blanket at the foot of the bed",
 "office": "in his small consulting room; around him a wooden desk with a plastic model of the human ear, a jar of tongue depressors, a blood pressure cuff coiled on the desk, an otoscope in its wall holder, a paper-covered examination couch, half-open blinds and a potted plant on the sill",
 "kitchen": "in his home kitchen; around him light wooden cabinets with glass doors, a stainless range hood, a dish rack with plates by the sink, a bowl of oranges on the granite counter, a speckled mug and wooden spoons in a crock",
 "living": "in a lived-in living room; around him a brown recliner with a knitted throw, a small wooden table radio on a side table, a lamp with a yellowed shade, family photos on the wall, net curtains and a worn rug",
}
FORM = ("candid photo taken on a modern smartphone, natural light, true-to-life colors, sharp focus, deep depth of field "
        "with the whole room in focus, the background cluttered with ordinary everyday objects that stay readable, nothing "
        "blurred out, realistic, candid everyday snapshot, no filter, no ai look, no text, no letters, no labels, no signs")
NIGHT = ("candid photo taken on a modern smartphone at night, lit by a warm bedside lamp so everything stays clearly visible, "
         "true-to-life colors, sharp focus, deep depth of field, the room readable around the subject, nothing blurred out, "
         "realistic, no filter, no ai look, no text, no letters, no labels, no signs")
ILLU = ("clean modern medical illustration, soft cream background, deep teal and warm gold palette, fine linework, "
        "soft shading, calm and precise, the whole drawing crisp and sharp, nothing blurred out, absolutely no text, no letters, no labels, no numbers")

M = []
def add(snip, t, **k): M.append(dict(snip=snip, t=t, **k))
A = lambda s: add(s, "A")
def S(s, q, dur=None): add(s, "S", q=q)
def P(s, act, loc="bed", anim=False, mo=None, night=False, **k):
    add(s, "P", prompt=f"{PRES}, {act}, {LOC[loc]}. " + (NIGHT if night else FORM), anim=anim, mo=mo, **k)
def H(s, act, anim=False, mo=None, night=False):
    add(s, "H", prompt=f"{HAR}, {act}. " + (NIGHT if night else FORM), anim=anim, mo=mo)
def G(s, scene, anim=False, mo=None, night=False, illu=False):
    add(s, "G", prompt=scene + ". " + (ILLU if illu else NIGHT if night else FORM), anim=anim, mo=mo)
def C(s, comp, props, bed=None): add(s, "C", comp=comp, props=props, bed=bed)
def L(s, keys, cta=None): add(s, "L", keys=keys, cta=cta)

# ───────────────────────── HOOK (0–33 s): dolor + promesa honesta ─────────────────────────
A("If your ears are ringing right now")
P("And no, it's not a cure.", "sitting on the edge of his bed, raising one open palm toward the camera in a calm, honest 'let me be straight with you' gesture, eyebrows slightly raised, a small sincere smile", "bed", anim=True, mo="he lowers his open palm slowly")
S("But for a lot of people, those sixty seconds", "senior woman bed night")
G("Sometimes for a minute.", "a 70-year-old woman lying in bed at night with her eyes closed and her face finally relaxed, one hand resting near her ear on the pillow, a white blanket pulled to her chest, a bedside lamp glowing, a glass of water and folded glasses on the nightstand", anim=True, mo="the lamp light flickers very softly", night=True)
A("And there's a reason why it works")
# ───────────────────────── DOLOR (33–120 s) ─────────────────────────
S("Let me guess how your night goes.", "turning off tv remote")
S("you turn off the light,", "turning off lamp")
G("and that's exactly when it gets loud.", "a 72-year-old man lying awake on his back in a dark bedroom, eyes wide open staring at the ceiling, jaw tight, the blanket up to his chest, his wife asleep turned away beside him, moonlight through a gap in the curtain and a digital clock turned away from the camera", night=True)
G("for a lot of people it's more like an old television", "an old boxy television left on in an empty dark living room, the screen glowing with grey static snow that lights the empty armchair and a folded newspaper on the side table, a doorway to a hallway", anim=True, mo="the static on the screen flickers", night=True)
S("During the day you barely notice it.", "senior couple kitchen morning")
G("But at night, in the silence,", "a 68-year-old woman sitting up in bed at night pressing the palm of her hand against one ear, eyes squeezed shut in frustration, grey hair loose on her shoulders, a lamp on, a book face down on the quilt", night=True)
A("And the worst part isn't even the sound.")
G("\"Am I going deaf?\"", "a 71-year-old man propped on one elbow in bed at night, fingertips touching his ear, a worried frown and lips pressed together, reading glasses and a phone face down on the nightstand, striped pyjamas", anim=True, mo="he slowly lowers his hand from his ear", night=True)
G("And then somebody, maybe a doctor,", "in a plain clinic room an older woman in a green cardigan sits across a desk from a bored doctor in a white coat who is shrugging with both palms up; the woman's shoulders are slumped and her handbag is on her lap; a computer monitor turned away, a box of tissues and a potted plant on the desk")
A("Which is... honestly, it's a terrible thing")
G("So maybe you tried things.", "a kitchen counter crowded with six plain supplement bottles without labels, a few scattered capsules, a small dish of dried ginkgo leaves, a glass of water, a pill organizer with the days' lids open and reading glasses folded beside them, morning light from a window")
G("The drops.", "a 66-year-old woman tilting her head sideways at a bathroom sink while squeezing a small plain dropper bottle toward her ear, a towel over her shoulder, a mirror with toothbrushes in a cup behind her")
G("Maybe you even put a cotton swab in there,", "a 70-year-old man at a bathroom mirror holding a cotton swab near his ear with a frown of concentration, a box of cotton swabs open on the sink, a razor and a bar of soap beside it, a small window with frosted glass")
G("And nothing. Or maybe, a little better for a week,", "a 69-year-old woman sitting at her kitchen table pushing a cluster of plain supplement bottles away with the back of her hand, lips pressed together and eyes tired, a cup of tea going cold, a wall calendar with no writing and a fruit bowl behind her", anim=True, mo="she slowly slides the bottles away")
A("I'm going to tell you why that happened.")
P("And stay with me for one more thing,", "leaning forward on a stool with his elbows on the kitchen counter, one index finger raised, a serious and caring expression, eyes locked on the camera", "kitchen")
S("Where you close this video and call your doctor today.", "senior phone call worried")
A("I'll tell you exactly what it sounds like.")
# ───────────────────────── MECANISMO (120–270 s) ─────────────────────────
C("So. Where does the ringing come from?", "ChapterTitle", {"label": "Chapter", "number": "1", "title": "Where the ringing comes from", "sub": "it's not where most people think"})
G("Like something in there is broken and whistling.", "an old copper pipe under a kitchen sink with a pinhole leak spraying a fine mist, droplets on a plastic bucket below, a sponge and a bottle of dish soap on the cabinet floor, a flashlight lying on its side", anim=True, mo="the fine mist sprays from the pinhole")
P("And, well, that's partly true,", "sitting at his desk holding a plastic model of the human ear in one hand and tilting the other hand side to side in a 'so-so' gesture, one eyebrow up, half-smiling", "office")
A("The ringing you hear is made by your brain.")
G("Inside your ear, in a little spiral", "a cross-section of the human inner ear showing the cochlea as a spiral shaped like a snail shell, partly opened to reveal its inner chamber", illu=True)
G("you have thousands of tiny hair cells.", "a magnified view inside the cochlea: long neat rows of tiny upright hair cells like a field of delicate reeds, glowing softly", anim=True, mo="the tiny hair cells sway gently", illu=True)
C("Some listen to the low sounds,", "CutawayCallouts", {"eyebrow": "Inside the ear", "title": "One hair cell, one pitch", "image": "@m_cochlea", "callouts": [{"text": "Low pitches", "sub": "deep inside the spiral", "tx": 0.38, "ty": 0.55, "side": "left"}, {"text": "High pitches", "sub": "at the entrance, they go first", "tx": 0.66, "ty": 0.45, "side": "right"}]})
S("the lawn mower, the factory,", "lawn mower")
S("the concerts, the kitchen blender,", "concert crowd")
S("the traffic...", "city traffic")
G("some of those hair cells get tired,", "a magnified view inside the cochlea: rows of tiny hair cells where a patch of them are bent over, flattened and faded while the rest stand upright", illu=True)
A("Now, here's the part nobody explained to you.")
G("When the signal from those high-pitched cells gets weak,", "a side view of a human head with the brain softly visible, a thin gold nerve line running from the ear to the brain that fades into a faint dotted line halfway", illu=True)
G("the brain does what you'd do with a radio", "an older man's weathered hand turning up the round volume knob of an old wooden table radio on a kitchen counter, a mug of coffee and a folded newspaper beside it, morning light", anim=True, mo="the hand turns the knob slowly")
C("It turns up the gain, as we say.", "GaugeDial", {"eyebrow": "The brain's volume knob", "label": "gain turned all the way up", "value": 88, "suffix": "%", "zones": True})
S("The hiss. The static.", "tv static noise")
C("That static... that's your tinnitus.", "PullQuote", {"quote": "That static is your tinnitus.", "author": "Remember this", "role": "the brain's own noise"})
P("That's why the ringing is usually a high pitch.", "standing beside his desk and pointing with a pen at the spiral part of a plastic ear model, explaining with focused eyes and slightly open mouth", "office", anim=True, mo="he moves the pen slowly along the model")
G("The brain is listening very, very hard", "a 70-year-old woman sitting alone in a quiet living room cupping one hand behind her ear, head tilted, straining to hear with a concentrated frown, a wall clock, a sofa with cushions and a window with net curtains behind her")
S("In the daytime there's the fridge,", "family kitchen breakfast")
S("people talking, the radio.", "people talking cafe")
G("At night, in a silent bedroom, there's nothing.", "a completely silent bedroom at night seen from the doorway, an older couple asleep under a pale quilt, both nightstands with switched-off lamps, a closed window with moonlight on the curtain, slippers on the rug", night=True)
C("So the brain turns the volume all the way up,", "FlowSteps", {"kicker": "Why it's louder at night", "title": "Silence turns the volume up", "nodes": [{"label": "Silent room", "sub": "no outside sound"}, {"label": "Brain searches", "sub": "for the missing pitch"}, {"label": "Gain goes up", "sub": "volume knob to max"}, {"label": "Static louder", "sub": "the ringing you hear"}]})
A("It's not getting worse.")
P("So, remember I said there's one thing", "sitting on the edge of his bed with one finger raised and his eyebrows lifted, a knowing half-smile, as if about to reveal something", "bed", anim=True, mo="he lowers his raised finger slowly")
G("Silence. The perfectly quiet bedroom.", "a perfectly tidy, perfectly quiet bedroom at night: the fan on the dresser switched off, the radio unplugged with its cord coiled, the window shut, an older woman lying awake on her side with open eyes in the lamplight", night=True)
S("Now, about the pills.", "pharmacy shelves")
P("There's no vitamin that turns that knob.", "standing in his kitchen holding up a plain white supplement bottle without a label between two fingers, gently shaking his head with a patient, slightly amused expression", "kitchen")
C("The big reviews of ginkgo for tinnitus", "MythTruth", {"myth": "Ginkgo quiets the ringing", "truth": "In big reviews it did no better than a sugar pill", "mythLabel": "Myth", "truthLabel": "Truth"})
A("So if you spent money on those,")
A("But, and this is the good news,")
S("One is through sound.", "rain on window")
G("is through the bones and the muscles of your head and neck.", "a side view of a human head and neck showing the jaw joint just in front of the ear canal, the chewing muscle of the jaw and the long neck muscles in warm tones, the skull bones softly outlined", illu=True)
# ───────────────────────── DEMOSTRACIÓN: EL TAMBOR (270–407 s) ─────────────────────────
C("Okay. Let's do the sixty seconds.", "ChapterTitle", {"label": "Chapter", "number": "2", "title": "The 60-second drum", "sub": "just your two hands"})
A("Put your phone down somewhere")
P("Now take both hands and cover your ears", "sitting on the edge of his bed with both palms pressed flat over his ears and his fingers pointing back toward the back of his head, eyes half closed in calm concentration", "bed", anim=True, mo="he presses his palms gently over his ears")
P("Your fingertips should be resting on the back of your skull,", "seen from behind at a three-quarter angle, sitting on his bed, both palms over his ears and his fingertips resting on the bony bump at the base of his skull just above the neck", "bed")
P("Good. Now, put your index finger on top of your middle finger.", "close view from behind his head: both hands cupping his ears, each index finger resting on top of the middle finger against the back of his skull, his curly dark hair and the collar of his scrubs visible", "bed", anim=True, mo="the index fingers tap lightly on the back of the head")
G("Tap. Tap. Tap.", "a 72-year-old woman in a floral blouse sitting in an armchair with her palms over her ears and fingers drumming on the back of her head, eyes closed, a small smile of concentration, a knitting basket and a lamp beside the chair", anim=True, mo="her fingers tap gently on the back of her head")
C("It should sound like a drum inside your head.", "NumberedSteps", {"eyebrow": "The 60-second drum", "title": "Palms on, fingers drum", "steps": [{"title": "Palms flat over the ears", "sub": "snug, fingers pointing back"}, {"title": "Fingertips on the skull base", "sub": "the bump above the neck"}, {"title": "Snap index off middle finger", "sub": "a hollow drum sound"}, {"title": "40 to 50 taps", "sub": "about 60 seconds"}]})
P("If you don't hear that drum sound,", "sitting on his bed with palms over his ears, sliding his fingertips slightly higher on the back of his head, eyes turned up in concentration as if listening for the right spot", "bed")
G("Do it about forty...", "a 75-year-old man sitting up in bed against the headboard in flannel pyjamas, palms over his ears and fingers tapping the back of his head, eyes closed and eyebrows relaxed, a lamp and a glass of water on the nightstand", anim=True, mo="his fingers tap steadily on the back of his head", night=True)
P("Steady. Not hard,", "sitting on his bed doing the finger drum on the back of his head with a relaxed, easy half-smile, shoulders loose", "bed")
A("Then take your hands away and... listen.")
G("For some of you, the ringing dropped.", "a 70-year-old woman in a cardigan sitting on a sofa lowering her hands from her ears, eyebrows lifted and mouth slightly open in pleasant surprise, a cushion and a side lamp beside her", anim=True, mo="she slowly lowers her hands from her ears")
G("For some of you, nothing changed at all.", "a 73-year-old man in a sweater sitting in a kitchen chair lowering his hands from his ears with a small shrug and an unimpressed, flat expression, a coffee cup and a newspaper on the table")
P("All three of those are normal.", "sitting on the edge of his bed nodding reassuringly with a warm, calm smile, hands loosely clasped between his knees", "bed")
C("that's what we call residual inhibition.", "PullQuote", {"quote": "Residual inhibition.", "author": "The science word", "role": "the volume backs off after the drum"})
G("when you give the hearing system a strong, rhythmic sound,", "a side view of a human head with soft gold rhythmic sound rings spreading from the back of the skull toward the ear, and inside the brain a bright tangle of lines calming into smooth waves", illu=True, anim=True, mo="the gold rings pulse outward slowly")
C("You're giving that bored, over-alert part of the brain", "GaugeDial", {"eyebrow": "After the drum", "label": "the volume backs off", "value": 34, "suffix": "%", "zones": True})
P("You can repeat it.", "sitting on his bed holding up three fingers toward the camera with a friendly, encouraging expression", "bed")
G("Some people do it every night right before the light goes off,", "a 71-year-old woman in bed reaching over to switch off her bedside lamp with a calm, sleepy face, a small fan on the dresser across the room, a paperback on the quilt", anim=True, mo="her hand reaches slowly toward the lamp switch", night=True)
A("Now, let me be straight")
C("It is not a cure.", "StampBadge", {"text": "NOT A CURE", "sub": "quiet minutes, not a repair"})
A("Anyone who tells you this makes tinnitus disappear forever")
G("when you've been lying awake with that whistle for an hour,", "a 74-year-old man finally asleep on his side in bed, face relaxed, one hand under the pillow, the bedside lamp switched off and faint light from the hallway through the door", night=True)
A("And if it did nothing for you, don't close the video.")
# ───────────────────────── NUEVA INTRIGA: EL TEST DE LA MANDÍBULA (417–480 s) ─────────────────────────
P("Here's the test. Clench your teeth.", "sitting on his bed clenching his teeth hard so the jaw muscles bulge, eyes turned sideways as if listening intently to something inside his head", "bed", anim=True, mo="he clenches his jaw and holds still")
P("Now push your jaw forward,", "sitting on his bed pushing his lower jaw forward into an underbite, eyebrows raised in concentration, listening", "bed")
P("Now turn your head all the way to one side,", "sitting on his bed with his head turned fully to one side, pushing his cheek against the flat palm of his own hand, eyes focused, listening", "bed")
A("Did the ringing change?")
G("Somatic just means the body.", "a 67-year-old woman at a kitchen table touching the joint of her jaw just in front of her ear with two fingertips, a curious, thoughtful expression, a mug of tea and a fruit bowl in front of her")
C("In studies, about two out of three people", "BigStatReveal", {"eyebrow": "Somatic tinnitus", "value": 2, "suffix": " in 3", "support": "people with tinnitus can change it by moving the jaw, neck or face", "source": "clinical studies"})
C("Because they're neighbors.", "CutawayCallouts", {"eyebrow": "Neighbors", "title": "Jaw, neck and ear share a switchboard", "image": "@m_anat", "callouts": [{"text": "Jaw joint", "sub": "a finger's width from the ear", "tx": 0.46, "ty": 0.58, "side": "left"}, {"text": "Ear canal", "sub": "right next door", "tx": 0.56, "ty": 0.46, "side": "right"}, {"text": "Neck muscles", "sub": "same brainstem switchboard", "tx": 0.6, "ty": 0.8, "side": "right"}]})
G("They share a switchboard.", "a vintage 1950s telephone switchboard with rows of jacks and patch cords plugged in, a brass bell and a headset hanging on a hook, an operator's chair, faded vintage colour photograph", anim=True, mo="a patch cord swings gently")
G("So when those muscles are tight, clenched all night,", "a 70-year-old man asleep in bed at night with a tense face, his jaw visibly clenched and his brow furrowed, one fist balled on the pillow, a lamp on low", night=True)
S("stiff from years of looking down at a book or a phone,", "senior reading phone")
P("hears it as ringing.", "sitting on his bed pressing two fingertips on his own jaw muscle below the cheekbone, explaining with a slight frown of concentration", "bed", anim=True, mo="he rubs slow small circles on his jaw")
# ───────────────────────── HAROLD (480–555 s) ─────────────────────────
H("I think about a patient of mine.", "sitting in a doctor's waiting room chair with his cap in his hands, a small tired smile, a water cooler, a rack of pamphlets without writing and a potted palm behind him")
G("walked his route for thirty years.", "a faded 1980s colour photograph of a mail carrier in a blue-grey uniform with a leather mailbag on his shoulder walking up a suburban sidewalk lined with maple trees and white picket fences, summer light")
H("Harold came in because his wife sent him,", f"standing in a doctor's office doorway looking a bit sheepish while {WIFE} stands behind him with a hand on his shoulder, a coat rack and a framed diploma without text on the wall")
H("he was sleeping in the recliner with the radio on,", "asleep at night in a brown recliner in his living room, head tilted back, a knitted throw over his knees, a small wooden table radio glowing on the side table, a lamp on low", night=True, anim=True, mo="the radio dial light glows softly")
H("He had a bag with him.", "at a doctor's wooden desk tipping a small clear plastic bag so that four plain supplement bottles without labels roll out onto the desk, a rueful half-smile, a plastic ear model and a blood pressure cuff on the desk", anim=True, mo="the bottles roll slowly across the desk")
H("\"Doc, I've spent more on these than on my truck insurance.\"", "sitting in the chair across a doctor's desk laughing ruefully with one big open hand raised, four plain bottles in front of him, a window with blinds behind him")
H("And I asked him to do the test.", "sitting on a paper-covered examination couch clenching his teeth, jaw muscles bulging, eyes going wide in surprise, his cardigan open")
H("\"It just got louder.", "close view of his face as his eyes widen in surprise and his eyebrows shoot up, mouth half open, the paper of the examination couch and a wall otoscope behind him")
H("And then I pressed with my thumb,", "sitting on the examination couch wincing as a doctor's hand in a royal-blue scrub sleeve presses a thumb gently on the big chewing muscle of his jaw, his eyes squeezed and shoulders lifted", anim=True, mo="he flinches slightly")
G("And his wife, who was sitting in the corner,", f"{WIFE}, sitting on a chair in the corner of a doctor's consulting room with her handbag on her lap, saying something with a knowing, exasperated look, a coat rack and a window with blinds behind her")
A("Eight years. Nine, maybe. Four bottles.")
P("Because before that, I have to show you something,", "sitting on the edge of his bed holding up a single printed cream-coloured page toward the camera with its back facing the lens so nothing on it can be read, eyebrows raised with excitement", "bed")
# ───────────────────────── LA LÁMINA (555–836 s) — zoom por regiones + inserciones cortas ─────────────────────────
# coords en el espacio 1920x1080 de LaminaZoom (la lámina se generó a 1792x1008 → x1,0714)
FULL = dict(x=0, y=0, w=1920, h=1080, mark=False)
R = dict(title=dict(x=43, y=11, w=1832, h=200), col1=dict(x=48, y=215, w=452, h=560), nums=dict(x=59, y=525, w=445, h=245),
         col2=dict(x=515, y=215, w=440, h=560), jaw1=dict(x=525, y=275, w=420, h=150), jaw2=dict(x=525, y=425, w=420, h=145),
         jaw3=dict(x=525, y=565, w=420, h=145), pill=dict(x=520, y=705, w=440, h=80), col3=dict(x=965, y=215, w=425, h=560),
         rule=dict(x=985, y=535, w=395, h=100), best=dict(x=1005, y=640, w=350, h=135), red=dict(x=1425, y=215, w=455, h=560),
         time=dict(x=43, y=790, w=1330, h=285), ask=dict(x=1395, y=795, w=485, h=270))
L("Please look very carefully at this image,", [("Please look very carefully", FULL), ("This is what I call the Quiet Ears", R["title"]), ("Up at the top, the idea", R["title"]), ("Two doors.", FULL), ("Now look at the left side.", R["col1"]), ("And look at the little numbers", R["nums"])])
L("Now, the middle column.", [("Now, the middle column.", R["col2"]), ("First, the jaw massage.", R["jaw1"])])
P("Find that muscle that bulges when you clench,", "sitting on his bed massaging the big chewing muscle of his jaw with two fingers in slow small circles, eyes calm, a gentle focused expression", "bed", anim=True, mo="his two fingers make slow small circles on his jaw")
L("It might be sore.", [("It might be sore.", R["jaw1"]), ("Second, the tongue rest.", R["jaw2"])])
G("That's the position your jaw is supposed to rest in,", "a relaxed 68-year-old woman sitting by a sunny window with her lips gently closed and her face soft and calm, shoulders down, a mug of tea on the sill and a potted plant beside it")
L("And third, the chin tuck.", [("And third, the chin tuck.", R["jaw3"])])
P("Sitting up, slide your chin straight back,", "sitting upright on the edge of his bed doing a chin tuck, sliding his chin straight back into a double chin, a slightly comic but concentrated expression, back straight", "bed", anim=True, mo="he slides his chin slowly back and forward")
L("And look at the arrow at the bottom of that column.", [("And look at the arrow", R["pill"]), ("Now the right side,", R["col3"]), ("There's a little drawing of a small fan", R["col3"]), ("The rule is the one written in the box:", R["rule"])])
S("If you set it just below,", "fan spinning bedroom")
L("The sounds that work best for most people", [("The sounds that work best", R["best"])])
S("Gentle rain.", "rain window night")
L("Not music with words,", [("Not music with words,", R["best"]), ("And look at the timeline along the bottom.", R["time"])])
G("And if you wake up at three in the morning", "a 72-year-old man sitting up in bed at three in the morning in the soft glow of a lamp, palms over his ears and fingers drumming on the back of his head, eyes closed, a small fan running on the dresser", night=True, anim=True, mo="his fingers tap gently on the back of his head")
L("And now this box, the red one, in the corner.", [("And now this box, the red one", R["red"]), ("Ringing in only one ear that's new.", R["red"])])
G("Sudden hearing loss especially:", "a 69-year-old woman at her kitchen table on a landline phone with a worried, urgent expression, one hand pressed over her other ear, a notepad with blank pages and a pen, a wall clock above the fridge")
L("There's a window, measured in days,", [("There's a window, measured in days,", R["red"]), ("And the last line on the page,", R["ask"])])
S("A proper hearing test,", "hearing test audiologist")
L("Your medications,", [("Your medications,", R["ask"]), ("Oh, and by the way...", FULL)], cta="Oh, and by the way...")
# ───────────────────────── SOLUCIÓN / DESENLACE DE HAROLD (836–993 s) ─────────────────────────
A("So, Harold. Remember Harold,")
H("We did it the boring way.", f"sitting upright on a living room sofa doing a chin tuck with a concentrated face while {WIFE} watches television beside him with a smile, a lamp and a knitted throw on the sofa", anim=True, mo="he slides his chin slowly back")
H("His dentist made him a night guard", "in a dentist's chair holding up a clear plastic night guard and examining it with a curious, amused squint, a dental lamp and a tray of instruments beside him")
H("He moved back into the bedroom", "lying in bed at night relaxed and content, head on the pillow, a small white desk fan running on the dresser across the room, his wife asleep beside him, a lamp on low", night=True, anim=True, mo="the fan blades spin slowly")
H("And he did the drum at night,", "sitting up in bed at night with palms over his ears and fingers drumming on the back of his head, eyes closed and a peaceful face, a glass of water on the nightstand", night=True)
H("Six weeks later he came back.", "sitting in a doctor's office chair, rested and smiling broadly, cap on his knee, sunlight through the blinds, a plastic ear model on the desk in front of him")
C("\"But I don't hate it anymore.\"", "PullQuote", {"quote": "It's not gone. But I don't hate it anymore.", "author": "Harold, 74", "role": "retired mailman", "image": "@m_harold_back"})
A("And I want you to hear that clearly,")
C("Not silence.", "MythTruth", {"myth": "Success means total silence", "truth": "Success is a quieter ringing that stops running your nights", "mythLabel": "The ads", "truthLabel": "The truth"})
C("The drum gives you quiet minutes.", "ChecklistReveal", {"eyebrow": "Three doors, together", "title": "How it adds up", "items": ["The drum: quiet minutes", "Jaw work: less muscle noise", "Sound at night: less straining"], "stamp": "WEEKS, NOT SECONDS"})
A("That's honest.")
G("This won't bring back hearing that's gone.", "an audiologist's hands in blue gloves fitting a small beige behind-the-ear hearing aid onto the ear of a 72-year-old man who sits calmly in a clinic chair, a hearing test booth with a padded door and a desk with a small open case behind them")
G("But I've seen people cry in my office", "a 70-year-old woman in an audiologist's office who has just been fitted with small hearing aids, eyes glistening with tears and a trembling smile, her hand at her ear, an audiologist's hand and a small case on the desk")
A("Don't let pride cost you that.")
P("The drum doesn't work for everyone.", "leaning against his kitchen counter with a gentle shrug and both palms open, an honest, kind expression", "kitchen")
G("And if anybody promises you a sixty-second cure,", "a 70-year-old woman at her kitchen table firmly closing the lid of a laptop with an unimpressed, skeptical look, the screen facing away from the camera, a cup of tea, a notepad and reading glasses beside it")
A("They're selling, not teaching.")
S("Do you have to give up coffee?", "senior coffee morning")
P("For most people, no.", "standing in his kitchen holding a speckled coffee mug with both hands and smiling reassuringly, steam rising, morning light from the window", "kitchen", anim=True, mo="steam rises slowly from the mug")
G("What does make it worse, reliably,", "a 71-year-old man at a breakfast table rubbing his tired eyes with one hand after a bad night, hair messy, a cup of coffee and a plate of toast in front of him, a window with morning light")
S("If it's at seven at night,", "evening coffee cup")
P("And there's a variant of the drum", "sitting on the edge of his bed leaning toward the camera with a conspiratorial half-smile, one hand raised as if sharing a secret", "bed")
H("like Harold's,", "sitting in his recliner with his jaw clenched and one hand on his cheek, listening with a surprised face, the table radio beside him")
P("I left exactly how to do it in the description,", "sitting on his bed pointing downward with his index finger and a friendly, knowing smile, as if pointing to something below the screen", "bed", ov="desc")
# ───────────────────────── RECAP 5 PASOS + CIERRE (993–1101 s) ─────────────────────────
C("Okay. Let's put it all together,", "ChapterTitle", {"label": "Chapter", "number": "3", "title": "Tonight, in five steps", "sub": "start before the light goes off"})
C("One. An hour before bed,", "NumberedSteps", {"eyebrow": "Tonight", "title": "Five steps to quieter nights", "steps": [{"title": "Screens down, lights low", "sub": "an hour before bed"}, {"title": "Jaw and neck release", "sub": "half an hour before"}, {"title": "The 60-second drum", "sub": "right before lights off"}, {"title": "Fan or soft rain", "sub": "just below the ringing"}, {"title": "Awake at 3 a.m.?", "sub": "drum again, in bed"}]})
P("Two. Half an hour before,", "sitting on the edge of his bed massaging both sides of his jaw with his fingertips, eyes closed and face relaxed", "bed")
G("Three. In bed,", "a 70-year-old woman sitting up in bed in a nightgown doing the finger drum with palms over her ears, eyes closed, a small smile, the lamp still on", night=True, anim=True, mo="her fingers tap gently on the back of her head")
S("Four. A fan or soft rain,", "table fan")
G("Five. If you wake up and it's loud,", "a 73-year-old man sitting on the side of his bed at night with his palms over his ears, calm rather than frustrated, slippers on the rug, a lamp on low and a fan on the dresser", night=True)
C("And any time you notice one of the signs from that red box,", "ChecklistReveal", {"eyebrow": "Skip all of this and call", "title": "Same-day signs", "items": ["New ringing in ONE ear", "Pulsing with your heartbeat", "Sudden hearing loss", "Dizziness or spinning"], "stamp": "CALL TODAY"})
A("Now I want to hear from you.")
G("did the ringing change when you did the drum?", "a 68-year-old woman on a sofa smiling while typing a message on her phone held toward her, the screen facing away from the camera, a cup of tea and a cushion beside her", anim=True, mo="her thumbs type slowly")
P("And in the next video,", "standing in his kitchen in the evening holding a plain steaming mug near his chest, a curious, mysterious half-smile, the window dark behind him", "kitchen", anim=True, mo="steam rises from the mug")
A("If you want to see that one, subscribe,")
G("It's your brain listening, so hard,", "an older couple asleep peacefully side by side in bed at night, faces relaxed, a small fan on the dresser and a lamp switched off, soft light from the hallway", night=True, anim=True, mo="the fan blades turn slowly")
S("Quiet enough to hear your grandchildren.", "grandparents grandchildren laughing")
S("Quiet enough to live.", "senior man walking morning")
A("Sleep well tonight.")


# ── metraje REAL >=25%: planos genéricos → stock, y 2º plano de stock en los momentos largos ──
CONVERT = {"The drops.": "ear drops", "At night, in a silent bedroom, there's nothing.": "couple sleeping bed",
 "What does make it worse, reliably,": "tired man breakfast", "when you've been lying awake with that whistle for an hour,": "old man sleeping",
 "So maybe you tried things.": "vitamin bottles", "the brain does what you'd do with a radio": "old radio knob"}
XSHOT = {"He had a bag with him.": "supplement pills table", "And then I pressed with my thumb,": "jaw massage", "Sitting up, slide your chin straight back,": "neck stretch",
 "For most people, no.": "pouring coffee", "Three. In bed,": "woman bed lamp",
 "And in the next video,": "warm milk mug", "It's your brain listening, so hard,": "old couple sleeping",
 "Because they're neighbors.": "ear closeup", "In studies, about two out of three people": "senior woman thinking", "The drum gives you quiet minutes.": "sunrise bedroom window"}
for m in M:
    if m["snip"] in CONVERT: m.update(t="S", q=CONVERT[m["snip"]], anim=False)
    if m["snip"] in XSHOT: m["x"] = XSHOT[m["snip"]]
miss = set(CONVERT) | set(XSHOT)
miss -= {m["snip"] for m in M}
if miss: sys.exit(f"⛔ CONVERT/XSHOT sin match: {miss}")

# ───────── resolución de anclas ─────────
cur = 0
low = guion.lower()
for m in M:
    s = m["snip"].lower()
    i = low.find(s, cur)
    if i < 0: sys.exit(f"⛔ snippet no encontrado desde el cursor: {m['snip']!r}")
    # índice de palabra que contiene el char i
    wi = max(k for k, o in enumerate(offs) if o <= i)
    m["wi"] = wi; m["ms"] = words[wi]["ms"]; cur = i + 1
M[0]["ms"] = 0
def ms_of(snip, start):
    i = low.find(snip.lower(), start)
    if i < 0: sys.exit(f"⛔ key no encontrada: {snip!r}")
    return words[max(k for k, o in enumerate(offs) if o <= i)]["ms"]
for m in M:
    if m["t"] == "L":
        st = offs[m["wi"]]
        m["keys"] = [dict(r, at_ms=ms_of(s, st)) for s, r in m["keys"]]
        if m.get("cta"): m["cta_ms"] = ms_of(m["cta"], st)
ALIAS = {"@m_cochlea": "Inside your ear, in a little spiral", "@m_anat": "is through the bones and the muscles of your head and neck.", "@m_harold_back": "Six weeks later he came back."}
for k, m in enumerate(M):
    m["id"] = f"m{k:03d}"
    m["ms_out"] = M[k + 1]["ms"] if k + 1 < len(M) else None
json.dump(M, open("_v3/nrt_moments.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print("momentos", len(M), dict(Counter(m["t"] for m in M)))
print("fotos a animar", sum(1 for m in M if m.get("anim")), "de", sum(1 for m in M if m["t"] in "PGH"))
