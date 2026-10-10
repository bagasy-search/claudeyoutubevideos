# -*- coding: utf-8 -*-
# EL EQUIPO de la fábrica: empleados DeepSeek con UN trabajo chico cada uno (llamadas directas, baratas, sin Claude Code).
#   arte()          director de arte: biblia del video (lugares fijos por sección, hora del día, quién aparece) + fotos MAESTRAS
#   planos()        director de fotografía: los planos de cada sección, con variedad de tamaños, Claudio haciendo, la familia presente
#   revisar_fotos() revisor (visión): hojas de 9 contra la maestra del lugar → qué foto no coincide / tiene texto / cambió de lugar
#   revisar_montaje() editor (visión): hoja de cada minuto armado contra lo que se dice → planos flojos o que no pegan
import json, math, os, re, shutil, subprocess, sys
from comun import R, S, D, V3, J, W, nw, at, CANAL, IDIOMA, PROT
import ds

NOM = CANAL["personajes"][PROT]["nombre"]; EL = CANAL.get("pron", "he"); SU = {"he": "his", "she": "her"}.get(EL, "their")
LUG0 = list(CANAL["lugares_fijos"])[0]
REFS = CANAL["dir_refs"]; os.makedirs(REFS, exist_ok=True)
IMG = R + f"public/img/{S}/"; os.makedirs(IMG, exist_ok=True)
ENV = {**os.environ, "AGNES_KEYS_OTRA_PC": os.environ.get("AGNES_KEYS_OTRA_PC", ",")}
HORAS = {"dia": "in daylight", "tarde": "in warm late-afternoon light", "noche": "at night, lit only by a ceiling bulb or a lamp, dark outside the window"}

def secciones():
    out = []
    for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8"):
        if not l.strip(): continue
        m = re.match(r"\[([^|\]]+)[^\]]*\]\s*(.*)", l.strip())
        if out and out[-1][0] == m.group(1): out[-1][1].append(m.group(2))
        else: out.append((m.group(1), [m.group(2)]))
    return out

def agnes_img(items, ident=" "):
    """items [{name,prompt,ref:[...]}] → IMG/<name>.png (agnes-image-2.5-flash, gratis)"""
    if not items: return
    lst = V3 + f"{S}_eq_{abs(hash(items[0]['name'])) % 99999}.json"; W(lst, items)
    subprocess.run(["node", "scripts/agnes_img.mjs", lst, f"public/img/{S}/_eq", "--conc", "9"], cwd=R, env={**ENV, "AGNES_IMG_MODEL": "agnes-image-2.5-flash", "AGNES_IDENT": ident})

def gpt_img(items):
    """gpt-image-2 por scripts/gptimg.mjs (las 4 palancas: low · 1088x608 · Batch · crop 128x192); espera y baja a IMG/_eq"""
    if not items: return
    # ⛔ tope de plata por video (pedido del creador): gpt-image sólo low+Batch ($0,00207 c/u con crop) y NUNCA más de US$0,60 por video
    gastado = J(D + "gpt_gasto.json", {"usd": 0.0})["usd"]; costo = len(items) * 0.00207
    if gastado + costo > 0.60:
        print(f"⛔ gpt-image BLOQUEADO: {len(items)} fotos = US${costo:.2f} + US${gastado:.2f} ya gastado > tope US$0,60 por video"); return
    W(D + "gpt_gasto.json", {"usd": round(gastado + costo, 4)})
    lst = V3 + f"{S}_gpt_{abs(hash(items[0]['name'])) % 99999}.json"; W(lst, items)
    try: subprocess.run(["node", "scripts/gptimg.mjs", lst, f"public/img/{S}/_eq"], cwd=R, env=ENV, timeout=20 * 60)
    except subprocess.TimeoutExpired: print("   gpt Batch tardó más de 20 min: lo que falte sale con agnes en la vuelta siguiente", flush=True)

