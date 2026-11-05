# Escena épica, UNA sola toma de 30 s: fondo marino con crinoideos -> la cámara sube, atraviesa nubes
# (la transición) -> emerge sobre el mar de nubes frente al Everest al amanecer y empuja hacia la cumbre.
# Salida: actions.json (lista de acciones de `tsrct project apply`). Coordenadas en píxeles (100 px = 1 m),
# X derecha, Y ABAJO, Z hacia adentro de la pantalla. Tiempos de keyframe en ms.
import json, sys, random
random.seed(7)
rev = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else {}   # asset_id -> sourceRevision (no se usa si no hay overrides)
DUR = 30000
A = []
C = "main"; L = 1
def kf(item, prop, keys, kind="vector3"):
    ks = []
    for i, (t, v, *e) in enumerate(keys):
        ease = e[0] if e else {"type": "cubicBezier", "x1": 0.42, "y1": 0, "x2": 0.58, "y2": 1}
        ks.append({"id": f"{prop}-{item}-{i}", "layerTime": t, "value": {"type": kind, "value": v}, "easing": ease})
    A.append({"type": "setFxAnimator", "compositionId": C, "target": {"type": "styleProperty", "layerId": L, "itemId": item, "propertyName": prop},
              "animator": {"type": "keyframes", "enabled": True, "keyframes": ks}, "dependencies": [], "layerRefBindings": []})

A.append({"type": "createFxScene3DLayer", "compositionId": C, "layerId": L, "name": "Epica", "pixelsPerMeter": 100, "view": {"id": 9, "exposure": 0},
          "activeRange": {"start": 0, "duration": DUR}, "transform": {"anchorPoint": [0, 0], "position": [0, 0], "scale": [100, 100], "rotation": 0, "opacity": 100},
          "world": {"id": 2}, "renderSettings": {"id": 97, "filmGate": None, "overscan": None, "lightGroups": [], "lightCollections": [], "lightLinks": [], "outputs": [], "previewOutput": None}})
# mundo: sin luz (las fotos son emisivas = se ven tal cual), fondo y niebla que viran de azul marino a cielo
AGUA = [0.02, 0.16, 0.27, 1]; CIELO = [0.62, 0.70, 0.82, 1]
A.append({"type": "setFxScene3DWorld", "compositionId": C, "layerId": L, "world": {"id": 2, "background": {"type": "color", "color": AGUA},
          "fog": {"color": AGUA, "startDistance": 8, "endDistance": 95}}})
A.append({"type": "addFxScene3DLayer", "compositionId": C, "layerId": L, "item": {"type": "Camera3D", "id": 3, "parentId": None, "name": "Toma",
          "transform": {"position": [0, 150, 0], "rotation": {"type": "euler", "order": "XYZ", "orientation": [0, 0, 0], "rotationX": 0, "rotationY": 0, "rotationZ": 0}},
          "lens": {"type": "angle", "projection": {"type": "perspective", "angleOfView": 52}}}})
A.append({"type": "setFxScene3DActiveCamera", "compositionId": C, "layerId": L, "cameraItemId": 3})

nid = [100]
def modelo(asset, pos, scale=100, rot=(0, 0, 0), name=None):
    nid[0] += 2; did, iid = 1000 + nid[0], nid[0]
    A.append({"type": "addFxScene3DFragment", "compositionId": C, "layerId": L, "data": [{"type": "model", "id": did, "name": name or asset, "assetId": asset}],
              "items": [{"type": "Model3D", "id": iid, "parentId": None, "name": name or asset, "dataId": did,
                         "transform": {"position": list(pos), "scale": [scale] * 3 if isinstance(scale, (int, float)) else list(scale),
                                       "rotation": {"type": "euler", "order": "XYZ", "orientation": [0, 0, 0], "rotationX": rot[0], "rotationY": rot[1], "rotationZ": rot[2]}},
                         "materialSlots": [], "modelRegionSlots": [], "poseStack": []}]})
    return iid

# 1) fondo marino (relieve 14 m) y crinoideos recortados que la cámara pasa de costado
modelo("mar", (0, 0, 4000))
for k, (x, y, z, s) in enumerate([(-650, 330, 1300, 55), (700, 360, 1900, 65), (-900, 380, 2500, 70), (450, 420, 3100, 60), (-250, 440, 3400, 50)]):
    modelo("lirios", (x, y, z), s, (0, random.uniform(-25, 25), 0), f"lirio{k}")
# 2) capa de nubes entre el agua y el cielo (la cámara sube a través)
for k in range(16):
    x = random.uniform(-1800, 1800); y = random.uniform(-3500, -1500); z = random.uniform(2300, 4600)
    modelo("nube", (x, y, z), random.uniform(55, 110), (0, 0, random.uniform(-12, 12)), f"nube{k}")
# 3) Everest al amanecer (relieve 10 m), detrás del mar de nubes
modelo("everest", (0, -4200, 8200))
# 4) nubes bajas delante del Everest (mar de nubes en primer plano) y ráfagas de nieve al final
for k in range(7):
    modelo("nube", (random.uniform(-2600, 2600), random.uniform(-3650, -3350), random.uniform(4300, 6200)), random.uniform(80, 140), (75, 0, 0), f"marnubes{k}")
for k in range(4):
    modelo("nube", (random.uniform(-500, 500), random.uniform(-4800, -4450), 5600 + k * 300), random.uniform(35, 60), (0, 0, random.uniform(-20, 20)), f"rafaga{k}")

# cámara: una sola toma
LIN = {"type": "linear"}
kf(3, "position", [(0, [0, 150, 0]), (8500, [180, -250, 1450]), (12500, [80, -3700, 2050]), (30000, [0, -4550, 6100])])
kf(3, "rotationX", [(0, 0, LIN), (8000, -4), (11000, -18), (13500, 4), (30000, -2)], "float")
kf(3, "rotationZ", [(0, 1.5, LIN), (9000, -1.5), (13000, 2), (30000, 0)], "float")
# mundo: agua -> cielo durante la subida (fondo y niebla)
for prop, a, b in [("backgroundColor", AGUA, CIELO), ("fogColor", AGUA, [0.80, 0.84, 0.90, 1])]:
    kf(2, prop, [(0, a, LIN), (9500, a), (12500, b)], "color")
kf(2, "fogStartDistance", [(0, 8, LIN), (9500, 8), (12500, 25)], "float")
kf(2, "fogEndDistance", [(0, 95, LIN), (9500, 95), (12500, 320)], "float")
json.dump(A, open("actions.json", "w"), indent=0)
print(len(A), "acciones")
