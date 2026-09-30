# director_build.py — genera vlog/tdchinca/director.json: cámara automática por beat + overlays de src/tdc anclados a PALABRAS (ASR).
# python vlog/tdchinca/director_build.py
import json
V = 'D:/Proyectos/video2-wt/tdchinca/vlog/tdchinca/'
B = json.load(open(V + 'beats.json', encoding='utf8'))

# ---------- cámara: empuje lento alternado, golpe en cada beat que abre escena, temblor en los detalles de golpe ----------
cam = []; last_p = None; k = 0
ORG = [[35, 50], [62, 45], [48, 38], [55, 60], [40, 42]]
IMPACT = {'b001': 2, 'b004': 1, 'b081': 1, 'b109': 3, 'b039': 0}
for b in B:
    if b['type'] == 'L': continue
    c = {}
    if b['type'] in ('D', 'DX'):
        c['push'] = [1.0, 1.10]; c['origin'] = ORG[k % 5]
        if b['id'] in IMPACT: c['shakes'] = [{'at': IMPACT[b['id']], 'amp': 12, 'len': 14}]
    else:
        c['push'] = [1.0, 1.06 + 0.02 * (k % 3)] if k % 2 == 0 else [1.08, 1.0]; c['origin'] = ORG[k % 5]
    if b['P'] != last_p and last_p is not None and b['id'] not in ('b001',):
        c['whipIn'] = 6; c['whipDir'] = 1 if k % 2 == 0 else -1
    if b['id'] in ('b003', 'b007', 'b080', 'b102', 'b110'): c['punches'] = [{'at': 2, 'amount': 0.14}]
    cam.append({'id': b['id'], 'cam': c}); last_p = b['P']; k += 1

S = lambda n, db=-14: [{'src': 'sfx/' + n, 'db': db}]
POP = S('sfx_pop.mp3', -16); SLAM = S('text_slam.mp3', -12); NUM = S('number_slam.mp3', -14)
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

