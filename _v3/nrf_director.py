# nrf_director.py — §0 DIRECTOR de `nrfloaters` (How to get rid of floaters in 2 NIGHTS. BUT IS IT SAFE?)
# Brief del creador: material = SOLO stock real (Pexels); IA SOLO para el presentador (+ diagramas/lámina).
# Tipos: A avatar · S stock (q = consulta CORTA 2-3 palabras) · P foto del presentador (gpt /edits + ref)
#        D diagrama (gpt /generations, ilustración médica sin texto) · F stock + capa de FLOATERS procedural
#        C componente del kit (cama = foto/clip vecino) · L lámina (zoom por regiones, keys por frase)
# Cada momento se ancla a la FRASE donde empieza (snippet literal, cursor secuencial) → ms de _v3/nrfloaters_wordms.json
import json, re, sys
SLUG = "nrfloaters"
guion = open(f"guiones/{SLUG}.txt", encoding="utf-8").read()
words = json.load(open(f"_v3/{SLUG}_wordms.json", encoding="utf-8"))
offs = [m.start() for m in re.finditer(r"\S+", guion)]
assert len(offs) == len(words)

PRES = ("the same man from the reference image: about 35, short dark curly hair, a short dark beard, "
        "royal-blue short-sleeved medical scrubs, a black stethoscope around his neck")
LOC = {
 "office": "in his small consulting room; around him a wooden desk with a plastic anatomical model of an eyeball split in half, a small desk lamp switched on, reading glasses and a closed notebook, a paper-covered examination couch against the wall, half-open white blinds with daylight, a potted plant on the windowsill and a framed landscape photo on the wall",
 "bed": "in his modest bedroom in the evening; around him a wooden nightstand with a lit lamp, a glass of water, reading glasses and a paperback, a white-painted door frame across the room, a beige curtain half drawn over a window with dusk light, a framed family photo on the wall and a knitted blanket at the foot of the bed",
 "living": "in a lived-in living room in the evening; around him a brown leather armchair with a knitted throw, a brass floor lamp, a side table with a mug of tea and a stack of paperbacks, family photos on the wall, net curtains and a worn rug",
 "kitchen": "in his home kitchen; around him light wooden cabinets with glass doors, a dish rack by the sink, a bowl of oranges and a glass of water on the granite counter, a speckled mug and wooden spoons in a crock, morning light from the window",
}
FORM = ("candid photo taken on a modern smartphone, natural light, true-to-life colors, sharp focus, deep depth of field "
        "with the whole room in focus, the background cluttered with ordinary everyday objects that stay readable, nothing "
        "blurred out, realistic, candid everyday snapshot, no filter, no ai look, no text, no letters, no labels, no signs")
NIGHT = ("candid photo taken on a modern smartphone at night, lit by a warm lamp so everything stays clearly visible, "
         "true-to-life colors, sharp focus, deep depth of field, the room readable around the subject, nothing blurred out, "
         "realistic, no filter, no ai look, no text, no letters, no labels, no signs")
ILLU = ("clean modern medical illustration, soft cream background, deep teal and warm gold palette, fine linework, "
        "soft shading, calm and precise, the whole drawing crisp and sharp, nothing blurred out, absolutely no text, no letters, no labels, no numbers")
EYE = "a clean cross-section of a human eyeball seen from the side, the cornea and lens at the front on the left, the round inside filled with clear pale gel, the curved retina lining the back wall on the right and the optic nerve leaving at the back"

M = []
def add(snip, t, **k): M.append(dict(snip=snip, t=t, **k))
A = lambda s: add(s, "A")
def S(s, q): add(s, "S", q=q)
def F(s, q, kind="sky"): add(s, "F", q=q, fl=kind)      # stock + floaters procedurales encima
def P(s, act, loc="office", anim=False, mo=None, night=False):
    add(s, "P", prompt=f"{PRES}, {act}, {LOC[loc]}. " + (NIGHT if night else FORM), anim=anim, mo=mo)
def D(s, scene, anim=False, mo=None):
    add(s, "D", prompt=scene + ". " + ILLU, anim=anim, mo=mo)
def C(s, comp, props): add(s, "C", comp=comp, props=props)
def L(s, keys, cta=None): add(s, "L", keys=keys, cta=cta)

