# build_plans.py — beats.json (+ tramos.json si existe) -> vlog/tdcrola/plan_<P>.json (una CADENA CORTA por tramo de <=CH beats)
# python vlog/tdcrola/build_plans.py [--k0only]
# Cadenas cortas (brief del creador): cada escena se parte en tramos de CH beats A/V; cada tramo nace de la FOTO BASE del lugar
# (K0 editada desde ella) => pocas rondas de Batch y el set no deriva. Escribe beats.json con b['P'] = plan del tramo.
import json, os, sys
R = 'D:/Proyectos/video2-wt/tdcrola/'
V = R + 'vlog/tdcrola/'
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
NB = ("The nephew is exactly the man of the second input image: a lanky young man of about 19, very short buzz-cut black hair, a little stubble fuzz on his upper lip, light brown skin, "
 "a faded grey hooded sweatshirt with the hood down, worn jeans and clean white sneakers.")
NB_WHO = "the nephew, a lanky young man of about 19 with a buzz cut and a faded grey hooded sweatshirt (the fourth reference image is his face)"
NB_VOICE = "in Spanish with a neutral Latin American accent, the cheerful voice of a 19-year-old young man"

TOOL = ("a home-made ring roller bender bolted to a thick wooden workbench: two thick black steel side plates with vertical slots, three steel pulleys with V-grooves on chrome shafts, a car-jack screw with a small handle on top and a long red crank handle at the side, painted matt black")
GAL = ("The place is his cluttered neighbourhood workshop shed in Argentina: concrete floor with old oil stains, a thick scarred wooden workbench along the back wall with a steel vice, an angle grinder, a stick welder with cables, "
 "a pile of scrap (pipes, flat bars, plates, bearings, plough discs, old gas cylinders) in the right corner, a pegboard of hand tools and a scratched blackboard on the wall, and the big sliding door on the left open to the yard. "
 "Light: daylight from the open door on the left plus one fluorescent tube on the ceiling; the side near the door brighter and a little cooler, the back corners dimmer, everything correctly exposed.")
PAT = ("The place is the back yard of a modest house in a small town in Argentina: cracked concrete floor, a low cinder-block wall, a tall black iron gate frame standing in the yard with a plain rectangular top (the arch is still missing), "
 "a few potted plants and an old plastic chair. Light: bright overcast daylight from an open sky, soft, the whole scene well lit and correctly exposed.")
SAME = "Same place, same framing, same clothes. "

PLACE = {'GAL': 'G1', 'PAT': 'PA'}
PLANES = {
 'H1': ('G1', 'GAL', f"{GAL} {MAN} A sixty-centimetre-wide chalk circle is drawn on the concrete floor in front of the bench and {TOOL} stands bolted to the bench. He stands beside the bench holding a closed steel tube ring on his forearm. "
        f"Beside the bench stands the nephew with his arms crossed. {NB}", True),
 'G1': ('ref', 'GAL', f"{GAL} {MAN} He stands beside the pile of scrap in the right corner of the workshop, one boot on a steel pipe, looking at the camera.", False),
 'PA': ('ref', 'PAT', f"{PAT} {MAN} He stands in the yard beside the gate frame, looking at the empty top of the frame.", False),
 'G2': ('G1', 'GAL', f"{SAME}The scratched blackboard on the wall has a rough drawing of three circles chalked on it. He stands in front of the blackboard holding a piece of chalk.", False),
 'GT': ('G1', 'GAL', f"{SAME}On the workbench lie three steel pulleys with V-grooves and a straight steel tube. He stands behind the bench.", False),
 'G3': ('G1', 'GAL', f"{SAME}On the workbench lie two thick steel flat bars, a paint marker, a tape measure and a drill. He stands at the bench.", False),
 'G4': ('G1', 'GAL', f"{SAME}On the workbench: steel pulleys with V-grooves, old washing-machine bearings, two chrome shock-absorber rods, a file, a hammer. He stands at the bench.", False),
 'G5': ('G1', 'GAL', f"{SAME}On the workbench: two steel side plates standing on a base, a car-jack screw, a thick nut, a stick welder with cables and a welding helmet. He stands at the bench.", False),
 'G6': ('G1', 'GAL', f"{SAME}On the workbench: a raw unpainted steel frame with two side plates on a channel base, a welding helmet, a small square, a long crank handle. He stands at the bench.", False),
 'PB': ('G1', 'GAL', f"{SAME}The raw ring roller bender is bolted to the workbench, a straight steel tube lies on the bench. He stands at the machine. The nephew stands beside the bench watching. {NB}", True),
 'G7': ('G1', 'GAL', f"{SAME}On the workbench lies a bent steel tube with a flattened end and a smooth steel pulley. He stands leaning on the bench.", False),
 'G8': ('G1', 'GAL', f"{SAME}On the workbench: the raw roller frame, three steel pulleys with round grooves, round files, a stick welder with cables, a welding helmet, a tin of grey primer and a brush. He stands at the bench.", False),
 'PC': ('G1', 'GAL', f"{SAME}The ring roller bender, painted matt black with a red crank handle, is bolted to the bench; a chalk circle is drawn on the floor in front of the bench. He stands at the machine with a fresh straight steel tube. Beside the bench stands the nephew. {NB}", True),
 'PE': ('G1', 'GAL', f"{SAME}The finished painted ring roller bender stands on the bench with a closed steel tube ring lying beside it, a tape measure and a caliper on the bench. He stands beside the bench. The nephew stands nearby. {NB}", True),
 'PD': ('G1', 'GAL', f"{SAME}The finished painted ring roller bender is on the bench, and a long steel tube lies across the bench. He stands beside the bench. The nephew stands next to him. {NB}", True),
 'PG': ('PA', 'PAT', f"{SAME}The tall black iron gate frame now has a new curved steel tube arch on its top. He stands beside the gate. The nephew stands next to him. {NB}", True),
}
WARD = " He is still wearing the navy-blue button-up work shirt with the sleeves rolled up, exactly as in the first image."
NBPOS = " The nephew stays beside the presenter within the same area and does not come closer to the camera."
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
    k0_from = R + 'public/ref_tdcrola.png' if pid == PLACE[place] + 'a' else OUT + PLACE[place] + 'a/anc/K0.png'
    plans[pid] = {'dir': OUT + pid + '/', 'face': R + 'public/ref_tdcrola_face256.png', 'k0_from': k0_from,
                  'extra': {'W': R + 'public/ref_sobrino_tdc.png', 'WF': R + 'public/ref_sobrino_tdc_face.png'},
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
    kp = 'Same photo, same place, same framing, a few seconds later: ' + b['K'] + '.' + WARD + ((' ' + NB.replace('the man of the second input image', 'the young man whose face is the second input image') + NBPOS) if nb else '') + ' ' + GAZE
    P['anchors'].append({'id': f'K{n}', 'from': fr, 'prompt': kp})
    if b['type'] == 'V':
        secs = max(4, min(8, round(len(b['line']) / 15 + 0.8)))
        P['clips'].append({'id': b['id'], 'a': f'K{n-1}', 'b': f'K{n}', 'secs': secs, 'line': b['line'], 'who': NB_WHO, 'voice': NB_VOICE, 'refs': ['WF'], 'text': b['line'],
                           'action': b['A'] + '. The presenter (third reference image face) listens and reacts silently, he does not speak.'})
    else:
        act = b['A'] + '.' + (' The nephew (fourth reference image face) stays where he is, listening silently.' if nb else '')
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
