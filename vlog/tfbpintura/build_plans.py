# build_plans.py — beats.json (+ tramos.json si existe) -> vlog/tfbpintura/plan_<P>.json (uno por cadena de anclas)
# python vlog/tfbpintura/build_plans.py [--k0only]
import json, os, sys
R = 'D:/Proyectos/video2-wt/tfbpintura/'
V = R + 'vlog/tfbpintura/'
OUT = R + 'out/vlog/'
B = json.load(open(V + 'beats.json', encoding='utf8'))
TR = {t['beat']: t for t in json.load(open(V + 'tramos.json', encoding='utf8'))} if os.path.exists(V + 'tramos.json') else {}
K0ONLY = '--k0only' in sys.argv

LIGHT = ("This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. "
 "The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. "
 "The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. "
 "Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. "
 "Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed.")
LOOK = ("Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, "
 "only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music.")

MAN = ("The presenter is a man of about 50 with black curly hair and a short salt-and-pepper beard (exactly the face of the last input image), "
 "wearing a faded olive-green work shirt with the sleeves rolled up to the elbows, stained with white paint and dust, a worn brown leather apron over it, and dark work trousers.")
NB = ("The neighbour is exactly the man of the second input image: a heavy-set man of about 65, bald on top with grey hair on the sides, a thick grey moustache, "
 "a light blue checked short-sleeve shirt with a pen in the breast pocket, reading glasses hanging on a cord around his neck.")
NB_WHO = "the neighbour, a heavy-set man of about 65 with a thick grey moustache and a light blue checked shirt (the fourth reference image is his face)"
NB_VOICE = "in Spanish with a neutral Latin American accent, the gruff, amused voice of a 65-year-old man"

EXT = ("The place is the side patio of a modest working-class house in Latin America: a long exterior wall of cement plaster about two and a half metres high with an aluminium-framed window; "
 "on the right a chest-high wall of bare red brick separates the neighbour's yard; cracked concrete floor, a green garden hose coiled on the floor, grey plastic buckets, a few potted plants, a clothesline with pegs. "
 "Light: bright overcast daylight from the open sky, soft and even, the whole wall well lit and correctly exposed.")
EXT_HALF = ("The left half of the long wall is freshly painted with limewash, a flat chalky bright white; the right half is the old wall: grey cement plaster with patches of old peeling off-white paint and dark damp stains near the ground.")
GAR = ("The place is a real, cluttered home garage-workshop in a working-class Latin American house: concrete floor with old stains and white dust, a sturdy wooden workbench with grey plastic twenty-litre buckets, "
 "a paper bag of hydrated lime and a smaller paper bag of white cement (plain paper bags), a clear plastic one-litre jug, a glass jar of coarse grey salt, a wooden stirring stick, rags, "
 "a pegboard with hanging tools on the back wall, metal shelves with old tins, a bicycle leaning on the wall. "
 "Light: the wide garage door on the left is open to a bright overcast day, plus one fluorescent tube on the ceiling; the side near the door is brighter and a little cooler, the back corners dimmer, everything correctly exposed.")
INT = ("The place is a small bedroom in a modest Latin American house: the wall on the left is painted with old glossy cream latex paint, the wall on the right is bare grey cement plaster not yet painted, "
 "a window with an aluminium frame letting in daylight, a bed pushed aside and covered with an old sheet, a plastic sheet on the tiled floor, a chair with folded clothes. "
 "Light: daylight through the window plus a plain ceiling bulb; correctly exposed, the side near the window brighter.")

