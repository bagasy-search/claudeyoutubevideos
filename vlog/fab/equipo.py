# -*- coding: utf-8 -*-
# EL EQUIPO de la fábrica: empleados DeepSeek con UN trabajo chico cada uno (llamadas directas, baratas, sin Claude Code).
#   arte()          director de arte: biblia del video (lugares fijos por sección, hora del día, quién aparece) + fotos MAESTRAS
#   planos()        director de fotografía: los planos de cada sección, con variedad de tamaños, Claudio haciendo, la familia presente
#   revisar_fotos() revisor (visión): hojas de 9 contra la maestra del lugar → qué foto no coincide / tiene texto / cambió de lugar
#   revisar_montaje() editor (visión): hoja de cada minuto armado contra lo que se dice → planos flojos o que no pegan
import json, math, os, re, shutil, subprocess, sys
from comun import R, S, D, V3, J, W, nw
import ds

CANAL = J(R + "vlog/fab/canal/" + J(D + "meta.json", {}).get("canal", "fumigador") + ".json")
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
    lst = V3 + f"{S}_gpt_{abs(hash(items[0]['name'])) % 99999}.json"; W(lst, items)
    subprocess.run(["node", "scripts/gptimg.mjs", lst, f"public/img/{S}/_eq"], cwd=R, env=ENV)

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
                 "(claudio is there whenever he is doing or showing something). Keep a section in ONE place unless the text clearly moves. "
                 "Also choose 'avatar_lugar': the place where Claudio talks to camera in this episode (the main place of the episode). "
                 'JSON: {"secciones": {"SEC": {"lugar": "...", "hora": "...", "gente": ["claudio", ...]}}, "nuevos": {"id": "English description"}, "avatar_lugar": "..."}'),
    }
    b = ds.json_call(sys_p, json.dumps(user, ensure_ascii=False), "arte")
    lug = dict(CANAL["lugares_fijos"]); lug.update(b.get("nuevos", {}))
    for s, _ in secs:
        x = b["secciones"].setdefault(s, {"lugar": "cocina", "hora": "dia", "gente": ["claudio"]})
        if x.get("lugar") not in lug: x["lugar"] = "cocina"
        if x.get("hora") not in HORAS: x["hora"] = "dia"
        x["gente"] = [g for g in x.get("gente", []) if g in CANAL["personajes"]]
    b["lugares"] = lug
    if b.get("avatar_lugar") not in lug: b["avatar_lugar"] = "cocina"
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
    if os.path.exists(cara) and not os.path.exists(R + f"public/ref_{S}_lugar.png"):
        l = b["avatar_lugar"]
        for ronda in range(3):
            agnes_img([{"name": "avatar_ref", "prompt": f"Medium shot of {CANAL['personajes']['claudio']['desc']}, standing in {b['lugares'][l]} {HORAS['dia']}, "
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
def planos(necesidad, extra=1.1):
    b = J(D + "biblia.json"); secs = secciones(); P = []
    sys_p = ("You are the director of photography of a home-vlog YouTube series. You write the SHOTS that illustrate a script section, one "
             "per spoken moment, in order. Every shot is a still photo that will be animated 2 seconds. Reply with JSON only.")
    tandas = []
    for s, txt in secs:   # secciones largas → tandas de ≤18 planos con su pedazo de texto (si no, el modelo se corta)
        n = math.ceil(necesidad.get(s, 0) * extra)
        if n == 0: continue
        k = max(1, math.ceil(n / 18)); tot = sum(len(t) for t in txt); acc, parte, hechos = 0, [], 0
        for t in txt:
            parte.append(t); acc += len(t)
            if len(tandas) < 10_000 and acc >= tot * (len([x for x in tandas if x[0] == s]) + 1) / k and t is not txt[-1]:
                m = round(n * acc / tot) - hechos; tandas.append((s, parte, m)); hechos += m; parte = []
        tandas.append((s, parte, n - hechos))
    for s, txt, n in tandas:
        if n <= 0 or not txt: continue
        x = b["secciones"][s]; gente = {g: CANAL["personajes"][g]["desc"] for g in x["gente"]}
        user = {
            "section": s, "spoken_text_in_order": txt, "place": b["lugares"][x["lugar"]], "time": HORAS[x["hora"]], "people_present": gente,
            "how_many_shots": n,
            "rules": [
                "Shots follow the spoken text in order: each shot shows EXACTLY what is being said at that moment (the object, the action, the result).",
                "Alternate shot sizes: never two of the same size in a row (wide / medium / close detail).",
                "Claudio, when present, is SHOWN DOING the actions with his hands (pouring, filling, hanging, checking with a flashlight), face visible in medium and wide shots. "
                "Mark those shots with \"cara\": true — but only about ONE shot in three: the others are his hands at work, the objects, the place and the results. Family members appear doing ordinary things; children only fully clothed and safe.",
                "In these shots nobody looks at the camera: Claudio and the family are busy with the task, looking at what they do (only the avatar talks to camera).",
                "Write 'foto' in English: only what is visible (who, doing what, where, objects, light). 60-90 words. No camera words (cinematic, close-up shot, bokeh, 4k).",
                "NEVER any paper, sign, label, book, screen, calendar or package where text could be read. No brand names.",
                "'mov' = ONE simple visible movement that lasts 2 seconds (the hand tips the bucket and water pours out). Never 'stays still'.",
                "Everything happens in the given place and time; do not invent other houses or streets.",
            ],
            "json": '{"planos": [{"tam": "general|medio|detalle", "gente": ["claudio"], "cara": true, "foto": "...", "mov": "..."}]}',
        }
        r = ds.json_call(sys_p, json.dumps(user, ensure_ascii=False), "planos", max_tokens=12000)
        for k, p in enumerate(r.get("planos", [])[:n]):
            P.append({"id": "", "sec": s, "lugar": x["lugar"], "hora": x["hora"], "gente": [g for g in p.get("gente", []) if g in gente],
                      "cara": bool(p.get("cara")) and "claudio" in p.get("gente", []), "tam": p.get("tam", ""), "foto": p.get("foto", "")[:700], "mov": p.get("mov", "")[:220]})
        print(f"   {s}: {len([p for p in P if p['sec'] == s])} planos (necesita {necesidad.get(s, 0)})", flush=True)
    for k, p in enumerate(P): p["id"] = f"p{k + 1:03d}"
    return P

def prompt_foto(p, b):
    gente = "; ".join(CANAL["personajes"][g]["desc"] for g in p["gente"] if g != "claudio")
    return (p["foto"] + f" The place is {b['lugares'][p['lugar']]}, {HORAS[p['hora']]}." + (f" People: {gente}." if gente else "")
            + (" No other people." if not p["gente"] else "") + " " + CANAL["estilo"])

# ═══════════════════════ fotos con referencias + revisor ═══════════════════════
def fotos(P, rondas=3):
    b = J(D + "biblia.json"); cara = R + f"public/cara_{S}.png"
    maestras(b)   # si falta alguna maestra (borrada o nueva), se hace antes que las fotos
    for ronda in range(rondas):
        falt = [p for p in P if not os.path.exists(IMG + p["id"] + ".png")]
        print(f"— fotos ronda {ronda + 1}: faltan {len(falt)}", flush=True)
        if not falt: break
        crop = CANAL.get("cara_crop", "")
        con = [p for p in falt if p["cara"] and os.path.exists(crop)]; sin = [p for p in falt if p not in con]
        import threading
        # Claudio HACIENDO = gpt-image-2 low + Batch + crop de cara 128x192 (identidad); el resto = agnes gratis con la maestra del lugar
        hilo = threading.Thread(target=gpt_img, args=([{"name": p["id"], "prompt": prompt_foto(p, b) + " " + CANAL["identidad"], "ref": crop} for p in con],))
        hilo.start()
        agnes_img([{"name": p["id"], "prompt": prompt_foto(p, b), "ref": [maestra_path(p["lugar"], p["hora"])]} for p in sin])
        hilo.join()
        nuevas = [p for p in falt if os.path.exists(IMG + "_eq/" + p["id"] + ".png")]
        malas = revisar_fotos(nuevas, b) if ronda < rondas - 1 else set()
        for p in nuevas:
            if p["id"] not in malas: shutil.copy(IMG + "_eq/" + p["id"] + ".png", IMG + p["id"] + ".png")
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
                          'is deformed; there are extra people. Reply JSON {"malas": [{"n": <number>, "motivo": "..."}]}', [maestra_path(l, h), hoja], "revisor_fotos")
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
    canal = J(D + "meta.json", {}).get("canal", "fumigador")
    biblia = open(R + f"vlog/fab/canal/{canal}_guion.md", encoding="utf8").read()
    ej = "\n\n".join(f"### EJEMPLO ({os.path.basename(f)}, guion real del canal que funcionó)\n" + open(f, encoding="utf8").read()
                     for f in sorted(__import__("glob").glob(R + "vlog/fab/canal/ejemplos/*.txt"))[:2])
    brief = open(D + "brief.md", encoding="utf8").read()
    sys_p = ("Eres el guionista del canal. Escribes guiones de YouTube que retienen de verdad, en la voz exacta del personaje. "
             "Sigues la biblia del canal al pie de la letra. Devuelves SÓLO el guion en el formato pedido, sin comentarios.")
    user = f"{biblia}\n\n{ej}\n\n## EPISODIO A ESCRIBIR\n{brief}\n\nEscribe el guion completo ahora (12.500-13.500 caracteres), en el formato `[SECCION] párrafo` por línea."
    g = ds.text_call(sys_p, user, "guionista", model="deepseek-v4-pro")
    open(D + "guion_v1.txt", "w", encoding="utf8").write(g)
    nota = ds.json_call("Eres un editor de retención de YouTube muy exigente. Reply with JSON only.",
                        f"BIBLIA:\n{biblia}\n\nGUION:\n{g}\n\nEvalúa contra la biblia: gancho de 5 s, misterio abierto, promesa concreta, loops cada 60-90 s, "
                        "especificidad (cantidades, tiempos, lugares), honestidad, voz de Claudio, tú neutro, menciones del Manual, largo. "
                        'JSON {"puntaje": 0-10, "notas": ["cambio concreto 1 (qué línea y cómo)", ...]} con 6-12 notas accionables.', "critico")
    W(D + "guion_notas.json", nota)
    g2 = ds.text_call(sys_p, f"{user}\n\n## TU PRIMER BORRADOR\n{g}\n\n## NOTAS DEL EDITOR (aplicalas todas)\n" + "\n".join(f"- {n}" for n in nota.get("notas", []))
                      + "\n\nDevuelve el guion completo corregido, mismo formato.", "guionista", model="deepseek-v4-pro")
    lineas = [l.strip() for l in g2.split("\n") if re.match(r"^\[[A-Z0-9_]+[^\]]*\]\s*\S", l.strip())]
    open(D + "guion.txt", "w", encoding="utf8").write("\n".join(lineas) + "\n")
    return len(" ".join(lineas)), nota.get("puntaje")
