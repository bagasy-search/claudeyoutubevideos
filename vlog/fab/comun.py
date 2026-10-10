# -*- coding: utf-8 -*-
# Piezas comunes de la fábrica (vlog/fab): rutas del video en curso, tiempos de palabras, mapeo máster→video recortado.
import json, os, re, subprocess, sys, unicodedata
for _s in (sys.stdout, sys.stderr):
    try: _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"
FPS = 30
def slug():
    s = os.environ.get("SLUG") or (open(R + "vlog/fab/actual.txt", encoding="utf8").read().strip() if os.path.exists(R + "vlog/fab/actual.txt") else "")
    if not s: sys.exit("⛔ no hay video en curso (vlog/fab/actual.txt)")
    return s
S = slug()
D = R + f"vlog/{S}/"          # lo que escribe el director (guion.txt, planos.json, ov.json, avatar.json, meta.json)
V3 = R + "_v3/"
# el CANAL manda (idioma, protagonista, voz, largo del avatar…): vlog/fab/canal/<canal>.json, elegido en vlog/<slug>/meta.json
_canal = json.load(open(D + "meta.json", encoding="utf8")).get("canal", "fumigador") if os.path.exists(D + "meta.json") else "fumigador"
CANAL = json.load(open(R + f"vlog/fab/canal/{_canal}.json", encoding="utf8")); CANAL["id"] = _canal
IDIOMA = CANAL.get("idioma", "es"); PROT = CANAL.get("protagonista", "claudio")
os.makedirs(V3, exist_ok=True)
def J(p, d=None):
    if not os.path.exists(p):
        if d is not None: return d
        sys.exit(f"⛔ falta {p.replace(R, '')}")
    try: return json.load(open(p, encoding="utf-8-sig"))
    except Exception as e: sys.exit(f"⛔ {p.replace(R, '')} no es JSON válido: {e}")
def W(p, x):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    json.dump(x, open(p, "w", encoding="utf8"), ensure_ascii=False, indent=1)
def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout or 0)
def frames(p):
    return int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", p], capture_output=True, text=True).stdout or 0)
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))

# ── tiempos: palabras del máster crudo (_v3/<slug>_wordms.json) y cortes de pausas (vlog/<slug>/cortes.json) ──
def cortes(): return J(D + "cortes.json", [])
def mapear(t, C=None):
    C = cortes() if C is None else C
    q = 0.0
    for a, b in C:
        if t >= b: q += b - a
        elif t > a: q += t - a
    return t - q
def palabras(): return J(V3 + f"{S}_wordms.json")
_cache = {}
def at(frase, end=False):
    """segundo (video recortado) donde empieza (o termina) la frase EXACTA del guion; None si no está"""
    if "WM" not in _cache:
        _cache["WM"] = palabras(); _cache["W"] = [nw(w["w"]) for w in _cache["WM"]]; _cache["C"] = cortes()
    WM, Wn, C = _cache["WM"], _cache["W"], _cache["C"]
    q = [nw(x) for x in frase.split() if nw(x)]
    if not q: return None
    for i in range(len(Wn) - len(q) + 1):
        if Wn[i:i + len(q)] == q: return mapear(WM[i + len(q) - 1]["e"] if end else WM[i]["s"], C)
    return None
def total_frames():
    p = R + f"public/{S}cut.wav"
    if not os.path.exists(p): sys.exit("⛔ falta la voz (corré: python vlog/fab/fab.py voz)")
    return round(dur(p) * FPS)
