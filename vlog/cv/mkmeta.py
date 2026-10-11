# public/<slug>_meta.json para deliver_card: título de la tarjeta + gancho + CTA (página del libro, ?src=<slug>, sin regalo) + capítulos + nota USDA.
#   SLUG=x python vlog/cv/mkmeta.py "<título>" <página> "<gancho>" "<nota USDA o ''>" "<emoji + CTA de ESTE video>" < capitulos.txt
# ⛔ renglón 1 = emoji + CTA a medida (lo de este video + 49 recetas más + ancla, SIN precio) + 👉 link (regla 10-oct).
import sys, json, os
S = os.environ["SLUG"]; tit, pag, hook, usda, cta = sys.argv[1:6]; ch = sys.stdin.read().strip()
d = f"""{cta} 👉 https://vaquero-cookbook.vercel.app/?src={S}

{hook}

The full recipe, with the trick and the common mistakes, is on page {pag} of The Vaquero's Cookbook. Every recipe from the ranch for less than one family dinner out: https://vaquero-cookbook.vercel.app/?src={S}

Chapters:
{ch}
""" + (f"\n{usda}\n" if usda else "") + "\n#cooking #oldfashioned #recipes"
json.dump({"title": tit, "description": d}, open(f"D:/Proyectos/video2-wt/{S}/public/{S}_meta.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(d), "caracteres")