# ───────────────────────── HOOK (0–60 s): dolor + promesa honesta + loops ─────────────────────────
A("If you've got little specks floating across your eye.")
F("Dots, threads, a kind of... cobweb", "blue sky clouds", "sky")
S("And it gets worse when you look at the sky,", "looking up sky")
S("or your phone at night.", "phone in bed night")
A("Stay with me for a few minutes.")
P("And I'm going to be honest with you from the start,", "sitting at the corner of his desk with one hand flat on his chest in an honest, 'I'll level with you' gesture, eyebrows slightly raised, a small sincere smile", "office", anim=True, mo="he lowers his hand from his chest slowly")
C("Is it safe?", "StampBadge", {"text": "IS IT SAFE?", "sub": "the honest answer, in one minute"})
A("For most floaters, yes.")
D("But there is one kind of floater that is not harmless at all.", EYE + ", with a small horseshoe-shaped tear in the retina at the upper back wall where a strand of the gel is still attached and pulling", anim=True, mo="the gel strand tugs very slightly at the tear")
S("You call an eye doctor today.", "senior phone call")
A("I'm going to tell you exactly how to tell the two apart.")
P("and you can do it tonight, sitting on your bed.", "sitting on the edge of his bed covering his left eye with his flat palm, looking steadily across the room with calm concentration", "bed", anim=True, mo="he holds still and blinks once")
A("And there's one thing almost everybody does when a floater shows up.")
S("And it makes them look worse.", "man squinting")
A("I'll get to that one,")
# ───────────────────────── DOLOR (60–170 s) ─────────────────────────
S("Let me guess how it goes for you.", "elderly reading newspaper")
F("And right in the middle of the line there's this little grey thing.", "reading book pages", "page")
S("You move your eyes to see it better, and it slides away.", "woman reading glasses")
S("Or you're outside on a nice day,", "elderly couple park")
F("and, well, suddenly it's full of these little worms and circles.", "clear blue sky", "sky")
S("like looking through a dirty window.", "dirty window rain")
S("she said it's like a fly that lives inside my eye", "fly on window")
S("And some of you have actually tried to swat it.", "old man laughing")
A("But the annoying part...")
S("The worst part is the thought that comes at night.", "woman awake bed")
C("Am I going blind?", "PullQuote", {"quote": "Is this the start of something? Am I going blind?", "author": "The 3 a.m. thought", "role": "what most people never say out loud"})
S("So maybe you went to the doctor.", "eye examination")
S("oh, those are just floaters.", "doctor talking patient")
A("Which is... I mean, it's true.")
S("So you went home and you searched on the internet.", "senior laptop")
S("Eye drops that promise to dissolve them.", "eye drops")
S("Pineapple.", "pineapple slices")
S("Some pills with a name you can't pronounce.", "pills bottle")
S("Drinking more water.", "pouring water glass")
S("Somebody in a video pressing on their eyeballs", "rubbing eyes")
A("Please, please don't do that one.")
S("And maybe you tried some of it. And nothing.", "tired senior man")
A("So here's what we're going to do.")
C("First, I'm going to explain what those things actually are,", "FlowSteps", {"kicker": "Where we're going", "title": "From worry to a plan", "nodes": [{"label": "What they are", "sub": "shadows, not specks"}, {"label": "Safety check", "sub": "one minute, tonight"}, {"label": "Two nights", "sub": "the light, the glide"}, {"label": "One page", "sub": "to keep"}]})
S("I'll call her Margaret,", "senior woman quilting")
A("Because what she did that night")
# ───────────────────────── MECANISMO (170–400 s) ─────────────────────────
C("Okay. So what is a floater?", "ChapterTitle", {"label": "Chapter", "number": "1", "title": "What a floater really is", "sub": "it's not what most people think"})
D("Your eye, the ball of your eye, isn't empty.", EYE + ", the gel inside glowing faintly clear and perfectly even", anim=True, mo="faint light moves slowly through the clear gel")
C("Doctors call it the vitreous.", "CutawayCallouts", {"eyebrow": "Inside the eye", "title": "Mostly a clear gel", "image": "@m_eye", "callouts": [{"text": "Vitreous gel", "sub": "about 80% of the eye", "tx": 0.5, "ty": 0.5, "side": "left"}, {"text": "Retina", "sub": "the film at the back", "tx": 0.84, "ty": 0.5, "side": "right"}]})
S("think of the white of a raw egg.", "cracking eggs bowl")
D("Inside it there are very, very thin fibers,", "a magnified view inside clear eye gel: very fine, evenly spread transparent collagen fibers crossing like a delicate net, softly glowing", anim=True, mo="the fine fibers sway very gently")
P("Now, here's what happens with the years.", "sitting at his desk holding the plastic eyeball model split in half, tilting it toward the camera and explaining with focused eyes and slightly open mouth", "office")
D("That gel slowly turns to liquid.", EYE + ", the gel inside now uneven, with clear watery pockets forming in the middle and thicker gel around them")
D("So they clump together.", "a magnified view inside eye gel: the fine fibers bunched into a few grey knots, curly strings and small clumps drifting in watery pockets", anim=True, mo="the grey clumps drift slowly")
A("And here's the part that nobody explained to you.")
C("You're seeing their shadows.", "PullQuote", {"quote": "You're not seeing the clumps. You're seeing their shadows.", "author": "Remember this", "role": "what a floater really is"})
D("Light comes in through the front of your eye,", EYE + ", thin warm golden rays of light entering through the lens and crossing the gel to land on the retina", anim=True, mo="the golden light rays pulse softly")
S("The retina is like the film in an old camera.", "vintage film camera")
D("it casts a tiny shadow on that film.", EYE + ", thin golden light rays crossing the gel, one small grey clump in their path and a small dark shadow falling on the retina behind it")
P("That's why they move when your eyes move.", "sitting at his desk slowly tilting a clear glass of water in his hand and watching the water slosh, curious half-smile", "office", anim=True, mo="the water in the glass sloshes gently")
S("like water in a glass when you turn it.", "water glass swirl")
S("And it's also why they're so much worse against the sky,", "old man looking up")
S("In a dim room you barely see them.", "cozy dim living room")
S("Put a big bright even background behind them,", "white wall sunlight")
A("Remember that. Light behind the shadow.")
C("In one survey of a few thousand people,", "BigStatReveal", {"eyebrow": "How common are floaters?", "value": 3, "suffix": " in 4", "support": "people say they see them", "source": "survey of a few thousand people"})
S("So if you have them, you are not strange", "seniors laughing together")
A("Now. There's a second thing that happens with age,")
D("it shrinks a little and it pulls away from the back wall of the eye.", EYE + ", the gel body shrunken and pulled forward, leaving a thin clear gap of liquid between the gel and the retina at the back", anim=True, mo="the gel slowly pulls away from the back wall")
C("Doctors call it a posterior vitreous detachment.", "CutawayCallouts", {"eyebrow": "After 50 or 55", "title": "The gel lets go", "image": "@m_pvd", "callouts": [{"text": "Gel pulls away", "sub": "shrinks and lets go", "tx": 0.5, "ty": 0.45, "side": "left"}, {"text": "Retina stays put", "sub": "most of the time", "tx": 0.84, "ty": 0.55, "side": "right"}]})
C("By seventy, more than half of people have already had it,", "BigStatReveal", {"eyebrow": "By age 70", "value": 50, "suffix": "%+", "support": "have already had the gel pull away", "source": "most never even noticed"})
F("But when it happens, a lot of people suddenly see a new floater.", "white wall room", "ring")
S("little flashes of light off to the side.", "dark bedroom night")
S("Like a tiny camera flash", "camera flash")
A("Most of the time, the gel just lets go, cleanly,")
D("the gel is stuck a little too tight to the retina in one spot.", EYE + ", the gel pulling away but one thin strand still firmly stuck to the retina at the top, stretching it into a small peak", anim=True, mo="the stuck strand stretches slowly")
C("Roughly one in seven people", "BigStatReveal", {"eyebrow": "Sudden new floaters + flashes", "value": 1, "suffix": " in 7", "support": "have a small retinal tear", "source": "that's why it's same day"})
D("And a tear, if nobody finds it,", EYE + ", a section of the retina at the top lifted off the back wall like wallpaper peeling, with fluid underneath it")
A("That's a retinal detachment.")
S("can usually be sealed in the office with a laser,", "ophthalmologist laser")
C("So the whole game is catching it early.", "StampBadge", {"text": "CATCH IT EARLY", "sub": "minutes with a laser, not an operation"})
# ───────────────────────── SAFETY CHECK (400–580 s) ─────────────────────────
C("So let's do the safety check.", "ChapterTitle", {"label": "Chapter", "number": "2", "title": "The safety check", "sub": "three signs, one minute"})
A("There are three warning signs.")
F("One. A sudden shower of new floaters.", "bright window curtains", "shower")
S("Some people describe it like pepper,", "black pepper grinder")
S("Two. Flashes of light.", "lightning night sky")
F("Three. A shadow or a curtain.", "living room daylight", "curtain")
C("If you have any of those three, it's the same day.", "ChecklistReveal", {"eyebrow": "Call an eye doctor today", "title": "Same-day signs", "items": ["A shower of NEW floaters", "Flashes of light", "A curtain or shadow at the edge"], "stamp": "SAME DAY"})
S("you tell them the words new floaters and flashes,", "woman phone call")
S("you go to the emergency room.", "hospital emergency entrance")
A("You don't wait for Monday.")
S("If you have diabetes", "blood sugar test")
D("that can be a little bit of bleeding inside the eye.", EYE + ", a faint reddish haze of blood drifting inside the gel near the back")
S("And if you're very nearsighted,", "thick eyeglasses")
A("Now, how do you check at home?")
P("sit on the edge of your bed, in normal light,", "sitting on the edge of his bed with his hands resting on his knees, looking across the room at the white door frame with calm attention", "bed")
P("Cover your left eye with your hand.", "sitting on his bed with his flat palm cupped over his left eye without pressing, his right eye looking steadily at the door frame across the room", "bed", anim=True, mo="he keeps his palm still over his eye and blinks once")
S("look at the door frame and hold still.", "white door frame")
P("pay attention to the edges of what you see.", "sitting on his bed, palm over one eye, his other eye fixed straight ahead, eyebrows drawn together in careful concentration", "bed")
C("Is everything there?", "NumberedSteps", {"eyebrow": "The 1-minute door test", "title": "Tonight, on your bed", "steps": [{"title": "Cover your left eye", "sub": "palm only, no pressing"}, {"title": "Look at the door frame", "sub": "hold the eye still"}, {"title": "Check every edge", "sub": "any shadow or curtain?"}, {"title": "Switch eyes, then the dark", "sub": "30 seconds: any flashes?"}]})
P("Then switch.", "sitting on his bed now covering his right eye with his other palm, looking steadily at the door frame", "bed")
S("Then turn off the light for a moment.", "turning off lamp")
A("If the edges are all there, both eyes,")
S("Annoying, but harmless.", "senior woman smiling")
S("the kind where they put drops in to open your pupils", "eye drops doctor")
S("look all the way to the edges of the retina,", "eye doctor exam")
A("That one exam is what tells you, for sure,")
# ───────────────────────── LAS DOS NOCHES (580–860 s) ─────────────────────────
C("Okay. Now the two nights.", "ChapterTitle", {"label": "Chapter", "number": "3", "title": "The two nights", "sub": "what they can do, and what they can't"})
A("In two nights, you will not dissolve a single floater.")
C("No drop, no pill, no fruit, no exercise", "MythTruth", {"myth": "Floaters dissolve in two nights", "truth": "Nothing breaks up the clumps in 48 hours", "mythLabel": "The promise", "truthLabel": "The truth"})
A("What you can do in two nights is two things.")
S("Stop jumping in front of every line you read.", "senior woman reading")
S("Stop being the first thing you notice when you walk outside.", "senior walking outdoors")
C("Night one is about light.", "PullQuote", {"quote": "The floater is a shadow. A shadow needs light behind it.", "author": "Night one", "role": "the light"})
P("So tonight, look at where you usually read,", "sitting in a brown leather armchair at night under one harsh bright ceiling light, holding a white paperback close and frowning at the page", "living", night=True)
S("one bright light overhead, a white page,", "phone screen night")
P("Put a warm lamp slightly behind you and to the side,", "standing beside his armchair turning the head of a brass floor lamp so it shines from behind his shoulder onto the seat, a satisfied little nod", "living", anim=True, mo="he slowly turns the lamp head", night=True)
S("Second, the screens.", "smartphone dark mode")
S("bring the brightness down, to about half.", "phone in bed night dim")
S("Third, the letters.", "tablet reading senior")
S("And outside, in the day, sunglasses.", "senior sunglasses")
S("The sky is the brightest wall there is.", "bright sky sun")
A("That's night one. It takes ten minutes.")
A("Night two is about your eyes.")
S("You chase it.", "man staring wall")
C("And every time you do that, you're telling your brain,", "FlowSteps", {"kicker": "The chase", "title": "Why chasing keeps them", "nodes": [{"label": "You look at it", "sub": "follow, stare, check"}, {"label": "Brain flags it", "sub": "'this matters'"}, {"label": "Filter stays off", "sub": "you keep seeing it"}]})
P("You don't feel your watch on your wrist right now,", "sitting at his desk glancing down at the wristwatch on his left wrist with an amused little smile", "office", anim=True, mo="he turns his wrist slightly")
S("The brain filters out constant things.", "busy street crowd")
P("Instead, look up, slowly, toward the ceiling.", "sitting in the armchair with a paperback open on his lap, his head still and only his eyes turned up toward the ceiling, calm and relaxed", "living", anim=True, mo="his eyes move slowly upward", night=True)
P("Then look down, slowly, toward the floor.", "sitting in the armchair with a paperback on his lap, head still, his eyes lowered toward the floor, calm", "living", night=True)
D("What that does is it swirls the gel a little.", EYE + ", the gel gently swirling with soft curved flow lines, one small grey clump drifting away from the center line toward the lower edge", anim=True, mo="the gel swirls and the grey clump drifts toward the edge")
C("Up. Down. Back. That's it.", "NumberedSteps", {"eyebrow": "Night two", "title": "The glide", "steps": [{"title": "Don't chase it", "sub": "let it drift"}, {"title": "Look UP, slowly", "sub": "toward the ceiling"}, {"title": "Look DOWN, slowly", "sub": "toward the floor"}, {"title": "BACK to your book", "sub": "it drifts to the edge"}]})
A("And the rule that goes with it.")
S("Like a car passing on the street.", "cars passing street")
S("Do that for the whole evening on night two.", "elderly couple reading evening")
A("Because here's what happens over the next few weeks.")
C("For most people, a floater that drove them crazy", "FlowSteps", {"kicker": "The honest timeline", "title": "Two nights, then time", "nodes": [{"label": "Night 1", "sub": "the light"}, {"label": "Night 2", "sub": "the glide"}, {"label": "Weeks 2 to 6", "sub": "the brain filters"}, {"label": "Months", "sub": "most barely notice"}]})
A("So two nights to stop the chase and fix the light.")
# ───────────────────────── LO QUE NO FUNCIONA (860–990 s) ─────────────────────────
A("Now, you're probably wondering about the other stuff.")
S("The pineapple.", "pineapple fruit")
S("There was a small study from Taiwan", "eating pineapple")
C("Pineapple is a fruit.", "MythTruth", {"myth": "Pineapple melts floaters", "truth": "One small study, three months, no real comparison group", "mythLabel": "The internet", "truthLabel": "The evidence"})
S("The drops. Most of the drops sold for floaters", "putting eye drops")
D("The floater is deep inside, in the gel.", EYE + ", a single clear droplet resting on the front surface of the eye on the left, and a small grey clump floating deep inside the gel far away from it on the right")
S("The water. Being well hydrated is good for you.", "drinking water senior")
S("The supplements.", "supplement capsules")
C("If you want to spend that money on something,", "StampBadge", {"text": "SPEND IT ON THE EXAM", "sub": "not on pills that promise to dissolve them"})
A("And pressing on your eyeballs. That video.")
P("There is no massage that reaches the gel safely.", "sitting at his desk shaking his head gently with one open palm raised in a calm 'please don't' gesture, serious caring eyes", "office")
A("Now, for a small number of people,")
S("There's a laser that can break up certain kinds of floaters,", "laser eye treatment")
S("And there's a surgery that replaces the gel.", "eye surgery")
C("But they have real risks,", "ChecklistReveal", {"eyebrow": "Laser or surgery", "title": "Only for the few", "items": ["Floaters that block reading or driving", "Not settled after many months", "A talk with a retina specialist"], "stamp": "NOT IN WEEK ONE"})
A("Not something to rush into in the first few weeks.")
# ───────────────────────── LA LÁMINA (990–1110 s) ─────────────────────────
# coords en el espacio 1920x1080 de Lamina3D (la lámina se generó a 1792x1008)
FULL = dict(x=0, y=0, w=1920, h=1080, mark=False)
R = dict(title=dict(x=36, y=12, w=1848, h=186), col1=dict(x=18, y=216, w=540, h=606), gel=dict(x=180, y=348, w=384, h=216),
         red=dict(x=578, y=236, w=356, h=586), same=dict(x=600, y=700, w=312, h=110), night1=dict(x=956, y=236, w=462, h=310),
         night2=dict(x=956, y=566, w=462, h=256), col4=dict(x=1438, y=216, w=460, h=606), pine=dict(x=1450, y=640, w=430, h=110),
         time=dict(x=18, y=840, w=1164, h=240), door=dict(x=1200, y=852, w=684, h=212))
