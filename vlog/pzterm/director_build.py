# director_build.py — formato NARRADOR: overlays de src/tdc anclados a palabras (ASR). Números en cifras (whisper-1).
import json
V = 'D:/Proyectos/video2-wt/pzterm/vlog/pzterm/'
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

lab('b002', '5 HÁBITOS QUE LO ROMPEN', 'cinco', tone='red', dur=2.8)
lab('b005', 'PINZA AMPERIMÉTRICA', 'pinza', tone='white', dur=2.6) if False else None
lab('b005', 'MIDE LA CORRIENTE', 'abraza', tone='yellow', dur=2.6)
lab('b008', 'AIRE = ½ FACTURA EN VERANO', 'mitad', tone='yellow', dur=2.8, size=54)
lab('b011', 'EL COMPRESOR', 'compresor', tone='white', dur=2.4)
lab('b015', 'ARRANQUE = MUCHA CORRIENTE', 'arranca', tone='red', dur=2.8, size=54)
lab('b018', 'VELOCIDAD FIJA', 'fija', tone='white', dur=2.4)
lab('b019', 'INVERTER', 'inverter', tone='yellow', dur=2.4)
slam('b021', [('HÁBITO 1', 'primer', 'yellow'), ('16 °C PARA ENFRIAR MÁS RÁPIDO', '16', 'red')], 'primer', size=84, until='b021', off=-0.1) if False else None
add('TdcStepCounter', 'b021', {'step': 1, 'total': 5, 'title': '16 °C NO ENFRÍA MÁS RÁPIDO'}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
lab('b024', 'CONFORT: 24 – 26 °C', '24', tone='yellow', dur=2.8)
warn('b026', 'EL SERPENTÍN SE CONGELA', ['alert'], word='serpentín', dur=3.0)
lab('b029', 'USÁ 24 – 25 °C', '24', tone='yellow', dur=2.6)
lab('b030', 'PEGATINA EN EL CONTROL', 'pegatina', tone='white', dur=2.6)
lab('b033', 'LA PRUEBA: 2 TARDES', 'prueba', tone='white', dur=2.6)
slam('b034', [('TARDE 1: 16 °C', '16', 'red'), ('TARDE 2: 24 °C', '24', 'yellow')], 'primera', size=88, until='b034', off=-0.2)
lab('b038', 'SIN PORCENTAJES INVENTADOS', 'porcentaje', tone='white', dur=2.8, size=54)
add('TdcStepCounter', 'b039', {'step': 2, 'total': 5, 'title': 'PRENDER Y APAGAR'}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
lab('b041', 'CADA ARRANQUE = UN PICO', 'pico', tone='red', dur=2.8)
lab('b044', 'RETARDO DE 3 MINUTOS', 'retardo', tone='yellow', dur=2.8)
lab('b046', '< 1 HORA: DEJALO PRENDIDO', 'hora', tone='white', dur=2.8)
add('TdcStepCounter', 'b050', {'step': 3, 'total': 5, 'title': 'PUERTAS ABIERTAS'}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
lab('b052', 'ENFRÍA LA CALLE', 'calle', tone='red', dur=2.6)
lab('b054', 'CERRÁ · CORTINAS · RECIÉN AHÍ', 'cortinas', tone='yellow', dur=2.8, size=54)
add('TdcStepCounter', 'b057', {'step': 4, 'total': 5, 'title': 'TURBO TODO EL DÍA'}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
lab('b062', 'TURBO: 10 MIN', 'diez', tone='yellow', dur=2.6)
lab('b063', 'MODO DORMIR', 'dormir', tone='white', dur=2.4)
add('TdcStepCounter', 'b064', {'step': 5, 'total': 5, 'title': 'CORTAR DESDE LA LLAVE'}, dur=3.6, sfx=S('sfx_pop.mp3', -15))
warn('b066', 'CORTA CON EL COMPRESOR ANDANDO', ['alert'], word='peor', dur=3.2)
lab('b070', 'CONTROL → VENTILADOR FRENA → LLAVE', 'control', tone='yellow', dur=3.2, size=52)
slam('b072', [('1 NO USAR 16 °C', '16', 'yellow'), ('2 NO PRENDER Y APAGAR', 'apagar', None), ('3 NO ABRIR VENTANAS', 'ventanas', 'yellow')], 'cinco', size=78, until='b072', off=-0.2)
lab('b074', 'NOTA AL LADO DEL AIRE', 'nota', tone='white', dur=2.6)
lab('b075', 'CONTROL EN LUGAR ALTO', 'alto', tone='white', dur=2.6)
lab('b077', 'VENTILADOR DE TECHO: +1 o 2 °C', 'ventilador', tone='yellow', dur=2.8, size=54)
lab('b081', 'TEMPORIZADOR', 'temporizador', tone='yellow', dur=2.4)
lab('b084', 'FILTRO: 1 VEZ POR MES', 'mes', tone='white', dur=2.6)
slam('b087', [('PRÓXIMO VIDEO', 'próximo', 'yellow'), ('ANTES DE PRENDER EL AIRE', 'prender', 'red')], 'próximo', size=88, until='b087', off=-0.1)

D = {'music': {'src': 'sfx/music_federer.mp3', 'start': 3.0, 'db': -23}, 'overlays': [o for o in ov if o], 'amb': 'sfx/amb_taller.mp3', 'tail': 0.0}
json.dump(D, open(V + 'director.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('overlays', len(D['overlays']))
