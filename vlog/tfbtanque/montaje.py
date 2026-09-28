# MONTAJE — la capa de motion graphics y la cámara virtual, anclada al ms por PALABRA (global.json), más la lista de SFX
# para la mezcla. Un momento "wow" por minuto. Salidas: src/tfbtanque/timeline.gen.ts + vlog/tfbtanque/sfx.json
# uso: python vlog/tfbtanque/montaje.py
import json, re, unicodedata, math, os
R = 'D:/Proyectos/video2-wt/tfbtanque/'
G = json.load(open(R + 'vlog/tfbtanque/global.json', encoding='utf8'))
FPS = 30; TOT = G['frames']
def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn'); return re.sub(r'[^a-z0-9ñ$]', '', w)
W = [(norm(x['w']), x['t'], x['e']) for x in G['words'] if not x['w'].startswith('[V]')]
W = [w for w in W if w[0]]
NUM = {'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5', 'seis': '6', 'diez': '10', 'treinta': '30', 'veinticuatro': '24', 'sesenta': '60', 'cien': '100'}
def _eq(a, b): return a == b or NUM.get(a) == b or NUM.get(b) == a
def find(ph, after=0.0, which='start'):
    toks = [norm(t) for t in ph.split() if norm(t)]
    for i in range(len(W)):
        if W[i][1] < after: continue
        if all(i + k < len(W) and _eq(W[i + k][0], toks[k]) for k in range(len(toks))):
            return W[i][1] if which == 'start' else W[i + len(toks) - 1][2]
    if os.environ.get('PARCIAL') == '1': return 1e9
    raise SystemExit(f'⛔ no encuentro la frase: "{ph}" (después de {after:.1f}s)')
F = lambda s: int(round(s * FPS))
CLIP = {c['id']: c for c in G['clips']}
def clip(i): return CLIP[i]
OVER, CAM, SFX = [], [], []
def over(kind, t, dur, sfx=None, sdb=-8, **props):
    OVER.append({'kind': kind, 'from': F(t), 'dur': max(6, F(dur)), 'props': props})
    if sfx: SFX.append({'src': sfx, 't': round(t, 3), 'db': sdb})
def cam(kind, t, dur, **k): CAM.append({'f': F(t), 'dur': max(2, F(dur)), 'kind': kind, **k})
def sfx(src, t, db=-8): SFX.append({'src': src, 't': round(t, 3), 'db': db})
WH = ['sfx/whoosh.mp3', 'sfx/sfx_whoosh_soft.mp3', 'sfx/ksjsbwuil-whoosh3-481204.mp3', 'sfx/stereogenicstudio-swish-swoosh-woosh-sfx-36-357175.mp3', 'sfx/freesound_community-whoosh-blow-flutter-shortwav-14678.mp3']
HIT = ['sfx/impacto_hit.mp3', 'sfx/text_slam.mp3', 'sfx/number_slam.mp3', 'sfx/sfx_text_thud.mp3']
POP = ['sfx/sfx_pop.mp3', 'sfx/node_pop.mp3', 'sfx/pin_plop.mp3', 'sfx/chip_pop3d.mp3']
LINE = 'sfx/line_draw.mp3'; RISER = 'sfx/cp_riser.wav'; TICK = 'sfx/digit_tick.mp3'; CHIME = 'sfx/winner_chime.mp3'; BOOM = 'sfx/deep-cinematic-impact-1.mp3'
BASE = 'tfbtanque_vlog.mp4'

# ── transiciones entre escenas: whip + whoosh en cada unión de segmentos; whoosh suave en cada corte del minuto 1
for k, sg in enumerate(G['segs'][1:], 1):
    t = sg['f0'] / FPS
    cam('whip', t - 0.23, 0.46, dir=(1 if k % 2 else -1)); sfx(WH[k % len(WH)], t - 0.25, -12)
for c in G['clips']:
    t = c['gvstart']
    if 0.5 < t < 62 and not any(abs(t - sg['f0'] / FPS) < 0.1 for sg in G['segs']): sfx(WH[int(t * 7) % len(WH)], t - 0.15, -18)

