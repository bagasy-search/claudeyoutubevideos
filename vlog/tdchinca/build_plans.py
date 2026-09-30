# build_plans.py — beats.json (+ tramos.json si existe) -> vlog/tdchinca/plan_<P>.json (una CADENA CORTA por tramo de <=CH beats)
# python vlog/tdchinca/build_plans.py [--k0only]
# Cadenas cortas (brief del creador): cada escena se parte en tramos de CH beats A/V; cada tramo nace de la FOTO BASE del lugar
# (K0 editada desde ella) => pocas rondas de Batch y el set no deriva. Escribe beats.json con b['P'] = plan del tramo.
import json, os, sys
R = 'D:/Proyectos/video2-wt/tdchinca/'
V = R + 'vlog/tdchinca/'
OUT = R + 'out/vlog/'
B = json.load(open(V + 'beats.json', encoding='utf8'))
TR = {t['beat']: t for t in json.load(open(V + 'tramos.json', encoding='utf8'))} if os.path.exists(V + 'tramos.json') else {}
K0ONLY = '--k0only' in sys.argv
CH = 4

LIGHT = ("This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. "
 "The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. "
 "The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. "
 "Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. "
 "Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed.")
LOOK = ("Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, "
 "only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music.")
GAZE = "In work shots he looks down at what his hands are doing with a calm concentrated working expression, mouth closed, not looking at the camera; he looks at the camera only when he is talking to it."

MAN = ("The presenter is a man of about 45 with black curly hair with volume and a short salt-and-pepper beard (exactly the face of the last input image), olive skin, "
 "wearing a navy-blue button-up work shirt with the sleeves rolled up to the elbows, worn and stained with grease and dust, dark work trousers, hands with grease and grime.")
NB = ("The neighbour is exactly the man of the second input image: a thin wiry man of about 62, weathered tanned face with deep lines, white stubble and a short white moustache, "
 "a faded green cloth cap, a sweat-stained grey sleeveless undershirt, old work trousers and worn boots.")
NB_WHO = "the neighbour, a thin wiry man of about 62 with a white moustache and a faded green cloth cap (the fourth reference image is his face)"
NB_VOICE = "in Spanish with a neutral Latin American accent, the gruff, amused voice of a 62-year-old man"

TOOL = ("a heavy grey SDS-max hammer drill (about five kilos, dusty, with a plugged black cable) and a home-made adapter: a ten-centimetre ring of thick steel pipe with a thick round steel lid welded on top and a short steel shank rising from the lid")
PAT = ("The place is the back yard field of a modest neighbourhood workshop in a small town in Argentina: flat patchy grass with bare soil spots, an old sagging wire fence with a few leaning stakes along the left, "
 "a rusty corrugated-iron shed wall at the back, some short square wooden eucalyptus stakes lying or standing in the grass, and a long orange extension cord across the grass. "
 "Light: bright overcast daylight from an open sky, soft, the whole scene well lit and correctly exposed.")
GAL = ("The place is his cluttered neighbourhood workshop shed in Argentina: concrete floor with old oil stains, a thick scarred wooden workbench along the back wall with a steel vice, an angle grinder, a stick welder with cables, "
 "a pile of scrap (pipes, flat bars, plates, bearings, plough discs, old gas cylinders) in the right corner, a pegboard of hand tools and a scratched blackboard on the wall, and the big sliding door on the left open to the yard. "
 "Light: daylight from the open door on the left plus one fluorescent tube on the ceiling; the side near the door brighter and a little cooler, the back corners dimmer, everything correctly exposed.")
STR = ("The place is a neighbourhood street in a small Argentine town: cracked pavement, a big yellow rubbish skip full of building rubble (bricks, plaster, old pipes) parked beside a half-built house with a plastered wall. "
 "Light: bright overcast daylight, correctly exposed.")
SAME = "Same place, same framing, same clothes. "

