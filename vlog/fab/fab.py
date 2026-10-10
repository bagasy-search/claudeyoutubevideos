# -*- coding: utf-8 -*-
# LA RECETA DE LA FÁBRICA: un comando por etapa. El director (el modelo) sólo escribe 5 archivos en vlog/<slug>/
# (guion.txt, planos.json, avatar.json, ov.json, meta.json) y corre estas etapas EN ORDEN. Nada más se programa.
#
#   python vlog/fab/fab.py estado                  qué etapas están hechas y qué sigue
#   python vlog/fab/fab.py guion                   valida guion.txt (largo, tú neutro, secciones) → guiones/<slug>*.txt
#   python vlog/fab/fab.py voz        (fondo)      Fish + compuerta ASR + alineación + pausas recortadas → public/<slug>cut.wav
#   python vlog/fab/fab.py planos                  valida planos.json y dice cuántos planos faltan por sección
#   python vlog/fab/fab.py imgs       (fondo)      fotos agnes (gratis) con juez de visión y regeneración
#   python vlog/fab/fab.py clips      (fondo)      clips agnes v2.0 + congelados + juez + regeneración + sello de QC
#   python vlog/fab/fab.py armar                   arma public/vid/<slug>/vlog.mp4 (cuadros exactos)
#   python vlog/fab/fab.py avatar     (fondo)      ventanas de avatar.json → UN /run de RunPod (US$0,25) → capa de avatar
#   python vlog/fab/fab.py ov                      resuelve ov.json (frase → cuadro), valida props y tiempos, arma las camas
#   python vlog/fab/fab.py editor     (fondo)      cuadros fijos de cada componente + juez de visión → aprueba o dice qué arreglar
#   python vlog/fab/fab.py mix                     voz + ambiente + foley, −14 LUFS, sin música
#   python vlog/fab/fab.py render     (fondo)      commit + farm + encfin + auditor sobre el mp4 final
#   python vlog/fab/fab.py esperar <etapa>         espera hasta ~9 min a una etapa de fondo y muestra cómo va
# ⭐ avatar va APENAS termina la voz (RunPod tarda ~25 min): corre en paralelo con planos/imgs/clips.
# Las etapas (fondo) se lanzan solas en segundo plano y vuelven enseguida: después `esperar <etapa>` (repetir hasta que diga FIN).
import os, re, sys, json, time, glob, shutil, subprocess, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import R, S, D, V3, FPS, J, W, dur, frames, nw, at, mapear, cortes, palabras, total_frames, CANAL, IDIOMA, PROT

LOG = D + "logs/"; HECHO = D + ".hecho/"
os.makedirs(LOG, exist_ok=True); os.makedirs(HECHO, exist_ok=True)
ENV = {**os.environ, "SLUG": S, "PYTHONUTF8": "1", "AGNES_KEYS_OTRA_PC": os.environ.get("AGNES_KEYS_OTRA_PC", ",")}
FONDO = {"guionista", "arte", "voz", "planos", "imgs", "clips", "avatar", "montaje", "editor", "render"}
ORDEN = ["guionista", "guion", "arte", "voz", "avatar", "planos", "imgs", "clips", "armar", "montaje", "ov", "editor", "mix", "render"]
CLIPF = 121

def sh(cmd, check=True, quiet=False, env=None, **kw):
    if not quiet: print("▶", cmd if isinstance(cmd, str) else " ".join(cmd), flush=True)
    r = subprocess.run(cmd, shell=isinstance(cmd, str), cwd=R, env={**ENV, **(env or {})}, text=True, encoding="utf8", errors="replace", **kw)
    if check and r.returncode != 0: raise SystemExit(f"⛔ falló (exit {r.returncode}): {cmd if isinstance(cmd, str) else ' '.join(cmd)}")
    return r
def out(cmd):
    return subprocess.run(cmd, shell=isinstance(cmd, str), cwd=R, env=ENV, capture_output=True, text=True, encoding="utf8", errors="replace").stdout.strip()
def hecho(et, ok=True, nota=""):
    if ok: open(HECHO + et, "w", encoding="utf8").write(time.strftime("%Y-%m-%d %H:%M:%S ") + nota)
    elif os.path.exists(HECHO + et): os.remove(HECHO + et)
def borrar_desde(et):
    """rehacer una etapa invalida las siguientes"""
    for e in ORDEN[ORDEN.index(et):]: hecho(e, False)

# ════════════════════════════════════════ guion ════════════════════════════════════════
VOSEO = re.compile(r"\b(vos|tenés|querés|podés|sabés|hacés|decís|venís|sentís|mirá|fijate|vení|decime|hacé|poné|sacá|andá|tomá|dale|che|acá|allá|laburo|plata|heladera|pileta|canilla)\b", re.I)
def e_guion():
    src = D + "guion.txt"
    L = [l.strip() for l in open(src, encoding="utf-8-sig").read().split("\n") if l.strip()] if os.path.exists(src) else sys.exit("⛔ falta vlog/<slug>/guion.txt")
    fil, secs, malas = [], [], []
    for i, l in enumerate(L):
        m = re.match(r"^\[([A-Z0-9_]+)(?:\|[^\]]*)?\]\s*(.+)$", l)
        if not m: malas.append(i + 1); continue
        sec, txt = m.group(1), m.group(2).strip()
        if "[" in txt or "]" in txt: malas.append(i + 1); continue
        fil.append(f"[{sec}|{sec}] {txt}"); secs.append(sec)
    if malas: sys.exit(f"⛔ líneas sin la forma '[SECCION] texto' (o con corchetes adentro): {malas[:10]}")
    orden = list(dict.fromkeys(secs))
    open(R + f"guiones/{S}_filmado.txt", "w", encoding="utf8", newline="\n").write("\n".join(fil))
    tags = D + "tags.json"
    if not os.path.exists(tags): W(tags, {})
    sh(["python", "vlog/claudio/mk_guion.py"])
    texto = " ".join(re.sub(r"^\[[^\]]*\]\s*", "", l) for l in fil)
    ch = len(texto); meta = J(D + "meta.json", {}); mins = float(meta.get("minutos", 12))
    cps = float(CANAL.get("cps", 14.0)); est = ch / cps / 60
    vos = sorted(set(m.group(0).lower() for m in VOSEO.finditer(texto))) if IDIOMA == "es" else []
    proh = sorted(set(m.group(0).lower() for x in CANAL.get("prohibidas", []) for m in re.finditer(x, texto, re.I)))
    largos = [i + 1 for i, l in enumerate(fil) if len(l) > 900]
    print(f"párrafos {len(fil)} · {ch} caracteres · ~{est:.1f} min de voz (pedido {mins:g}) · secciones {len(orden)}: {' '.join(orden)}")
    prob = []
    if vos: prob.append(f"palabras de voseo/regionales (usa tú neutro: tienes, mira, aquí, refrigerador, fregadero, llave): {vos}")
    if proh: prob.append(f"palabras PROHIBIDAS en este canal (sacalas o reescribí la frase): {proh}")
    if largos: prob.append(f"párrafos de más de 900 caracteres (partilos): líneas {largos}")
    if not (0.8 * mins <= est <= 1.25 * mins): prob.append(f"largo fuera de rango: {est:.1f} min para {mins:g} pedidos ({cps:g} car/s)")
    if len(orden) < 6: prob.append("menos de 6 secciones: separá el guion en bloques (gancho, problema, cada arreglo, cierre)")
    for p in prob: print("⛔", p)
    if prob: hecho("guion", False); sys.exit(2)
    borrar_desde("guion"); hecho("guion", True, f"{ch} car"); print("✓ guion OK → siguiente: python vlog/fab/fab.py voz")

# ════════════════════════════════════════ guionista ════════════════════════════════════════
def e_guionista():
    if not os.path.exists(D + "brief.md"): sys.exit("⛔ falta vlog/<slug>/brief.md")
    import equipo
    n, p = equipo.guion()
    print(f"FIN guionista: guion.txt de {n} caracteres (borrador puntuado {p}/10 por el crítico y reescrito) → siguiente: python vlog/fab/fab.py guion")
    hecho("guionista", True)