# ═════════ MINUTO 1 — el tráiler (cero silencios, ≥20 cortes, ninguna toma > 4 s) ═════════

cam('shake', 0.0, 1.2, amt=0.8); cam('push', 1.2, 1.8, amt=0.06)
over('mark', 0.9, 2.1, sfx=LINE, sdb=-14, items=[{'kind': 'circle', 'x': 57, 'y': 30, 'w': 14, 'h': 22, 'from': 0, 'seed': 3}])
t = find('Un tanque nuevo sale una fortuna'); over('word', t + 0.3, 2.1, sfx=HIT[3], sdb=-10, text='una fortuna', variant='red', y=80, size=110)
t = find('menos de dos dólares'); over('word', t, 2.2, sfx=HIT[0], text='$2', sub='en materiales', variant='yellow', y=72, size=190, rot=-3)
cam('frame', t, 2.4, amt=0.22, ox=55, oy=35)                       # jump cut a plano cerrado dentro de la toma larga
t = find('sin soldar metal'); over('word', t, 1.6, sfx=HIT[1], sdb=-11, text='sin soldar', variant='white', y=74, size=120)
t = find('sin una gota de pegamento'); over('word', t, 2.0, sfx=HIT[2], sdb=-10, text='pegamento', variant='white', strike=True, y=74, size=120)
cam('frame', t - 0.1, 2.1, amt=0.12, ox=40, oy=40)
t = find('Este símbolo'); over('mark', t + 0.5, 2.3, sfx=POP[0], sdb=-12, items=[{'kind': 'circle', 'x': 52, 'y': 55, 'w': 16, 'h': 26, 'color': '#FFD21F', 'from': 6}, {'kind': 'label', 'x': 76, 'y': 30, 'text': '= polietileno', 'from': 14}])
t = find('Dos agujeritos en las puntas'); cam('punch', t + 0.8, 0.5, amt=0.1); sfx(HIT[3], t + 0.8, -14)
t = find('que se hunde'); cam('push', t, 2.0, amt=0.1)
t = find('en el mismo plástico derretido'); cam('punch', t, 0.45, amt=0.12); over('flash', t, 0.2, sfx=BOOM, sdb=-12, color='#FFD21F', peak=0.35)
t = find('Por fuera, y también por dentro')                 # WOW min 1: el tríptico de la miniatura
over('triptych', t - 0.1, 2.6, sfx=WH[3], sdb=-9, panels=[
    {'src': 'img/tfbtanque/trip_1.jpg', 'focusX': 55}, {'src': 'img/tfbtanque/trip_2.jpg', 'mark': 'circle', 'mx': 52, 'my': 50},
    {'src': 'img/tfbtanque/trip_3.jpg', 'mark': 'arrow', 'mx': 62, 'my': 58, 'focusX': 65}])
sfx(POP[1], t + 0.2, -12); sfx(POP[2], t + 0.5, -12); sfx(POP[3], t + 0.8, -12)
t = find('ni una gota'); over('word', t, 1.8, sfx=CHIME, sdb=-10, text='ni una gota', variant='yellow', y=76, size=130)
t = find('Pero quédate hasta el final'); sfx(RISER, t - 0.2, -10)
over('teaser', t + 0.2, 7.5, sfx=POP[0], sdb=-12, kicker='AL FINAL DEL VIDEO', text='Por qué el pegamento nunca funciona')
t = find('la silicona y la cinta'); cam('frame', t, 2.2, amt=0.2, ox=50, oy=38)
t = find('Con una sola gota de agua'); over('word', t, 2.3, sfx=HIT[0], text='1 gota de agua', variant='white', y=76, size=110)