L("Okay. Now, please look very carefully at this image,", [("Okay. Now, please look very carefully", FULL), ("This is what I call the two-night clear sight protocol.", R["title"]), ("Up at the top, the idea.", R["title"]), ("Most are harmless, a few are an emergency,", FULL)])
L("Now look at the left side.", [("Now look at the left side.", R["col1"]), ("And look at the little label on the gel.", R["gel"])])
L("Now the red box, right next to it.", [("Now the red box, right next to it.", R["red"]), ("And underneath, in bold: same day.", R["same"]), ("That box is the one I'd like you to remember", R["red"])])
L("Now, the middle column.", [("Now, the middle column.", R["night1"]), ("Then night two, the glide.", R["night2"])])
L("And the right column, the things that don't work,", [("And the right column", R["col4"]), ("And the one with the question mark, the pineapple.", R["pine"])])
L("And look at the timeline along the bottom.", [("And look at the timeline along the bottom.", R["time"]), ("And the last line on the page, in the corner:", R["door"]), ("Take a screenshot of this.", FULL)], cta="Oh, and by the way...")
P("And there's a variant of the glide that works even better", "sitting in the armchair at night reading a paperback, his eyes lifted to the top edge of the page at the end of a line, a warm lamp shining from behind his shoulder", "living", night=True)
# ───────────────────────── MARGARET (1110–1290 s) ─────────────────────────
C("Okay. So, Margaret.", "ChapterTitle", {"label": "Chapter", "number": "4", "title": "Margaret", "sub": "what one patient did right"})
S("Margaret is sixty-seven, a retired schoolteacher.", "senior woman sewing")
S("She quilts.", "quilting hands")
S("Every white piece of fabric, there they were.", "white fabric sewing")
P("She came to see me because a doctor had told her,", "sitting across his desk from an older woman patient seen from behind with a silver bob, listening to her with a patient, attentive expression, pen resting on a notebook", "office")
S("Her retina was fine.", "doctor reassuring patient")
S("The lamp moved behind her shoulder instead of above the fabric.", "desk lamp sewing")
C("I don't think they're smaller.", "PullQuote", {"quote": "I don't think they're smaller. But I'm not looking at them anymore.", "author": "Margaret, 67", "role": "six weeks later"})
A("But that's not why I remember Margaret.")
S("About a year later, on a Tuesday,", "woman bedroom night")
F("A little swarm of dots.", "bedroom lamp night", "shower")
S("And then, when she turned off the light, a flash.", "woman scared dark")
L("And she remembered the red box.", [("And she remembered the red box.", R["red"])])
S("her first thought was, it's late,", "woman holding phone night")
S("And she called the emergency line,", "woman calling phone")
D("It was a tear. A small one.", EYE + ", a small horseshoe-shaped tear in the retina at the top of the back wall, clearly visible, the rest of the retina smooth and attached")
S("they sealed it with a laser, in the office, in about ten minutes.", "slit lamp eye exam")
S("And today she still sees perfectly out of that eye.", "grandmother smiling grandchild")
A("If she'd waited for the weekend... well.")
C("It's the difference between ten minutes with a laser and an operation.", "StampBadge", {"text": "SAME DAY", "sub": "ten minutes with a laser, not an operation"})
# ───────────────────────── RECAP + CIERRE (1290–1191 s fin) ─────────────────────────
C("So let me put it all together for you, in order.", "ChapterTitle", {"label": "Chapter", "number": "5", "title": "Tonight, in five steps", "sub": "start before the light goes off"})
C("One. Tonight, the one-minute door frame test.", "NumberedSteps", {"eyebrow": "Tonight", "title": "Five steps for your floaters", "steps": [{"title": "The door test", "sub": "one eye, the other, then the dark"}, {"title": "Any warning sign?", "sub": "call an eye doctor today"}, {"title": "Dilated eye exam", "sub": "book it this month"}, {"title": "Night one: the light", "sub": "lamp behind, dark mode"}, {"title": "Night two: the glide", "sub": "up, down, back"}]})
P("Two. If you have any of the three warning signs,", "sitting at his desk with one index finger raised, a serious and caring expression, eyes locked on the camera", "office")
S("Three. If you've never had a dilated eye exam", "optometrist exam")
P("Four. Night one, the light.", "sitting relaxed in the armchair at night reading a paperback under a warm lamp shining from behind his shoulder, calm content face", "living", night=True, anim=True, mo="he turns a page slowly")
P("Five. Night two, the glide.", "sitting in the armchair at night, paperback on his knee, eyes lifted slowly toward the ceiling with a peaceful expression", "living", night=True)
A("And then let time do the rest.")
S("don't spend a fortune on drops,", "pharmacy shelves")
A("What I can give you is a way to know you're safe,")
S("If this helped, share it with someone", "elderly friends talking")
A("And I'll see you in the next one.")

