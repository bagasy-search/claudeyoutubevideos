# build_plans.py — beats.json + tramos.json → vlog/tfbcola/S*.json (planes de agnes_vlog) + details.json (keyframe)
import json, os, math
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '../..')).replace('\\', '/')
BJ = json.load(open(os.path.join(HERE, 'beats.json'), encoding='utf8'))
TR = json.load(open(os.path.join(HERE, 'tramos.json'), encoding='utf8'))
VL = ROOT + '/out/vlog/'
FACE = ROOT + '/public/ref_tfbcola_face_clip.png'; REF = ROOT + '/public/ref_tfbcola.png'; W = ROOT + '/public/ref_vecino.png'  # cara de 256 px o más: agnes rechaza refs más chicas

LIGHT = ("This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. "
 "The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. "
 "The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. "
 "Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. "
 "Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed.")
LOOK = ("Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, "
 "only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music.")
SETS = {
 'taller': ("The place is a real, lived-in home garage-workshop in a working-class Latin American house: the wide metal roll-up door is open on the left to a quiet street in bright daylight, "
            "a plain fluorescent tube on the ceiling, concrete floor with old stains and sawdust, a heavy wooden workbench with a vise, clamps and hand tools, a pegboard with hanging tools, "
            "shelves with paint tins and glass jars, stacked plastic buckets, a bicycle leaning on the painted brick wall. "
            "Light: plenty of daylight comes in through the wide open roll-up door on the left, plus the fluorescent tube overhead; the workbench area is well lit."),
 'cocina': ("The place is the kitchen of a modest, tidy middle-class Latin American home: white tiled wall, a four-burner gas stove, a steel sink under a big window on the left, "
            "a wooden shelf with jars and cups, a dish rack, a small table with a plastic tablecloth, the edge of a fridge with magnets. "
            "Light: bright daylight from the big window over the sink on the left plus the ceiling light; the counter is well lit."),
 'patio': ("The place is the back patio of a Latin American house: red clay floor tiles, whitewashed walls with potted plants, a clothesline with a faded towel, the open back door of the house. "
           "Light: plain bright overcast daylight over the whole patio."),
}
WHO = ("The presenter is the man of the reference photos — about 50, black curly hair, short greying beard, the face of the last input image — dressed in a worn olive-green work shirt "
       "with the sleeves rolled up to the elbows, stained with paint and dust, and a worn brown leather apron over it.")
NB = ("The neighbour is exactly the man of the second input image: about 65, stout, bald on top with grey hair on the sides, thick grey moustache, a light-blue short-sleeved checked shirt "
      "with a pen in the pocket, reading glasses hanging on a cord around his neck.")
NB_WHO = "the neighbour, a stout man of about 65 with a thick grey moustache and a light-blue checked shirt (the fourth reference image)"
NB_VOICE = "in Spanish with a neutral Latin American accent, the gruff, amused voice of a 65-year-old man"
KEEP = " He still wears the same worn olive-green work shirt with rolled sleeves and the brown leather apron."
HANDS = ("The hands belong to a man of about 50: real hands with the wrists and forearms attached, entering the frame from the bottom edge, olive-green work shirt sleeves rolled up. ")
DET_SET = {
 'cocina': "It happens on the counter or stove of a modest home kitchen with white tiles, bright daylight from the window on the left and a ceiling light.",
 'taller': "It happens on the scratched wooden workbench of a home garage-workshop, bright daylight from the open roll-up door on the left and a fluorescent tube overhead, tins and tools in the background.",
 'patio': "It happens on the back patio of a house, red clay tiles, plain bright overcast daylight.",
}
KIT = ('pot', 'stove', 'sink', 'tap', 'colander', 'milk', 'carton', 'whey', 'curd')
def det_set(txt, scene_set):
    if 'workbench' in txt: return DET_SET['taller']
    if any(w in txt for w in KIT) and 'jar' not in txt: return DET_SET['cocina']
    return DET_SET[scene_set]
def hands(txt): return HANDS if any(w in txt.lower() for w in ('hand', 'stirr', 'brush', 'pour', 'spoon', 'stick', 'tying', 'clamp', 'finger')) else ''

T0, C0, P0 = VL + 'base_taller.png', VL + 'base_cocina.png', VL + 'base_patio.png'
BASE = {**{s: T0 for s in ('S1', 'S4', 'S7', 'S8', 'S9', 'S9m', 'S9b', 'S11', 'S12', 'S13')}, 'S5': C0, 'S6': C0, 'S10b': P0}
SKIP = {'b016'}  # hook: sacado para que el loop caiga antes del seg 60 y la prueba antes del min 2
def par(n):  # padre del ancla n: cadenas de ≤3 desde K0 (3 rondas de Batch en vez de 15; el set es fijo y cada prompt describe la pose entera)
    return f'K{n-1}' if (n - 1) % 3 else 'K0'