# ═══════════════════════ director de arte ═══════════════════════
def arte():
    secs = secciones()
    sys_p = ("You are the art director of a YouTube series shot like a real home vlog. You decide WHERE and WHEN each section of the script happens, "
             "so that the house is always the same house. Reply with JSON only.")
    user = {
        "series": CANAL["serie"], "fixed_places": {k: v[:160] for k, v in CANAL["lugares_fijos"].items()},
        "characters": {k: v["nombre"] for k, v in CANAL["personajes"].items()},
        "script_sections": [{"sec": s, "text": " ".join(t)[:1600]} for s, t in secs],
        "task": ("For every section choose: 'lugar' = one of fixed_places if it fits, otherwise a NEW place id (snake_case) with a full English description "
                 "in 'nuevos' (same detail level as fixed_places, a place of THIS family's world: their bathroom, their garden, a neighbour's yard…). "
                 "'hora' = dia | tarde | noche, following what the script says happens. 'gente' = ids of the characters that are physically there "
                 f"({PROT} is there whenever {EL} is doing or showing something). Keep a section in ONE place unless the text clearly moves. "
                 f"Also choose 'avatar_lugar': the place where {NOM} talks to camera in this episode (the main place of the episode). "
                 'JSON: {"secciones": {"SEC": {"lugar": "...", "hora": "...", "gente": ["' + PROT + '", ...]}}, "nuevos": {"id": "English description"}, "avatar_lugar": "..."}'),
    }
    b = ds.json_call(sys_p, json.dumps(user, ensure_ascii=False), "arte")
    lug = dict(CANAL["lugares_fijos"]); lug.update(b.get("nuevos", {}))
    for s, _ in secs:
        x = b["secciones"].setdefault(s, {"lugar": LUG0, "hora": "dia", "gente": [PROT]})
        if x.get("lugar") not in lug: x["lugar"] = LUG0
        if x.get("hora") not in HORAS: x["hora"] = "dia"
        x["gente"] = [g for g in x.get("gente", []) if g in CANAL["personajes"]]
    b["lugares"] = lug
    if b.get("avatar_lugar") not in lug: b["avatar_lugar"] = LUG0
    W(D + "biblia.json", b)
    maestras(b)
    return b

def maestra_path(lugar, hora):
    fijo = lugar in CANAL["lugares_fijos"]
    return f"{REFS}/{lugar}_{hora}.png" if fijo else IMG + f"_maestra_{lugar}_{hora}.png"

def maestras(b):
    """una foto MAESTRA por (lugar, hora): plano general vacío. Las de lugares fijos del canal se guardan y se reusan en cada episodio."""
    pares = sorted({(x["lugar"], x["hora"]) for x in b["secciones"].values()})
    pares.append((b["avatar_lugar"], "dia")) if (b["avatar_lugar"], "dia") not in pares else None
    for ronda in range(3):
        falt = [(l, h) for l, h in pares if not os.path.exists(maestra_path(l, h))]
        if not falt: break
        agnes_img([{"name": f"m_{l}_{h}", "prompt": f"A wide view of {b['lugares'][l]}, {HORAS[h]}. Nobody is in the picture. {CANAL['estilo']}"} for l, h in falt])
        for l, h in falt:
            p = IMG + f"_eq/m_{l}_{h}.png"
            if not os.path.exists(p): continue
            v = ds.vision(f"This photo must show: {b['lugares'][l]}, {HORAS[h]}, with NO people. Is it a believable real photo that matches, with no readable "
                          'text or letters anywhere and no person? Reply JSON {"ok": true|false, "motivo": "..."}', [p], "arte_juez")
            if v.get("ok") is True or ronda == 2: shutil.copy(p, maestra_path(l, h))
            else: print(f"   maestra {l}/{h} rechazada: {v.get('motivo', '')[:120]}")
    # avatar: Claudio hablando a cámara en el lugar principal del episodio (UNA foto, identidad controlada)
    cara = R + f"public/cara_{S}.png"
    if os.path.exists(cara) and not CANAL.get("avatar_ref") and not os.path.exists(R + f"public/ref_{S}_lugar.png"):
        l = b["avatar_lugar"]
        for ronda in range(3):
            agnes_img([{"name": "avatar_ref", "prompt": f"Medium shot of {CANAL['personajes'][PROT]['desc']}, standing in {b['lugares'][l]} {HORAS['dia']}, "
                        "looking straight at the camera and about to speak, relaxed, both hands visible near his chest, the room clearly visible behind him. "
                        + CANAL["estilo"], "ref": [cara, maestra_path(l, "dia")]}], ident=CANAL["identidad"])
            p = IMG + "_eq/avatar_ref.png"
            if not os.path.exists(p): continue
            v = ds.vision('The FIRST photo is the reference face. In the SECOND photo, is the man the same person (face, hair, beard, age), facing the camera, '
                          'with a natural undeformed face and hands, and no readable text? Reply JSON {"misma_persona": 0-10, "ok": true|false, "motivo": "..."}',
                          [cara, p], "arte_juez")
            if (v.get("ok") is True and float(v.get("misma_persona", 0)) >= 7) or ronda == 2:
                shutil.copy(p, R + f"public/ref_{S}_lugar.png"); break
            print(f"   avatar_ref rechazada: {v.get('motivo', '')[:120]}")