# K0 de cada cadena: (desde, prompt, ¿vecino en cuadro?)
PLANES = {
 'E1': ('ref', f"{EXT} {EXT_HALF} {MAN} He stands beside the white half of the wall holding a green garden hose pistol, spraying a jet of water on the white paint, water running down the wall. "
        f"Behind the low red brick wall on the right stands the neighbour with his arms crossed, watching with a sceptical frown. {NB}", True),
 'E2': ('E1', "Same place, same framing, earlier the same day. The neighbour is not there. He stands in front of the old grey right half of the wall holding a wide white-bristle brush, "
        "a grey bucket of milky white limewash at his feet, the hose coiled on the floor. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'EP': ('E1', "Same place, same framing, days earlier. The neighbour is not there. He stands in front of the old grey right half of the wall holding a wide steel putty knife and a wire brush, "
        "curling flakes of old paint on the wall, a garden pump sprayer and an empty bucket at his feet. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'E3': ('E1', "Same place, same framing, days earlier. The neighbour is not there. The right half of the wall is scraped clean, bare grey cement plaster, damp and darker from water. "
        "He stands in front of it holding a wooden stick in a grey bucket of milky white limewash, a wide brush resting on the rim. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'E4': ('E1', "Same place, same framing, days earlier. The neighbour is not there. The right half of the wall now has a first thin coat of limewash, milky and a little patchy over the grey. "
        "He stands in front of it loading a wide brush from a grey bucket of limewash. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'E7': ('E1', "Same place, same framing, days earlier. The neighbour is not there. Both halves of the long wall are now matte chalky white, the right half freshly painted and slightly damp. "
        "He stands in front of it holding a garden pump sprayer; an old sheet hangs from the eaves shading part of the wall. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'E5': ('E1', "Same place, same framing, several days later. The neighbour is not there. The whole long wall is evenly matte chalky white, both halves the same. "
        "He stands in front of it holding the green garden hose pistol pointed down, dry. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'E8': ('E1', f"Same place, same framing, several days later. The whole long wall is evenly matte chalky white and wet, water drops running down. He stands in front of it holding a small glass jar of coarse salt. "
        f"At the far left of the patio there is an old low garden wall with a white fluffy salt stain near the ground. Behind the low red brick wall on the right the neighbour leans with a coffee mug. {NB} "
        "Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", True),
 'G1': ('ref', f"{GAR} {MAN} He stands behind the workbench beside an empty grey bucket, holding the clear plastic one-litre jug, looking at the camera.", False),
 'G2': ('G1', "Same garage, same framing. On the bench there is now also an old grey bucket with a lid (yesterday's mix), a small kitchen scale and a low stool beside the bench. "
        "He stands behind the bench. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'G3': ('G1', "Same garage, same framing. Clear safety goggles and a pair of orange rubber gloves lie on the bench beside the two paper bags. "
        "He stands behind the bench with his hands on it. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'G4': ('G1', "Same garage, same framing, late afternoon: the ceiling fluorescent tube is on and daylight still comes through the open garage door. "
        "He stands at the bench with an empty grey bucket in front of him and the open paper bag of lime. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'G5': ('G1', "Same garage, same framing, the next morning. On the bench: a grey bucket of milky limewash, a mug of steaming hot water, the glass jar of coarse salt, a small bucket, "
        "a second empty bucket with a piece of green mosquito mesh beside it. He wears clear safety goggles and orange rubber gloves. Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
 'I1': ('ref', f"{INT} {MAN} He stands beside the old cream latex wall; on it there is a small square test patch of dried white limewash with a strip of masking tape pressed on it.", False),
 'I2': ('I1', "Same bedroom, same light, turned toward the bare grey cement plaster wall on the right. He stands in front of the bare grey wall with a grey bucket of milky limewash at his feet and a wide brush. "
        "Same clothes: faded olive-green work shirt with rolled sleeves and the worn brown leather apron.", False),
}
WARD = " He is still wearing the faded olive-green work shirt with the sleeves rolled up and the worn brown leather apron tied over it, exactly as in the first image."
NBPOS = (" The neighbour stays on his own side of the property line: behind the chest-high red brick wall on the right, only his chest, arms and head showing above the bricks; "
 "he does not step over to this side and does not come closer to the camera.")
DET1 = "EXTREME CLOSE-UP of the hands and materials only, same place and same light as the first input image, the face is not in the frame (ignore the last input image): "
DET2 = "Same extreme close-up, same framing, same light, a few seconds later: "

plans = {}
KEND = {}  # beat -> índice K al final de ese beat (para anclar los insertos)
for pid, (frm, k0p, nb0) in PLANES.items():
    d = OUT + pid + '/'
    k0_from = R + 'public/ref_tfbpintura.png' if frm == 'ref' else OUT + frm + '/anc/K0.png'
    plans[pid] = {'dir': d, 'face': R + 'public/ref_tfbpintura_face256.png', 'k0_from': k0_from,
                  'extra': {'W': R + 'public/ref_vecino.png', 'WF': R + 'public/ref_vecino_face.png'},
                  'lang': 'es', 'light': LIGHT, 'look': LOOK,
                  'anchors': [{'id': 'K0', 'from': ['k0'] + (['W'] if nb0 else []), 'prompt': k0p + (NBPOS if nb0 and pid[0] == 'E' else '')}], 'clips': [], '_n': 0, '_nb': nb0,
                  'out': d + f'vlog_{pid}.mp4'}
for b in B:
    if b['type'] == 'L': continue
    P = plans[b['scene']]; n = P['_n']
    if b['type'] == 'I':
        hk = KEND[b['host']]
        P['anchors'].append({'id': f"D_{b['id']}_1", 'from': [f'K{hk}'], 'prompt': DET1 + b['d1'] + '.'})
        P['anchors'].append({'id': f"D_{b['id']}_2", 'from': [f"D_{b['id']}_1"], 'prompt': DET2 + b['d2'] + '.'})
        P['clips'].append({'id': b['id'], 'a': f'K{hk}', 'b': f'K{hk}', 'detail': True, 'insert': b['host'], 'secs': b['secs'], 'd1': b['d1'], 'd2': b['d2'], 'text': '', 'action': 'INSERT'})
        continue
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
    kp = 'Same photo, same place, same framing, a few seconds later: ' + b['K'] + '.' + WARD + ((' ' + NB.replace('the man of the second input image', 'the man whose face is the second input image') + (NBPOS if b['scene'][0] == 'E' else '')) if nb else '')
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
for pid, P in plans.items():
    P.pop('_n'); P.pop('_nb')
    if K0ONLY: P = {**P, 'anchors': P['anchors'][:1], 'clips': []}
    os.makedirs(P['dir'], exist_ok=True)
    json.dump(P, open(V + (f'plan0_{pid}.json' if K0ONLY else f'plan_{pid}.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print({k: (len(p['anchors']), len(p['clips'])) for k, p in plans.items()}, 'anclas', sum(len(p['anchors']) for p in plans.values()),
      'clips', sum(len(p['clips']) for p in plans.values()), 'con audio', sum(1 for p in plans.values() for c in p['clips'] if c.get('audio')))
