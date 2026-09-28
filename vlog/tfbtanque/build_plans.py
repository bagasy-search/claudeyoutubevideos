# DIRECTOR → planes de agnes_vlog para tfbtanque.
# - SETS: 3 fotos base (patio con el tanque parado perdiendo agua, patio con el tanque acostado, taller) desde la ref.
# - Por escena: K0 desde la foto base de su set; cada tramo T = clip K(n-1)→K(n) (anclas en ESTRELLA desde K0: sin deriva);
#   D/F = plano detalle keyframe con su par de anclas propias (D1 desde K0 sin cara, D2 desde D1);
#   V = el vecino (contraplano) con su par de anclas propias (Vs/Ve desde K0 + cara del vecino), audio propio.
#   Detalles y vecino son CORTES: el tramo T siguiente arranca de la última ancla del presentador (continúa su toma).
# - L (lámina) no genera clips: parte la escena y queda como segmento aparte en order.json.
# uso: python vlog/tfbtanque/build_plans.py
import json, os, math, re, subprocess
import numpy as np, soundfile as sf
R = 'D:/Proyectos/video2-wt/tfbtanque/'
VL = R + 'out/vlog/'; PL = R + 'vlog/tfbtanque/plans/'; os.makedirs(PL, exist_ok=True)
T = json.load(open(R + 'vlog/tfbtanque/tramos.json', encoding='utf8'))
FACE = R + 'public/ref_tfbtanque_face_hd.png'; FACE_ANC = R + 'public/ref_tfbtanque_face.png'; VFACE = R + 'public/ref_vecino_face.png'; REF = R + 'public/ref_tfbtanque.png'
LIGHT = ("This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed.")
LOOK = ("Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music.")
WEAR = "He is the man of the reference face — same face, same dark curly hair, same short salt-and-pepper beard — wearing a faded olive-green work shirt with the sleeves rolled up to the elbows, stained with paint and dust, and a worn brown leather apron over it; dark work trousers."
NB = "a heavy-set man about 65, bald on top with short grey hair on the sides, a thick grey moustache, a light-blue short-sleeved checked shirt with a pen in the breast pocket, reading glasses hanging on a cord around his neck"
PATIO = ("The place is the small backyard patio of a modest working-class house in Latin America: cracked grey concrete floor with old stains, a faded pale-yellow painted block wall with damp marks at the bottom, a chest-high low wall on the right that separates the neighbour's patio, with a potted geranium on top; a clothesline with two faded towels, a coiled green garden hose, a red plastic bucket, a wooden fruit crate with a few tools on it, the back door of the house half open.")
TANK = "a cylindrical black ribbed plastic water tank about 1.2 m tall (horizontal ribs all around, a large round black screw lid on top, a small white outlet fitting near the bottom)"
TALLER = ("The place is a real, messy home garage-workshop in a working-class house in Latin America: concrete floor with old stains and dust, a long wooden workbench covered in tools, tins, rags and offcuts, a pegboard with hanging tools and a printed sheet pinned on it, stacked plastic buckets, a bicycle leaning on the wall, an old grey fibre-cement water tank standing in a corner, bare painted brick walls with damp patches, the wide garage door open to the street on the left.")
L_PATIO = "Light of this place: flat overcast daylight from the open sky over the patio, soft and even; the wall facing the sky a little brighter, the corner under the eave dimmer."
L_TALLER = "Light of this place: grey daylight coming in through the wide-open garage door on the left, plus one plain fluorescent tube on the ceiling; the side near the door brighter and cooler, the back corners dimmer."
SETS = {  # anclas del plan SETS (ids K0/K1/K2 para que el runner resuelva dependencias)
 'K0': {'from': ['k0'], 'prompt': f"{PATIO} Against the back wall stands {TANK} on a low square concrete base; a hard thin jet of water shoots sideways out of a short vertical crack in the lower third of the tank and splashes on the concrete, a dark wet patch spreading on the floor. {WEAR} He stands beside the tank, half turned, looking down at the leak with one hand on his hip, frowning. Medium-wide shot, the whole tank and the low wall visible. {L_PATIO}"},
 'K1': {'from': ['K0'], 'prompt': f"Same patio, same wall, same low wall, same objects, later the same day: the black tank has been emptied and is now lying on its side on an old folded grey blanket on the concrete floor in front of its empty concrete base, its round top opening facing left, the crack facing up; beside it, on the wooden fruit crate used as a small table, a soldering iron on a metal stand, a small roll of metal mosquito mesh, scissors, a rag, a small plastic bottle of alcohol and a cordless drill; an orange extension cord runs from the back door. {WEAR} He kneels on the blanket beside the tank looking at the crack. {L_PATIO}"},
 'K2': {'from': ['k0'], 'prompt': f"{TALLER} On the workbench: a broken piece of black plastic tank, a white plastic water jug, a glass jar full of coloured bottle caps, a soldering iron on a metal stand, a heat gun, a small roll of metal mesh. {WEAR} He stands at the workbench facing the camera, one hand resting on the bench. Medium shot from the waist up. {L_TALLER}"},
}
SET_OF = {'S0': 'K0', 'S1': 'K1', 'S2': 'K0', 'S3': 'K2', 'S4': 'K2', 'S5': 'K2', 'S6': 'K2', 'S7': 'K0', 'S7B': 'K1', 'S8': 'K1', 'S9': 'K1', 'S10': 'K1', 'S11': 'K1', 'S11B': 'K0', 'S12': 'K2', 'S13': 'K2'}
LIGHT_OF = {k: (L_TALLER if v == 'K2' else L_PATIO) for k, v in SET_OF.items()}
STATE0 = {  # cómo arranca cada escena (K0 = la foto base + esto)
 'S0': "The tank is standing on its concrete base, leaking a hard jet of water from the crack. He stands next to the tank turned toward the leak.",
 'S1': "The tank is lying on its side on the blanket, empty, the crack facing up. He kneels next to it.",
 'S2': "The tank is standing on its base, leaking a thin trickle from the crack. The neighbour is not in the frame yet. He stands between the tank and the low wall.",
 'S3': "He walks in through the garage door carrying a broken piece of black tank plastic.",
 'S4': "He stands at the workbench, with long white plastic strips cut from a jug lying on the bench.",
 'S5': "He stands at the workbench next to the soldering iron on its stand and a heat gun.",
 'S6': "He stands at the workbench; a printed sheet of paper is pinned on the pegboard behind him.",
 'S7': "The tank is standing on its base, full, a small wet leak on the crack. He stands next to it holding a thick black marker.",
 'S7B': "The tank is lying on its side on the blanket, empty; on its upper side a thin irregular hairline crack about a hand long, with one small round black marker dot just beyond each end of the crack (no other marks). He kneels next to it.",
 'S8': "The tank is lying on its side on the blanket; on its upper side the hand-long irregular crack has been scraped around (a satiny darker patch two fingers wide), with a tiny round drilled hole just beyond each end. He kneels next to it holding a pencil-type soldering iron with a flat tip, its cable running to the orange extension cord.",
 'S9': "The tank is lying on its side on the blanket; on its upper side the hand-long crack is now filled with a slightly raised, glossy seam of melted black plastic. He kneels next to it holding a small rectangle of aluminium mosquito mesh about the size of a paperback book, and the pencil-type soldering iron rests on its stand on the crate.",
 'S10': "The tank is lying on its side on the blanket with a smooth black patch over the crack. He kneels near its round top opening holding a flashlight.",
 'S11': "The tank is lying on its side on the blanket, with a smooth black patch over the crack; its low square concrete base is empty next to it. He crouches by the empty concrete base.",
 'S11B': "The tank is standing on its concrete base with a smooth black patch where the crack was, no leak at all, the floor dry. The neighbour is not in the frame.",
 'S12': "He leans on the workbench, the broken piece of black tank plastic and the jar of bottle caps in front of him.",
 'S13': "He stands at the workbench; on it lies a flat black plastic scrap the size of a book with three different things stuck on it side by side: a thick rounded bead of light-grey silicone sealant, a round translucent amber blob of hardened epoxy glue, and a short strip of shiny silver duct tape.",
}
NB_SCENES = {'S0', 'S2', 'S11B', 'S13'}
WHO = "the neighbour, " + NB + " (the fourth reference image is his face)"
VOICE = "in Spanish with a neutral Latin American accent, the gruff, amused voice of a 65-year-old man"
NBREF = " The neighbour is exactly the man of the second input image (copy his face): " + NB + "."
x, sr = sf.read(R + 'public/tfbtanque.wav', dtype='float32')
def emin(t0, t1):
    a, b = int(t0 * sr), int(t1 * sr); seg = x[a:b] if x.ndim == 1 else x[a:b].mean(1); hop = int(0.01 * sr)
    e = [np.mean(seg[k * hop:(k + 1) * hop] ** 2) for k in range(len(seg) // hop)]; return t0 + (int(np.argmin(e)) + 0.5) * 0.01
# --- reorden (CTA del 60 %: nace de la espera del enfriado) y recorte de S12_14 ("Y ahora, lo que te prometí" se va)
ids = [t['id'] for t in T]; byid = {t['id']: t for t in T}
mov = ['S12_12', 'S12_13a', 'S12_13b', 'S12_14']
for m in mov: ids.remove(m)
i = ids.index('S10_08') + 1; ids[i:i] = mov
t14 = byid['S12_14']; cut = emin(865.3, 865.9); t14['b'] = round(cut, 3); t14['len'] = round(cut - t14['a'], 3)
t14['text'] = t14['text_piece'] = 'Si te sirve, el enlace está abajo.'
sf.write(t14['audio'], x[int(t14['a'] * sr):int(cut * sr)], sr, subtype='PCM_16')
for m in mov: byid[m]['scene'] = 'S10'
seq = [byid[i] for i in ids]
# --- segmentos: partir en escenas (y en L)
segs = []
for t in seq:
    key = ('L' if t['type'] == 'L' else t['scene'])
    if not segs or segs[-1]['key'] != key: segs.append({'key': key, 'scene': t['scene'], 'items': []})
    segs[-1]['items'].append(t)
names = {}
for s in segs:
    n = names.get(s['key'], 0); names[s['key']] = n + 1
    s['name'] = s['key'] if s['key'] != 'L' else 'LAMINA'
    if n: s['name'] += 'b'
def dsplit(a):
    p = a.split(' >> '); return (p[0], p[1] if len(p) > 1 else p[0])
order = []; tot = {'anc': 0, 'clips': 0}
sets_plan = {'dir': VL + 'SETS/', 'face': FACE, 'face_anc': FACE_ANC, 'k0_from': REF, 'light': LIGHT, 'look': LOOK, 'prev_box': '384x216', 'lang': 'es',
             'anchors': [{'id': k, 'from': v['from'], 'prompt': v['prompt']} for k, v in SETS.items()], 'clips': [], 'out': VL + 'SETS/sets.mp4'}
json.dump(sets_plan, open(PL + 'SETS.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
for s in segs:
    if s['key'] == 'L':
        order.append({'seg': s['name'], 'type': 'lamina', 'tramos': [{'id': t['id'], 'audio': t['audio'], 'len': t['len'], 'text': t.get('text_piece', t['text'])} for t in s['items']]}); continue
    sc = s['scene']; name = s['name']; d = VL + name + '/'
    k0 = VL + 'SETS/anc/' + SET_OF[sc] + '.png'
    first = next((t for t in s['items'] if t['type'] == 'T'), None)
    LAMREF = sc == 'S6'
    anchors = [{'id': 'K0', 'from': ['k0'] + (['LAM'] if LAMREF else []), 'prompt': f"Same place as the first image, same objects, same light. {STATE0[sc]} " + (f"He is at the start of this moment: {first['action']}." if first else '') + f" {WEAR} {LIGHT_OF[sc]}"}]
    clips = []; n = 0; last = 'K0'; nd = 0; nv = 0
    for t in s['items']:
        act = t['action']; txt = t.get('text_piece', t['text'])
        if t['type'] == 'T':
            later = act.lower().startswith('later:')
            a = last
            if later:
                anchors.append({'id': f'K{n+1}s', 'from': ['K0'], 'prompt': f"Same place, same framing, some time later: {act[6:].strip()}; this is the moment just before, he is about to start the movement. {WEAR}"})
                a = f'K{n+1}s'
            n += 1
            half = t.get('npieces', 1) == 2 and t.get('piece') == 0
            pose = ('he is halfway through this action: ' if half else 'he is at the end of this moment: ') + act
            nbq = sc in NB_SCENES and any(u['type'] == 'V' for u in s['items'][:s['items'].index(t)])
            anchors.append({'id': f'K{n}', 'from': ['K0'] + (['LAM'] if LAMREF else []), 'prompt': f"Same photo, same place, same framing, a few seconds later: {pose}. {WEAR}" + (" The printed sheet in his hands is exactly the second input image: a cream-coloured reference card with a big brown title, numbered steps and a small diagram, seen at an angle, its text small." if LAMREF else '')})
            clips.append({'id': t['id'], 'a': a, 'b': f'K{n}', 'audio': t['audio'], 'text': txt,
                          'action': act.replace('later:', '').strip() + '. He speaks naturally to the friend holding the camera, with small natural gestures.'})
            last = f'K{n}'
        elif t['type'] in 'DF':
            nd += 1; d1, d2 = dsplit(act); A1, A2 = f'D{nd}a', f'D{nd}b'
            anchors.append({'id': A1, 'from': ['K0'], 'noface': True, 'prompt': f"EXTREME CLOSE-UP of the hands and the object only, filling the frame, in the same place and light as the first image: {d1}. Any forearm enters from the edge of the frame and wears the rolled-up olive-green work shirt sleeve. No face in the frame."})
            anchors.append({'id': A2, 'from': [A1], 'noface': True, 'prompt': f"Same close-up, same framing, same light, a few seconds later: {d2}. No face in the frame."})
            c = {'id': t['id'], 'a': A1, 'b': A2, 'detail': True, 'text': txt, 'd1': d1, 'd2': d2}
            if t['type'] == 'D': c['audio'] = t['audio']
            else: c.update({'secs': 4, 'show': 3.0, 'sound': 'the loud hiss and splash of the water jet hitting the concrete'})
            clips.append(c)
        elif t['type'] == 'V':
            nv += 1; A1, A2 = f'V{nv}a', f'V{nv}b'
            anchors.append({'id': A1, 'from': ['K0', 'V'], 'prompt': f"Same place and light as the first image, reverse angle toward the neighbour: {act}. He is at the start of his line, mouth closed. The presenter is visible only from behind or at the edge of the frame. {NBREF}"})
            anchors.append({'id': A2, 'from': [A1, 'V'], 'prompt': f"Same photo, same framing, a few seconds later: the neighbour finishes talking, mouth closed, same pose and expression. {NBREF}"})
            secs = min(12, max(4, math.ceil(len(t['text']) / 12 + 1.5)))
            clips.append({'id': t['id'], 'a': A1, 'b': A2, 'secs': secs, 'line': t['text'], 'text': t['text'], 'who': WHO, 'voice': VOICE, 'refs': ['V'],
                          'action': act + '. The presenter, if visible, listens in silence.'})
    look = LOOK + (" The garage door is wide open and plenty of grey daylight comes in, plus the ceiling tube is on: the workshop is well lit and his face is clearly lit." if SET_OF[sc] == 'K2' else '')
    plan = {'dir': d, 'face': FACE, 'face_anc': FACE_ANC, 'k0_from': k0, 'extra': {'V': VFACE, 'LAM': R + 'public/img/tfbtanque/lamina_0.png'}, 'light': LIGHT, 'look': look, 'prev_box': '384x216', 'lang': 'es',
            'anchors': anchors, 'clips': clips, 'out': d + f'vlog_{name}.mp4'}
    json.dump(plan, open(PL + name + '.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    order.append({'seg': name, 'type': 'scene', 'plan': PL + name + '.json', 'out': d + f'vlog_{name}.mp4'})
    tot['anc'] += len(anchors); tot['clips'] += len(clips)
json.dump(order, open(R + 'vlog/tfbtanque/order.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('segmentos', [o['seg'] for o in order])
print('anclas', tot['anc'] + 3, 'clips', tot['clips'])