# ═══════════════════════ director de fotografía ═══════════════════════
def planos(necesidad=None):
    """UN plano por tramo del video armado, con el texto EXACTO que suena en ese tramo (y el anterior/siguiente como contexto)."""
    import fab
    from comun import palabras, mapear, cortes
    b = J(D + "biblia.json"); segs = fab.tramos(); WM = palabras(); C = cortes()
    tw = [(mapear(w["s"], C), w["w"]) for w in WM]
    for k, sg in enumerate(segs): sg["texto"] = " ".join(w for t, w in tw if sg["a"] <= t < sg["b"]) or "(pausa)"
    sys_p = ("You are the director of photography of a home-vlog YouTube series. For each numbered moment of the video you get the EXACT words "
             "the narrator says during it; you write the ONE still photo (animated 2 seconds) that shows THAT. Reply with JSON only.")
    tandas, cur = [], []
    for k, sg in enumerate(segs):
        if cur and (len(cur) >= 18 or segs[cur[-1]]["sec"] != sg["sec"]): tandas.append(cur); cur = []
        cur.append(k)
    if cur: tandas.append(cur)
    P = []; PLAN = J(D + "plan.json", {})   # lo que el editor jefe decidió para cada sección
    for t in tandas:
        sec = segs[t[0]]["sec"]; x = b["secciones"][sec]; gente = {g: CANAL["personajes"][g]["desc"] for g in x["gente"]}
        momentos = [{"n": i + 1, "seconds": round(segs[k]["b"] - segs[k]["a"], 1), "says": segs[k]["texto"]} for i, k in enumerate(t)]
        user = {
            "section": sec, "context_before": segs[t[0] - 1]["texto"] if t[0] else "", "moments": momentos,
            "place": b["lugares"][x["lugar"]], "time": HORAS[x["hora"]], "people_present": gente,
            "chief_editor_plan": {"video": PLAN.get("vision", ""), "this_section": PLAN.get("secciones", {}).get(sec, "")},
            "rules": [
                "Exactly ONE shot per moment, same order and same numbers. The shot shows what is SAID in that moment (the object, the action, the result). "
                "If the moment is a general statement, show the most concrete visible thing that illustrates it in this house.",
                "Alternate shot sizes: never two of the same size in a row (wide / medium / close detail).",
                f"{NOM} ({PROT}), when present, is SHOWN DOING the actions with {SU} hands (" + CANAL.get("acciones", "pouring, filling, hanging, checking with a flashlight") + "). "
                f"Mark \"cara\": true only when {SU} face is clearly visible, about ONE shot in three; the others are {SU} hands at work, the objects, the place, the results. "
                "Family members appear doing ordinary things; children only fully clothed and safe.",
                "Nobody looks at the camera: everybody is busy with the task (only the avatar talks to camera).",
                "Write 'foto' in English: only what is visible (who, doing what, where, objects, light). 50-80 words. No camera words.",
                "NEVER any paper, sign, label, book, manual page, screen, calendar or package where text could be read. No brand names.",
                "'mov' = ONE simple visible movement that lasts 2 seconds. Never 'stays still'.",
                "Everything happens in the given place and time; do not invent other houses or streets.",
            ],
            "json": '{"planos": [{"n": 1, "tam": "general|medio|detalle", "gente": ["' + PROT + '"], "cara": false, "foto": "...", "mov": "..."}]}',
        }
        r = ds.json_call(sys_p, json.dumps(user, ensure_ascii=False), "planos", max_tokens=12000)
        por_n = {int(q.get("n", 0)): q for q in r.get("planos", []) if isinstance(q, dict)}
        for i, k in enumerate(t):
            q = por_n.get(i + 1) or (r.get("planos", [])[i] if i < len(r.get("planos", [])) else {})
            P.append({"id": "", "tramo": k, "sec": sec, "lugar": x["lugar"], "hora": x["hora"], "gente": [g for g in q.get("gente", []) if g in gente],
                      "cara": bool(q.get("cara")) and PROT in q.get("gente", []), "tam": q.get("tam", ""), "dice": segs[k]["texto"][:200],
                      "foto": (q.get("foto") or f"A concrete visible detail of the house illustrating: {segs[k]['texto']}")[:700], "mov": (q.get("mov") or "a small natural movement in the scene")[:220]})
        print(f"   {sec}: tramos {t[0]}-{t[-1]}", flush=True)
    for k, p in enumerate(P): p["id"] = f"p{k + 1:03d}"
    return P

def prompt_foto(p, b):
    gente = "; ".join(CANAL["personajes"][g]["desc"] for g in p["gente"] if g in CANAL["personajes"])
    return (p["foto"] + f" The place is {b['lugares'][p['lugar']]}, {HORAS[p['hora']]}." + (f" People: {gente}." if gente else "")
            + (" No other people." if not p["gente"] else " Everyone's eyes are on what their hands are doing.") + " " + CANAL["estilo"])

