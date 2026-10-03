# director_build.py — genera vlog/tdcrola/director.json: cámara automática por beat + overlays de src/tdc anclados a PALABRAS (ASR).
# whisper-1 escribe números en cifras ("60", "21", "75"): los `word` numéricos van en cifras (1-6 y 10 se normalizan solos).
import json
V = 'D:/Proyectos/video2-wt/tdcrola/vlog/tdcrola/'
B = json.load(open(V + 'beats.json', encoding='utf8'))

cam = []; last_p = None; k = 0
ORG = [[35, 50], [62, 45], [48, 38], [55, 60], [40, 42]]
IMPACT = {'b001': 2, 'b002': 1, 'b078': 1, 'b104': 3}
PUNCH = {'b004', 'b005', 'b074', 'b079', 'b091', 'b109', 'b110', 'b133'}
for b in B:
    if b['type'] == 'L': continue
    c = {}
    if b['type'] in ('D', 'DX'):
        c['push'] = [1.0, 1.10]; c['origin'] = ORG[k % 5]
        if b['id'] in IMPACT: c['shakes'] = [{'at': IMPACT[b['id']], 'amp': 12, 'len': 14}]
    else:
        c['push'] = [1.0, 1.06 + 0.02 * (k % 3)] if k % 2 == 0 else [1.08, 1.0]; c['origin'] = ORG[k % 5]
    if b['P'] != last_p and last_p is not None and b['id'] != 'b001':
        c['whipIn'] = 6; c['whipDir'] = 1 if k % 2 == 0 else -1
    if b['id'] in PUNCH: c['punches'] = [{'at': 2, 'amount': 0.14}]
    cam.append({'id': b['id'], 'cam': c}); last_p = b['P']; k += 1

S = lambda n, db=-14: [{'src': 'sfx/' + n, 'db': db}]
POP = S('sfx_pop.mp3', -16); SLAM = S('text_slam.mp3', -12); NUM = S('number_slam.mp3', -14); HIT = S('stinger_hit.mp3', -18)
ov = []
def add(kind, beat, props=None, word=None, dur=None, until=None, off=0.0, sfx=None, nth=0, until_off=0.0):
    o = {'kind': kind, 'beat': beat, 'props': props or {}}
    if word: o['word'] = word
    if nth: o['nth'] = nth
    if until: o['until'] = until
    else: o['dur'] = dur or 2.0
    if off: o['off'] = off
    if until_off: o['until_off'] = until_off
    if sfx: o['sfx'] = sfx
    ov.append(o)
def lab(beat, text, word, sub=None, tone='yellow', dur=2.4, off=-0.2, at=(50, 15), size=None):
    p = {'text': text, 'at': list(at), 'tone': tone}
    if sub: p['sub'] = sub
    if size: p['size'] = size
    add('TdcLabel', beat, p, word=word, off=off, dur=dur, sfx=POP)
def warn(beat, text, icons, tone='red', word=None, dur=3.0, off=-0.2):
    add('TdcWarning', beat, {'text': text, 'icons': icons, 'tone': tone}, word=word, off=off, dur=dur, sfx=HIT)
def slam(beat, words, word, pos='top', size=100, dur=None, until=None, off=-0.1):
    add('TdcTitleSlam', beat, {'pos': pos, 'size': size, 'words': [{'t': t, 'beat': beat, 'word': w, **({'hl': h} if h else {})} for t, w, h in words]},
        word=word, off=off, dur=dur or 2.6, until=until, sfx=SLAM)
def tag(beat, name, origin, word, at=(50, 4), dur=3.0):
    add('TdcScrapTag', beat, {'name': name, 'origin': origin, 'cost': '$0', 'at': list(at)}, word=word, dur=dur, sfx=POP)

