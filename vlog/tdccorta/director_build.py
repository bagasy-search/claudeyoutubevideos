# director_build.py — formato NARRADOR: overlays de src/tdc anclados a palabras (ASR). Números en cifras (whisper-1).
import json
V = 'D:/Proyectos/video2-wt/tdccorta/vlog/tdccorta/'
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

lab('b001', 'AMOLADORA VIEJA = CORTADORA', 'pasto', tone='yellow', dur=2.8)
warn('b004', 'UNA CUCHILLA A 10.000 VUELTAS', ['alert', 'goggles'], word='cuchilla', dur=3.2)
slam('b005', [('EL DISCO ESTALLÓ', 'pedazos', 'red')], 'pedazos', size=96, until='b005', off=-0.2)
lab('b009', 'PATIO DE 30 m²', '30', tone='white', dur=2.6)
lab('b010', 'HILO CADA 10 MIN', 'hilo', tone='red', dur=2.6)
slam('b016', [('1 MANGO LARGO', 'largo', 'yellow'), ('2 SEGURA', 'segura', None), ('3 QUE RESPONDA', 'responda', 'yellow')], 'uno', size=84, until='b016', off=-0.2) if False else None
lab('b016', '1 MANGO · 2 SEGURA · 3 RENDIR', 'mango', tone='yellow', dur=3.0, size=54)
for bid, n, o, w, x in [('b020', 'AMOLADORA 115 mm', 'vieja', 'amoladora', 30), ('b021', 'RUEDAS ×4', 'carrito de súper', 'ruedas', 50), ('b022', 'CHAPA 3 mm Ø35', 'plataforma', 'chapa', 70), ('b024', 'PLANCHUELA 4×25', 'la cuchilla', 'planchuela', 50), ('b026', 'GOMA DE NEUMÁTICO', 'el faldón', 'goma', 50)]:
    tag(bid, n, o, w, x=x)
for bid, step, name in [('b032', 1, 'PLATAFORMA Y RUEDAS'), ('b040', 2, 'MONTAR LA AMOLADORA'), ('b045', 3, 'CUCHILLA Y BALANCEO'), ('b059', 4, 'CÚPULA Y FALDÓN'), ('b065', 5, 'MANGO Y FRENO'), ('b072', 6, 'LA PRUEBA')]:
    add('TdcStepCounter', bid, {'step': step, 'total': 6, 'title': name}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
warn('b034', 'ANTEOJOS · GUANTES', ['goggles'], word='anteojos', dur=2.8)
lab('b035', 'AGUJERO DE 60 mm', '60', tone='white', dur=2.6)
lab('b043', 'CERO JUEGO', 'milímetro', tone='yellow', dur=2.4)
lab('b049', 'BALANCEO: LA GRAVEDAD NO MIENTE', 'balanceo', tone='yellow', dur=3.0, size=54)
warn('b050', 'DESBALANCEADA = VIBRA Y ROMPE', ['alert'], word='desbalanceada', dur=3.2)
slam('b055', [('DISCO DE CORTE: NO', 'estalló', 'red'), ('CUCHILLA DE ACERO: SÍ', 'pedazos', 'yellow')], 'estalló', size=84, until='b055', off=-0.1)
warn('b057', 'EL DISCO NO AGUANTA PIEDRAS', ['alert', 'goggles'], word='piedras', dur=3.2)
lab('b063', 'FALDÓN A 1 cm DEL SUELO', 'centímetro', tone='white', dur=2.8)
lab('b067', 'MANIJA DE FRENO = GATILLO', 'manija', tone='yellow', dur=2.8)
slam('b069', [('SI LA SUELTAS, CORTA', 'sueltas', 'yellow'), ('HOMBRE MUERTO', 'caes', 'red')], 'sueltas', size=88, until='b070', off=-0.2)
warn('b071', 'NUNCA TRABADA', ['alert'], word='nunca', dur=2.8)
warn('b072', 'ANTEOJOS · BOTAS · GUANTES · OÍDOS', ['goggles'], word='anteojos', dur=3.0)
lab('b073', 'BARRER EL TERRENO', 'recorro', tone='white', dur=2.6)
lab('b077', 'CORTE PAREJO A 4 cm', 'cuatro', tone='yellow', dur=2.6)
warn('b080', 'SE SUELTA Y SE DESENCHUFA', ['alert'], word='regla', dur=3.2)
lab('b081', 'CASQUILLO CORTO EN EL EJE', 'casquillo', tone='yellow', dur=2.8)
slam('b086', [('DESMALEZADORA: 4 min 30', 'desmalezadora', 'white'), ('CORTADORA: MENOS', 'cortadora', 'yellow')], 'desmalezadora', size=84, until='b086', off=-0.2)
lab('b087', 'VENTAJA MODESTA · SIN TRAMPA', 'modesta', tone='white', dur=3.0, size=54)
lab('b089', 'HASTA 50 m²', '50', tone='yellow', dur=2.6)
warn('b092', 'PARQUE GRANDE: NO', ['alert'], word='parque', dur=2.8)
slam('b094', [('7 REGLAS DE SEGURIDAD', 'reglas', 'red')], 'reglas', size=90, until='b094', off=-0.2)
warn('b096', 'NUNCA SIN CÚPULA NI FALDÓN', ['alert'], word='nunca', dur=3.2)
lab('b100', 'RUEDA TRASERA MÁS GRANDE', 'rueda', tone='white', dur=2.6)
lab('b102', 'ALTURA REGULABLE', 'regulación', tone='white', dur=2.4)
slam('b106', [('CUCHILLA, NO DISCO', 'cuchilla', 'yellow'), ('PROTECCIÓN COMPLETA', 'protección', None), ('GATILLO SIN TRABAR', 'gatillo', 'yellow')], 'cuchilla', size=82, until='b106', off=-0.2)
slam('b108', [('PRÓXIMO VIDEO', 'próximo', 'yellow'), ('HACHA OXIDADA COMO NUEVA', 'hacha', 'red')], 'próximo', size=88, until='b108', off=-0.1)

D = {'music': {'src': 'sfx/music_federer.mp3', 'start': 3.0, 'db': -23}, 'overlays': [o for o in ov if o], 'amb': 'sfx/amb_taller.mp3', 'tail': 0.0}
json.dump(D, open(V + 'director.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('overlays', len(D['overlays']))
