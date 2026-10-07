import json
R="/tmp/claude-0/ohfth/r2/"
FACE=R+"claudio_face.png"
ID=("THE PRESENTER is EXACTLY the man in the SECOND reference image (a real photo of him): American man about 70, CLEAN-SHAVEN, "
    "thick silver hair swept straight back, weathered tanned face with deep forehead lines. Keep his exact face, nose, eyes and hairline. "
    "Wardrobe: a cream-coloured work shirt with sleeves rolled to the forearm, black leather suspenders, brown work trousers. "
    "No hat, no beard, no glasses.")
LIGHT=("PHOTO QUALITY: a crisp, well-exposed, true-to-life photograph. Clean natural light, NEUTRAL white balance, real colours. "
       "Realistic skin with pores and natural texture. STRICTLY AVOID: yellow, amber or orange colour cast, sepia, dull or murky "
       "exposure, washed-out greys, HDR halos, glow, bloom, lens flare, plastic skin, oversharpening, any 'AI filter' look.")
COMMON=("Only the presenter and the hero object matter; keep the background simple. Behind his head is a darker mass (wall, wood, "
        "shadow), never a bright sky. Spell the text exactly as given, never split a word, never insert a gap inside a word. "
        "No logos, no brand names, no watermark, no extra text. Hands correct with five fingers.")
def P(clone, scene, text):
    return (f"Recreate the FIRST reference image as a new 16:9 YouTube thumbnail: {clone}\n\nSCENE: {scene}\n\nTEXT: {text}\n\n"
            f"{ID}\n\n{LIGHT}\n\n{COMMON}")
items=[
 ("01_radiator","AQZLwcBnX1I",
  "copy its layout and look exactly - text box top-left, red curved arrow from the text to the hero object, the presenter in the right third looking straight at the lens with a serious, mouth-closed expression.",
  "Inside an old 1920s house with plaster walls and wood trim. A white cast-iron radiator under a window takes the left-centre. The presenter crouches beside it, one hand holding a small brass radiator bleed key on the bleed valve; a tiny drop of rusty water at the valve. A hand-drawn red marker circle around the bleed valve.",
  "\"DON'T BLEED IT\" in black on a white rounded box with a thick black border, and below it \"YET!\" in big yellow capitals with a black outline."),
 ("02_nohotwater","_XYCVgsPu1U",
  "copy its composition exactly - big white text on a black plate top-left, a tall gas water heater in the centre, the presenter kneeling on the right gesturing at it.",
  "An unfinished basement utility area. A tall white gas water heater; its small burner access door at the bottom is open and the pilot area is dark with no flame. The presenter kneels on the right, pointing with one finger at the dark pilot opening, worried look at the lens. A hand-drawn red marker circle around the dark pilot opening.",
  "\"NO HOT WATER?\" in big bold white capitals on a solid black plate, two lines (NO HOT / WATER?)."),
 ("03_heaton","kGs_biFA87Q",
  "clone this design exactly - the bright warm magenta-to-orange background, a GIANT round smart thermostat in the centre, stacked text plates on the left (white text on magenta plates, last line black text on a lime-green plate), the presenter on the right holding his open palm under the thermostat.",
  "The thermostat display glows and reads \"68°\". The presenter's face shows a questioning, doubtful expression, eyebrows raised, mouth closed.",
  "stacked plates: \"LEAVE IT\" / \"ON ALL\" / \"DAY?\" - the last line on the lime-green plate."),
 ("04_frozenpipe","1jE932GQeiQ",
  "clone its composition - frosty copper water pipes with long icicles running across the basement ceiling joists filling the left and top, the presenter standing on the right with hands on hips, white headline text bottom-left.",
  "One pipe has a split crack with a fan of ice around it, circled with a hand-drawn red marker circle. Cold bluish daylight from a small basement window. The presenter is serious, mouth closed, looking at the lens.",
  "bottom-left, small white \"BEFORE IT\" and below it huge white bold \"FREEZES\" with a soft dark shadow. No logo."),
 ("05_furnace","fX4qYS3lQqY",
  "copy its look - bold white and yellow text top-left, a yellow curved arrow pointing to the hero object, the presenter on the right holding the object out toward the lens.",
  "A basement furnace with its front panel removed on the left, a row of small BLUE burner flames visible inside. The presenter holds up close to the lens, between two fingers, a thin bent metal flame-sensor rod whose tip is coated in black soot. Serious face, mouth closed.",
  "\"DIRTY\" in white and \"SENSOR\" in yellow, huge condensed capitals with black outline, two lines."),
 ("06_foggywindow","S9cGT2jGiSY",
  "clone it exactly - red brick wall, a double-pane window, huge white text on separate black plates stacked on the left.",
  "The glass between the panes is milky and fogged with streaks of trapped condensation. The presenter stands on the right edge beside the window, knuckle tapping the foggy glass, looking at the lens with a concerned face.",
  "three black plates stacked: \"FOGGY\" / \"WINDOW\" / \"FIX!\" in bold white condensed capitals."),
 ("07_dryervent","_m3dY47QT8s",
  "copy its layout - big text top-left with the second word yellow, a red curved arrow from the text to the hero object on the left, the presenter on the right looking at the lens pointing toward the object.",
  "Inside a laundry room. On the left a crushed silver foil dryer vent hose hanging from the wall, packed with lint. The presenter on the right holds out a huge grey clump of compacted dryer lint in his hand. Serious face, mouth closed.",
  "\"FIRE\" in white and \"HAZARD!\" in yellow, huge condensed capitals with black outline, one line."),
 ("08_icedam","_3EqD_-u0lo",
  "clone its look - a close view of a roof edge in winter with a thick ridge of ice and many long icicles across the whole frame, huge red bold headline text top-left.",
  "The presenter in the lower right corner, wearing a brown canvas work jacket open over the cream shirt and suspenders, looking at the lens with a concerned face. A hand-drawn red marker circle around the thick ice ridge at the gutter. Overcast neutral winter daylight, white snow, no colour cast.",
  "\"ICE DAM\" and below \"QUICK FIX\" in huge bold red capitals with a white outline."),
 ("09_doordraft","zJaJVKZ6V-s",
  "clone its composition - a low view of an entry door threshold with hands installing a door sweep, huge white stacked text on the left.",
  "An old wooden entry door seen low from inside; a bright strip of daylight and a few snowflakes come through the gap under it. The presenter kneels, both hands pressing a new rubber door sweep along the bottom of the door; his face visible on the right looking at the lens.",
  "big white bold condensed capitals with soft shadow, stacked: \"STOP THE\" / \"DRAFT\" / \"UNDER DOOR\"."),
 ("10_coldroom","8dJbLTEXyfg",
  "clone its text design - \"FIX\" in white, \"HOT\" in red, \"& COLD\" in light blue, a second line in white, over a dark basement duct background.",
  "Silver metal heating ducts along the basement ceiling. The presenter on the right reaches up and turns a small damper lever on a duct, looking at the lens with a confident, mouth-closed face. A hand-drawn red marker circle around the damper lever.",
  "\"FIX HOT & COLD\" on line one (HOT red, & COLD light blue, FIX white) and \"ROOMS\" in white on line two, bold sans-serif with dark shadow."),
]
L=[{"name":n,"ref":[R+m+".jpg",FACE],"prompt":P(c,s,t)} for n,m,c,s,t in items]
json.dump(L,open("list2.json","w"),indent=1); print(len(L))