# ===== gancho =====
lab('b005', '60 cm · CALZA JUSTO', '60', tone='white', dur=2.6, off=-0.4)
tag('b004', 'RULEMANES', 'de lavarropas', 'rulemanes', at=(18, 4), dur=1.6)
tag('b004', 'AMORTIGUADORES', 'vástagos de 12 mm', 'amortiguador', at=(50, 4), dur=1.6)
tag('b004', 'GATO DE AUTO', 'el husillo', 'gato', at=(82, 4), dur=1.6)
slam('b008', [('EL DETALLE', 'detalle', 'yellow'), ('DE LOS RODILLOS', 'rodillos', 'red')], 'detalle', until='b008', off=-0.3)
# ===== problema =====
lab('b010', 'PORTÓN DE LA ABUELA', 'abuela', sub='arco nuevo', tone='white', dur=2.8)
lab('b014', 'SALE UN CODO', 'codo', tone='red', dur=2.0, off=-1.5) if False else None
slam('b016', [('3 RODILLOS', 'tres', 'yellow'), ('1 TORNILLO', 'tornillo', None), ('1 MANIJA', 'manija', 'yellow')], 'roladora', pos='bottom', size=92, dur=3.4, off=0.0)
slam('b021', [('1 RANURA', 'ranura', 'yellow'), ('2 MANIJA GRANDE', 'manija', None), ('3 QUE AGARRE', 'agarre', 'yellow'), ('4 IMPRIMAR', 'imprimar', 'red')], 'ranura', pos='top', size=88, until='b021', off=-0.2)
# ===== inventario =====
tag('b024', 'RULEMANES ×3', 'lavarropas roto', 'lavarropas', dur=3.2)
tag('b025', 'EJES Ø12', 'amortiguadores', 'amortiguador', dur=3.2)
tag('b026', 'HUSILLO', 'gato de auto', 'gato', dur=3.2)
tag('b028', 'PLANCHUELA 10 mm', 'portón viejo', 'portón', dur=3.0)
tag('b029', 'POLEAS', 'motor y compresor', 'poleas', dur=3.2)
add('TdcExploded', 'b030', {'assemble': True, 'at': [30, 52], 'scale': 0.8, 'parts': [
    {'shape': 'shank', 'name': 'Ejes Ø12', 'origin': 'amortiguadores'}, {'shape': 'disc', 'name': 'Poleas con canal', 'origin': 'motor y compresor'},
    {'shape': 'pipe', 'name': 'Rulemanes ×3', 'origin': 'lavarropas'}, {'shape': 'shank', 'name': 'Husillo', 'origin': 'gato de auto'}]},
    word='materiales', off=-0.3, until='b030', until_off=1.5, sfx=S('cam_travel.mp3', -18))
# ===== pasos y teoría =====
for bid, step, name in [('b040', 1, 'LOS LATERALES'), ('b047', 2, 'LOS RODILLOS'), ('b057', 3, 'EL HUSILLO'), ('b065', 4, 'BASE Y MANIJA'), ('b073', 5, 'SOLDAR Y PROBAR'), ('b098', 6, 'IMPRIMAR Y PINTAR')]:
    add('TdcStepCounter', bid, {'step': step, 'total': 6, 'title': name}, dur=3.4, sfx=S('sfx_pop.mp3', -15))