# ═══════════════════════ fotos con referencias + revisor ═══════════════════════
def fotos(P, rondas=3):
    b = J(D + "biblia.json"); cara = R + f"public/cara_{S}.png"
    maestras(b)   # si falta alguna maestra (borrada o nueva), se hace antes que las fotos
    for ronda in range(rondas):
        falt = [p for p in P if not os.path.exists(IMG + p["id"] + ".png")]
        print(f"— fotos ronda {ronda + 1}: faltan {len(falt)}", flush=True)
        if not falt: break
        crop = CANAL.get("cara_crop", "")
        con = [p for p in falt if p["cara"] and os.path.exists(crop)]
        if ronda >= 2: con = []   # gpt se regenera UNA vez como mucho (el revisor no es perfecto y cada vuelta cuesta)
        sin = [p for p in falt if p not in con]   # en la 3ª vuelta lo que falte de Claudio sale con agnes (nunca queda un hueco)
        import threading
        # Claudio HACIENDO = gpt-image-2 low + Batch + crop de cara 128x192 (identidad); el resto = agnes gratis con la maestra del lugar
        hilo = threading.Thread(target=gpt_img, args=([{"name": p["id"], "prompt": prompt_foto(p, b) + " " + CANAL["identidad"], "ref": crop} for p in con],))
        hilo.start()
        # detalle = el objeto llena el cuadro, SIN la maestra (con la maestra agnes copia el plano general y se repite la composición)
        # medio = la maestra sólo da paredes y muebles: otro ángulo y mucho más cerca (si no, agnes copia el plano general vacío)
        PRE = {"detalle": "A close detail where the main object fills most of the frame, seen from very near: ",
               "medio": "Seen from a different spot of the same room as the reference photo and much closer, the reference only shows what the walls, light and furniture look like: "}
        agnes_img([{"name": p["id"], "prompt": PRE.get(p.get("tam"), "") + prompt_foto(p, b),
                    **({} if p.get("tam") == "detalle" else {"ref": [maestra_path(p["lugar"], p["hora"])]})} for p in sin])
        hilo.join()
        nuevas = [p for p in falt if os.path.exists(IMG + "_eq/" + p["id"] + ".png")]
        malas = revisar_fotos(nuevas, b) if ronda < rondas - 1 else set()
        if ronda >= 1: malas -= {p["id"] for p in con}   # 2ª vuelta de gpt: se acepta
        for p in nuevas:
            if p["id"] not in malas: shutil.copy(IMG + "_eq/" + p["id"] + ".png", IMG + p["id"] + ".png")
    falt = [p for p in P if not os.path.exists(IMG + p["id"] + ".png")]
    if falt:   # red de seguridad: lo que falte sale con agnes (sin juez) para que nunca quede un hueco
        agnes_img([{"name": p["id"], "prompt": prompt_foto(p, b)} for p in falt])
        for p in falt:
            if os.path.exists(IMG + "_eq/" + p["id"] + ".png"): shutil.copy(IMG + "_eq/" + p["id"] + ".png", IMG + p["id"] + ".png")
    return [p["id"] for p in P if not os.path.exists(IMG + p["id"] + ".png")]

def revisar_fotos(nuevas, b):
    """hojas de 9 por lugar, con la MAESTRA del lugar como 1ª imagen → ids rechazados"""
    malas = set(); os.makedirs(IMG + "_eq/_hojas", exist_ok=True)
    por = {}
    for p in nuevas: por.setdefault((p["lugar"], p["hora"]), []).append(p)
    for (l, h), ps in por.items():
        for g in range(0, len(ps), 9):
            gr = ps[g:g + 9]; hoja = ds.grilla([IMG + "_eq/" + p["id"] + ".png" for p in gr], IMG + f"_eq/_hojas/{l}_{h}_{g}.jpg")
            desc = "\n".join(f"{i + 1}: {p['foto'][:260]}" for i, p in enumerate(gr))
            v = ds.vision("The FIRST image is the master photo of the place. The SECOND image is a sheet of numbered photos that must all happen in that SAME place "
                          f"({h}). Expected content of each numbered photo:\n{desc}\n\nReject a photo ONLY for a clear problem: it shows something different from its "
                          "description; it is obviously a different place (other walls, other house, a street); there is readable text or fake letters; a body or hand "
                          'is deformed; there are extra people; someone stares straight out of the photo at the viewer; it is nearly the same picture as the master photo (same framing, nothing new). Reply JSON {"malas": [{"n": <number>, "motivo": "..."}]}', [maestra_path(l, h), hoja], "revisor_fotos")
            for m in v.get("malas", []) if isinstance(v, dict) else []:
                try: malas.add(gr[int(m["n"]) - 1]["id"]); print(f"   ✗ {gr[int(m['n']) - 1]['id']}: {str(m.get('motivo', ''))[:110]}")
                except Exception: pass
    return malas