# ── 2º plano de stock en momentos largos (se decide con las duraciones reales; ver nrf_plan.py) ──
XSHOT = {
 "If you've got little specks floating across your eye.": None,
}

# ───────── resolución de anclas ─────────
cur = 0
low = guion.lower()
for m in M:
    s = m["snip"].lower()
    i = low.find(s, cur)
    if i < 0: sys.exit(f"⛔ snippet no encontrado desde el cursor: {m['snip']!r}")
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
for k, m in enumerate(M):
    m["id"] = f"m{k:03d}"
    m["ms_out"] = M[k + 1]["ms"] if k + 1 < len(M) else None
# momentos duplicados en el mismo ms (snippets que caen en la misma palabra) = error de dirección
dups = [(M[k]["snip"], M[k + 1]["snip"]) for k in range(len(M) - 1) if M[k]["ms"] >= M[k + 1]["ms"]]
if dups: sys.exit(f"⛔ momentos de duración 0: {dups[:5]}")
json.dump(M, open(f"_v3/{SLUG}_moments.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
END = words[-1]["ms"] + 1500
dur = lambda m: ((m["ms_out"] or END) - m["ms"]) / 1000
print("momentos", len(M), dict(Counter(m["t"] for m in M)))
print("avatar visible %.1f s de %.1f (%.1f%%)" % (sum(dur(m) for m in M if m["t"] == "A"), END / 1000, 100 * sum(dur(m) for m in M if m["t"] == "A") / (END / 1000)))
print("stock %.1f s (%.1f%%)" % (sum(dur(m) for m in M if m["t"] in "SF"), 100 * sum(dur(m) for m in M if m["t"] in "SF") / (END / 1000)))
print("fotos a animar", sum(1 for m in M if m.get("anim")), "de", sum(1 for m in M if m["t"] in "PD"))
ds = sorted(dur(m) for m in M)
print("dur momento: mediana %.1f · p75 %.1f · max %.1f" % (ds[len(ds) // 2], ds[int(len(ds) * .75)], ds[-1]))
for m in M:
    if dur(m) > 11: print(f"  largo {dur(m):5.1f}s {m['t']} {m['id']} {m['snip'][:60]}")