# ═════════ 1:00-2:00 — el arreglo completo de corrido, con contador de pasos ═════════
steps = [('Vacío el tanque', 'Vaciar'), ('Seco bien', 'Secar y limpiar'), ('Raspo la capa de afuera', 'Raspar'), ('Un agujerito de tres milímetros', 'Agujeritos'),
         ('Abro la grieta en V', 'Abrir en V'), ('Y relleno con una tira', 'Rellenar'), ('Encima, la malla', 'Malla'), ('Por dentro, lo mismo', 'Por dentro'),
         ('Lo dejo enfriar solo', 'Enfriar'), ('Lo paro, lo lleno', 'Prueba')]
ts = [find(p) for p, _ in steps] + [find('y esa es la reparación completa')]
for i, ((p, lab), t) in enumerate(zip(steps, ts)):
    over('step', t, min(12.0, ts[i + 1] - t + 0.05), sfx=TICK, sdb=-12, n=i + 1, total=len(steps), label=lab)
t = find('y esa es la reparación completa'); over('word', t, 2.2, sfx=CHIME, sdb=-10, text='reparación completa', variant='yellow', y=78, size=100)

# ═════════ S2 — el pegamento (dolor #1) ═════════
t = find('casi siempre son de polietileno'); over('word', t + 0.6, 2.2, sfx=HIT[1], sdb=-11, text='polietileno', variant='yellow', y=80, size=110)
t = find('al que casi nada se le pega'); over('mark', t, 3.0, items=[{'kind': 'label', 'x': 70, 'y': 22, 'text': 'ceroso, resbaloso', 'from': 0}])
t = find('El pegamento queda apoyado encima'); over('word', t + 0.4, 2.4, sfx=HIT[3], sdb=-11, text='apoyado, no agarrado', variant='red', y=80, size=90)
t = find('y el plástico se mueve'); cam('shake', t, 1.0, amt=0.5)
t = find('Hacemos que el propio tanque se cierre'); over('word', t, 2.4, sfx=HIT[0], text='el tanque se cierra solo', variant='yellow', y=80, size=90)
t = find('tiene que ser el mismo plástico'); over('word', t, 2.6, sfx=HIT[2], sdb=-10, text='el mismo plástico', variant='white', y=78, size=110)

# ═════════ S3 — qué plástico es (WOW min 3: el símbolo que se lee) ═════════
t = find('El triangulito de reciclaje'); over('mark', t + 0.3, 3.2, sfx=LINE, sdb=-14, items=[{'kind': 'circle', 'x': 50, 'y': 55, 'w': 18, 'h': 30, 'color': '#FFD21F', 'from': 0}])
t0 = find('Si adentro dice dos'); t1 = find('Si dice cinco, o PP'); t2 = find('Y aquí viene la trampa')
over('plastic', t0, (t2 - t0) + 1.2, sfx=POP[1], sdb=-10, title='¿QUÉ PLÁSTICO ES?', items=[{'code': '2', 'letters': 'PE', 'name': 'polietileno', 'ok': True, 'at': 0},
     {'code': '4', 'letters': 'PE', 'name': 'polietileno', 'ok': True, 'at': F(0.9)}, {'code': '5', 'letters': 'PP', 'name': 'polipropileno', 'ok': False, 'at': F(t1 - t0)}], focus=[{'f': F(t1 - t0), 'i': 2}])
sfx(HIT[2], t1 + 1.0, -12)
t = find('fibrocemento'); over('word', t, 2.4, sfx=HIT[3], sdb=-11, text='fibrocemento: se cambia', variant='red', y=80, size=90)
t = find('Mira: aquí dice cinco'); over('word', t + 0.4, 1.8, sfx=HIT[1], text='5 = PP', variant='red', y=76, size=130)
t = find('parecen unidos, pero no se mezclan'); over('word', t, 2.4, sfx=HIT[3], sdb=-11, text='no se mezclan', variant='white', strike=False, y=80, size=110)
t = find('Lo seguro es rellenar'); over('word', t, 2.6, sfx=CHIME, sdb=-12, text='mismo número', variant='yellow', y=80, size=120)
t = find('tiras de medio centímetro'); over('mark', t, 2.8, items=[{'kind': 'label', 'x': 72, 'y': 24, 'text': '5 mm de ancho', 'from': 0}])

