import json

REF = "C:/Users/bauti/Downloads/plan_ray_oct3/face_webcam.png"
LIGHT = ["overcast morning light from a window", "flat daylight from a porch",
         "soft kitchen light from a ceiling bulb", "grey early light through a glass door"]
IMPERF = ["slight blur on one edge", "the frame a little tilted",
          "something cut off at the edge of the photo", "a thumb partly in the corner"]

RAY = [
    ("kneel_door", "Ray kneeling on the porch at the front door of an ordinary US suburban house, checking the metal plate on the door frame, a welcome mat and a plastic flower pot beside him"),
    ("bathrobe", "Ray standing on the porch talking to a homeowner in a bathrobe who holds a phone with both hands, a cold paper coffee cup on the porch rail"),
    ("coffee_step", "Ray sitting on the front step with a paper coffee cup on the concrete beside him and a bunch of keys in his hand, a faded navy work shirt with a white oval patch"),
    ("drawer", "Ray standing in an ordinary kitchen looking into a kitchen drawer that has been pulled out, a dish towel and a pair of scissors on the counter"),
    ("van_invoice", "Ray writing an invoice by hand on the hood of a white work van in a suburban driveway, a pen in his hand and a clipboard under his arm"),
    ("policy_read", "Ray at a kitchen table reading a printed insurance policy booklet with steel reading glasses on his nose, a highlighter and a cold cup of coffee beside him"),
    ("policy_point", "Ray pointing with one finger at a line of small print on an open policy booklet on a kitchen table, a pen lying across the page"),
    ("tenant", "Ray standing in the hallway of an apartment building talking to a young woman at her apartment door, a laundry basket on the floor"),
    ("owner_photo", "A homeowner in a bathrobe holding a phone up, taking a photo of her front door, while Ray stands beside the frame with his hands in his pockets"),
    ("frame_point", "Ray kneeling at a wooden door frame pointing at the metal strike plate with one finger so the homeowner can photograph it"),
    ("film_room", "A homeowner walking slowly through a living room with a phone held up to film, Ray standing by the sofa in a navy work shirt"),
    ("phone_porch", "Ray on a front porch talking on a phone in the early morning, a cold coffee in his other hand and a house behind him"),
    ("clipboard", "Ray holding a clipboard with a blank police report form on it at a front door, a pen clipped to the board"),
    ("cupboard_note", "Ray in a kitchen pointing at a small handwritten note taped inside an open cupboard door, a kettle on the counter"),
    ("receipts", "Ray spreading paper receipts and a card statement on a kitchen table, his reading glasses pushed up on his forehead"),
    ("folder", "Ray putting a folder of papers into a small grey fireproof box on a desk in a home office, a closed laptop beside it"),
    ("serial", "Ray turning a small electronic device over to read the serial number on its back, under a kitchen ceiling light"),
    ("window_hinge", "Ray standing at a window looking closely at the hinge and the latch, a tape measure hanging from his belt"),
    ("window_lock", "Ray checking the lock on a double-hung window in an ordinary house, a small flashlight in his other hand"),
    ("screws", "Ray kneeling at a front door tightening a strike plate screw with a screwdriver, a small pile of screws on the step beside him"),
    ("measure", "Ray measuring the wooden frame beside a door with a tape measure, a small box of longer screws on the step beside him"),
    ("kitchen_bills", "Ray sitting at a kitchen table with a mug of coffee and a stack of paper bills, looking tired but calm"),
    ("porch_dusk", "Ray standing on a porch at dusk under a porch light, a rolled-up work apron over one arm"),
    ("letter_hold", "Ray holding a folded claim letter in one hand while looking at a door frame, his other hand on his hip"),
]

