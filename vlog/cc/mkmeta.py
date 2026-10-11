# public/<slug>_meta.json {title, description} para deliver_card: título y descripción de la tarjeta (cards_es.json) + el enlace
# de la guía PAGA (?src=<slug>) + capítulos por sección del guion, re-mapeados por el recorte de pausas.  SLUG=x python vlog/cc/mkmeta.py
import json, os, sys
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/ccfrijoles/"
sys.path.insert(0, R + f"vlog/{S}"); from recorte import mapear
card = next(c for c in json.load(open("C:/Users/bauti/Downloads/plan_claudio_cocina/cards_es.json", encoding="utf8")) if c["slug"] == S)
NOM = {"HOOK": "El truco de la fonda", "FONDA": "Así se hacía en la fonda", "ERROR": "El error que comete casi todo el mundo",
       "CIENCIA": "Por qué funciona", "TRUCO": "La receta paso a paso", "SERVIR": "Cómo se sirve", "ANTES": "Antes y después",
       "VARIANTE": "Variantes", "MUCHOS": "Para mucha gente", "ERRORES": "Errores comunes", "MERCADO": "Qué comprar",
       "GUARDAR": "Cómo se guarda", "PREGUNTAS": "Preguntas que me hacen", "SOBRA": "Con lo que sobra", "COSTO": "Cuánto cuesta por plato",
       "CIERRE": "Para cerrar"}
caps, vistos = [], set()
for q in json.load(open(R + f"_v3/{S}_paras.json", encoding="utf8")):
    sec = q["sec"]
    if sec in NOM and sec not in vistos:
        vistos.add(sec); t = 0.0 if not caps else mapear(q["s"])
        if caps and t - caps[-1][0] < 20: continue          # capítulos de ≥20 s
        caps.append((t, NOM[sec]))
fmt = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
link = f"https://recetario-de-la-fonda.vercel.app/?src={S}"
LO = {"ccfrijoles": "Los frijoles de olla sin remojar", "cccostillas": "Las costillas en la olla con su glaseado",
      "ccejotes": "Los ejotes de un solo sartén", "cccafe": "El café de olla con piloncillo y canela", "ccrepollo": "El repollo de la fonda",
      "ccmuslos": "Los muslos en su grasa con salsa", "cccarne": "La carne que se deshace en 3 horas", "cchuevos": "Los huevos sin aceite y la salsa roja",
      "ccarroz": "El arroz rojo suelto y los refritos", "ccchuletas": "Las chuletas jugosas en rajas"}
# renglón 1 = CTA a medida del video (feedback_cta_primer_renglon_todos_los_videos): lo de ESTE video + lo demás + ancla, sin precio de la guía
cta = f"📖 {LO[S]}, con cantidades y tiempos exactos, + 49 recetas más de la fonda que en un restaurante te cobran US$15 o más el plato 👉 {link}"
d = cta + "\n\n" + card["yt_description"].replace("[[CHAPTERS]]", "\n".join(f"{fmt(t)} {n}" for t, n in caps))
json.dump({"title": card["title"], "description": d}, open(R + f"public/{S}_meta.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(d)