# ════════════════════════════════════════ arte ════════════════════════════════════════
def e_arte():
    if not os.path.exists(HECHO + "guion"): sys.exit("⛔ primero: guion")
    import equipo
    b = equipo.arte()
    for sec, x in b["secciones"].items(): print(f"   {sec:10s} {x['lugar']:14s} {x['hora']:6s} {','.join(x['gente'])}")
    print(f"FIN arte: {len(b['lugares'])} lugares · avatar en '{b['avatar_lugar']}'"); hecho("arte", True)

# ════════════════════════════════════════ voz ════════════════════════════════════════
def e_voz():
    if not os.path.exists(HECHO + "guion"): sys.exit("⛔ primero: guion")
    meta = J(D + "meta.json", {})
    sh(["python", "vlog/claudio/voz.py", "--voice", meta.get("voz") or CANAL.get("voz", "claudio_definitiva"), "--lang", IDIOMA, "--cps", str(CANAL.get("cps", 14.0))])
    raw = R + f"public/{S}_raw.wav"
    if not os.path.exists(raw): sys.exit("⛔ voz.py no dejó el máster")
    sh(f'modal run vlog/claudio/modal_asr_blocks.py --files public/{S}_raw.wav --out _v3/{S}_asr_raw.json --lang {IDIOMA}')
    d = J(V3 + f"{S}_asr_raw.json"); ws = d[list(d)[0]]["words"]
    W(R + f"public/captions_{S}.json", [{"text": w["w"].strip(), "startMs": round(w["s"] * 1000), "endMs": round(w["e"] * 1000)} for w in ws])
    r = sh(["python", "vlog/claudio/align.py"], capture_output=True); print(r.stdout[-1500:])
    pausas(); cut()
    T = total_frames()
    print(f"FIN voz: máster {dur(raw):.1f} s → sin pausas {T / FPS:.1f} s = {T} cuadros ({T / FPS / 60:.2f} min)")
    hecho("voz", True, f"{T} cuadros")

def pausas():
    import numpy as np
    SR, H = 16000, 160; MIN, COLA, PRE = 0.30, 0.12, 0.06
    WAV = R + f"public/{S}_raw.wav"
    rd = lambda af: np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", WAV, "-af", af, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
    def db(x): n = len(x) // H; return 20 * np.log10(np.sqrt((x[:n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
    full = db(rd("highpass=f=80")); hi = db(rd("highpass=f=4000,lowpass=f=7900"))
    n = min(len(full), len(hi)); full, hi = full[:n], hi[:n]
    voz = (full > np.percentile(full, 20) + 12) | (hi > np.percentile(hi, 20) + 10)
    WM = palabras(); C = []
    for i in range(len(WM) - 1):
        a0, b0 = WM[i]["e"], WM[i + 1]["s"]
        if b0 - a0 < MIN: continue
        fa, fb = int((a0 - 0.15) * 100), int((b0 + 0.15) * 100)
        best, cur = (0, 0, 0), 0
        for k, v in enumerate(voz[max(0, fa):fb]):
            cur = cur + 1 if not v else 0
            if cur > best[0]: best = (cur, k - cur + 1, k + 1)
        L, s, e = best; s_t, e_t = (max(0, fa) + s) / 100, (max(0, fa) + e) / 100
        if e_t - s_t < MIN: continue
        fin = WM[i]["w"][-1] in ".?!:;"
        a = max(s_t + COLA, a0 + 0.10) + (0.07 if fin else 0); b = min(e_t - PRE, b0 - 0.06)
        a, b = math.ceil(a * 30) / 30, math.floor(b * 30) / 30
        if b - a > 0.05: C.append([round(a, 5), round(b, 5)])
    W(D + "cortes.json", C)
    print(f"pausas recortadas {len(C)} · {sum(b - a for a, b in C):.1f} s")