# ═════════ S4 — agua potable + la historia de Ramón ═════════
t = find('que es agua para tomar'); over('word', t, 2.2, sfx=HIT[0], text='agua potable', variant='red', y=80, size=110)
t = find('La malla metálica va solo por fuera'); over('word', t + 0.3, 2.6, sfx=HIT[3], sdb=-11, text='malla: solo afuera', variant='yellow', y=80, size=100)
t = find('Me escribió Ramón'); over('word', t + 0.5, 3.0, sfx=POP[2], sdb=-12, text='Ramón · Barquisimeto', sub='Venezuela', variant='white', x=30, y=82, size=64, rot=0)
t = find('Tres veces goteó otra vez'); over('word', t, 1.8, sfx=HIT[1], text='3 veces', variant='red', y=78, size=120)
t = find('cinco. Polipropileno'); cam('punch', t, 0.5, amt=0.12); over('word', t, 2.0, sfx=HIT[0], text='era PP', variant='red', y=78, size=130)
t = find('Lo rehízo con tiras de un bidón'); over('wipe', t, 4.2, sfx=WH[2], sdb=-10, before={'src': 'img/tfbtanque/wipe_tapitas.jpg'}, after={'src': 'img/tfbtanque/wipe_bidon.jpg'}, beforeLabel='TAPITAS (5)', afterLabel='BIDÓN (2)')
t = find('Fue usar el plástico correcto'); over('word', t, 2.2, sfx=CHIME, sdb=-12, text='el plástico correcto', variant='yellow', y=80, size=100)

# ═════════ S5 — la herramienta (WOW min 5: la lupa sobre la punta y el punto justo) ═════════
t = find('de sesenta a cien vatios'); over('word', t, 2.4, sfx=HIT[3], sdb=-11, text='60 a 100 W', variant='yellow', y=78, size=130)
t = find('Le cambio la punta por una plana'); over('zoom', t + 0.4, 3.4, sfx=POP[3], sdb=-11, src=BASE, startFrom=F(t + 0.4), track=[{'f': 0, 'x': 50, 'y': 45}], zoom=2.0, cx=78, cy=40, r=230)
t0 = find('Y los dos dólares son esto'); t1 = find('El plástico sale gratis')
over('list', t0, (t1 - t0) + 3.0, sfx=POP[0], sdb=-12, title='LOS $2', accent='#FFD21F', rows=[{'text': 'Retazo de malla', 'at': F(1.4)}, {'text': 'Un poco de alcohol', 'at': F(2.2)}, {'text': 'Broca fina', 'at': F(3.0)}, {'text': 'Plástico de un bidón viejo', 'at': F(t1 - t0), 'mark': 'check'}])
t = find('Si el plástico humea mucho'); over('word', t + 0.3, 2.6, sfx=HIT[1], text='demasiado caliente', variant='red', y=80, size=100)
t = find('Tiene que ponerse brillante'); over('word', t + 0.3, 2.8, sfx=CHIME, sdb=-12, text='brillante, sin burbujas', variant='yellow', y=80, size=90)
t = find('El plástico se quema por arriba'); over('word', t, 2.2, sfx=HIT[2], sdb=-11, text='encendedor: no', variant='white', strike=False, y=80, size=100)
t = find('el humo del plástico no se respira'); over('word', t, 2.6, sfx=HIT[3], sdb=-11, text='al aire libre', variant='red', y=80, size=110)
t = find('escalera firme, y entre dos'); over('word', t, 2.4, sfx=HIT[3], sdb=-12, text='entre dos', variant='white', y=80, size=110)

