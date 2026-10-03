# director_build.py — formato NARRADOR: overlays de src/tdc anclados a palabras (ASR). Números en cifras (whisper-1).
import json
V = 'D:/Proyectos/video2-wt/tdcprensa/vlog/tdcprensa/'
S = lambda n, db=-14: [{'src': 'sfx/' + n, 'db': db}]
POP = S('sfx_pop.mp3', -16); SLAM = S('text_slam.mp3', -12); HIT = S('stinger_hit.mp3', -18)
ov = []
def add(kind, beat, props=None, word=None, dur=None, until=None, off=0.0, sfx=None, until_off=0.0):
    o = {'kind': kind, 'beat': beat, 'props': props or {}}
    if word: o['word'] = word
    if until: o['until'] = until
    else: o['dur'] = dur or 2.4
    if off: o['off'] = off
    if until_off: o['until_off'] = until_off
    if sfx: o['sfx'] = sfx
    ov.append(o)
def lab(beat, text, word=None, sub=None, tone='yellow', dur=2.6, off=-0.2, size=None):
    p = {'text': text, 'at': [50, 15], 'tone': tone}
    if sub: p['sub'] = sub
    if size: p['size'] = size
    add('TdcLabel', beat, p, word=word, off=off, dur=dur, sfx=POP)
def warn(beat, text, icons, tone='red', word=None, dur=3.2, off=-0.2, until=None):
    add('TdcWarning', beat, {'text': text, 'icons': icons, 'tone': tone}, word=word, off=off, dur=None if until else dur, until=until, sfx=HIT)
def slam(beat, words, word, pos='top', size=96, dur=3.0, until=None, off=-0.1):
    add('TdcTitleSlam', beat, {'pos': pos, 'size': size, 'words': [{'t': t, 'beat': beat, 'word': w, **({'hl': h} if h else {})} for t, w, h in words]}, word=word, off=off, dur=None if until else dur, until=until, sfx=SLAM)
def tag(beat, name, origin, word, dur=3.0, x=50):
    add('TdcScrapTag', beat, {'name': name, 'origin': origin, 'cost': '$0', 'at': [x, 4]}, word=word, dur=dur, sfx=POP)

lab('b001', 'CHAPA DE 3 mm · A ESCUADRA', 'escuadra', tone='yellow', dur=2.8, size=56)
lab('b002', '90° REPETIBLE', 'perfecto', tone='white', dur=2.4)
warn('b008', 'CASI ME DOBLA A MÍ', ['alert'], word='doblaba', dur=3.0) if False else None
lab('b013', 'PLEGADORA = UN AUTO USADO', 'auto', tone='red', dur=2.8, size=54)
lab('b014', 'GATO DE BOTELLA · 12 t', 'gato', tone='yellow', dur=2.8)
lab('b018', 'LA V ES EL APOYO', 'apoyo', tone='white', dur=2.6)
slam('b021', [('V = 8 × ESPESOR', '8', 'yellow'), ('3 mm → V DE 24', 'espesor', None)], '8', size=86, until='b021', off=-0.2)
warn('b023', '4 ERRORES QUE SE REPITEN', ['alert'], word='4', dur=3.2)
for bid, n, o, w, x in [('b026', 'PERFILES U ×2', 'obra vieja', 'perfiles', 30), ('b028', 'CHAPA 12 mm', 'travesaño', 'chapa', 50), ('b029', 'GATO 12 t', 'camioneta', 'gato', 70), ('b034', 'RESORTES ×2', 'auto', 'resortes', 50), ('b037', 'BARRAS', 'amortiguadores', 'barras', 50)]:
    tag(bid, n, o, w, x=x)
