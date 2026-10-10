# public/<slug>_meta.json para deliver_card: título de la tarjeta + gancho + CTA (página del libro, ?src=<slug>, sin regalo) + capítulos + nota USDA.
#   SLUG=x python vlog/cv/mkmeta.py "<título>" <página> "<gancho>" "<nota USDA o ''>" < capitulos.txt
import sys, json, os
S = os.environ["SLUG"]; tit, pag, hook, usda = sys.argv[1:5]; ch = sys.stdin.read().strip()
d = f"""{hook}

The full recipe, with the trick and the common mistakes, is on page {pag} of The Vaquero's Cookbook. Every recipe from the ranch for less than one family dinner out: https://vaquero-cookbook.vercel.app/?src={S}

Chapters:
{ch}
""" + (f"\n{usda}\n" if usda else "") + "\n#cooking #oldfashioned #recipes"
json.dump({"title": tit, "description": d}, open(f"D:/Proyectos/video2-wt/{S}/public/{S}_meta.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(d), "caracteres")