# ═════════ S6 — LA LÁMINA (min ~7) + CTA 1 ═════════
t = find('Presta muchísima atención'); cam('push', t, 5.5, amt=0.12); sfx(RISER, t + 3.2, -9)
lam = next(sg for sg in G['segs'] if sg['type'] == 'lamina'); L0 = lam['f0'] / FPS; LD = lam['nf'] / FPS
def lp(ph): return F(find(ph) - L0)
over('lamina', L0, LD, sfx=BOOM, sdb=-12, src='img/tfbtanque/lamina_0.png', points=[
    {'f': 0, 'x': 50, 'y': 50, 'z': 1.0},
    {'f': lp('Arriba, antes de empezar'), 'x': 12, 'y': 60, 'z': 1.9, 'box': [1, 28, 13, 52]},
    {'f': lp('Después, los agujeritos'), 'x': 30, 'y': 45, 'z': 2.0, 'box': [14, 30, 20, 30]},
    {'f': lp('La malla se corta'), 'x': 38, 'y': 72, 'z': 2.0, 'box': [14, 57, 22, 24]},
    {'f': lp('Por dentro, una sola capa'), 'x': 30, 'y': 90, 'z': 1.8, 'box': [1, 82, 36, 17]},
    {'f': lp('Y abajo, los tres errores'), 'x': 85, 'y': 88, 'z': 2.1, 'box': [69, 72, 29, 25]},
    {'f': lp('Sácale una captura'), 'x': 50, 'y': 50, 'z': 1.0}])
for ph in ['Arriba, antes de empezar', 'Después, los agujeritos', 'La malla se corta', 'Por dentro, una sola capa', 'Y abajo, los tres errores']: sfx(WH[1], find(ph) - 0.2, -16)
t = find('Esta hoja la armé'); t2 = find('el enlace está abajo', after=t)
over('cta', t + 2.0, (t2 - t) + 3.5, sfx=POP[1], sdb=-10, qr='img/tfbtanque/qr_tfbtanque.png', cover='img/tfbtanque/portada-coleccion.jpg', kicker='LA GUÍA DEL CANAL', line='Escanea con tu teléfono')

# ═════════ S7/S7B — marcar y FRENAR la grieta (WOW min 8: la grieta que avanza y se frena) ═════════
t = find('marco con un marcador'); over('mark', t + 1.2, 3.5, sfx=LINE, sdb=-14, items=[{'kind': 'arrow', 'x': 30, 'y': 20, 'x2': 44, 'y2': 42, 'color': '#FFD21F', 'from': 0}, {'kind': 'label', 'x': 22, 'y': 14, 'text': 'un poco más allá', 'from': 8}])
t = find('Siempre es más larga de lo que parece'); over('word', t, 3.1, sfx=HIT[3], sdb=-11, text='más larga de lo que parece', variant='white', y=80, size=86)
t = find('paso uno: vaciarlo'); over('step', t, 4.0, sfx=TICK, sdb=-12, n=1, total=6, label='Vaciar y secar')
t = find('Una gota atrapada adentro hierve'); over('word', t + 0.5, 2.6, sfx=HIT[1], text='gota atrapada = poro', variant='red', y=80, size=90)
t = find('Nada de detergente'); over('word', t, 2.0, sfx=HIT[3], sdb=-12, text='detergente: no', variant='white', y=80, size=100)
t = find('Es la piel que quemó el sol'); over('mark', t - 0.8, 3.2, items=[{'kind': 'label', 'x': 72, 'y': 20, 'text': 'piel quemada por el sol', 'from': 0, 'size': 64}])
t0 = find('Con cada llenado, el peso del agua empuja'); t1 = find('Por eso, en cada punta'); t2 = find('la grieta se frena ahí')
over('crack', t0, (t2 - t0) + 2.2, sfx=RISER, sdb=-12, holesAt=F(t1 - t0 + 0.8), holeLabel='3 mm', pressureLabel='el agua empuja', stopLabel='SE FRENA')
sfx(HIT[0], t1 + 0.8, -9); sfx(CHIME, t2 + 0.6, -12)