tr_by_beat = {}
for t in TR: tr_by_beat.setdefault(t['beat'], []).append(t)
plans, details = {}, []
for sc in BJ['scenes']:
    sid, sset, nb = sc['id'], sc['set'], sc['nb']
    d = VL + sid + '/'; cl = d + 'clips/'
    base = BASE.get(sid)
    if base:
        k0p = (f"The same place as the first image — the very same room, same walls, same door, same furniture and shelves, same light — seen from a slightly different spot a little later. {WHO} "
               + (f"{NB} " if nb else "") + sc['k0'] + " Medium shot from the waist up, the scene fills the frame.")
    else:
        k0p = (f"Place this same man in a completely new place; nothing from the first image's background remains. {SETS[sset]} {WHO} "
               + (f"{NB} " if nb else "") + sc['k0'] + " Medium shot from the waist up, the scene fills the frame.")
    anchors = [{'id': 'K0', 'from': ['k0'] + (['W'] if nb else []), 'prompt': k0p}]
    clips = []; n = 0
    for b in [b for b in BJ['beats'] if b['scene'] == sid and b['id'] not in SKIP]:
        if b['type'] == 'L': continue
        if b['type'] in 'DX':
            trs = tr_by_beat.get(b['id'], [])
            aud = trs[0] if trs else None
            T = b['secs'] if b['type'] == 'X' else min(12, max(4, math.ceil(sum(t['len'] for t in trs) + 0.15)))
            p1 = f"Close view, the action fills the frame. {b['d1']} {hands(b['d1'])}{det_set(b['d1'], sset)} {LIGHT}"
            p2 = f"Same photo, same place, same framing, one moment later: {b['d2']} Everything else identical. {LIGHT}"
            kp = (f"Close-up detail shot, one continuous take from the first frame to the last frame: {b['d1']} It slowly becomes: {b['d2']} "
                  + ("Slow motion. " if b['type'] == 'X' else "") + "Real hands and real materials, natural physics, no text, no faces, no cuts. "
                  + LOOK.replace('; no music.', '.') + " Only the real sound of the action and the room, no speech, no music.")
            details.append({'id': b['id'], 'scene': sid, 'cl': cl, 'T': T, 'own': b['type'] == 'X', 'p1': p1, 'p2': p2, 'kprompt': kp})
            c = {'id': b['id'], 'a': f'K{n}', 'b': f'K{n}', 'text': b.get('text', ''), 'action': 'DETAIL', 'detail': True}
            if b['type'] == 'D':
                if len(trs) != 1: raise SystemExit(f'detalle {b["id"]} partido en {len(trs)} tramos: acortalo')
                c['audio'] = aud['audio']
            clips.append(c); continue
        if b['type'] == 'V':
            n += 1
            anchors.append({'id': f'K{n}', 'from': [par(n), 'W'], 'prompt': 'Same photo, same place, same framing, a few seconds later: ' + b['K'] + '.' + KEEP + ' ' + NB})
            clips.append({'id': b['id'], 'a': f'K{n-1}', 'b': f'K{n}', 'secs': b['secs'], 'line': b['line'], 'who': NB_WHO, 'voice': NB_VOICE, 'refs': ['W'], 'text': b['line'], 'action': b['A']})
            continue
        trs = tr_by_beat[b['id']]
        for t in trs:
            n += 1
            kp = ('he is halfway through this action: ' + b['A']) if (t['npieces'] == 2 and t['piece'] == 0) else b['K']
            anchors.append({'id': f'K{n}', 'from': [par(n)] + (['W'] if nb else []),
                            'prompt': 'Same photo, same place, same framing, a few seconds later: ' + kp + '.' + KEEP + ((' ' + NB + ' The neighbour stays where he is, listening, silent.') if nb else '')})
            act = b['A'] + '.' + (' The neighbour (fourth reference image) stays where he is, listening, silent.' if nb else '')
            clips.append({'id': t['id'], 'a': f'K{n-1}', 'b': f'K{n}', 'audio': t['audio'], 'text': t['text'], 'action': act, **({'refs': ['W']} if nb else {})})
    if sid == 'S3':  # b026 salió 3 veces con labios de otra frase (acción de 3 pasos): acción simple
        for c in clips:
            if c['id'] == 'b026': c['action'] = 'he talks to the lens with small natural gestures of his right hand holding the flat brush, the glued boards resting on the bench in front of him, a simple calm movement.'
    if sid == 'S7':  # la hoja que muestra = la FICHA real (se pasa como ref: se ve la página en su mano)
        for a in anchors:
            if a['id'] in ('K1', 'K2'):
                a['from'] = a['from'] + ['LAM']
                a['prompt'] += ' The sheet of paper he holds is exactly the printed page of the second input image (a cream page with a red title and small drawings), facing the viewer, slightly curved in his hands.'
    plans[sid] = {'dir': d, 'face': FACE, 'k0_from': base or REF, 'extra': {'W': W, 'LAM': ROOT + '/vlog/tfbcola/lamina/v_0.png'}, 'lang': 'es', 'light': LIGHT, 'look': LOOK, 'anchors': anchors, 'clips': clips, 'out': d + f'vlog_{sid}.mp4'}
    os.makedirs(cl, exist_ok=True)
    json.dump(plans[sid], open(os.path.join(HERE, f'{sid}.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
json.dump(details, open(os.path.join(HERE, 'details.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print({k: (len(p['anchors']), len(p['clips'])) for k, p in plans.items()})
print('clips', sum(len(p['clips']) for p in plans.values()), 'anclas', sum(len(p['anchors']) for p in plans.values()), 'detalles', len(details))
