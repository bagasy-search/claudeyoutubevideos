# Listas de imágenes de la temporada entera desde los planes (_v3/<slug>_plan.json):
#   _v3/hh_lor.json   → gpt-image-2 /edits low + Batch + crop 128x192 (SOLO planos con la cara de Loretta)
#   _v3/hh_agnes.json → agnes-image (todo lo que no tiene la cara de Loretta: bi, cl, ei)
#   _v3/<slug>_i2v.json → lista de agnes_i2v (clips de los planos cl)
# Nombres globales "<slug>__<nombre>" (después se reparten a public/img/<slug>/<nombre>.jpg). python vlog/hh/assets.py
import json, re, os
R = "D:/Proyectos/video2-wt/lhh/"
SL = ["hhdollar", "hhwinter", "hhexpire", "hhfreeze", "hhgrocery", "hhscraps", "hhvinegar", "hhperox", "hhtoilet", "hhnever"]
WHO = "Loretta, an 81-year-old woman with short curly white hair, light thin wire-framed glasses, a pearl necklace and a lilac blouse"
WHO_DAY = WHO + " with a lilac cardigan and a floral apron with a green trim, old hands with age spots and veins"
TAIL = (" One ordinary frame from a normal home video shot at eye level by her grandson with a consumer camera, casual slightly imperfect framing,"
        " something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the room around her stays readable with ordinary everyday objects. Only the light"
        " the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real skin with pores,"
        " wrinkles and age spots, real materials with wear and use. Her face is the face of the reference image: same face, same age, same glasses, not"
        " younger, not prettier. No text, no letters, no labels, no logos.")
PEOPLE = re.compile(r"\b(hand|hands|woman|man|men|women|girl|boy|child|children|people|person|farmer|lady|ladies|family|couple|her|his|grandmother|kid|kids|crew|nurse|clerk|bride|widow|sisters|guild)\b", re.I)
A_TAIL = " An ordinary everyday frame from a home video shot at eye level, natural light of the place, real materials with wear and use, no text, no letters, no logos."
def EI(year, scene):
    return (f"A faded color snapshot photograph taken around {year} in small-town rural Iowa with an ordinary family snapshot camera: {scene} Faded warm colors "
            "of old print film, slightly soft print, casual family snapshot of ordinary Midwestern people caught mid-action, nobody posing, someone cut by the "
            "edge of the frame, the room around them readable. No text, no letters, no signs, no logos.")
lor, ag = [], []
for s in SL:
    P = json.load(open(R + f"_v3/{s}_plan.json", encoding="utf8"))
    i2v = []
    for m in P["marks"]:
        k, n = m["k"], m.get("name")
        if k == "lor":
            sc = m["prompt"]; who = WHO if re.search(r"nightgown|robe|coat|church dress|sun hat", sc) else WHO_DAY
            lor.append({"name": f"{s}__{n}", "prompt": f"{who}. She {sc[0].lower() + sc[1:] if sc.split()[0] in ('stands','sits','kneels','walks','carries','pours','lifts','holds','arranges','waters','drapes','mops','folds','opens','slides','flips','cracks','gently','pushes','leans','snips','chops','wipes','dries','stands,') else sc}{'' if sc.endswith('.') else '.'}" + TAIL, "ref": ["public/ref_lor_face.png"]})
        elif k in ("bi", "cl"):
            sc = m["prompt"].rstrip(".") + "."
            extra = " Her face is not in the frame." if re.search(r"\bhands?\b", sc) else ("" if PEOPLE.search(sc) else " Nobody in the frame.")
            ag.append({"name": f"{s}__{n}", "prompt": sc + extra + A_TAIL})
            if k == "cl": i2v.append({"nombre": n, "motion": m["motion"]})
        elif k == "ei":
            ag.append({"name": f"{s}__{n}", "prompt": EI(m["year"], m["prompt"].rstrip(".") + ".")})
    json.dump(i2v, open(R + f"_v3/{s}_i2v.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
json.dump(lor, open(R + "_v3/hh_lor.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
json.dump(ag, open(R + "_v3/hh_agnes.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
print("gpt (cara Loretta):", len(lor), "· agnes imágenes:", len(ag), "· clips:", sum(len(json.load(open(R + f"_v3/{s}_i2v.json"))) for s in SL))
print(lor[0]["prompt"][:400]); print(ag[0]["prompt"][:300])