# ═════════ S8 — abrir en V y fundir (WOW min 9: el corte de la soldadura) ═════════
t = find('Paso dos: el cautín bien caliente'); over('step', t, 3.2, sfx=TICK, sdb=-12, n=2, total=6, label='Abrir en V')
tv = find('abro la grieta en V, como una canaleta'); tf = find('Ahora apoyo la tira'); tm = find('Amaso con la punta')
over('weld', tv - 0.2, (tm - tv) + 5.0, sfx=WH[4], sdb=-12, at={'v': F(0.8), 'fill': F(tf - tv + 0.2)}, labels={'v': 'canaleta en V', 'fill': 'fundido CON el borde', 'outside': 'AFUERA', 'water': 'ADENTRO', 'title': 'EL CORTE DEL ARREGLO'})
t = find('tienes que ver que el tanque también se derrite'); over('word', t, 2.8, sfx=HIT[0], text='se derriten los dos', variant='yellow', y=80, size=100)
t = find('Es otro pegamento'); over('word', t, 1.8, sfx=HIT[2], sdb=-10, text='otro pegamento', variant='red', y=80, size=110)
t = find('pásale la uña'); over('word', t, 2.4, sfx=POP[2], sdb=-12, text='la prueba de la uña', variant='white', y=80, size=100)

# ═════════ S9 — la malla (WOW min 10: la malla hundiéndose, lupa + corte) ═════════
t = find('La malla. Sirve la de mosquitero'); over('step', t, 3.2, sfx=TICK, sdb=-12, n=3, total=6, label='Malla solo afuera')
t = find('La de hierro común'); over('word', t, 2.2, sfx=HIT[1], text='hierro: se oxida', variant='red', y=80, size=100)
t = find('La corto dos centímetros más grande'); over('word', t + 0.3, 2.8, sfx=HIT[3], sdb=-11, text='+2 cm por lado', variant='yellow', y=80, size=130)
t = find('El plástico del tanque sube por los agujeritos'); over('zoom', t, 3.6, sfx=POP[3], sdb=-11, src=BASE, startFrom=F(t), track=[{'f': 0, 'x': 50, 'y': 50}], zoom=1.9, cx=78, cy=38, r=240)
t = find('Tiene que quedar a media altura')
tw0 = find('No la aprietes de más'); tw1 = find('La malla hace el trabajo del hierro')
over('weld', tw0, (tw1 - tw0) + 7.5, sfx=WH[0], sdb=-12, at={'v': 0, 'fill': 0, 'mesh': F(1.0), 'cover': F(find('otra capa de tira derretida') - tw0)}, labels={'mesh': 'malla a media altura', 'cover': 'capa de cierre', 'outside': 'AFUERA', 'water': 'ADENTRO'})
t = find('Y los bordes, en rampa'); sfx(POP[0], t, -12)

# ═════════ S10 — por dentro, enfriar y CTA 2 (~65 %) ═════════
t = find('Ahora, por dentro'); over('step', t, 3.2, sfx=TICK, sdb=-12, n=4, total=6, label='Por dentro')
t = find('Mira el color de adentro: blanco'); over('word', t + 0.4, 2.0, sfx=POP[1], sdb=-12, text='blanco por dentro', variant='white', y=80, size=100)
t = find('como un sándwich'); over('word', t, 2.7, sfx=HIT[3], sdb=-12, text='sellado de los dos lados', variant='yellow', y=80, size=86)
t = find('no lo enfríes con agua'); over('word', t, 2.4, sfx=HIT[0], text='agua fría', variant='white', strike=True, y=80, size=130); cam('punch', t, 0.5, amt=0.1)
t = find('Media hora, a la sombra'); over('step', t, 3.0, sfx=TICK, sdb=-12, n=5, total=6, label='Enfriar 30 min')
t = find('El agua que más se pierde en una casa'); over('word', t, 2.8, sfx=HIT[3], sdb=-11, text='el agua que no se ve', variant='yellow', y=80, size=100)
t = find('Eso lo tengo en la guía del canal'); t2 = find('Si te sirve, el enlace está abajo')
over('cta', t, (t2 - t) + 4.2, sfx=POP[1], sdb=-10, qr='img/tfbtanque/qr_tfbtanque.png', cover='img/tfbtanque/portada-coleccion.jpg', kicker='LA GUÍA DEL CANAL', line='Escanea con tu teléfono')