# ===== minuto 1 =====
add('TdcStopwatch', 'b003', {'to': 8, 'label': 'HINCAPOSTES', 'at': [80, 17], 'runFrames': 54}, word='ocho', off=-0.1, dur=3.6, sfx=S('digit_tick.mp3', -18))
add('TdcLabel', 'b003', {'text': 'DE LA BASURA', 'at': [30, 16], 'tone': 'white'}, word='basura', dur=1.6, sfx=POP)
add('TdcScrapTag', 'b005', {'name': 'CAÑO', 'origin': 'bastidor de cama', 'cost': '$0', 'at': [18, 4]}, word='caño', dur=1.7, sfx=S('sfx_pop.mp3', -16))
add('TdcScrapTag', 'b005', {'name': 'CHAPA', 'origin': 'tapa de alcantarilla', 'cost': '$0', 'at': [50, 4]}, word='chapa', dur=1.7, sfx=S('sfx_pop.mp3', -16))
add('TdcScrapTag', 'b005', {'name': 'MECHA ROTA', 'origin': 'de mi banco', 'cost': '$0', 'at': [82, 4]}, word='mecha', dur=1.7, sfx=S('sfx_pop.mp3', -16))
add('TdcTitleSlam', 'b007', {'pos': 'top', 'size': 104, 'words': [{'t': 'SE ROMPIÓ', 'beat': 'b007', 'word': 'rompió', 'hl': 'red'}, {'t': 'DOS VECES', 'beat': 'b007', 'word': 'dos', 'hl': 'yellow'}]}, word='rompió', off=-0.05, until='b007', sfx=SLAM)
add('TdcLabel', 'b008', {'text': 'LO QUE NADIE CUENTA', 'at': [50, 14], 'tone': 'yellow', 'size': 58}, word='casi', off=-1.6, dur=2.6, sfx=POP)
# ===== el problema =====
add('TdcTitleSlam', 'b010', {'pos': 'top', 'size': 100, 'words': [{'t': '100 ESTACAS', 'beat': 'b010', 'word': 'cien', 'hl': 'yellow'}, {'t': '120 METROS', 'beat': 'b010', 'word': 'ciento'}]}, word='necesitaba', dur=3.0, sfx=NUM)
add('TdcLabel', 'b011', {'text': 'MAZA 5 KG', 'at': [50, 15], 'tone': 'white'}, word='maza', dur=1.8, sfx=POP)
add('TdcLabel', 'b012', {'text': '2 TARDES', 'sub': 'y la espalda', 'at': [50, 15], 'tone': 'red'}, word='tardes', off=-0.2, dur=2.0, sfx=POP)
add('TdcTitleSlam', 'b017', {'pos': 'top', 'size': 100, 'words': [{'t': 'LA APUESTA', 'beat': 'b017', 'word': 'apuesta', 'hl': 'yellow'}, {'t': 'UN ASADO', 'beat': 'b017', 'word': 'asado', 'hl': 'red'}]}, word='minuto', off=-1.0, dur=3.4, sfx=SLAM)
add('TdcTimeSkip', 'b020', {'text': 'ESA SEMANA'}, word='semana', off=-0.6, dur=1.2, sfx=S('sfx_whoosh_soft.mp3', -16))
add('TdcScrapTag', 'b021', {'name': 'ROTOMARTILLO', 'origin': 'del volquete', 'cost': '$0', 'at': [50, 4]}, word='rotomartillo', dur=2.4, sfx=S('sfx_pop.mp3', -16))
# ===== inventario =====
add('TdcScrapTag', 'b027', {'name': 'CAÑO Ø76', 'origin': 'bastidor de cama', 'cost': '$0', 'at': [50, 4]}, word='caño', dur=3.0, sfx=POP)
add('TdcScrapTag', 'b028', {'name': 'CHAPA 10 mm', 'origin': 'tapa de alcantarilla', 'cost': '$0', 'at': [50, 4]}, word='chapa', dur=3.0, sfx=POP)
add('TdcScrapTag', 'b029', {'name': 'MECHA SDS-MAX', 'origin': 'rota', 'cost': '$0', 'at': [50, 4]}, word='cola', dur=3.0, sfx=POP)
add('TdcExploded', 'b030', {'assemble': True, 'at': [30, 52], 'scale': 0.8}, word='todo', off=-0.3, until='b030', until_off=1.5, sfx=S('cam_travel.mp3', -18))
add('TdcLabel', 'b031', {'text': 'ESTACA 2×2 · 80 cm', 'sub': '40 enterrados', 'at': [50, 15], 'tone': 'white'}, word='eucalipto', off=-0.3, dur=2.6, sfx=POP)
# ===== los 6 pasos =====
for i, (bid, name) in enumerate([('b038', 'EL ROTOMARTILLO'), ('b051', 'EL VÁSTAGO'), ('b055', 'EL CAÑO'), ('b062', 'LA TAPA'), ('b065', 'SOLDAR'), ('b072', 'LAS ESTACAS')]):
    add('TdcStepCounter', bid, {'step': i + 1, 'total': 6, 'title': name}, word=None, dur=3.4, sfx=S('sfx_pop.mp3', -15))
