import json, importlib.util

# reuse the RAY and MACRO action lists from the agnes list generator (its module-level dump is harmless)
spec = importlib.util.spec_from_file_location("mk1", "D:/wt/rkclaim/_v3/rkclaim_mkimg.py")
mk1 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mk1)
RAY, MACRO = mk1.RAY, mk1.MACRO

REF = "C:/Users/bauti/Downloads/plan_ray_oct3/face_webcam.png"
LIGHT = ["overcast morning light from a window", "flat daylight from a porch",
         "soft kitchen light from a ceiling bulb", "grey early light through a glass door"]
EXTRA = ["a fingerprint smear on the glass", "the frame a little tilted",
         "something cut at the edge of the frame", "a thumb in the corner of the frame"]
BANNED = ["cinematic", "35mm", "bokeh", "8k", "highly detailed", "photorealistic", "golden hour",
          "documentary", "grainy", "blurry", "blurred", "out of focus", "soft focus", "shallow depth of field", "stock photo"]
RECIPE = ("Candid smartphone photo taken by the homeowner of a 68-year-old locksmith with thick white hair combed back, "
          "short white stubble, steel reading glasses pushed up on his forehead, faded navy work shirt with a white oval patch, ")

ray_items, nof_items = [], []
for i, (n, a) in enumerate(RAY):
    p = RECIPE + a + ", " + LIGHT[i % 4] + ", " + EXTRA[i % 4] + ". He is busy and not looking at the camera, nothing blurred out."
    ray_items.append({"name": "ray_" + n, "prompt": p, "ref": REF})
    p2 = (RECIPE + "from a few steps back, " + a[0].lower() + a[1:] + ", " + LIGHT[(i + 1) % 4] + ", "
          + EXTRA[(i + 1) % 4] + ". He is busy and not looking at the camera, nothing blurred out.")
    ray_items.append({"name": "ray_" + n + "_b", "prompt": p2, "ref": REF})
for i, (n, a) in enumerate(MACRO):
    p = ("Candid smartphone photo taken by the homeowner: " + a + ", " + LIGHT[i % 4] + ", " + EXTRA[(i + 2) % 4]
         + ". Ordinary lived-in house, everyday clutter nearby, no people in the frame, no readable text, nothing blurred out.")
    nof_items.append({"name": "det_" + n, "prompt": p})

for it in ray_items + nof_items:
    low = it["prompt"].lower().split("nothing blurred out")
    low = "".join(low)
    assert len(it["prompt"]) >= 180, (it["name"], len(it["prompt"]))
    assert "nothing blurred out" in it["prompt"].lower(), it["name"]
    for w in BANNED:
        assert w not in low, (it["name"], w)

json.dump(ray_items, open("_v3/rkclaim_items_ray.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
json.dump(nof_items, open("_v3/rkclaim_items_nof.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("ray", len(ray_items), "nof", len(nof_items))