# ═════════ S11 — la base y la prueba (WOW min 12: 24 horas en 6 segundos) ═════════
t = find('Una piedrita abajo'); over('mark', t + 0.4, 3.0, sfx=LINE, sdb=-14, items=[{'kind': 'circle', 'x': 50, 'y': 45, 'w': 12, 'h': 20, 'from': 0}])
t = find('Lo paro en su lugar'); over('step', t, 3.0, sfx=TICK, sdb=-12, n=6, total=6, label='La prueba')
t0 = find('Y lo dejo veinticuatro horas'); t1 = find('Si hay una pérdida mínima')
over('leak', t0, 6.5, sfx=RISER, sdb=-14, hours=24, label='LLENO HASTA ARRIBA · 24 H', okLabel='PAPEL SECO', fillUntil=F(1.6))
t = find('Al otro día: papel seco'); over('word', t, 2.4, sfx=CHIME, sdb=-10, text='papel seco', variant='yellow', y=80, size=120)
t = find('Casi siempre es un poro chiquito'); over('word', t, 2.2, sfx=POP[0], sdb=-12, text='otra pasada y listo', variant='white', y=80, size=100)
t = find('dale sombra'); over('word', t, 2.2, sfx=HIT[3], sdb=-12, text='dale sombra', variant='yellow', y=80, size=110)

# ═════════ S12 — los 3 errores y los límites (WOW min 13) ═════════
t0 = find('Te resumo los tres errores'); ts = [find('Uno: rellenar con otro plástico'), find('Dos: no hacer los agujeritos'), find('Tres: derretir solo la tira')]
over('list', t0, (ts[2] - t0) + 7.0, sfx=HIT[1], sdb=-10, title='LOS 3 ERRORES', rows=[{'text': 'Otro plástico', 'at': F(ts[0] - t0)}, {'text': 'Sin agujeritos', 'at': F(ts[1] - t0)}, {'text': 'Fundir solo la tira', 'at': F(ts[2] - t0)}])
for x in ts: sfx(HIT[3], x, -12)
t0 = find('cuándo no vale la pena'); ts = [find('Si la grieta es muy larga'), find('Si está en la base'), find('se quiebra como una galleta')]
over('list', t0, (ts[2] - t0) + 6.0, sfx=HIT[0], sdb=-10, title='CAMBIA EL TANQUE SI…', accent='#E32619', side='right', rows=[{'text': 'Grieta de más de un palmo', 'at': F(ts[0] - t0), 'mark': 'x'}, {'text': 'En la base o la rosca', 'at': F(ts[1] - t0), 'mark': 'x'}, {'text': 'Plástico cristalizado', 'at': F(ts[2] - t0), 'mark': 'x'}])
for x in ts: sfx(POP[2], x, -12)
t = find('se quiebra como una galleta'); cam('shake', t + 1.2, 0.8, amt=0.8); sfx(BOOM, t + 1.2, -12)
t = find('Te dejé exactamente cómo hacerlo en la descripción'); over('word', t, 2.8, sfx=POP[3], sdb=-10, text='en la descripción', sub='la variante para curvas y esquinas', variant='yellow', y=76, size=100)

