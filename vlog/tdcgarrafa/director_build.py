# director_build.py — formato NARRADOR: overlays de src/tdc anclados a palabras (ASR). Números en cifras (whisper-1).
import json
V = 'D:/Proyectos/video2-wt/tdcgarrafa/vlog/tdcgarrafa/'
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

lab('b002', 'LA ESCARCHA SE CORRE', 'escarcha', tone='white', dur=2.4)
warn('b005', 'EL PASO QUE NO SE SALTEA', ['alert'], word='nunca', dur=3.4)
lab('b006', 'MISMO TERMÓMETRO · MISMO TIEMPO', 'comparación', tone='white', dur=3.4, size=54)
lab('b012', '1 GARRAFA POR SEMANA', 'garrafa', tone='red', dur=2.8)
slam('b019', [('1 TUBOS INCLINADOS', 'inclinados', 'yellow'), ('2 MADERA SIN TRATAR', 'tratada', None), ('3 CENICERO', 'cenicero', 'yellow'), ('4 FONDO SIN AGUJEROS', 'fondo', None)], 'uno', size=80, until='b019', off=-0.2)
tag('b022', 'GARRAFA 10 kg', 'vacía y pinchada', 'garrafa', x=30)
tag('b023', 'CAÑO Ø4"', 'chimenea', 'caño', x=50)
tag('b024', 'PLANCHUELA', 'portón viejo', 'planchuela', x=70)
tag('b026', 'LADRILLOS', 'refractarios ×6', 'ladrillos', x=50)
for bid, step, name in [('b034', 1, 'PURGAR LA GARRAFA'), ('b045', 2, 'CORTAR LA PUERTA'), ('b054', 3, 'LAS PATAS'), ('b059', 4, 'LA CHIMENEA'), ('b066', 5, 'PUERTA Y AIRE'), ('b072', 6, 'PISO Y CENICERO'), ('b085', 7, 'PINTAR')]:
    add('TdcStepCounter', bid, {'step': step, 'total': 7, 'title': name}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
warn('b034', 'QUEDA GAS ADENTRO', ['alert'], word='gas', dur=3.2, off=-0.3)
warn('b037', 'AL AIRE LIBRE · SIN CHISPAS', ['alert'], word='aire', dur=3.2)
lab('b039', 'LLENAR DE AGUA', 'agua', tone='yellow', dur=2.6)
warn('b041', 'NUNCA AMOLADORA SIN PURGAR', ['alert', 'goggles'], word='nunca', until='b041')
warn('b042', 'DUDA = QUE LA GASIFIQUEN', ['alert'], word='gasifiquen', dur=3.0, off=-0.5)
lab('b045', 'PUERTA 20 × 15 cm', '20', tone='yellow', dur=2.6)
warn('b048', 'ANTEOJOS · OÍDOS', ['goggles'], word='anteojos', dur=2.8)
lab('b054', '4 PATAS · 40 cm', '40', tone='white', dur=2.6)
lab('b065', 'CAÑO Ø4"', 'cuatro', tone='yellow', dur=2.4)
lab('b069', 'CHAPITA = REGULADOR DE AIRE', 'regulador', tone='yellow', dur=2.8) if False else None
lab('b068', 'CHAPITA = REGULADOR', 'regulador', tone='yellow', dur=2.8)
lab('b071', 'CENICERO', 'cenicero', tone='white', dur=2.4)
lab('b075', 'FONDO SIN AGUJEROS', 'agujeros', tone='white', dur=2.6)
lab('b080', 'NO TIRABA', 'tiraba', tone='red', dur=2.2)
slam('b083', [('CHIMENEA CORTA', 'poca', 'red'), ('= NO TIRA', 'tira', 'yellow')], 'error', size=100, until='b083', off=-0.2)
lab('b082', 'CHIMENEA: ~3 m', 'metros', tone='yellow', dur=2.6, off=-0.4)
lab('b087', 'SECAR UN DÍA ENTERO', 'día', tone='white', dur=2.6)
lab('b089', '3 ENCENDIDOS CHICOS', 'tres', tone='yellow', dur=2.8)
warn('b093', 'AL MENOS 1 m DE LO INFLAMABLE', ['alert'], word='metro', dur=3.2)
warn('b096', 'DETECTOR DE MONÓXIDO', ['alert'], word='detector', dur=3.2)
warn('b098', 'NO PARA DORMITORIOS', ['alert'], word='dormitorio', dur=3.2)
lab('b100', '9 °C', '9', tone='white', dur=2.4)
lab('b103', '16 °C → 20 °C', '16', tone='yellow', dur=2.8)
slam('b108', [('ESTUFA: +3 °C', 'tres', 'red'), ('SALAMANDRA: +10 °C', 'diez', 'yellow')], 'estufa', pos='bottom', size=88, until='b108', off=-0.2)
lab('b112', 'CENIZA: BALDE METÁLICO', 'balde', tone='white', dur=2.8)
lab('b116', 'BOCA INCLINADA = LEÑA SOLA', 'tiltas', tone='yellow', dur=3.0, off=-0.5)
warn('b119', 'MADERA TRATADA: NO', ['alert'], word='tratada', dur=3.0)
lab('b126', 'MATAFUEGO AL ALCANCE', 'matafuego', tone='red', dur=2.8)
slam('b127', [('1 PURGAR CON AGUA', 'purgar', 'yellow'), ('2 CHIMENEA ALTA', 'chimenea', None)], 'uno', size=88, until='b127', off=-0.2)
slam('b128', [('3 DETECTOR + MATAFUEGO', 'detector', 'yellow'), ('4 1 m · SIN DORMITORIO', 'metro', 'red')], 'tres', size=84, until='b128', off=-0.2)
slam('b130', [('PRÓXIMO VIDEO', 'próximo', 'yellow'), ('PRENSA PLEGADORA', 'plegadora', 'red')], 'próximo', size=96, until='b130', off=-0.1)

D = {'music': {'src': 'sfx/music_federer.mp3', 'start': 3.0, 'db': -23}, 'overlays': [o for o in ov if o], 'amb': 'sfx/amb_taller.mp3', 'tail': 0.0}
json.dump(D, open(V + 'director.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('overlays', len(D['overlays']))