lab('b038', 'MÁS BAJO = MÁS CERRADA', 'cerrada', tone='yellow', dur=2.8)
lab('b039', 'MÍNIMO: 40 cm', '40', tone='red', dur=2.6)
warn('b043', 'ANTEOJOS SIEMPRE', ['goggles'], word='anteojos', dur=2.6)
lab('b045', 'RANURAS IGUALES', 'iguales', tone='white', dur=2.4)
lab('b048', 'CANAL EN V', 'canal', tone='yellow', dur=2.4)
lab('b050', 'CANAL = DIÁMETRO DEL CAÑO', 'diámetro', tone='yellow', dur=3.0)
lab('b054', 'CENTRADA O NADA', 'centro', tone='white', dur=2.4)
lab('b066', 'ESCUADRA, SÍ O SÍ', 'escuadra', tone='white', dur=2.4)
lab('b068', 'MANIJA 40 cm', '40', tone='yellow', dur=2.4)
warn('b071', 'ATORNILLADA AL BANCO', ['alert'], word='atornillada', dur=2.8)
# ===== primera prueba =====
slam('b074', [('PATINA', 'patina', 'red')], 'patina', size=118, dur=2.0, off=-0.05)
slam('b079', [('CAÑO OVALADO', 'ovalada', 'red')], 'aplastada', size=108, dur=2.4, off=-0.3)
lab('b081', 'NO ES LA FUERZA', 'fuerza', tone='yellow', dur=2.6)
# ===== diagnóstico y arreglo =====
lab('b083', 'ACERO CONTRA ACERO', 'acero', tone='red', dur=2.4)
lab('b084', 'CANAL MUY ANCHO', 'ancho', tone='red', dur=2.4)
lab('b087', 'AFUERA SE ESTIRA · ADENTRO SE COMPRIME', 'estira', tone='white', dur=3.4, size=52)
lab('b090', 'MEDIA CAÑA Ø21', '21', tone='yellow', dur=2.4, off=-0.5)
slam('b091', [('CANAL', 'justo', 'yellow'), ('A MEDIDA', 'sobra', 'yellow')], 'justo', size=110, until='b091', off=-0.6)
lab('b093', 'CORDONES = TRACCIÓN', 'traccion', tone='yellow', dur=2.8)
lab('b096', 'REFUERZO EN CADA LATERAL', 'escuadra', tone='white', dur=2.6)
lab('b098', 'IMPRIMACIÓN PRIMERO', 'imprimacion', tone='yellow', dur=2.6)
# ===== prueba de fuego =====
slam('b100', [('PRUEBA', 'tercera', 'yellow'), ('DE FUEGO', 'vuelta', 'red')], 'tercera', size=110, dur=2.4, off=-0.1)
lab('b103', '¼ DE VUELTA POR PASADA', 'cuarto', tone='yellow', dur=2.8)
slam('b109', [('SE CIERRA', 'cierra', 'yellow')], 'cierra', size=120, dur=2.2, off=-0.2)
# ===== pago honesto =====
add('TdcCaliper', 'b113', {'dims': [{'from': [24, 72], 'to': [76, 72], 'value': '60 cm', 'tone': 'yellow'}], 'gap': 10}, word='sesenta', off=-0.2, dur=3.6, sfx=S('marker_drive.mp3', -16))
add('TdcCaliper', 'b114', {'dims': [{'from': [24, 72], 'to': [76, 72], 'value': '60,5 cm', 'tone': 'white'}], 'gap': 10}, word='sesenta', off=-0.2, dur=3.6, sfx=S('marker_drive.mp3', -16))
lab('b115', 'Ø21 → Ø21', 'veintiuno', tone='yellow', dur=2.6)
lab('b118', 'MÍNIMO: 40 cm', '40', tone='red', dur=2.4, off=-0.4)
slam('b119', [('½" Y ¾"', 'media', 'yellow'), ('PARED FINA', 'fina', None)], 'media', pos='bottom', size=96, dur=3.2, off=-0.1)
warn('b120', 'TUBO CUADRADO: NO', ['alert'], word='cuadrado', dur=2.8)
lab('b121', 'RELLENO DE ARENA SECA', 'arena', tone='white', dur=2.8)
warn('b122', 'ATRAPAMIENTO: DEDOS FUERA', ['alert', 'gloves'], word='atrapamientos', dur=3.2)
warn('b123', 'ROPA AJUSTADA · ANTEOJOS', ['goggles', 'alert'], word='ropa', dur=3.0)
lab('b125', 'ALUMINIO / CUADRADO: NO PROBÉ', 'aluminio', tone='white', dur=3.0)
# ===== arco del portón =====
slam('b129', [('EL ARCO', 'arco', 'yellow'), ('DEL PORTÓN', 'portón', 'red')], 'arco', size=110, dur=2.6, off=-0.1)
lab('b132', 'PLANTILLA DE CARTÓN', 'plantilla', tone='white', dur=2.6)
slam('b140', [('LUZ 1,20 m', 'metro', 'yellow'), ('ALTURA 30 cm', 'treinta', None), ('RADIO 75 cm', '75', 'red')], 'luz', pos='top', size=94, until='b140', off=-0.1)
slam('b142', [('CANAL A MEDIDA', 'canal', 'yellow'), ('TRACCIÓN', 'traccion', 'yellow'), ('REFUERZO', 'refuerzo', 'yellow')], 'aprendí', pos='top', size=92, until='b142', off=-0.1)
slam('b144', [('PRÓXIMO VIDEO', 'próximo', 'yellow'), ('CALENTAR EL GALPÓN', 'calentar', 'red')], 'próximo', size=96, until='b145', off=-0.1)

D = {'music': {'src': 'sfx/music_federer.mp3', 'start': 6.0, 'db': -23}, 'cam': cam, 'overlays': [o for o in ov if o], 'covers': {}}
json.dump(D, open(V + 'director.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('cam', len(cam), 'overlays', len(D['overlays']))