# ═════════ S13 — el cierre: por qué el pegamento no sirve (WOW final: la gota) ═════════
t = find('La silicona sale entera'); cam('punch', t + 0.6, 0.5, amt=0.1); sfx(HIT[3], t + 0.6, -12)
t = find('El epoxi salta de una pieza'); cam('punch', t + 0.5, 0.5, amt=0.1); sfx(HIT[3], t + 0.5, -12)
t = find('Nunca se agarraron'); over('word', t, 2.0, sfx=HIT[0], text='nunca se agarraron', variant='red', y=80, size=100)
t = find('lo que te prometí: una gota de agua'); sfx(RISER, t - 0.5, -10)
t0 = find('Mira cómo queda'); t1 = find('imagínate un pegamento')
over('drop', t0 + 1.5, (t1 - t0) + 2.5, sfx=CHIME, sdb=-14, leftLabel='MADERA', rightLabel='POLIETILENO', leftNote='la moja', rightNote='ni la moja', title='LA PRUEBA DE LA GOTA')
t = find('La costura aguanta'); over('word', t, 2.2, sfx=HIT[0], text='la costura aguanta', variant='yellow', y=80, size=110); cam('shake', t - 0.6, 0.8, amt=0.7)
t = find('es el mismo plástico, otra vez de una sola pieza'); over('word', t, 3.0, sfx=HIT[2], sdb=-10, text='una sola pieza', variant='yellow', y=80, size=130)
t = find('mismo plástico, agujeritos, malla, y paciencia'); over('list', t, 5.5, sfx=POP[0], sdb=-12, title='EN RESUMEN', accent='#FFD21F', rows=[{'text': 'Mismo plástico', 'at': 0, 'mark': 'check'}, {'text': 'Agujeritos', 'at': F(1.0), 'mark': 'check'}, {'text': 'Malla', 'at': F(1.8), 'mark': 'check'}, {'text': 'Paciencia', 'at': F(2.4), 'mark': 'check'}])
t = find('La hoja y la guía con los arreglos del agua'); over('cta', t, (TOT / FPS - t) - 0.3, sfx=POP[1], sdb=-10, qr='img/tfbtanque/qr_tfbtanque.png', cover='img/tfbtanque/portada-coleccion.jpg', kicker='LA GUÍA DEL CANAL', line='Escanea con tu teléfono')

# ── clip límites y salida
OVER = [o for o in OVER if 0 <= o['from'] < TOT]; CAM = [c for c in CAM if 0 <= c['f'] < TOT]; SFX = [x for x in SFX if 0 <= x['t'] < TOT / FPS]
for o in OVER:
    o['dur'] = max(6, min(o['dur'], TOT - o['from']))
OVER.sort(key=lambda o: o['from']); CAM.sort(key=lambda c: c['f']); SFX.sort(key=lambda s: s['t'])
ts = ('// GENERADO por vlog/tfbtanque/montaje.py — no editar a mano.\n'
      '/* eslint-disable */\n'
      f'export const TOTAL_FRAMES_TFBTANQUE = {TOT};\n'
      f'export const BASE = "{BASE}";\nexport const AUDIO = "tfbtanque.m4a";\n'
      f'export const CAM: any[] = {json.dumps(CAM, ensure_ascii=False)};\n'
      f'export const OVER: {{ kind: string; from: number; dur: number; props: any }}[] = {json.dumps(OVER, ensure_ascii=False, indent=0)};\n')
open(R + 'src/tfbtanque/timeline.gen.ts', 'w', encoding='utf8', newline='\n').write(ts)
json.dump(SFX, open(R + 'vlog/tfbtanque/sfx.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
# compuerta de lectura: ningún texto > 12 palabras; piso de lectura 2,0 s + 0,28 s por palabra > 3
def txts(o):
    p = o['props']; out = [p.get('text', ''), p.get('sub', ''), p.get('title', ''), p.get('label', '')] + [r.get('text', '') for r in p.get('rows', [])] + [i.get('text', '') for i in p.get('items', []) if isinstance(i, dict)]
    return [x for x in out if x]
bad = [(o['kind'], x) for o in OVER for x in txts(o) if len(x.split()) > 12]
short = [(o['kind'], o['props'].get('text'), round(o['dur'] / FPS, 2)) for o in OVER if o['kind'] == 'word' and o['dur'] / FPS < 1.6 + 0.28 * max(0, len(o['props']['text'].split()) - 3)]
per_min = {}
for o in OVER: per_min[o['from'] // (60 * FPS)] = per_min.get(o['from'] // (60 * FPS), 0) + 1
print(f'componentes {len(OVER)} ({len(set(o["kind"] for o in OVER))} tipos) · cámara {len(CAM)} · sfx {len(SFX)} · por minuto {dict(sorted(per_min.items()))}')
print('⛔ >12 palabras:', bad) if bad else None
print('⚠️ cortos para leer:', short) if short else None