MACRO = [
    ("front_closed", "The front door of an ordinary US suburban house, closed, with a porch light on"),
    ("frame_latch", "A wooden door frame at the latch side, painted white, with a small metal strike plate and two screws"),
    ("deadbolt", "A brass deadbolt and a round knob on a painted front door, close up, a little dust on the metal"),
    ("window_lock", "A double-hung window lock on the inside of a window frame, close up, a faint smudge on the glass"),
    ("sash_hinge", "Hinge pins on a window sash, close up, slightly rusty"),
    ("drawer_empty", "A kitchen drawer pulled out and empty, close up, a dish towel folded in the corner"),
    ("receipts_table", "Paper receipts and a card statement on a wooden table, slightly curled edges, a pen beside them"),
    ("statement_counter", "A printed credit card statement on a kitchen counter, a coffee ring on the corner"),
    ("serial_back", "The back of a small electronic gadget, close up, a tiny printed serial number, a hair of dust on the case"),
    ("fire_box", "A grey fireproof document box, closed, on a shelf in a home office"),
    ("policy_closed", "A printed homeowners policy booklet, closed, on a kitchen table, a pair of reading glasses resting on top"),
    ("endorse_page", "An inside page of a printed insurance policy booklet with small type and a yellow highlighter line, lying open on a wooden table"),
    ("decl_page", "A printed declarations page with a row of boxes, lying flat on a desk beside a pen"),
    ("police_form", "A blank police report form on a clipboard on a porch railing, a pen clipped to it"),
    ("landline_note", "A landline phone on a kitchen wall with a small handwritten number taped beside it"),
    ("cupboard_inside", "The inside of a kitchen cupboard door with a small handwritten note taped to it"),
    ("strike_close", "A metal strike plate on a wooden door frame, close, a light scrape on it and one screw slightly raised"),
    ("screw_pile", "A small pile of wood screws, short and long, on a porch step"),
    ("screw_box", "A small cardboard box of wood screws on a workbench, closed"),
    ("reinforce", "A metal reinforcement plate on the inside of a wooden door frame, screws visible, a little sawdust on the floor"),
    ("window_crack", "A window glass with a fine crack, close up, a dusty sill below it"),
    ("garage_side", "A garage side door with a plain knob, closed, a bicycle leaning on the wall beside it"),
    ("shelf_gap", "An empty spot on a wall shelf where a box used to be, a faint rectangle of cleaner paint"),
    ("jewel_box", "An open wooden box on a dresser, empty, a few small paper tags inside"),
    ("watch_stand", "An empty watch stand on a wooden dresser top, a small dish beside it"),
    ("cold_coffee", "A paper coffee cup on a porch railing, cold, a little condensation on the lid"),
    ("mail_table", "A stack of mail and envelopes on a kitchen table, unopened, with a pair of glasses on top"),
    ("mailboxes", "A row of apartment mailboxes in a hallway, a cardboard box leaning against the wall"),
    ("latch_dust", "The latch and strike plate of a door, close up, a little dust in the corner"),
    ("blind_gap", "A closed window blind in a living room with a slight gap at the bottom"),
    ("doormat_splinters", "A doormat on a front porch with a few small wood splinters on it"),
    ("step_dew", "A concrete front step with a welcome mat, dew on the steps, early morning"),
    ("patio_track", "A sliding patio door track with a little dirt and a plastic cap, close up"),
    ("hall_photos", "An ordinary hallway with a wooden floor and a family photo on the wall, morning light"),
    ("notebook_list", "A spiral notebook open to a handwritten list of household items, a pen beside it"),
    ("dresser_dish", "A wooden dresser top with a small jewelry dish and a phone charger, slightly disordered"),
    ("kitchen_counter", "A kitchen counter with a toaster, a fruit bowl and a closed notebook"),
    ("door_light", "A wall-mounted porch light with a dusty glass globe beside a front door"),
    ("bill_envelope", "An unopened envelope from an insurance company on a kitchen counter"),
]

BANNED = ["cinematic", "dramatic", "bokeh", "studio", "portrait", "golden hour", "epic", "8k"]
out = []
for i, (n, a) in enumerate(RAY):
    out.append({"name": "ray_" + n,
                "prompt": "Candid smartphone photo taken by the homeowner: " + a + ". " + LIGHT[i % 4] + ", " + IMPERF[i % 4] + ". He is busy and not looking at the camera.",
                "ref": REF})
    out.append({"name": "ray_" + n + "_b",
                "prompt": "Candid smartphone photo taken by the homeowner, from a few steps back, " + a[0].lower() + a[1:] + ". " + LIGHT[(i + 1) % 4] + ", " + IMPERF[(i + 1) % 4] + ". He is busy and not looking at the camera.",
                "ref": REF})
for i, (n, a) in enumerate(MACRO):
    out.append({"name": "det_" + n,
                "prompt": "Candid smartphone photo taken by the homeowner: " + a + ". " + LIGHT[i % 4] + ", " + IMPERF[(i + 2) % 4] + "."})
for it in out:
    assert it["prompt"].endswith("."), it["name"]
    low = it["prompt"].lower()
    for w in BANNED:
        assert w not in low, (it["name"], w)
json.dump(out, open("_v3/rkclaim_imglist.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(out), sum(1 for x in out if "ref" in x))
