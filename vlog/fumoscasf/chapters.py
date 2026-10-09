# -*- coding: utf-8 -*-
# chapters.json del vlog: un capítulo por sección del guion filmado (el índice es el PÁRRAFO, igual que en
# vlog/claudio/meta.mjs: `P[p].s - 0.5` da el segundo real de arranque).
import json, re
R = "D:/Proyectos/video2-wt/fumoscasf/"
fil = [l for l in open(R + "guiones/fumoscasf_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
para = [l for l in open(R + "guiones/fumoscasf.txt", encoding="utf8").read().split("\n") if l.strip()]
assert len(fil) == len(para), (len(fil), len(para), "filmado y guion tienen que estar línea a línea")
TIT = {"HOOK": "Treinta moscas en una cocina limpia",
       "AF": "Por qué entra una mosca a una cocina limpia",
       "MO": "El mosquitero que no sirve",
       "ALM": "Lo que pides en el almacén de la esquina",
       "BA": "Arreglo 1: la basura, por dentro y por fuera",
       "LI": "Arreglo 2: medio limón con clavo en cada ventana",
       "AL": "Arreglo 3: la albahaca en la ventana que más usas",
       "CI": "Arreglo 4: la cinta pegajosa, arriba y lejos de la comida",
       "ME": "La mesa, los chicos y el veneno que no ponemos",
       "GR": "Moscas grandes: algo muerto a menos de diez metros",
       "NO": "Una semana después, de noche",
       "CL": "La revisión de diez minutos con la linterna",
       "NX": "Lo que viene: los mosquitos"}
ch, vistos = [], set()
for i, l in enumerate(fil):
    sec = re.match(r"\[([^|]+)\|", l).group(1)
    if sec in vistos: continue
    vistos.add(sec); ch.append([i, TIT[sec]])
out = {"intro": ("Una mosca no entra a una cocina por la comida: entra por el olor. En la casa de los Ramírez "
                 "vaciamos el tarro todos los días y lo lavamos con agua oxigenada, pusimos medio limón con "
                 "diez clavos en cada ventana y albahaca en la que más se usa, y colgamos la cinta pegajosa "
                 "arriba y lejos de la comida. Sin mosquiteros y sin aerosol. Y si aparecen moscas grandes, "
                 "algo muerto hay a menos de diez metros. Episodio 8 de \"La casa de los Ramírez\"."),
       "chapters": ch,
       "pinned": ("¿Cuál de los cuatro arreglos vas a probar primero en tu cocina? Cuéntame aquí, leo todos. "
                  "Las 3 pruebas de la noche (incluida la de la cinta doble faz, que no está en ningún video) "
                  "están gratis en el primer link de la descripción. — Claudio")}
json.dump(out, open(R + "vlog/fumoscasf/chapters.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(json.dumps(ch, ensure_ascii=False))