for bid, step, name in [('b043', 1, 'EL BASTIDOR'), ('b049', 2, 'LAS GUÍAS'), ('b054', 3, 'MESA Y MATRIZ V'), ('b060', 4, 'LA CUCHILLA'), ('b064', 5, 'GATO Y RESORTES'), ('b068', 6, 'LA PRUEBA')]:
    add('TdcStepCounter', bid, {'step': step, 'total': 6, 'title': name}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
warn('b040', 'ANTEOJOS · GUANTES · CARETA', ['goggles'], word='anteojos', dur=3.0)
lab('b045', 'SIEMPRE CON ESCUADRA', 'escuadra', tone='white', dur=2.6)
lab('b052', 'GUÍA LARGA = NO SE TRABA', 'larga', tone='yellow', dur=2.8)
lab('b056', '2 → 16 · 3 → 24 · 4 → 32', '16', tone='white', dur=3.2, size=54)
lab('b061', 'CUCHILLA REDONDEADA', 'redondeado', tone='yellow', dur=2.6)
warn('b067', 'RESORTES ESTIRADOS: PEGAN', ['alert'], word='resortes', dur=3.0)
warn('b069', 'MANOS LEJOS DE LA CUCHILLA', ['alert', 'goggles'], word='manos', dur=3.0)
slam('b072', [('SE DOBLÓ TORCIDA', 'torcida', 'red')], 'torcida', size=96, until='b072', off=-0.2)
warn('b074', 'AL COSTADO · NUNCA DE FRENTE', ['alert'], word='costado', dur=3.2)
slam('b075', [('1 GUÍA CORTA', 'guía', 'yellow'), ('2 CHAPA CORRIDA', 'corrida', None), ('3 SIN TOPE', 'tope', 'red')], 'tres', size=84, until='b077', off=-0.2) if False else None
lab('b075', '1 · GUÍA CORTA', 'guía', tone='red', dur=2.6)
lab('b076', '2 · CHAPA CORRIDA', 'corrida', tone='red', dur=2.6)
lab('b077', '3 · SIN TOPE', 'tope', tone='red', dur=2.6)
lab('b078', 'NO ERA FUERZA: ERA PRECISIÓN', 'precisión', tone='yellow', dur=3.0, size=54)
lab('b080', 'GUÍAS DE 18 cm', '18', tone='yellow', dur=2.6)
lab('b083', 'TOPE ATRÁS DE LA MATRIZ', 'tope', tone='white', dur=2.6)
lab('b085', 'CUENCO SOLDADO EN LA BASE', 'cuenco', tone='white', dur=2.8)
lab('b090', '90° SIN TORCERSE', 'noventa', tone='yellow', dur=2.6)
lab('b093', 'ESCUADRA: 90°', 'noventa', tone='white', dur=2.6)
lab('b096', '< 1 MINUTO POR PIEZA', 'minuto', tone='yellow', dur=2.8)
lab('b098', 'RETORNO ELÁSTICO: +3° O 4°', 'retorno', tone='white', dur=3.0, size=54)
lab('b099', 'LÍMITE: 3 mm · 30 cm', 'límites', tone='red', dur=2.8)
warn('b103', 'NUNCA PASES LA CAPACIDAD DEL GATO', ['alert'], word='nunca', dur=3.2)
warn('b104', 'FISURA = SE PARA TODO', ['alert'], word='fisura', dur=3.0)
warn('b105', 'MANOS LEJOS SIEMPRE', ['alert'], word='manos', dur=3.0)
lab('b107', 'MANÓMETRO EN EL GATO', 'manómetro', tone='white', dur=2.6)
lab('b108', 'ESCALA EN EL TOPE', 'escala', tone='white', dur=2.6)
lab('b112', 'IMPRIMACIÓN + NEGRO MATE', 'imprimación', tone='yellow', dur=2.8)
slam('b115', [('GUÍAS LARGAS', 'guías', 'yellow'), ('TOPE FIJO', 'tope', None), ('CHAPA QUE REPARTE', 'reparta', 'yellow')], 'guías', size=84, until='b115', off=-0.2)
slam('b118', [('PRÓXIMO VIDEO', 'próximo', 'yellow'), ('CORTADORA DE PASTO', 'cortadora', 'red')], 'próximo', size=96, until='b118', off=-0.1)

D = {'music': {'src': 'sfx/music_federer.mp3', 'start': 3.0, 'db': -23}, 'overlays': [o for o in ov if o], 'amb': 'sfx/amb_taller.mp3', 'tail': 0.0}
json.dump(D, open(V + 'director.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('overlays', len(D['overlays']))