add('TdcWarning', 'b042', {'text': 'OÍDOS · ANTEOJOS · GUANTES', 'icons': ['goggles', 'gloves'], 'tone': 'yellow'}, until='b042', sfx=S('stinger_hit.mp3', -20))
add('TdcWarning', 'b044', {'text': 'SÓLO PERCUSIÓN · SIN ROTACIÓN', 'icons': ['alert'], 'tone': 'red'}, until='b044', sfx=S('stinger_hit.mp3', -18))
add('TdcExploded', 'b049', {'assemble': True, 'at': [30, 52], 'scale': 0.8}, word='adaptador', off=-0.2, until='b050', sfx=S('cam_travel.mp3', -18))
add('TdcWarning', 'b052', {'text': 'ANTEOJOS SIEMPRE', 'icons': ['goggles'], 'tone': 'red'}, word='anteojos', off=-0.2, dur=2.6, sfx=S('stinger_hit.mp3', -20))
add('TdcLabel', 'b053', {'text': 'ACERO TEMPLADO', 'sub': 'acuérdate', 'at': [50, 15], 'tone': 'red'}, word='templado', off=-0.3, dur=2.4, sfx=POP)
add('TdcLabel', 'b055', {'text': '10 cm', 'at': [50, 15], 'tone': 'yellow'}, word='centímetros', off=-0.5, dur=1.6, sfx=POP)
add('TdcCaliper', 'b060', {'dims': [{'from': [26, 62], 'to': [74, 62], 'value': 'Ø68 mm', 'tone': 'yellow'}, {'from': [26, 80], 'to': [74, 80], 'value': '70 mm', 'tone': 'red'}], 'gap': 46}, word='sesenta', off=-0.2, until='b060', sfx=S('marker_drive.mp3', -16))
add('TdcLabel', 'b062', {'text': 'TAPA 3 mm', 'sub': 'la fina', 'at': [50, 15], 'tone': 'white'}, word='fina', off=-0.3, dur=2.0, sfx=POP)
add('TdcWarning', 'b065', {'text': 'CARETA ANTES DE ENCENDER', 'icons': ['eye'], 'tone': 'red'}, word='careta', off=-0.2, dur=3.0, sfx=S('stinger_hit.mp3', -20))
add('TdcLabel', 'b066', {'text': 'ELECTRODO 2,5 mm', 'sub': 'bien seco', 'at': [50, 15], 'tone': 'white'}, word='electrodo', dur=2.6, sfx=POP)
# ===== primera prueba =====
add('TdcWarning', 'b078', {'text': 'NUNCA LA MANO CERCA DE LA ESTACA', 'icons': ['alert', 'gloves'], 'tone': 'red'}, word='nunca', off=-0.2, dur=3.2, sfx=S('stinger_hit.mp3', -18))
add('TdcTitleSlam', 'b080', {'pos': 'top', 'size': 118, 'words': [{'t': 'SE PARTIÓ', 'beat': 'b080', 'word': 'partió', 'hl': 'red'}]}, word='partió', off=-0.05, dur=2.0, sfx=SLAM)
add('TdcTitleSlam', 'b082', {'pos': 'top', 'size': 96, 'words': [{'t': 'TAPA ABOLLADA', 'beat': 'b082', 'word': 'tapa', 'hl': 'yellow'}, {'t': 'SOLDADURA AGRIETADA', 'beat': 'b082', 'word': 'soldadura', 'hl': 'red'}]}, word='tapa', off=-0.1, until='b082', sfx=SLAM)
# ===== diagnóstico =====
add('TdcLabel', 'b086', {'text': '3 mm ES POCO', 'at': [50, 15], 'tone': 'red'}, word='tres', off=-0.1, dur=2.4, sfx=POP)
add('TdcLabel', 'b087', {'text': 'LAS ESQUINAS', 'sub': 'lo más débil', 'at': [50, 15], 'tone': 'yellow'}, word='esquinas', off=-0.2, dur=2.6, sfx=POP)
add('TdcCaliper', 'b089', {'dims': [{'from': [26, 62], 'to': [74, 62], 'value': '70 mm', 'tone': 'red'}, {'from': [26, 80], 'to': [74, 80], 'value': 'Ø68 mm', 'tone': 'yellow'}], 'gap': 40}, word='setenta', off=-0.1, until='b089', sfx=S('marker_drive.mp3', -16))
add('TdcTitleSlam', 'b092', {'pos': 'top', 'size': 96, 'words': [{'t': 'CHAPA GRUESA', 'beat': 'b092', 'word': 'chapa', 'hl': 'yellow'}, {'t': 'PRECALENTAR', 'beat': 'b092', 'word': 'precalentar', 'hl': 'yellow'}, {'t': 'BISELAR', 'beat': 'b092', 'word': 'estaca', 'hl': 'yellow'}]}, word='entendí', off=-0.1, until='b092', sfx=SLAM)
# ===== arreglo =====
add('TdcLabel', 'b093', {'text': 'CHAPA 10 mm', 'at': [50, 15], 'tone': 'yellow'}, word='diez', dur=2.2, sfx=POP)
add('TdcLabel', 'b096', {'text': 'ROJO OSCURO', 'at': [50, 15], 'tone': 'red'}, word='rojo', dur=2.2, sfx=POP)
add('TdcWarning', 'b097', {'text': 'ENFRIAR LENTO · SIN AGUA', 'icons': ['alert'], 'tone': 'yellow'}, word='arena', off=-0.2, dur=3.6, sfx=S('stinger_hit.mp3', -20))
add('TdcLabel', 'b102', {'text': 'BISEL 45°', 'sub': 'las 4 esquinas', 'at': [50, 15], 'tone': 'yellow'}, word='biselo', off=-0.1, dur=2.6, sfx=POP)
# ===== prueba de fuego =====
add('TdcTitleSlam', 'b105', {'pos': 'top', 'size': 110, 'words': [{'t': 'PRUEBA', 'beat': 'b105', 'word': 'vuelta', 'hl': 'yellow'}, {'t': 'DE FUEGO', 'beat': 'b105', 'word': 'estaca', 'hl': 'red'}]}, word='segunda', off=-0.1, dur=2.4, sfx=SLAM)
add('TdcStopwatch', 'b108', {'to': 8, 'label': 'HINCAPOSTES', 'at': [82, 16], 'runFrames': 240}, word='ahí', off=0.0, until='b110', until_off=1.3, sfx=S('digit_tick.mp3', -18))
add('TdcTitleSlam', 'b112', {'pos': 'bottom', 'size': 92, 'words': [{'t': '9 s', 'beat': 'b112', 'word': 'nueve'}, {'t': '· 8 s', 'beat': 'b112', 'word': 'ocho'}, {'t': '· 7,5 s', 'beat': 'b112', 'word': 'siete', 'hl': 'yellow'}]}, word='segunda', off=-0.1, until='b112', sfx=NUM)
# ===== técnica =====
add('TdcLabel', 'b114', {'text': 'NIVEL PRIMERO', 'at': [50, 15], 'tone': 'yellow'}, word='nivel', off=-0.1, dur=2.4, sfx=POP)
add('TdcLabel', 'b115', {'text': 'GOLPES CORTOS', 'sub': 'después, a fondo', 'at': [50, 15], 'tone': 'white'}, word='cortitos', off=-0.2, dur=2.6, sfx=POP)
add('TdcLabel', 'b116', {'text': 'CODOS PEGADOS', 'sub': 'rotomartillo vertical', 'at': [50, 15], 'tone': 'white'}, word='codos', off=-0.2, dur=2.6, sfx=POP)
# ===== pago honesto =====
add('TdcTitleSlam', 'b121', {'pos': 'bottom', 'size': 96, 'words': [{'t': 'MAZA: 3 min 30 s', 'beat': 'b121', 'word': 'tres', 'hl': 'red'}, {'t': 'HINCAPOSTES: 8 s', 'beat': 'b121', 'word': 'ocho', 'hl': 'yellow'}]}, word='tres', off=-0.1, until='b121', sfx=NUM)
add('TdcLabel', 'b122', {'text': 'SIN BISELAR', 'sub': 'a propósito', 'at': [50, 15], 'tone': 'red'}, word='biselar', off=-0.1, dur=2.4, sfx=POP)
add('TdcWarning', 'b124', {'text': 'TIERRA BLANDA · SIN PIEDRAS', 'icons': ['alert'], 'tone': 'yellow'}, word='blanda', off=-0.3, dur=3.0, sfx=S('stinger_hit.mp3', -20))
add('TdcWarning', 'b125', {'text': 'CON PIEDRA, REBOTA', 'icons': ['alert'], 'tone': 'red'}, word='piedra', off=-0.2, dur=2.6, sfx=S('stinger_hit.mp3', -20))
add('TdcLabel', 'b126', {'text': '7–10 s CADA ESTACA', 'at': [50, 15], 'tone': 'yellow'}, word='diez', off=-0.2, dur=2.8, sfx=POP)
add('TdcLabel', 'b128', {'text': 'ALARGUE 30 m', 'sub': 'más lejos: generador', 'at': [50, 15], 'tone': 'white'}, word='alargue', off=-0.2, dur=3.0, sfx=POP)
add('TdcWarning', 'b129', {'text': 'CAÑOS Y CABLES ENTERRADOS', 'icons': ['alert'], 'tone': 'red'}, word='caños', off=-0.2, dur=3.2, sfx=S('stinger_hit.mp3', -18))
add('TdcLabel', 'b130', {'text': 'SÓLO ESTACAS 2×2', 'sub': 'poste de 4": no probé', 'at': [50, 15], 'tone': 'white'}, word='estacas', off=-0.1, dur=3.0, sfx=POP)
# ===== vuelta de tuerca =====
add('TdcTimeSkip', 'b131', {'text': 'UNA MAÑANA'}, word='mañana', off=-0.9, dur=1.2, sfx=S('sfx_whoosh_soft.mp3', -16))
add('TdcLabel', 'b132', {'text': 'PAUSA CADA 10', 'sub': 'que respire', 'at': [50, 15], 'tone': 'yellow'}, word='pausa', off=-0.1, dur=2.6, sfx=POP)
add('TdcLabel', 'b133', {'text': 'ESTACA 62: PIEDRA', 'at': [50, 15], 'tone': 'red'}, word='sesenta', off=-0.1, dur=2.4, sfx=POP)
add('TdcLabel', 'b134', {'text': 'ESQUINEROS: A PALA', 'at': [50, 15], 'tone': 'white'}, word='esquineros', off=-0.1, dur=2.6, sfx=POP)
add('TdcTitleSlam', 'b138', {'pos': 'top', 'size': 92, 'words': [{'t': '2 ELECTRODOS', 'beat': 'b138', 'word': 'electrodos', 'hl': 'yellow'}, {'t': '+ 1 DISCO', 'beat': 'b138', 'word': 'disco'}, {'t': '= LA MITAD DE UN DOMINGO', 'beat': 'b138', 'word': 'domingo', 'hl': 'yellow'}]}, word='gastó', off=-0.1, until='b138', sfx=SLAM)
add('TdcLabel', 'b140', {'text': 'TUTORES DE TOMATE', 'sub': 'mismo vástago, caño más chico', 'at': [50, 15], 'tone': 'white'}, word='varillas', off=-0.3, dur=3.0, sfx=POP)
add('TdcWarning', 'b141', {'text': 'ANTEOJOS · OÍDOS · GUANTES · SÓLO PERCUSIÓN', 'icons': ['goggles', 'gloves', 'alert'], 'tone': 'red'}, word='seguridad', off=-0.2, until='b141', sfx=S('stinger_hit.mp3', -18))
add('TdcTitleSlam', 'b144', {'pos': 'top', 'size': 96, 'words': [{'t': 'PRÓXIMO VIDEO', 'beat': 'b144', 'word': 'próximo', 'hl': 'yellow'}, {'t': 'LA ROLADORA DE CAÑO', 'beat': 'b144', 'word': 'doblo', 'hl': 'red'}]}, word='próximo', off=-0.1, until='b144', until_off=6.0, sfx=SLAM)

D = {'music': {'src': 'sfx/music_federer.mp3', 'start': 6.0, 'db': -23}, 'cam': cam, 'overlays': ov, 'covers': {}}
json.dump(D, open(V + 'director.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('cam', len(cam), 'overlays', len(ov))