def cut():
    import numpy as np, wave
    SR = 44100; C = cortes(); src = R + f"public/{S}_raw.wav"
    with wave.open(src, "rb") as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16) if (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2) else None
    if x is None:
        sh(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", src + ".tmp.wav"]); os.replace(src + ".tmp.wav", src); return cut()
    T = round(len(x) / SR * FPS); keep, t = [], 0.0
    for a, b in C: keep.append((round(t * FPS), round(a * FPS))); t = b
    keep.append((round(t * FPS), T)); keep = [(a, b) for a, b in keep if b > a]
    ns = lambda f: round(f * SR / FPS)
    y = np.concatenate([x[ns(a):ns(b)] for a, b in keep])
    with wave.open(R + f"public/{S}cut.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())

# ════════════════════════════════════════ tramos (para planos y armar) ════════════════════════════════════════
def tramos():
    """el video se parte en tramos que cortan en pausas de la voz: ~1,95 s en el minuto 1, ~4,03 s después"""
    WM = palabras(); C = cortes(); T = total_frames() / FPS
    fil = [l for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
    secs_par = [re.match(r"\[([^|\]]+)", l).group(1) for l in fil]
    paras = [l for l in open(R + f"guiones/{S}.txt", encoding="utf8").read().split("\n") if l.strip()]
    pidx = [i for i, p in enumerate(paras) for _ in re.findall(r"\S+", p)]
    if len(pidx) != len(WM): sys.exit(f"⛔ palabras del guion ({len(pidx)}) ≠ tiempos ({len(WM)}): rehacé voz")
    sec = [secs_par[i] for i in pidx]; m = lambda t: mapear(t, C)
    gaps = [((m(WM[i]["e"]) + m(WM[i + 1]["s"])) / 2,) for i in range(len(WM) - 1) if sec[i + 1] == sec[i] and m(WM[i + 1]["s"]) - m(WM[i]["e"]) > 0.05]
    bounds = [0.0] + [(m(WM[i - 1]["e"]) + m(WM[i]["s"])) / 2 for i in range(1, len(WM)) if sec[i] != sec[i - 1]] + [T]
    bsec = [sec[0]] + [sec[i] for i in range(1, len(WM)) if sec[i] != sec[i - 1]]
    obj = lambda t: 1.8 if t < 60 else 2.7
    segs = []
    for k in range(len(bounds) - 1):
        A, B, t = bounds[k], bounds[k + 1], bounds[k]
        if B - t < 0.4:
            if segs: segs[-1]["b"] = B
            continue
        while B - t > obj(t) * 1.25:
            want = t + obj(t)
            op = [g[0] for g in gaps if abs(g[0] - want) <= 0.35 and t + obj(t) * 0.5 <= g[0] <= B - 0.35]
            c = min(op, key=lambda g: abs(g - want)) if op else want
            if c - t < 0.9 or B - c < 0.9: break
            segs.append({"a": t, "b": c, "sec": bsec[k]}); t = c
        segs.append({"a": t, "b": B, "sec": bsec[k]})
    TF = total_frames()
    for s in segs: s["fa"] = max(0, round(s["a"] * FPS)); s["fb"] = round(s["b"] * FPS)
    segs[-1]["fb"] = TF
    for i in range(1, len(segs)): segs[i]["fa"] = segs[i - 1]["fb"]
    for s in segs: s["n"] = s["fb"] - s["fa"]
    return [s for s in segs if s["n"] > 0]

def necesidad():
    from collections import Counter
    c = Counter()
    for s in tramos(): c[s["sec"]] += math.ceil(s["n"] / CLIPF)
    return c

# ════════════════════════════════════════ planos ════════════════════════════════════════
RUIDO = re.compile(r"\b(cinematic|photorealistic|8k|4k|bokeh|35 ?mm|depth of field|shallow focus|lens|camera angle|wide shot|close-up shot|establishing shot|dolly|tracking shot|award|masterpiece|ultra|hdr)\b", re.I)
CARA = re.compile(r"\b(looking at the camera|looks at the camera|looks straight at the camera|portrait)\b", re.I)
def leer_planos():
    P = J(D + "planos.json")
    if not isinstance(P, list): sys.exit("⛔ planos.json tiene que ser una lista")
    return P
def e_planos():
    for e in ("voz", "arte"):
        if not os.path.exists(HECHO + e): sys.exit(f"⛔ primero: {e}")
    nec = necesidad()
    if not os.path.exists(D + "planos.json") or "--rehacer" in sys.argv:
        import equipo
        P = equipo.planos(nec)
        W(D + "planos.json", P)
    P = leer_planos(); errs, avisos = [], []
    for p in P:   # arreglos automáticos de lo que escribe el director de fotografía (no vale la pena frenar por esto)
        p["foto"] = re.sub(r"\s{2,}", " ", RUIDO.sub("", str(p.get("foto", "")))).strip(" ,.") + "."
        if len(str(p.get("mov", ""))) < 20: p["mov"] = str(p.get("mov", "")).rstrip(". ") + ", slowly and clearly visible"
    W(D + "planos.json", P)
    ids = [p.get("id") for p in P]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup: errs.append(f"ids repetidos: {dup[:10]}")
    secs = list(dict.fromkeys(re.match(r"\[([^|\]]+)", l).group(1) for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8") if l.strip()))
    for p in P:
        i = p.get("id", "?")
        if not re.fullmatch(r"[a-z0-9_]{2,16}", str(i)): errs.append(f"{i}: id inválido (minúsculas, números, _)")
        if p.get("sec") not in secs: errs.append(f"{i}: sección '{p.get('sec')}' no está en el guion")
        f, mv = str(p.get("foto", "")), str(p.get("mov", ""))
        if not (80 <= len(f) <= 700): errs.append(f"{i}: 'foto' de {len(f)} caracteres (80-700)")
        if not (20 <= len(mv) <= 220): errs.append(f"{i}: 'mov' de {len(mv)} caracteres (20-220)")
        if RUIDO.search(f): errs.append(f"{i}: vocabulario de cámara en la foto ('{RUIDO.search(f).group(0)}'): describe sólo lo que se ve")
        if not p.get("cara") and CARA.search(f): avisos.append(f"{i}: menciona cara/mirada pero no tiene \"cara\": true")
        if re.search(r"[áéíóúñ¿¡]", f + mv): avisos.append(f"{i}: foto/mov con español (van en inglés)")
    from collections import Counter
    if all("tramo" in p for p in P): nec = Counter(s["sec"] for s in tramos())
    tiene = Counter(p.get("sec") for p in P)
    print("sección   tienes  necesitas")
    falta = 0
    for s in secs:
        n, t = nec.get(s, 0), tiene.get(s, 0); falta += max(0, n - t)
        print(f"  {s:8s} {t:6d}  {n:6d}  {'✓' if t >= n else '⛔ faltan ' + str(n - t)}")
    for a in avisos[:8]: print("⚠", a)
    for e in errs[:25]: print("⛔", e)
    if falta: print(f"⛔ faltan {falta} planos en total: corré `fab.py planos --rehacer`")
    if errs or falta: hecho("planos", False); sys.exit(2)
    hecho("planos", True, f"{len(P)} planos"); print(f"✓ {len(P)} planos OK → siguiente: python vlog/fab/fab.py imgs")

# ════════════════════════════════════════ imgs ════════════════════════════════════════
EMPTY = " Nobody else is in the picture."
def e_imgs():
    if not os.path.exists(HECHO + "planos"): sys.exit("⛔ primero: planos")
    import equipo
    falt = equipo.fotos(leer_planos())
    if falt:
        print(f"⛔ FIN imgs: {len(falt)} fotos no salieron (agnes): {falt[:20]} → corré imgs de nuevo"); hecho("imgs", False); sys.exit(2)
    hecho("imgs", True); print("FIN imgs: fotos OK → siguiente: python vlog/fab/fab.py clips")

# ════════════════════════════════════════ clips ════════════════════════════════════════
PERSONA = re.compile(r"\b(hand|hands|finger|fingers|thumb|arm|arms|sleeve|he|she|his|her|shoulders?|man|woman|boy|girl|child|children|dog|cat|people|person)\b", re.I)
def congelado(p):
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", p, "-vf", "freezedetect=n=-60dB:d=2.4", "-an", "-f", "null", "-"], capture_output=True, text=True, encoding="utf8", errors="replace")
    return "freeze_start" in r.stderr
def kenburns(i, k, src, dst):
    """plano QUIETO: la foto con un movimiento de cámara lento (acercamiento / alejamiento / paneo), 121 cuadros a 30 fps"""
    m = k % 4; n = CLIPF
    z = ["1.0+0.10*on/%d" % n, "1.10-0.10*on/%d" % n, "1.08", "1.08"][m]
    x = ["iw/2-(iw/zoom/2)", "iw/2-(iw/zoom/2)", "(iw-iw/zoom)*on/%d" % n, "(iw-iw/zoom)*(1-on/%d)" % n][m]
    vf = f"scale=3840:2160:flags=lanczos,zoompan=z='{z}':x='{x}':y='ih/2-(ih/zoom/2)':d={n}:s=1920x1080:fps=30,format=yuv420p"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", src, "-vf", vf, "-frames:v", str(n), "-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-an", dst], check=True)
def e_clips():
    """⛔ 9-oct: agnes-video-v2.0 DESAPARECIÓ de la API y la 2.5 normal es paga. Ahora:
       · TODOS los planos: FOTO 3D (profundidad local, paralaje real, gratis, ~10 s c/u) → nunca se traba el video
       · planos HÉROE (Claudio haciendo, cara=true): además agnes-video-2.5-flash (gratis, sonido real, 7-17 min c/u) en paralelo
         con todas las claves, cámara estática; los que lleguen antes del tope REEMPLAZAN a su foto 3D."""
    if not os.path.exists(HECHO + "imgs"): sys.exit("⛔ primero: imgs")
    P = {p["id"]: p for p in leer_planos()}; CL = R + f"public/broll/{S}"; os.makedirs(CL, exist_ok=True)
    heroe = [i for i in P if P[i].get("cara")][:45]
    TOPE = int(os.environ.get("FAB_HEROE_MIN", "90")) * 60
    proc = None
    falt_h = [i for i in heroe if not os.path.exists(f"{CL}/{i}.agnes")]
    if falt_h:
        lst = [{"nombre": i, "motion": "Static camera, the camera does not move at all. " + P[i]["mov"] + " Only ambient sound, nobody speaks."} for i in falt_h]
        W(V3 + f"{S}_i2v_heroe.json", lst); os.makedirs(R + f"public/broll/{S}_heroe", exist_ok=True)
        proc = subprocess.Popen(["node", "scripts/agnes_i2v.mjs", f"_v3/{S}_i2v_heroe.json", S, f"public/img/{S}", f"public/broll/{S}_heroe"], cwd=R,
                                env={**ENV, "AG_MODEL": "agnes-video-2.5-flash"}, stdout=open(LOG + "clips_heroe.log", "w"), stderr=subprocess.STDOUT)
        print(f"agnes 2.5-flash: {len(lst)} planos héroe en paralelo (tope {TOPE // 60} min)", flush=True)
    import foto3d
    segs = tramos(); largo = {i: segs[P[i]["tramo"]]["n"] for i in P if "tramo" in P[i] and P[i]["tramo"] < len(segs)}
    t0 = time.time(); hechos = 0
    for k, i in enumerate(P):
        if not os.path.exists(f"{CL}/{i}.mp4"):
            foto3d.clip(R + f"public/img/{S}/{i}.png", f"{CL}/{i}.mp4", (k * 7) % 6, n=max(CLIPF, largo.get(i, 0) + 2)); hechos += 1
            if hechos % 25 == 0: print(f"   foto 3D {hechos} · {(time.time() - t0) / 60:.0f} min", flush=True)
    print(f"foto 3D: {hechos} clips nuevos en {(time.time() - t0) / 60:.0f} min", flush=True)
    while proc and proc.poll() is None and time.time() - t0 < TOPE:
        time.sleep(30)
    if proc and proc.poll() is None: proc.kill(); print("tope de tiempo: corto agnes (lo que no llegó queda en foto 3D)")
    usados = 0
    for i in heroe:   # el clip de agnes reemplaza a la foto 3D (queda marca .agnes para no repetir)
        f = R + f"public/broll/{S}_heroe/{i}.mp4"
        if os.path.exists(f) and os.path.getsize(f) > 50_000 and frames(f) >= largo.get(i, 0):   # más corto que su tramo: queda la foto 3D
            shutil.copy(f, f"{CL}/{i}.mp4"); open(f"{CL}/{i}.agnes", "w").close(); usados += 1
    if falt_h or usados:   # sello del QC que exige el farm para los clips de agnes (medición + revisión registrada)
        W(V3 + f"{S}_i2v_heroe.json", [{"nombre": i, "motion": P[i]["mov"]} for i in heroe if os.path.exists(f"{CL}/{i}.agnes")])
        sh(["node", "scripts/agnes_qc.mjs", S], check=False, quiet=True, capture_output=True)
        sh(["node", "scripts/agnes_qc.mjs", S, "--revision", "ninguno"], check=False, quiet=True, capture_output=True)
    hecho("clips", True, f"{len(P)} clips · {usados} agnes héroe")
    print(f"FIN clips: {len(P)} clips ({usados} con agnes 2.5-flash y sonido real, el resto foto 3D) → siguiente: python vlog/fab/fab.py armar")

# ════════════════════════════════════════ armar ════════════════════════════════════════
def e_armar():
    if not os.path.exists(HECHO + "clips"): sys.exit("⛔ primero: clips")
    segs = tramos(); P = leer_planos(); CL = R + f"public/broll/{S}"
    porsec = {}
    for p in P: porsec.setdefault(p["sec"], []).append(p["id"])
    k = {s: 0 for s in porsec}; usados = []
    portramo = {p["tramo"]: p["id"] for p in P if "tramo" in p}
    if portramo and len(portramo) == len(segs):   # planos POR TRAMO: cada tramo lleva SU plano (lo dicho en ese segundo)
        for j, s in enumerate(segs):
            s["planos"] = [{"id": portramo[j], "n": s["n"]}]; usados.append((f"{CL}/{portramo[j]}.mp4", s["n"]))
    for s in (segs if not (portramo and len(portramo) == len(segs)) else []):
        lst = porsec.get(s["sec"]) or sys.exit(f"⛔ la sección {s['sec']} no tiene planos")
        s["planos"], resto = [], s["n"]
        while resto > 0:
            if k[s["sec"]] >= len(lst): sys.exit(f"⛔ faltan planos en {s['sec']} (corré planos)")
            nom = lst[k[s["sec"]]]; k[s["sec"]] += 1; n = min(CLIPF, resto)
            s["planos"].append({"id": nom, "n": n}); usados.append((f"{CL}/{nom}.mp4", n)); resto -= n
    W(D + "tramos.json", segs)
    W(V3 + f"{S}_cues.json", [{"key": u["id"], "src": f"broll/{S}/{u['id']}.mp4", "start": 0, "dur": round(u["n"] / FPS, 4)} for s in segs for u in s["planos"]])
    A = D + "_armar/"; os.makedirs(A, exist_ok=True); os.makedirs(R + f"public/vid/{S}", exist_ok=True)
    nf_cache = {}
    def nfc(p):
        if p not in nf_cache: nf_cache[p] = frames(p) or CLIPF
        return nf_cache[p]
    usados = [(p, min(n, nfc(p))) if n <= nfc(p) else (p, n) for p, n in usados]
    partes = []
    for g in range(0, len(usados), 40):
        tro = usados[g:g + 40]
        open(A + f"c{g:03d}.txt", "w").write("".join(f"file '{p}'\n" for p, _ in tro))
        sel, pos, base = [], 0, 0
        for p, n in tro: sel.append(f"between(n,{base},{base + n - 1})"); pos += n; base += nfc(p)
        open(A + f"s{g:03d}.txt", "w").write(f"select='{'+'.join(sel)}',setpts=N/({FPS}*TB),tpad=stop_mode=clone:stop=-1")
        pr = A + f"p{g:03d}.mp4"
        sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", A + f"c{g:03d}.txt", "-an", "-/vf", A + f"s{g:03d}.txt", "-fps_mode", "passthrough", "-frames:v", str(pos),
            "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-bf", "0", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", pr], quiet=True)
        partes.append(pr)
    open(A + "partes.txt", "w").write("".join(f"file '{p}'\n" for p in partes))
    vl = R + f"public/vid/{S}/vlog.mp4"
    sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", A + "partes.txt", "-c", "copy", vl], quiet=True)
    # audio REAL de los clips (sólo los que lo traen, p. ej. agnes 2.5-flash): misma línea de tiempo que el video
    import numpy as np, wave
    SRA = 48000; pista = []
    for p, n in usados:
        L = round(n / FPS * SRA)
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-t", f"{n / FPS:.4f}", "-ac", "1", "-ar", str(SRA), "-f", "s16le", "-"], capture_output=True).stdout
        x = np.frombuffer(raw, np.int16)[:L]
        pista.append(np.pad(x, (0, L - len(x))))
    with wave.open(R + f"public/{S}_clips.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SRA); w.writeframes(np.concatenate(pista).astype(np.int16).tobytes())
    nf, TF = frames(vl), total_frames()
    if nf != TF: sys.exit(f"⛔ vlog.mp4 tiene {nf} cuadros y tenían que ser {TF}")
    print(f"✓ vlog.mp4 {nf} cuadros ({nf / FPS:.1f} s) · {len(segs)} tramos · minuto 1: {sum(1 for s in segs if s['a'] < 60)} cortes · {len(usados)} clips, 0 repetidos")
    hecho("armar", True); print("→ siguiente: python vlog/fab/fab.py ov (cuando avatar haya terminado: esperar avatar)")

# ════════════════════════════════════════ montaje ════════════════════════════════════════
def e_montaje():
    if not os.path.exists(HECHO + "armar"): sys.exit("⛔ primero: armar")
    import equipo
    if os.path.exists(D + "montaje/rehacer.json") and "--de-nuevo" not in sys.argv:
        reh = J(D + "montaje/rehacer.json"); print(f"retomo el montaje: {len(reh)} planos ya marcados (no se vuelve a revisar)")
    else:
        reh = equipo.revisar_montaje()
    print(f"editor de montaje: {len(reh)} planos a rehacer")
    if reh:
        P = leer_planos(); b = J(D + "biblia.json")
        for p in P:
            if p["id"] in reh and reh[p["id"]].get("mejor"):
                p["foto"] = reh[p["id"]]["mejor"][:600]
                for f in (R + f"public/img/{S}/{p['id']}.png", R + f"public/img/{S}/_eq/{p['id']}.png", R + f"public/broll/{S}/{p['id']}.mp4", R + f"public/broll/{S}/_raw/{p['id']}.mp4"):
                    if os.path.exists(f): os.remove(f)
        W(D + "planos.json", P)
        falt = equipo.fotos(P, rondas=3)
        if falt: sys.exit(f"⛔ montaje: faltan fotos {falt[:10]} → corré `fab.py montaje` de nuevo")
        hecho("imgs", True); hecho("clips", False)
        try: e_clips()
        except SystemExit: pass
        e_armar()
    borrar_desde("ov"); hecho("montaje", True, f"{len(reh)} rehechos"); print("FIN montaje → siguiente: python vlog/fab/fab.py ov (si avatar terminó)")

# ════════════════════════════════════════ avatar ════════════════════════════════════════
def ventanas():
    A = J(D + "avatar.json"); segs = tramos(); TOT = total_frames() / FPS; M = 0.12
    win, errs = [], []
    for k, w in enumerate(A):
        a, b = at(w.get("desde", "")), at(w.get("hasta", ""), end=True)
        if a is None: errs.append(f"ventana {k + 1}: no encuentro la frase 'desde': {w.get('desde')!r}")
        if b is None: errs.append(f"ventana {k + 1}: no encuentro la frase 'hasta': {w.get('hasta')!r}")
        if a is None or b is None: continue
        if b <= a: errs.append(f"ventana {k + 1}: 'hasta' está antes que 'desde'"); continue
        win.append({"n": w.get("n", f"V{k + 1}"), "ms": round(max(0, a - M), 3), "me": round(min(TOT, b + M), 3)})
    win.sort(key=lambda w: w["ms"])
    for i in range(1, len(win)):
        if win[i]["ms"] < win[i - 1]["me"]: errs.append(f"ventanas {win[i - 1]['n']} y {win[i]['n']} se pisan")
    vis = 0.0
    for w in win:   # el avatar va por TRAMOS enteros: ≤7 s seguidos y después un tramo de planos; minuto 1 alternado; nunca en los primeros 4 s
        pz, seguido, salto = [], 0.0, False
        for s in [s for s in segs if s["b"] > w["ms"] and s["a"] < w["me"]]:
            a, b = max(w["ms"], s["a"]), min(w["me"], s["b"])
            if a < 4.0 or salto: salto = False; seguido = 0.0; continue
            pz.append([a, b]); seguido += b - a
            if seguido >= (2.0 if a < 60 else 4.5): salto = True
        out = []
        for a, b in pz:
            if out and abs(out[-1][1] - a) < 1e-6: out[-1][1] = b
            else: out.append([a, b])
        w["pieces"] = [[round(a, 3), round(b, 3)] for a, b in out if b - a > 0.06]
        vis += sum(b - a for a, b in w["pieces"])
    pct = 100 * vis / TOT; lo, hi = CANAL.get("avatar_pct", [15, 30])
    if not (lo - 3 <= pct <= hi + 2): errs.append(f"el avatar se ve {pct:.1f} % del video: tiene que ser {lo}-{hi} % (sumá o achicá ventanas)")
    # ⛔ InfiniteTalk degrada pasados ~240 s de reel → el reel lleva SÓLO las piezas visibles (cada una con 0,12 s de margen), no la ventana entera
    pzw = []
    for w in win:
        for j, (a, b) in enumerate(w["pieces"]):
            pzw.append({"n": f"{w['n']}_{j}", "ms": round(max(0, a - M), 3), "me": round(min(TOT, b + M), 3), "pieces": [[a, b]]})
    reel = sum(w["me"] - w["ms"] for w in pzw)
    if reel > 235: errs.append(f"el avatar suma {reel:.0f} s de reel: máximo 235 s (InfiniteTalk se degrada) → achicá ventanas")
    return pzw, pct, errs
def e_avatar():
    if not os.path.exists(HECHO + "voz"): sys.exit("⛔ primero: voz")
    win, pct, errs = ventanas()
    for e in errs: print("⛔", e)
    if errs: sys.exit(2)
    OUT = R + f"out/{S}_avatar/"; os.makedirs(OUT, exist_ok=True)
    if os.path.exists(OUT + "reel.mp4") and os.path.exists(V3 + f"{S}_avwin.json") and J(V3 + f"{S}_avwin.json").get("win") and [w["ms"] for w in J(V3 + f"{S}_avwin.json")["win"]] == [w["ms"] for w in win]:
        print("el reel de RunPod ya existe para estas mismas ventanas: no se gasta otro /run")
    else:
        off, txt = 0.0, ""
        for i, w in enumerate(win):
            f = OUT + f"p{i:03d}.wav"
            sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{w['ms']:.3f}", "-to", f"{w['me']:.3f}", "-i", R + f"public/{S}cut.wav", "-ac", "1", "-ar", "44100", f], quiet=True)
            w["off"] = round(off, 3); off += w["me"] - w["ms"]; txt += f"file '{f}'\n"
        open(OUT + "concat.txt", "w").write(txt)
        sh(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", OUT + "concat.txt", "-c:a", "pcm_s16le", OUT + "reel.wav"], quiet=True)
        W(V3 + f"{S}_avwin.json", {"reel": dur(OUT + "reel.wav"), "win": win})
        print(f"{len(win)} ventanas · reel {dur(OUT + 'reel.wav'):.1f} s · avatar a la vista {pct:.1f} %")
        if os.path.exists(R + f"public/ref_{S}_lugar.png"): shutil.copy(R + f"public/ref_{S}_lugar.png", R + f"public/ref_{S}.png")   # el protagonista en el lugar del episodio
        elif CANAL.get("avatar_ref") and not os.path.exists(R + f"public/ref_{S}.png"): shutil.copy(CANAL["avatar_ref"], R + f"public/ref_{S}.png")   # foto fija del canal
        if not os.path.exists(R + f"public/ref_{S}.png"): sys.exit(f"⛔ falta public/ref_{S}.png (foto del avatar)")
        sh(["node", "vlog/claudio/avatar_run.mjs", "run"])            # UN solo /run (US$0,25), espera hasta COMPLETED
    os.makedirs(R + f"src/{S}", exist_ok=True)
    sh(["python", "vlog/claudio/avatar_post.py"])
    W(R + "src/fab/data/avwin.json", J(R + f"src/{S}/avwin.json"))
    hecho("avatar", True, f"{pct:.1f} %"); print(f"FIN avatar: {len(win)} ventanas, {pct:.1f} %")

# ════════════════════════════════════════ ov ════════════════════════════════════════
LUG = ["puerta", "puerta_patio", "ventana_cocina", "pileta", "heladera", "mesada", "cocina", "comedor", "sala", "ventana_sala", "bano", "inodoro", "rejilla", "dormitorio", "ventana_dormitorio", "lavadero", "garaje", "patio", "desague", "techo"]
TXT = lambda n, req=True: ("txt", n, req)
FOTO = ("img", 0, True); FOTO_OP = ("img", 0, False)
ESQ = {   # componente: {prop: (tipo, límite, obligatoria)} · tipo: txt (≤ límite caracteres), img, num, bool, enum:a|b, list:(min,max,{sub}), obj:{sub}, file
    "FabSiNo": {"title": TXT(24, False), "no": ("obj", {"img": FOTO, "txt": TXT(28)}, True), "si": ("obj", {"img": FOTO, "txt": TXT(28)}, True)},
    "FabPasos": {"title": TXT(26, False), "pasos": ("list", (2, 4, {"img": FOTO, "txt": TXT(22)}), True)},
    "FabDato": {"num": TXT(6), "unidad": TXT(14, False), "txt": TXT(30, False), "img": FOTO_OP, "alerta": ("bool", 0, False)},
    "FabAltura": {"title": TXT(24, False), "max": ("num", (50, 400), False), "marcas": ("list", (1, 4, {"cm": ("num", (0, 400), True), "txt": TXT(26), "alerta": ("bool", 0, False)}), True)},
    "FabCalendario": {"title": TXT(14, False), "cada": ("num", (1, 14), True), "dias": ("num", (14, 31), False), "empieza": ("num", (1, 7), False), "txt": TXT(18, False)},
    "FabPrecio": {"tienda": ("obj", {"txt": TXT(34), "p": TXT(9)}, True), "casa": ("obj", {"txt": TXT(18), "p": TXT(9), "items": ("list", (0, 4, {"t": TXT(16), "p": TXT(7)}), False)}, True), "nota": TXT(34, False)},
    "FabCiclo": {"title": TXT(24, False), "etapas": ("list", (3, 5, {"img": FOTO_OP, "txt": TXT(18)}), True), "centro": TXT(14, False)},
    "FabRuta": {"bicho": ("enum:mosca|cucaracha|raton|hormiga|mosquito", 0, True), "desde": ("obj", {"img": FOTO, "txt": TXT(24)}, True), "hasta": ("obj", {"img": FOTO, "txt": TXT(24)}, True), "corte": TXT(24, False), "n": ("num", (3, 10), False)},
    "FabMapa": {"title": TXT(22, False), "note": TXT(28, False), "pins": ("list", (2, 6, {"lugar": ("enum:" + "|".join(LUG), 0, True), "txt": TXT(14)}), True), "hechos": ("num", (0, 6), False), "foco": ("num", (0, 5), False)},
    "FabAntesDespues": {"antes": FOTO, "despues": FOTO, "a": TXT(10, False), "b": TXT(10, False), "nota": TXT(30, False)},
    "ClVideoRef": {"thumb": ("file", 0, True), "title": TXT(44), "tag": TXT(16, False), "next": ("bool", 0, False)},
    "ClQRCard": {"qr": ("file", 0, True), "cover": ("file", 0, False), "text": TXT(30, False), "kicker": TXT(28, False)},
    "ClBookPage": {"page": ("file", 0, True), "qr": ("file", 0, False), "pageNo": ("num", (1, 300), False), "stamp": TXT(28, False)},
    "ClCheck": {"title": TXT(40), "items": ("list", (2, 4, TXT(40)), True)},
}
def chk_prop(v, spec, donde, errs, imgs):
    tipo, lim, _ = spec
    if tipo == "txt":
        if not isinstance(v, str) or not v.strip(): errs.append(f"{donde}: tiene que ser texto"); return
        if len(v) > lim: errs.append(f"{donde}: \"{v}\" tiene {len(v)} caracteres (máximo {lim})")
        if IDIOMA == "es" and VOSEO.search(v): errs.append(f"{donde}: \"{v}\" tiene voseo/regionalismo ('{VOSEO.search(v).group(0)}'): tú neutro")
    elif tipo == "img":
        if not isinstance(v, str) or not (os.path.exists(R + f"public/img/{S}/{v}.png") or ("/" in v and os.path.exists(R + "public/" + v))): errs.append(f"{donde}: '{v}' no es el id de un plano con foto")
        else: imgs.add(v)
    elif tipo == "file":
        if not isinstance(v, str) or not os.path.exists(R + "public/" + v): errs.append(f"{donde}: no existe public/{v}")
    elif tipo == "num":
        if not isinstance(v, (int, float)) or not (lim[0] <= v <= lim[1]): errs.append(f"{donde}: tiene que ser un número entre {lim[0]} y {lim[1]}")
    elif tipo == "bool":
        if not isinstance(v, bool): errs.append(f"{donde}: true o false")
    elif tipo.startswith("enum:"):
        if v not in tipo[5:].split("|"): errs.append(f"{donde}: '{v}' no vale; opciones: {tipo[5:].replace('|', ', ')}")
    elif tipo == "obj":
        if not isinstance(v, dict): errs.append(f"{donde}: tiene que ser un objeto"); return
        chk_obj(v, lim, donde, errs, imgs)
    elif tipo == "list":
        mn, mx, sub = lim
        if not isinstance(v, list) or not (mn <= len(v) <= mx): errs.append(f"{donde}: lista de {mn} a {mx} elementos"); return
        for j, x in enumerate(v):
            if isinstance(sub, tuple): chk_prop(x, sub, f"{donde}[{j}]", errs, imgs)
            else: chk_obj(x, sub, f"{donde}[{j}]", errs, imgs) if isinstance(x, dict) else errs.append(f"{donde}[{j}]: tiene que ser un objeto")
def chk_obj(o, esq, donde, errs, imgs):
    for k in o:
        if k not in esq: errs.append(f"{donde}: prop desconocida '{k}' (vale: {', '.join(esq)})")
    for k, spec in esq.items():
        if k in o: chk_prop(o[k], spec, f"{donde}.{k}", errs, imgs)
        elif spec[2]: errs.append(f"{donde}: falta '{k}'")
def e_ov():
    for e in ("avatar", "armar", "montaje"):   # ⛔ después del montaje: si no, las camas salen del vlog viejo
        if not os.path.exists(HECHO + e): sys.exit(f"⛔ primero: {e}")
    OV = J(D + "ov.json"); TOT = total_frames() / FPS; AV = J(R + "src/fab/data/avwin.json")["win"]
    errs, out, imgs = [], [], set()
    from collections import Counter
    for k, o in enumerate(OV):
        c, donde = o.get("c"), f"ov[{k}] {o.get('c')}"
        if c not in ESQ: errs.append(f"{donde}: componente desconocido (vale: {', '.join(ESQ)})"); continue
        chk_obj(o.get("props", {}), ESQ[c], donde, errs, imgs)
        t = at(o.get("frase", ""))
        if t is None: errs.append(f"{donde}: no encuentro la frase {o.get('frase')!r} en el guion (copiala EXACTA, 3-8 palabras)"); continue
        d = float(o.get("dur", 0))
        if not (4 <= d <= 12) and not (c == "ClVideoRef" and 1.5 <= d <= 6): errs.append(f"{donde}: dur {d} s (4-12 s)")
        t = max(0.0, t - 0.15)
        if t < 60 and c != "ClVideoRef": errs.append(f"{donde}: cae en el minuto 1 ({t:.1f} s): ahí van sólo cortes y avatar")
        if c == "ClVideoRef" and t < 60 and d > 2.0: errs.append(f"{donde}: en el minuto 1 dura máximo 2,0 s")
        if t + d > TOT - 0.5: errs.append(f"{donde}: se pasa del final del video")
        for w in AV:
            if t < w["me"] and t + d > w["ms"]: errs.append(f"{donde} ({t:.1f}-{t + d:.1f} s) pisa la ventana de avatar {w['n']} ({w['ms']:.1f}-{w['me']:.1f} s): elegí otra frase")
        out.append({"c": c, "from": round(t * FPS), "dur": round(d * FPS), "props": o.get("props", {}), "t": round(t, 2), "frase": o.get("frase")})
    out.sort(key=lambda o: o["from"])
    for a, b in zip(out, out[1:]):
        if b["from"] < a["from"] + a["dur"] + 3 * FPS: errs.append(f"{a['c']} ({a['t']} s) y {b['c']} ({b['t']} s) quedan a menos de 3 s: separalos")
    cnt = Counter(o["c"] for o in out); fab = [c for c in cnt if c.startswith("Fab")]
    nmin = max(8, math.ceil(TOT / 50))
    if not (nmin <= len(out) <= nmin + 8): errs.append(f"hay {len(out)} componentes: para {TOT / 60:.1f} min tienen que ser {nmin}-{nmin + 8} (uno cada ~50 s)")
    if len(fab) < 5: errs.append(f"usá al menos 5 componentes Fab distintos (hay {len(fab)}: {fab})")
    cap = max(3, math.ceil(TOT / 300))   # 3 por cada 15 min de video
    for c, n in cnt.items():
        if c.startswith("Fab") and n > cap: errs.append(f"{c} aparece {n} veces (máximo {cap})")
    for e in errs[:30]: print("⛔", e)
    if errs: hecho("ov", False); sys.exit(2)
    vl = R + f"public/vid/{S}/vlog.mp4"
    for n, o in enumerate(out):
        nf = o["dur"] + 4; o["props"] = {**o["props"], "bed": f"vid/{S}/bed_{n}.mp4#{nf}"}
        sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{o['t']:.3f}", "-i", vl, "-frames:v", str(nf), "-an", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-bf", "0", "-pix_fmt", "yuv420p", R + f"public/vid/{S}/bed_{n}.mp4"], quiet=True)
    W(R + "src/fab/data/ov.json", out)
    W(R + "src/fab/data/meta.json", {"slug": S, "total": total_frames(), "lang": IDIOMA})
    pct = 100 * sum(o["dur"] for o in out) / FPS / TOT
    print(f"✓ {len(out)} componentes ({pct:.1f} % del video), {len(fab)} tipos Fab, ninguno pisa avatar")
    for o in out: print(f"   {o['t']:7.1f} s  {o['c']:16s} {o['dur'] / FPS:4.1f} s  «{o['frase']}»")
    borrar_desde("ov"); hecho("ov", True); print("→ siguiente: python vlog/fab/fab.py editor")

# ════════════════════════════════════════ editor ════════════════════════════════════════
def e_editor():
    if not os.path.exists(HECHO + "ov"): sys.exit("⛔ primero: ov")
    OV = J(R + "src/fab/data/ov.json"); E = D + "editor/"; shutil.rmtree(E, ignore_errors=True); os.makedirs(E)
    B = f"D:/rtmp/fab_{S}_bundle"
    sh(f"npx remotion bundle src/index_fab.tsx --out-dir {B} --public-dir public", quiet=True, capture_output=True)
    lst = []
    for i, o in enumerate(OV):
        if not o["c"].startswith("Fab"): continue
        for tag, fr in (("a", o["from"] + int(o["dur"] * 0.45)), ("b", o["from"] + o["dur"] - 14)):
            p = E + f"ov{i:02d}{tag}.png"
            sh(f"npx remotion still {B} Fab {p} --frame={fr} --gl=angle", quiet=True, capture_output=True, check=False)
            if os.path.exists(p) and o["c"].startswith("Fab"):   # los Cl* son del kit viejo, probados: el juez mira los Fab
                lst.append({"name": f"ov{i:02d}{tag}", "c": o["c"], "props": {k: v for k, v in o["props"].items() if k != "bed"}})
    W(E + "lista.json", lst)
    r = sh(["node", "vlog/fab/editor_juez.mjs", f"vlog/{S}/editor/lista.json", f"vlog/{S}/editor"], check=False, capture_output=True)
    print(r.stdout[-3000:])
    try:
        from PIL import Image
        ims = sorted(glob.glob(E + "ov*a.png")); cols = 4; rows = math.ceil(len(ims) / cols) or 1
        H = Image.new("RGB", (cols * 480, rows * 270), "white")
        for k, p in enumerate(ims): H.paste(Image.open(p).convert("RGB").resize((480, 270)), ((k % cols) * 480, (k // cols) * 270))
        H.save(E + "hoja.jpg", quality=85)
    except Exception as e: print("hoja:", e)
    shutil.rmtree(B, ignore_errors=True)   # el bundle copia public/ entero (GBs): se borra al terminar
    res = J(E + "juez.json", {}); malos = sorted({k[:4] for k, v in res.items() if not v.get("ok")})
    n = int(open(D + ".editor_vueltas").read()) + 1 if os.path.exists(D + ".editor_vueltas") else 1
    open(D + ".editor_vueltas", "w").write(str(n))
    if malos and n < 3:
        for k, v in sorted(res.items()):
            if not v.get("ok"): print(f"   ✗ {OV[int(k[2:4])]['c']} «{OV[int(k[2:4])]['frase']}»: {', '.join(v['fallas'])} — {v.get('motivo', '')[:160]}")
        print(f"⛔ FIN editor (vuelta {n} de 3): arreglá esos componentes en vlog/{S}/ov.json (textos más cortos, otra foto que muestre lo que dice el pie, u otro componente)")
        print("   y corré: python vlog/fab/fab.py ov  →  python vlog/fab/fab.py editor"); hecho("editor", False); sys.exit(2)
    if malos:   # 3ª vuelta: se sacan los que siguen mal (si quedan ≥8) y se aprueba
        idx = sorted(int(m[2:]) for m in malos); keep = [o for i, o in enumerate(OV) if i not in idx]
        if len(keep) >= 8: W(R + "src/fab/data/ov.json", keep); print(f"3ª vuelta: saqué {len(idx)} componentes que seguían mal ({idx}); quedan {len(keep)}")
        else: print(f"3ª vuelta: quedan defectos en {malos} pero no saco más (quedarían <8)")
    hecho("editor", True); print(f"FIN editor: componentes aprobados (hoja: vlog/{S}/editor/hoja.jpg) → siguiente: python vlog/fab/fab.py mix")

# ════════════════════════════════════════ mix ════════════════════════════════════════
def e_mix():
    import numpy as np
    if not os.path.exists(HECHO + "armar"): sys.exit("⛔ primero: armar")
    meta = J(D + "meta.json", {}); AMB, FOLEY = {}, {}; SR = 48000   # ⛔ 9-oct: sin ambientes ni efectos, sólo la voz
    DEF = ["sfx_pro/amb/amb_indoor_generic.flac"]
    for s, fs in list(AMB.items()) + [(s, [f for f, _ in v]) for s, v in FOLEY.items()]:
        for f in fs:
            p = R + "public/" + (f if f.startswith("sfx") else "sfx_pro/foley/" + f)
            if not os.path.exists(p): sys.exit(f"⛔ meta.json: no existe {p.replace(R, '')} (lista: python vlog/fab/fab.py sonidos)")
    def load(f, ch=2):
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
        return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
    rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    def lufs(x):
        p = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], input=x.astype(np.float32).tobytes(), capture_output=True)
        o = p.stderr.decode("utf8", "replace"); return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1]), float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)[-1])
    voice = load(R + f"public/{S}cut.wav", 1)[:, 0]; N = len(voice); V = np.repeat(voice[:, None], 2, 1)
    vdb = rms(voice[np.abs(voice) > 0.02]); hop = 480; n = N // hop
    env = np.sqrt((voice[:n * hop].reshape(n, hop) ** 2).mean(1)); act = np.clip((20 * np.log10(env + 1e-9) - (vdb - 30)) / 20, 0, 1)
    sm = np.zeros_like(act); a = 0
    for i, v in enumerate(act): a = v if v > a else a * 0.985; sm[i] = a
    duck = np.repeat(1 - 0.35 * sm, hop)[:N]; duck = np.pad(duck, (0, max(0, N - len(duck))), constant_values=1)
    secc = []
    for s in J(D + "tramos.json"):
        if secc and secc[-1][0] == s["sec"]: secc[-1][2] = s["b"]
        else: secc.append([s["sec"], s["a"], s["b"]])
    A = np.zeros((N, 2), np.float32); cache = {}
    for sc, s, e in secc:
        i0, i1 = int(s * SR), min(N, int(e * SR)); L = i1 - i0
        if L <= 0: continue
        if not AMB: continue
        bed = np.zeros((L, 2), np.float32); lst = AMB.get(sc) or DEF
        for f in lst:
            if f not in cache: x = load(R + "public/" + f); cache[f] = x / (10 ** (rms(x) / 20)) * 10 ** ((vdb - 24) / 20)
            x = cache[f]; bed += np.tile(x, (int(np.ceil(L / len(x))) + 1, 1))[:L] * (0.8 if len(lst) > 1 else 1)
        fk = min(int(0.8 * SR), L // 3); r = np.linspace(0, 1, fk, dtype=np.float32)[:, None]; bed[:fk] *= r; bed[-fk:] *= r[::-1]; A[i0:i1] += bed
    A *= duck[:, None]; F = np.zeros((N, 2), np.float32)
    for sc, s, e in secc:
        for f, off in FOLEY.get(sc, []):
            x = load(R + "public/" + (f if f.startswith("sfx") else "sfx_pro/foley/" + f)); i0 = int((s + off) * SR)
            if i0 >= N - 100: continue
            L = min(len(x), N - i0); F[i0:i0 + L] += x[:L] * (10 ** ((vdb - 30) / 20)) * duck[i0:i0 + L, None] ** 2
    cw = R + f"public/{S}_clips.wav"
    if os.path.exists(cw):   # ⭐ regla del creador 9-oct: sólo el sonido REAL de los clips, bajo
        c = load(cw, 2)[:N]; c = np.pad(c, ((0, max(0, N - len(c))), (0, 0)))
        lv = c[np.abs(c[:, 0]) > 0.003]
        if len(lv): F += c / (10 ** (rms(lv) / 20)) * 10 ** ((vdb - 22) / 20) * duck[:, None] ** 1.5
    mix = V + A + F; I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
    for _ in range(4):
        I, tp = lufs(mix)
        if tp <= -1.0: break
        pk = 10 ** (-1.3 / 20); mix = np.tanh(mix / pk) * pk; I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
    os.makedirs(R + "out", exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", R + f"out/{S}_mix.wav"], input=mix.astype(np.float32).tobytes(), check=True)
    I, tp = lufs(mix); print(f"✓ mezcla {N / SR:.1f} s · {I:.1f} LUFS · TP {tp:.1f} dB · {len(secc)} secciones · sin música")
    hecho("mix", True); print("→ siguiente: python vlog/fab/fab.py render")
def e_sonidos():
    for d in ("amb", "foley"):
        print(f"[{d}]", " ".join(sorted(os.path.basename(f) for f in glob.glob(R + f"public/sfx_pro/{d}/*.flac"))))

# ════════════════════════════════════════ render ════════════════════════════════════════
def run_id(rama, desde):
    for _ in range(40):
        js = json.loads(out(f'gh run list --branch {rama} -L 5 --json databaseId,createdAt') or "[]")
        js = [r for r in js if r["createdAt"] >= desde]
        if js: return js[0]["databaseId"]
        time.sleep(15)
    sys.exit(f"⛔ no aparece la corrida en {rama}")
def e_render():
    for e in ("editor", "mix"):
        if not os.path.exists(HECHO + e): sys.exit(f"⛔ primero: {e}")
    T = J(R + "src/fab/data/meta.json")["total"]; OV = J(R + "src/fab/data/ov.json")
    imgs = sorted({f"img/{S}/{v}.png" for o in OV for v in re.findall(r"'(?:img|antes|despues)': '([a-z0-9_]+)'", str(o["props"]))})
    files = sorted({v for o in OV for k, v in o["props"].items() if k in ("thumb", "qr", "cover", "page") and isinstance(v, str)})
    open(R + f"_{S}_assets.txt", "w").write("\n".join([f"vid/{S}"] + imgs + files) + "\n")
    shutil.copy(R + f"out/{S}_mix.wav", R + f"public/{S}_fish.wav")
    rama = f"{S}-render"
    sh(f"git add -f src/fab/data src/{S} vlog/{S}/*.json vlog/{S}/guion.txt guiones/{S}.txt guiones/{S}_filmado.txt guiones/{S}_voz.txt _{S}_assets.txt", check=False)
    sh(f'git -c user.email=noreply@local -c user.name=fab commit -qm "{S}: datos del render (fábrica)"', check=False)
    sh(f"git push -q origin HEAD:{rama}")
    t0 = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    os.makedirs(f"D:/rtmp/fab_{S}", exist_ok=True)
    sh(["node", "scripts/farm.mjs", S, "Fab", str(T), "60", f"@_{S}_assets.txt"],
       env={"ENTRY": "src/index_fab.tsx", "FARM_REF": rama, "TAR_DIR": f"D:/rtmp/fab_{S}", "FARM_NOWAIT": "1", "STITCH_RAW": "1"})
    rid = run_id(rama, t0); print("render run", rid, flush=True)
    shutil.rmtree(f"D:/rtmp/fab_{S}", ignore_errors=True)   # el tar ya está subido al release
    sh(f"node scripts/esperar_run.mjs {rid}", check=False)
    js = json.loads(out(f"gh run view {rid} --json jobs") or '{"jobs":[]}')["jobs"]
    caidos = sorted({int(m.group(1)) for j in js if j.get("conclusion") not in ("success", "skipped") for m in [re.search(r"(\d+)", j["name"])] if m and "chunk" in j["name"].lower()})
    if caidos:
        print("chunks caídos:", caidos, "→ re-render parcial", flush=True); t1 = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        sh(f"gh workflow run render.yml --ref {rama} -f slug={S} -f comp_id=Fab -f total_frames={T} -f chunks=60 -f only_chunks={','.join(map(str, caidos))} -f entry=src/index_fab.tsx -f stitch_raw=1")
        rid = run_id(rama, t1); sh(f"node scripts/esperar_run.mjs {rid}", check=False)
    sh(f"gh release upload assets-{S} out/{S}_mix.wav --clobber")
    t2 = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    sh(["bash", "D:/Proyectos/encfin/push.sh", S, str(T), "60"])
    eid = run_id(f"encfin-{S}", t2); print("encfin run", eid, flush=True)
    sh(f"node scripts/esperar_run.mjs {eid}", check=False)
    fin = R + f"out/{S}_final.mp4"
    if os.path.exists(fin): os.remove(fin)
    sh(f"gh release download {S} -p {S}.mp4 -O {fin} --clobber")
    nf = frames(fin)
    if nf != T: sys.exit(f"⛔ el mp4 final tiene {nf} cuadros y tenían que ser {T}")
    r = sh(["python", "vlog/claudio/audit.py", fin], check=False, capture_output=True); print(r.stdout[-2500:])
    hecho("render", r.returncode == 0)
    print(f"FIN render: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/{S}/{S}.mp4 · {nf} cuadros · auditor exit {r.returncode}")

# ════════════════════════════════════════ fondo / esperar / estado ════════════════════════════════════════
def lanzar(et):
    st = LOG + et + ".estado"
    if os.path.exists(st) and J(st).get("fin") is None and time.time() - J(st)["t0"] < 6 * 3600:
        print(f"{et} ya está corriendo (desde {time.strftime('%H:%M', time.localtime(J(st)['t0']))}): python vlog/fab/fab.py esperar {et}"); return
    W(st, {"t0": time.time(), "fin": None})
    lg = open(LOG + et + ".log", "w", encoding="utf8")
    subprocess.Popen([sys.executable, "-u", os.path.abspath(__file__), "_run", et], cwd=R, env=ENV, stdout=lg, stderr=subprocess.STDOUT,
                     creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0) | getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0))
    print(f"▶ {et} lanzada en segundo plano → python vlog/fab/fab.py esperar {et}")
def esperar(et, tope=540):
    st, lg = LOG + et + ".estado", LOG + et + ".log"
    if not os.path.exists(st): sys.exit(f"{et} no se lanzó")
    t = time.time()
    while time.time() - t < tope and J(st).get("fin") is None: time.sleep(10)
    e = J(st); cola = [l for l in open(lg, encoding="utf8", errors="replace").read().split("\n") if l.strip()]
    if e.get("fin") is None:
        print(f"{et} sigue corriendo ({(time.time() - e['t0']) / 60:.0f} min). Últimas líneas:"); print("\n".join("   " + l[:200] for l in cola[-4:]))
        print(f"→ python vlog/fab/fab.py esperar {et}")
    else:
        print(f"{et} TERMINÓ (exit {e['rc']}, {(e['fin'] - e['t0']) / 60:.0f} min). Final del log:"); print("\n".join("   " + l[:220] for l in cola[-14:]))
def e_estado():
    print(f"video: {S}")
    for e in ORDEN:
        st = LOG + e + ".estado"; corr = os.path.exists(st) and J(st).get("fin") is None
        print(f"  {'✓' if os.path.exists(HECHO + e) else ('…' if corr else ' ')} {e:7s} {open(HECHO + e, encoding='utf8').read() if os.path.exists(HECHO + e) else ('corriendo' if corr else '')}")
    sig = next((e for e in ORDEN if not os.path.exists(HECHO + e)), None)
    print("siguiente:", f"python vlog/fab/fab.py {sig}" if sig else "nada: el video está terminado")

ETAPAS = {"guionista": e_guionista, "arte": e_arte, "montaje": e_montaje, "guion": e_guion, "voz": e_voz, "planos": e_planos, "imgs": e_imgs, "clips": e_clips, "armar": e_armar, "avatar": e_avatar,
          "ov": e_ov, "editor": e_editor, "mix": e_mix, "render": e_render, "estado": e_estado, "sonidos": e_sonidos}
if __name__ == "__main__":
    a = sys.argv[1:] or ["estado"]
    if a[0] == "_run":
        et = a[1]; rc = 0
        try: ETAPAS[et]()
        except SystemExit as x: rc = x.code if isinstance(x.code, int) else (0 if x.code is None else 1); print(x.code if not isinstance(x.code, int) else "", flush=True)
        except Exception as x: import traceback; traceback.print_exc(); rc = 1
        st = LOG + et + ".estado"; e = J(st); e.update(fin=time.time(), rc=rc); W(st, e)
    elif a[0] == "esperar": esperar(a[1])
    elif a[0] in FONDO: lanzar(a[0])
    elif a[0] in ETAPAS: ETAPAS[a[0]]()
    else: sys.exit("etapas: " + ", ".join(list(ETAPAS) + ["esperar <etapa>"]))
