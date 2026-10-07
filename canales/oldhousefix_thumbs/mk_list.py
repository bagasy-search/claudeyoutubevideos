import json
FACE="/tmp/claude-0/ohfth/ref/hank_face.png"
STY={"earl":"/tmp/claude-0/ohfth/molds/AQZLwcBnX1I.jpg","jhon":"/tmp/claude-0/ohfth/molds/fX4qYS3lQqY.jpg","ramon":"/tmp/claude-0/ohfth/molds/k1HGyewDZ_k.jpg"}
ID=("THE MAN is EXACTLY the person in the second reference image (a real photo): a clean-shaven American man about 70, "
    "thick grey hair swept back, deep forehead lines, warm tanned skin. Keep his exact face, nose, eyes and hairline. "
    "He wears a worn red-and-grey plaid flannel work shirt. No hat, no beard, no suspenders.")
STYLE=("STYLE: copy the look of the first reference thumbnail exactly - hyper-real bright YouTube thumbnail photo, crisp, "
       "rich natural colours, the presenter in one side third from mid-chest up with shoulders touching the bottom edge, "
       "looking straight into the lens with a serious, concerned expression, mouth CLOSED (NOT a smile, NOT shocked). "
       "Behind his head there is a DARK mass (wood, shadow, dark wall) - never bright sky behind his hair. "
       "Only TWO things in the picture: him and the hero object. The hero object is big, sharp and in the centre.")
TXT=("TEXT: big heavy condensed sans-serif capitals (like Anton), white with a thick black outline, the key word in YELLOW, "
     "placed top-left inside the safe area, never touching the edges, max two lines. Spell exactly as given, never split a word, "
     "never insert a gap inside a word. No other text, no logos, no brand names, no watermark. Correct hands with five fingers.")
items=[
 ("01_radiator","earl","Inside an old 1920s house, a cast-iron radiator under a window. The man crouches beside it holding a radiator bleed key on the small bleed valve, a thin hiss of air and a drop of rusty water at the valve. A hand-drawn RED marker circle around the bleed valve. A curved red arrow from the text to the valve.","DON'T BLEED IT|YET!"),
 ("02_nohotwater","jhon","A dim basement. A tall old gas water heater fills the centre; its small burner access door at the bottom is open showing the pilot area with NO flame, dark. The man kneels beside it holding a flashlight pointed at the pilot opening. A curved yellow arrow from the text to the dark pilot opening.","NO HOT|WATER?"),
 ("03_heaton","earl","Inside a cosy old living room at night in winter, frost on the window behind. A big old round analog wall thermostat in sharp focus in the centre, set to 68. The man stands beside it, finger pointing at the dial. A curved red arrow from the text to the thermostat.","LEAVE IT ON|ALL DAY?"),
 ("04_frozenpipe","jhon","A cold unfinished basement wall in winter. A copper water pipe covered in thick white frost with a split crack spraying a fan of water and ice. A hand-drawn RED marker circle around the crack. The man stands beside it with a worried look. A curved yellow arrow from the text to the crack.","BEFORE IT|FREEZES"),
 ("05_furnace","ramon","A basement furnace with its front panel removed, blue flames visible. The man holds up close to the lens a thin metal flame sensor rod coated with black soot, between two fingers. A hand-drawn RED marker circle around the sooty tip of the rod. A curved red arrow from the text to the rod.","DIRTY|SENSOR"),
 ("06_foggywindow","earl","An old double-pane window seen from inside a house in winter; the glass between the panes is milky, fogged and streaked with condensation so you cannot see out, while the frame is clean. The man stands beside it tapping the glass with a knuckle. A hand-drawn RED marker circle on the foggy area between the panes.","FOGGY|WINDOW FIX"),
 ("07_dryervent","jhon","A laundry room. The man holds up to the camera a huge grey clump of compacted dryer lint just pulled out of a crushed silver flexible dryer vent hose that hangs from the wall behind the dryer. A curved yellow arrow from the text to the lint clump.","FIRE|HAZARD"),
 ("08_icedam","earl","Outside an old house in deep snow. The roof edge has a thick ridge of ice along the gutter with long icicles and water stains running down the siding below. A hand-drawn RED marker circle around the ice ridge at the roof edge. The man stands in the foreground in a heavy work jacket over the flannel, looking at the lens.","ICE DAMS|STOP THEM"),
 ("09_doorgap","ramon","Inside an old house in winter, a wooden entry door seen low from inside: a bright strip of cold daylight and a few blown snowflakes come through a gap under the bottom of the door. The man kneels beside it holding his palm near the gap. A curved red arrow from the text to the gap.","FEEL THAT|DRAFT?"),
 ("10_coldroom","jhon","An old bedroom in winter. On the floor a metal floor heating register in sharp focus with a small dial thermometer laid on it reading 58 degrees. The man kneels beside it, hand on the register lever. A curved yellow arrow from the text to the register.","COLD|ROOM FIX"),
]
L=[]
for n,s,scene,txt in items:
    a,b=txt.split("|")
    p=(f"Create a 16:9 YouTube thumbnail.\n\nSCENE: {scene}\n\n{ID}\n\n{STYLE}\n\n"
       f"TEXT CONTENT: line 1 \"{a}\" in white, line 2 \"{b}\" in yellow.\n{TXT}")
    L.append({"name":n,"ref":[STY[s],FACE],"prompt":p,"text":txt})
json.dump(L,open("list.json","w"),indent=1); print(len(L))
