import json, importlib.util

spec = importlib.util.spec_from_file_location("mk1", "D:/wt/rkclaim/_v3/rkclaim_mkimg.py")
mk1 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mk1)
RAY = [(n, a.replace("with one finger", "with a pen tip").replace("one finger", "a pen tip")) for n, a in mk1.RAY]

REF = "C:/Users/bauti/Downloads/plan_ray_oct3/face_webcam.png"
LIGHT = ["overcast morning light from a window", "flat daylight from a porch",
         "soft kitchen light from a ceiling bulb", "grey early light through a glass door"]
# imperfections WITHOUT finger/thumb/lens: framing and light only
EXTRA = ["the frame a little tilted", "something cut at the edge of the frame",
         "a window reflection across the glass", "mixed light from a window and a ceiling bulb"]
BANNED = ["cinematic", "35mm", "bokeh", "8k", "highly detailed", "photorealistic", "golden hour",
          "documentary", "grainy", "blurry", "blurred", "out of focus", "soft focus", "shallow depth of field",
          "stock photo", "finger", "thumb", "lens", "hand over"]
RECIPE = ("Candid smartphone photo taken by the homeowner of a 68-year-old locksmith with thick white hair combed back, "
          "short white stubble, steel reading glasses pushed up on his forehead, faded navy work shirt with a white oval patch, ")
TAIL = ". He is busy and not looking at the camera, nothing blurred out."

# second angles, all new (no more "from a few steps back" pairs)
ANGLES = [
    "seen from below as he kneels, looking up at the work",
    "over his shoulder as he reads the claim letter in his hands",
    "a close view of his hands at the work, the rest of him out of the edge of the frame",
    "from across the room through a doorway, him bent over the task",
]
ACTION_SHORT = {n: a for n, a in RAY}

ray = []
for i, (n, a) in enumerate(RAY):
    ray.append({"name": "ray_" + n, "prompt": RECIPE + a + ", " + LIGHT[i % 4] + ", " + EXTRA[i % 4] + TAIL, "ref": REF})
for i, (n, a) in enumerate(RAY[:24]):
    ang = ANGLES[i % len(ANGLES)]
    ray.append({"name": "ray_" + n + "_v2",
                "prompt": RECIPE + a + ", " + ang + ", " + LIGHT[(i + 2) % 4] + ", " + EXTRA[(i + 1) % 4] + TAIL,
                "ref": REF})

NOF_SPECIFIC = [
    ("letter_denied", "A printed claim letter lying on a kitchen table with a red rubber-stamp mark that reads DENIED in capital letters and nothing else legible, a pen beside it"),
    ("policy_theft_highlight", "An open insurance policy booklet on a wooden table, a yellow highlighter line across a block of small print, a pair of reading glasses folded beside it"),
    ("report_note_fridge", "A small yellow sticky note with a handwritten police report number stuck to a white refrigerator door, a magnet holding it"),
    ("strike_short_vs_long", "A metal strike plate on a wooden door frame, one short screw beside a longer three inch screw on a workbench next to the frame"),
    ("fireproof_receipts", "A grey fireproof document box open on a desk, a stack of paper receipts and a folded card statement inside"),
    ("phone_door_photo", "A phone lying on a kitchen counter, its screen showing a photo of a front door, the phone case slightly scratched"),
    ("receipt_serial_back", "A paper receipt next to a small electronic device, the device lying face down to show the serial number sticker on the back"),
    ("insurance_envelope", "An unopened white envelope from an insurance company on a hallway table beside a set of house keys"),
    ("hinge_window_pins", "Two window hinge pins on a white window sash, close up, one pin slightly bent, a little paint flaking"),
    ("apartment_mail", "An apartment building mailbox row, one brass door open, a folded paper notice inside, a plastic plant nearby"),
    ("laptop_box_empty", "An empty cardboard laptop box on a bedroom floor, a power cable coiled on the carpet"),
    ("dresser_watch_tray", "A wooden jewelry tray on a dresser, empty except for a small brass key and a dried flower"),
    ("porch_step_splinters", "Two small wood splinters and a bit of painted trim lying on a concrete porch step beside a welcome mat"),
    ("front_door_morning", "A white painted front door of a suburban house in early morning, the porch light still on, a bicycle at the side"),
    ("sliding_patio_track", "The track of a sliding patio door with a small plastic cap and a little dirt, the glass door partly open"),
    ("garage_side_metal", "A metal garage side door with a dented bottom corner and a small scrape near the knob"),
    ("porch_flower_pot", "A plastic flower pot beside a front door, one plant tipped over onto the mat"),
    ("kitchen_coffee_bills", "A cold paper coffee cup beside a pile of bills and an unopened envelope on a kitchen table"),
    ("cupboard_list", "The inside of a kitchen cupboard door with a handwritten list of phone numbers taped to it, a little yellowed"),
    ("dish_towel_drawer", "A kitchen drawer pulled out, a folded dish towel and a pair of kitchen scissors on the counter next to it"),
    ("landing_hallway_photo", "A framed family photo in a hallway, slightly crooked on the wall, a wooden floor below"),
    ("front_step_morning", "A concrete front step with dew on it in the early morning, a rolled newspaper in a plastic sleeve"),
    ("shelf_gap_box", "A gap on a bookshelf where a box used to sit, a clean rectangle on the shelf and dust around it"),
    ("doorframe_scrape", "A painted white door frame, close, a small fresh scrape on the wood beside the strike plate hole"),
    ("kitchen_table_policy", "A stack of paper forms and a printed policy booklet on a round kitchen table, a cold mug of coffee at the edge"),
    ("porch_lamp_glass", "A wall-mounted porch lamp with a dusty glass globe beside a dark green front door"),
    ("bedside_table_empty", "An empty bedside table with a phone charger and a wallet-sized empty leather slot"),
]

nof = []
for i, (n, a) in enumerate(NOF_SPECIFIC):
    nof.append({"name": "det_" + n,
                "prompt": "Candid smartphone photo taken by the homeowner: " + a + ", " + LIGHT[i % 4] + ", " + EXTRA[(i + 1) % 4]
                          + ". Ordinary lived-in house, everyday clutter nearby, no people in the frame, no readable text, nothing blurred out."})

KEEP = ["front_closed","frame_latch","deadbolt","window_lock","sash_hinge","drawer_empty","receipts_table","serial_back",
        "fire_box","decl_page","police_form","strike_close","screw_pile","reinforce","window_crack","garage_side",
        "doormat_splinters","cupboard_inside","notebook_list","bill_envelope"]
macro_map = dict(mk1.MACRO)
for i, n in enumerate(KEEP):
    a = macro_map[n]
    nof.append({"name": "det_" + n,
                "prompt": "Candid smartphone photo taken by the homeowner: " + a + ", " + LIGHT[(i + 2) % 4] + ", " + EXTRA[i % 4]
                          + ". Ordinary lived-in house, everyday clutter nearby, no people in the frame, no readable text, nothing blurred out."})

items = ray + nof
for it in items:
    assert len(it["prompt"]) >= 180, (it["name"], len(it["prompt"]))
    assert "nothing blurred out" in it["prompt"].lower(), it["name"]
    low = "".join(it["prompt"].lower().split("nothing blurred out"))
    for w in BANNED:
        assert w not in low, (it["name"], w)

json.dump(ray, open("_v3/rkclaim_items_ray_v2.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
json.dump(nof, open("_v3/rkclaim_items_nof_v2.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
json.dump(items, open("D:/rtmp_rkclaim/imgs_rehacer.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("ray", len(ray), "nof", len(nof), "total", len(items))