# ═══════════════════════ editor de montaje ═══════════════════════
def revisar_montaje():
    """mira cada minuto del vlog armado (cuadro del medio de cada tramo) contra lo que se dice → planos a rehacer {id: motivo}"""
    from comun import palabras, mapear, cortes
    segs = J(D + "tramos.json"); WM = palabras(); C = cortes(); vl = R + f"public/vid/{S}/vlog.mp4"
    tw = [(mapear(w["s"], C), w["w"]) for w in WM]
    os.makedirs(D + "montaje", exist_ok=True); rehacer = {}
    for g in range(0, len(segs), 9):
        gr = segs[g:g + 9]; fotos_ = []
        for i, s in enumerate(gr):
            f = D + f"montaje/t{g + i:03d}.jpg"; t = (s["a"] + s["b"]) / 2
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", vl, "-frames:v", "1", "-vf", "scale=640:360", f])
            fotos_.append(f)
        hoja = ds.grilla(fotos_, D + f"montaje/h{g:03d}.jpg")
        dicho = "\n".join(f"{i + 1}: «{' '.join(w for t, w in tw if s['a'] <= t < s['b'])[:200]}»" for i, s in enumerate(gr))
        v = ds.vision("You are the editor of a home-vlog YouTube video. The sheet shows one frame of each numbered shot, in order. Next to each number is what the "
                      f"narrator SAYS during that shot:\n{dicho}\n\nFlag a shot ONLY if: it does not show what is being said; it looks like a different house/place "
                      "than its neighbours; it has readable or fake text; it is a near duplicate of the previous shot; or it is visually broken. "
                      'Reply JSON {"malos": [{"n": <number>, "motivo": "...", "mejor": "<what the shot should show, one English sentence>"}]}', [hoja], "editor_montaje")
        for m in v.get("malos", []) if isinstance(v, dict) else []:
            try:
                s = gr[int(m["n"]) - 1]
                for u in s["planos"]: rehacer[u["id"]] = {"motivo": m.get("motivo", ""), "mejor": m.get("mejor", "")}
            except Exception: pass
    W(D + "montaje/rehacer.json", rehacer)
    return rehacer