# escena -> (base: 'ref' o escena-base, place-base plan, prompt K0, ¿vecino en cuadro?)
PLACE = {'PAT': 'H1', 'GAL': 'G1', 'STR': 'VO'}
PLANES = {
 'H1': ('ref', 'PAT', f"{PAT} {MAN} He stands in the grass beside a freshly driven stake, holding {TOOL}, hanging at his side. A row of driven stakes runs behind him along the sagging fence. "
        f"On the right stands the neighbour with a five-kilo sledgehammer on his shoulder, watching with a sceptical frown. {NB}", True),
 'G1': ('ref', 'GAL', f"{GAL} {MAN} He stands beside the pile of scrap in the right corner of the workshop, one boot on a steel pipe, looking at the camera.", False),
 'PA': ('H1', 'PAT', f"{SAME}Earlier, before any work: the fence on the left is fallen and sagging with rotten stakes, no driven stakes, a pile of new eucalyptus stakes lies in the grass. The neighbour is not there. "
        "He stands in the middle of the grass looking along the fence, hands on his hips.", False),
 'VO': ('ref', 'STR', f"{STR} {MAN} He stands beside the yellow skip looking into it.", False),
 'G2': ('G1', 'GAL', f"{SAME}The scratched blackboard on the wall now has tool outlines and short lines chalked on it. He stands in front of the blackboard holding a piece of chalk.", False),
 'G3': ('G1', 'GAL', f"{SAME}On the workbench lies a dusty grey SDS-max hammer drill with a cut cable and a screwdriver beside it. He stands behind the bench.", False),
 'GT': ('G1', 'GAL', f"{SAME}On the workbench lies a dusty grey SDS-max hammer drill with its housing open showing the piston and gears, a screwdriver beside it. He stands behind the bench.", False),
 'G4': ('G1', 'GAL', f"{SAME}A broken SDS-max drill bit is clamped in the steel vice on the workbench, an angle grinder and safety goggles beside it. He stands at the bench.", False),
 'G5': ('G1', 'GAL', f"{SAME}On the workbench: a rusty thick steel pipe, a marker, a caliper, an angle grinder and a thin steel sheet. He stands at the bench.", False),
 'G6': ('G1', 'GAL', f"{SAME}On the workbench: a stick welder with its cables, a welding helmet, a small steel disc with a short steel shank through its hole, a chipping hammer. He stands at the bench.", False),
 'ES': ('H1', 'PAT', f"{SAME}Near the workshop door there is a wooden sawhorse with a long eucalyptus board on it, a handsaw, a hatchet and a chopping block. The neighbour is not there. He stands beside the sawhorse.", False),
 'PB': ('H1', 'PAT', f"{SAME}A row of short square eucalyptus stakes stands in the grass. He stands holding the hammer drill with the adapter in front of a stake, ear defenders around his neck. The neighbour stands a few steps away with crossed arms. {NB}", True),
 'G7': ('G1', 'GAL', f"{SAME}On the workbench lies a cracked adapter (a pipe ring with a dented thin lid and a cracked weld) and a split wooden stake head. He stands leaning on the bench.", False),
 'G8': ('G1', 'GAL', f"{SAME}On the workbench: a thick steel plate, the pipe ring, a small blowtorch, a bucket of dry sand, a hand plane and a wooden stake in the vice. He stands at the bench.", False),
 'PC': ('H1', 'PAT', f"{SAME}Stakes stand in the grass. He stands holding the hammer drill with the adapter over a stake, safety glasses and ear defenders on. Beside him the neighbour holds a small stopwatch. {NB}", True),
 'PT': ('H1', 'PAT', f"{SAME}He stands in the grass by a row of stakes, holding a spirit level against one of them. The neighbour is not there.", False),
 'PE': ('H1', 'PAT', f"{SAME}Several stakes are already driven in a row in the grass. He stands beside them with the hammer drill on the ground. The neighbour stands nearby holding the sledgehammer. {NB}", True),
 'PD': ('H1', 'PAT', f"{SAME}The fence line is finished: a long straight row of new wooden stakes with taut wire, low sun. He stands beside it holding the hammer drill on his shoulder. The neighbour stands nearby with a mug. {NB}", True),
}
WARD = " He is still wearing the navy-blue button-up work shirt with the sleeves rolled up, exactly as in the first image."
NBPOS = " The neighbour stays a few metres from him on the same side, standing on the grass, and does not come closer to the camera."
DET1 = "EXTREME CLOSE-UP of the hands and materials only, same place and same light as the first input image, the face is not in the frame (ignore the last input image): "
DET2 = "Same extreme close-up, same framing, same light, a few seconds later: "

# ---- 1) partir cada escena en tramos de CH beats A/V
st = {}
for i, b in enumerate(B):
    if b['type'] == 'L': continue
    s_ = b['scene']; j, c, last = st.get(s_, (0, 0, None))
    if last is not None and (last != i - 1 or c >= CH) and (b['type'] in ('A', 'V') or last != i - 1):
        j += 1; c = 0
    if b['type'] in ('A', 'V'): c += 1
    st[s_] = (j, c, i); b['P'] = f"{s_}{chr(97 + j)}"
