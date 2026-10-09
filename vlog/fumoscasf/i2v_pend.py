# -*- coding: utf-8 -*-
# Arma la lista de image-a-video SÓLO con los planos cuyo clip todavía no existe.
#   python vlog/fumoscasf/i2v_pend.py            → _v3/fumoscasf_i2v_pend.json
#   node scripts/agnes_i2v.mjs _v3/fumoscasf_i2v_pend.json fumoscasf
# `gente` sólo afina la pista del control de calidad (si en el plano tiene que haber manos/gente).
import json, os, re
R = "D:/Proyectos/video2-wt/fumoscasf/"
BE = json.load(open(R + "_v3/fumoscasf_beats.json", encoding="utf8"))
CL = R + "public/broll/fumoscasf"
PERSONA = re.compile(r"\b(hand|hands|finger|fingers|thumb|arm|arms|sleeve|he|she|his|her|shoulders?|dog|boy|girl|children|child|shoe)\b", re.I)
# qué motion tiene cada plano: lo saca beats.py
import importlib.util
spec = importlib.util.spec_from_file_location("beats", R + "vlog/fumoscasf/beats.py")
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
MOT = {s["id"]: s for s in mod.SHOTS}
pend = [b["id"] for b in BE if not os.path.exists(f"{CL}/{b['id']}.mp4")]
lista = [{"nombre": n, "motion": MOT[n]["motion"], "gente": bool(PERSONA.search(MOT[n]["motion"]) or PERSONA.search(MOT[n]["prompt"]))} for n in pend]
json.dump(lista, open(R + "_v3/fumoscasf_i2v_pend.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
print("faltan", len(lista), "·", " ".join(pend))