# ═══════════════════════ equipo de guion: guionista (Pro) → crítico (Flash) → reescritura (Pro) ═══════════════════════
def guion():
    """guionista (Pro) → crítico (Flash) → reescritura (Pro) → si quedó corto, ampliación (Pro). Biblia y ejemplos = los del CANAL."""
    canal = CANAL["id"]; meta = J(D + "meta.json", {}); cps = float(CANAL.get("cps", 14.0))
    obj = int(float(meta.get("minutos", 12)) * 60 * cps); lo, hi = int(obj * 0.97), int(obj * 1.06)
    biblia = open(R + f"vlog/fab/canal/{canal}_guion.md", encoding="utf8").read()
    ejs = sorted(__import__("glob").glob(R + f"vlog/fab/canal/ejemplos/{CANAL.get('ejemplos', '')}*.txt"))[:2]
    brief = open(D + "brief.md", encoding="utf8").read()
    if IDIOMA == "en":
        ej = "\n\n".join(f"### EXAMPLE ({os.path.basename(f)}, a real script of this channel that worked)\n" + open(f, encoding="utf8").read() for f in ejs)
        sys_p = ("You are the channel's scriptwriter. You write YouTube scripts that truly hold viewers, in the exact voice of the character. "
                 "You follow the channel bible to the letter. You return ONLY the script in the requested format, no comments.")
        pide = (f"Write the complete script now, in English: between {lo} and {hi} characters (that is the real length of the video; count it), "
                "one paragraph per line, each line `[SECTION] paragraph` (SECTION = short uppercase id like HOOK, PAIN, STORY, M1, M2, CTA, END).")
        crit = (f"Evaluate against the bible: 5-second hook, open mystery, concrete promise, a loop every 60-90 s, specificity (amounts, times, places), honesty, "
                f"the voice of {NOM}, the book mentions and page numbers exactly as the brief says, forbidden words, length ({lo}-{hi} characters). ")
        notas_t, borr_t, fin_t = "## EDITOR NOTES (apply them all)", "## YOUR FIRST DRAFT", "Return the complete corrected script, same format."
    else:
        ej = "\n\n".join(f"### EJEMPLO ({os.path.basename(f)}, guion real del canal que funcionó)\n" + open(f, encoding="utf8").read() for f in ejs)
        sys_p = ("Eres el guionista del canal. Escribes guiones de YouTube que retienen de verdad, en la voz exacta del personaje. "
                 "Sigues la biblia del canal al pie de la letra. Devuelves SÓLO el guion en el formato pedido, sin comentarios.")
        pide = f"Escribe el guion completo ahora ({lo}-{hi} caracteres), en el formato `[SECCION] párrafo` por línea."
        crit = (f"Evalúa contra la biblia: gancho de 5 s, misterio abierto, promesa concreta, loops cada 60-90 s, especificidad (cantidades, tiempos, lugares), "
                f"honestidad, voz de {NOM}, tú neutro, menciones del Manual, largo ({lo}-{hi} caracteres). ")
        notas_t, borr_t, fin_t = "## NOTAS DEL EDITOR (aplicalas todas)", "## TU PRIMER BORRADOR", "Devuelve el guion completo corregido, mismo formato."
    user = f"{biblia}\n\n{ej}\n\n## EPISODE / EPISODIO\n{brief}\n\n{pide}"
    limpio = lambda g: [l.strip() for l in g.split("\n") if re.match(r"^\[[A-Z0-9_]+[^\]]*\]\s*\S", l.strip())]
    largo = lambda g: len(" ".join(re.sub(r"^\[[^\]]*\]\s*", "", l) for l in limpio(g)))
    g = ds.text_call(sys_p, user, "guionista", model="deepseek-v4-pro")
    open(D + "guion_v1.txt", "w", encoding="utf8").write(g)
    nota = ds.json_call("You are a very demanding YouTube retention editor. Reply with JSON only.",
                        f"BIBLE:\n{biblia}\n\nBRIEF:\n{brief}\n\nSCRIPT ({largo(g)} characters):\n{g}\n\n{crit}"
                        'JSON {"puntaje": 0-10, "notas": ["concrete change 1 (which line and how)", ...]} with 6-12 actionable notes, in the language of the script.', "critico")
    W(D + "guion_notas.json", nota)
    g2 = ds.text_call(sys_p, f"{user}\n\n{borr_t}\n{g}\n\n{notas_t}\n" + "\n".join(f"- {n}" for n in nota.get("notas", []))
                      + f"\n\n{fin_t} ({lo}-{hi})", "guionista", model="deepseek-v4-pro")
    for k in range(3):   # el modelo escribe corto (medido: ~60-80 % de lo pedido): se amplía hasta el largo real del video
        n = largo(g2)
        if n >= lo * 0.95: break
        print(f"   guion corto: {n} de {lo} caracteres → ampliación {k + 1}", flush=True)
        g2 = ds.text_call(sys_p, f"{user}\n\n## CURRENT SCRIPT ({n} characters — TOO SHORT, it must be {lo}-{hi})\n{g2}\n\n"
                          "Return the COMPLETE script again, same format and same order, keeping every good line, but longer: deepen each section "
                          "(more concrete steps, the honest-words part, a short personal memory, the exact why) until it reaches the length. Do not pad with repetition.",
                          "guionista", model="deepseek-v4-pro")
    lineas = limpio(g2)
    open(D + "guion.txt", "w", encoding="utf8").write("\n".join(lineas) + "\n")
    return largo(g2), nota.get("puntaje")

# ═══════════════════════ editor jefe: MEGA-PLAN de la edición (antes de cualquier foto) ═══════════════════════
def _json_de(txt):
    a, b = txt.find("{"), txt.rfind("}")
    try: return json.loads(txt[a:b + 1])
    except Exception: return None