plans = {}; KEND = {}
for b in B:
    if b['type'] == 'L': continue
    pid = b['P']; s = b['scene']
    if pid in plans: continue
    frm, place, k0p, nb0 = PLANES[s]
    k0_from = R + 'public/ref_tdchinca.png' if pid == PLACE[place] + 'a' else OUT + PLACE[place] + 'a/anc/K0.png'
    plans[pid] = {'dir': OUT + pid + '/', 'face': R + 'public/ref_tdchinca_face256.png', 'k0_from': k0_from,
                  'extra': {'W': R + 'public/ref_vecino_tdc.png', 'WF': R + 'public/ref_vecino_tdc_face.png'},
                  'lang': 'es', 'light': LIGHT, 'look': LOOK,
                  'anchors': [{'id': 'K0', 'from': ['k0'] + (['W'] if nb0 else []), 'prompt': k0p + (NBPOS if nb0 else '') + ' ' + GAZE}],
                  'clips': [], '_n': 0, '_nb': nb0, '_scene': s,
                  'out': OUT + pid + f'/vlog_{pid}.mp4'}
for b in B:
    if b['type'] == 'L': continue
    P = plans[b['P']]; n = P['_n']
    if b['type'] in ('D', 'DX'):
        KEND[b['id']] = n
        P['anchors'].append({'id': f"D_{b['id']}_1", 'from': [f'K{n}'], 'prompt': DET1 + b['d1'] + '.'})
        P['anchors'].append({'id': f"D_{b['id']}_2", 'from': [f"D_{b['id']}_1"], 'prompt': DET2 + b['d2'] + '.'})
        c = {'id': b['id'], 'a': f'K{n}', 'b': f'K{n}', 'detail': True, 'd1': b['d1'], 'd2': b['d2'], 'text': b['text'], 'action': 'DETAIL'}
        if b['type'] == 'DX': c['secs'] = b['secs']
        elif b['id'] in TR: c['audio'] = TR[b['id']]['audio']
        P['clips'].append(c); continue
    if b['type'] == 'V': P['_nb'] = True
    nb = P['_nb']; n += 1; P['_n'] = n; KEND[b['id']] = n
    fr = [f'K{n-1}'] + (['WF'] if nb else [])
    kp = 'Same photo, same place, same framing, a few seconds later: ' + b['K'] + '.' + WARD + ((' ' + NB.replace('the man of the second input image', 'the man whose face is the second input image') + NBPOS) if nb else '') + ' ' + GAZE
    P['anchors'].append({'id': f'K{n}', 'from': fr, 'prompt': kp})
    if b['type'] == 'V':
        secs = max(4, min(8, round(len(b['line']) / 15 + 0.8)))
        P['clips'].append({'id': b['id'], 'a': f'K{n-1}', 'b': f'K{n}', 'secs': secs, 'line': b['line'], 'who': NB_WHO, 'voice': NB_VOICE, 'refs': ['WF'], 'text': b['line'],
                           'action': b['A'] + '. The presenter (third reference image face) listens and reacts silently, he does not speak.'})
    else:
        act = b['A'] + '.' + (' The neighbour (fourth reference image face) stays where he is, listening silently.' if nb else '')
        c = {'id': b['id'], 'a': f'K{n-1}', 'b': f'K{n}', 'text': b['text'], 'action': act, **({'refs': ['WF']} if nb else {})}
        if b['id'] in TR: c['audio'] = TR[b['id']]['audio']
        if not b.get('skip'): P['clips'].append(c)
# el vecino sigue en cuadro en los tramos siguientes de la escena si ya apareció (K0 de esos tramos)
for pid, P in sorted(plans.items()):
    P.pop('_n'); P.pop('_nb'); P.pop('_scene')
    if K0ONLY: P = {**P, 'anchors': P['anchors'][:1], 'clips': []}
    os.makedirs(P['dir'], exist_ok=True)
    json.dump(P, open(V + (f'plan0_{pid}.json' if K0ONLY else f'plan_{pid}.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
if not K0ONLY:
    json.dump(B, open(V + 'beats.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print({k: (len(p['anchors']), len(p['clips'])) for k, p in sorted(plans.items())})
print('planes', len(plans), 'anclas', sum(len(p['anchors']) for p in plans.values()), 'clips', sum(len(p['clips']) for p in plans.values()),
      'con audio', sum(1 for p in plans.values() for c in p['clips'] if c.get('audio')))