def guion_con_tiempos():
    """[{sec, a, b, texto}] por párrafo, con los segundos del video recortado"""
    from comun import palabras, mapear, cortes
    WM = palabras(); C = cortes()
    paras = [l for l in open(R + f"guiones/{S}.txt", encoding="utf8").read().split("\n") if l.strip()]
    secs = [re.match(r"\[([^|\]]+)", l).group(1) for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
    out, k = [], 0
    for i, p in enumerate(paras):
        n = len(re.findall(r"\S+", p))
        if k + n > len(WM) or n == 0: break
        out.append({"sec": secs[i], "a": round(mapear(WM[k]["s"], C), 1), "b": round(mapear(WM[k + n - 1]["e"], C), 1), "texto": p}); k += n
    return out

SLOTS = ("img", "antes", "despues")
def _fotos_de(props, reg):
    """reemplaza cada {"foto": ...} de un slot de imagen por un id kNNN y lo registra"""
    if isinstance(props, list): return [_fotos_de(x, reg) for x in props]
    if not isinstance(props, dict): return props
    o = {}
    for k, v in props.items():
        if k in SLOTS and isinstance(v, dict) and v.get("foto"):
            i = f"k{len(reg) + 1:03d}"; reg.append({**v, "id": i}); o[k] = i
        else: o[k] = _fotos_de(v, reg)
    return o

def plan():
    import fab
    b = J(D + "biblia.json"); meta = J(D + "meta.json", {})
    G = guion_con_tiempos(); TOT = round(G[-1]["b"], 1)
    fijos = sorted(f for f in os.listdir(IMG) if f.endswith(".jpg"))
    lo, hi = CANAL.get("avatar_pct", [15, 30])
    sys_p = ("You are the chief editor and creative director of a YouTube channel. Before anything is shot, you plan the WHOLE edit of one video: "
             "what every section must look like, where the presenter talks to camera, and every on-screen component with the exact photos it needs. "
             "Think as long as you need; there is no limit. Reply with ONE JSON object only.")
    user = (open(R + "vlog/fab/EDICION.md", encoding="utf8").read() + "\n\n## THE COMPONENT KIT\n" + open(R + "vlog/fab/KIT.md", encoding="utf8").read()
            + f"\n\n## THIS VIDEO\nChannel: {CANAL['serie']}. Language of everything written on screen: {'English' if IDIOMA == 'en' else 'Spanish (neutral, tú)'}. "
            + f"Forbidden on screen: {', '.join(CANAL.get('prohibidas', [])) or 'nothing special'}.\nTitle: {meta.get('titulo', '')}\n"
            + f"Presenter: {CANAL['personajes'][PROT]['desc']} (id '{PROT}').\nPlaces of each section (already decided): "
            + json.dumps({s: {"place": b['lugares'][x['lugar']][:120], "time": x['hora'], "people": x['gente']} for s, x in b['secciones'].items()}, ensure_ascii=False)
            + f"\nFixed files you can use as props (paths): {', '.join('img/' + S + '/' + f for f in fijos)}\n"
            + f"\n## THE SCRIPT WITH TIMES (seconds of the final video, total {TOT} s)\n"
            + "\n".join(f"[{g['sec']}] {g['a']}-{g['b']} s: {g['texto']}" for g in G)
            + "\n\n## WHAT YOU RETURN\n"
            + "{\n \"vision\": \"3-5 sentences: how this video should feel and look\",\n"
            + " \"secciones\": {\"SEC\": \"what the shots of this section must show (concrete objects, actions, the hero shots of the presenter with face, what to avoid)\"},\n"
            + " \"avatar\": [{\"n\": \"short name\", \"desde\": \"EXACT first words of the window (copied from the script)\", \"hasta\": \"EXACT last words\"}],\n"
            + " \"componentes\": [{\"c\": \"Component\", \"frase\": \"3-8 EXACT words of the script where it enters\", \"dur\": 4-12, \"props\": {...}}]\n}\n"
            + f"Rules: avatar windows = the presenter on camera; never in the first 4 s; the visible presenter must be {lo}-{hi} % of the video "
            + f"(the factory shows only ~60 % of each window, cut with photos); windows never overlap; total of all windows ≤ {int(235 / 0.6)} s.\n"
            + f"Components: between {max(8, math.ceil(TOT / 50))} and {max(8, math.ceil(TOT / 50)) + 8}; ≥5 different Fab types; each Fab type at most {max(3, math.ceil(TOT / 300))} times; "
            + "none inside an avatar window; ≥3 s apart; none in minute 1 except a ≤2 s ClVideoRef. "
            + "Every IMAGE prop (img, antes, despues) is NOT an id: write an object {\"foto\": \"exact English description of the photo it needs: who, doing what, which object, where, light; 40-70 words; no text, labels or screens\", "
            + "\"tam\": \"detalle|medio|general\", \"presenter\": true|false, \"face\": true|false}. File props (thumb, qr, cover, page) use the fixed file paths above. "
            + "Texts respect the character limits of the kit exactly.")
    if os.path.exists(D + "plan_raw.json") and "--rehacer" not in sys.argv: P = J(D + "plan_raw.json")   # el plan caro no se repite
    else:
        raw = ds.text_call(sys_p, user, "plan", model="deepseek-v4-pro", max_tokens=48000)
        P = _json_de(raw)
        if not P: open(D + "plan_mal.txt", "w", encoding="utf8").write(raw); sys.exit("⛔ plan: el editor jefe no devolvió JSON (vlog/<slug>/plan_mal.txt)")
        W(D + "plan_raw.json", P)
    # minuto 1 = sólo cortes y avatar: lo que el plan haya puesto ahí se va (salvo una referencia corta)
    P["componentes"] = [o for o in P.get("componentes", []) if not ((at(str(o.get("frase", ""))) or 99) < 60 and not (o.get("c") == "ClVideoRef" and float(o.get("dur", 9)) <= 2))]
    def espaciar(comps):
        """dos componentes a menos de 3 s: el primero se acorta (≥4 s) o, si no alcanza, se va el segundo"""
        cs = sorted([o for o in comps if isinstance(o, dict) and at(str(o.get("frase", ""))) is not None], key=lambda o: at(o["frase"]))
        out = []
        for o in cs:
            if out:
                p_ = out[-1]; ta, tb = at(p_["frase"]), at(o["frase"])
                if tb < ta + float(p_.get("dur", 6)) + 3:
                    if tb - ta - 3 >= 4: p_["dur"] = round(tb - ta - 3, 1)
                    else: continue
            out.append(o)
        return out
    for ronda in range(4):   # el plan se VALIDA con las mismas compuertas de la fábrica y se corrige hasta que pase
        P["componentes"] = espaciar(P.get("componentes", []))
        reg = []; ov = [{**o, "props": _fotos_de(o.get("props", {}), reg)} for o in P["componentes"]]
        W(D + "avatar.json", P.get("avatar", [])); W(D + "ov.json", ov)   # el avatar se adapta solo a los componentes y al tope del canal
        win, pct, ea = fab.ventanas()
        _, eo, _ = fab.validar_ov(ov, win, img=False)
        errs = ea + eo
        print(f"   plan ronda {ronda + 1}: avatar {pct:.1f} % · {len(ov)} componentes · {len(reg)} fotos para componentes · {len(errs)} problemas", flush=True)
        if not errs or ronda == 3: break
        nmin = max(8, math.ceil(TOT / 50))
        if len(ov) < nmin:   # faltan componentes: el editor jefe agrega en los huecos libres (sin componente ni avatar)
            ocup = sorted([(at(o["frase"]), at(o["frase"]) + float(o.get("dur", 6))) for o in P["componentes"]] + [(w["ms"], w["me"]) for w in win])
            huecos, t0 = [], 60.0
            for a_, b_ in ocup:
                if a_ - t0 > 16: huecos.append(f"{t0 + 3:.0f}-{a_ - 3:.0f} s")
                t0 = max(t0, b_)
            if TOT - t0 > 16: huecos.append(f"{t0 + 3:.0f}-{TOT - 2:.0f} s")
            raw = ds.text_call(sys_p, user + "\n\n## YOUR PLAN SO FAR\n" + json.dumps(P["componentes"], ensure_ascii=False)
                               + f"\n\nIt has {len(ov)} components and needs at least {nmin + 2}. Add {nmin + 2 - len(ov)} NEW components, each one entering at a phrase "
                               + f"inside these free gaps (seconds): {', '.join(huecos)}. Choose the moments that most deserve one. "
                               + 'Return ONLY {"nuevos": [...]} with the same format.', "plan_mas", model="deepseek-v4-pro", max_tokens=24000)
            n_ = (_json_de(raw) or {}).get("nuevos", [])
            if isinstance(n_, list): P["componentes"] += [o for o in n_ if isinstance(o, dict)]
            continue
        fix = ds.json_call("You fix an edit plan so that it passes the factory checks. Change ONLY what the errors require; keep everything else identical. Reply with JSON only.",
                           "ERRORS:\n" + "\n".join(errs[:40]) + "\n\nSCRIPT:\n" + "\n".join(f"[{g['sec']}] {g['a']}-{g['b']} s: {g['texto']}" for g in G)
                           + "\n\nCOMPONENTS:\n" + json.dumps(P["componentes"], ensure_ascii=False)
                           + '\n\nReturn {"componentes": [...]} complete and fixed (image props stay as {"foto": ...} objects).', "plan_fix", max_tokens=16000)
        if isinstance(fix, dict) and isinstance(fix.get("componentes"), list) and fix["componentes"]: P["componentes"] = fix["componentes"]
        else: print("   (el corrector no devolvió componentes)", flush=True)
    W(D + "plan_raw.json", P)
    # fotos de los componentes: un plano más cada una, en el lugar/hora de la sección donde entra el componente
    segs = fab.tramos(); fotos_c = []
    for f in reg:
        t = next((at(o["frase"]) for o in ov if f["id"] in json.dumps(o["props"])), 0) or 0
        sec = next((s["sec"] for s in segs if s["a"] <= t < s["b"]), segs[-1]["sec"]); bs = b["secciones"].get(sec, {"lugar": list(b["lugares"])[0], "hora": "dia"})
        con = bool(f.get("presenter"))
        fotos_c.append({"id": f["id"], "sec": sec, "lugar": bs["lugar"], "hora": bs["hora"], "gente": [PROT] if con else [], "cara": con and bool(f.get("face")),
                        "tam": f.get("tam", "detalle"), "foto": str(f["foto"])[:700], "mov": "", "dice": ""})
    W(D + "comp_fotos.json", fotos_c); W(D + "ov.json", ov)
    W(D + "plan.json", {"vision": P.get("vision", ""), "secciones": P.get("secciones", {}), "problemas": errs})
    return len(P.get("avatar", [])), pct, len(ov), len(fotos_c), errs
