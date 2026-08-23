# check_i18n.py — valida CADA beat premium contra la firma REAL del componente.
#   (a) props que el build MANDA y el componente NO declara -> React las descarta EN SILENCIO
#   (b) props de texto con default en ESPAÑOL que el build NO pisa -> sale español en pantalla
# check_props.py NO ve nada de esto: sólo valida las formas que ya conoce.
import json, re, glob, sys

ES = re.compile(
    r'[áéíóúñ¿¡]|\b(el|la|los|las|un|una|de|del|que|con|sin|por|para|te|tu|su|es|esta|mas|dia|dias'
    r'|plata|casa|paso|como|antes|despues|mito|verdad|guia|link|descripcion|resumen|clave|dato)\b',
    re.I)

STR_DEFAULT = re.compile(r'(\w+)\s*=\s*"([^"]*)"')
ARR_DEFAULT = re.compile(r'(\w+)\s*=\s*(\[[^\]]*\])', re.S)

sig = {}
for path in glob.glob('src/VideoEdit/kit/premium/*.tsx'):
    if 'StageProof' in path:
        continue
    src = open(path, encoding='utf8').read()
    for m in re.finditer(r'export const (\w+): React\.FC<\{(.*?)\}>\s*=\s*\(\{(.*?)\}\)', src, re.S):
        name, typ, dest = m.group(1), m.group(2), m.group(3)
        declared = set(re.findall(r'(\w+)\s*\??\s*:', typ))
        defaults = {}
        for k, v in STR_DEFAULT.findall(dest):
            defaults[k] = v
        for k, v in ARR_DEFAULT.findall(dest):
            defaults.setdefault(k, ' '.join(re.findall(r'"([^"]*)"', v)))
        sig[name] = (declared, defaults, path.split('/')[-1])

beats = [b for b in json.load(open('beatsheet/goldpower.json', encoding='utf8'))['beats']
         if b.get('kind') == 'premium']
SKIP = {'id', 'start', 'dur', 'kind', 'overlay', 'comp', 'theme', 'zone'}

bad = 0
for b in beats:
    comp = b['comp']
    if comp not in sig:
        print("?? sin firma: %s" % comp)
        continue
    declared, defaults, fname = sig[comp]
    sent = {k for k in b if k not in SKIP}
    ghost = sorted(sent - declared)
    spanish = sorted(k for k, v in defaults.items() if k not in sent and v.strip() and ES.search(v))
    if ghost or spanish:
        bad += 1
        print("\n● %s @%ss (%s)" % (comp, b['start'], fname))
        if ghost:
            print("   ⛔ props IGNORADAS (el componente no las declara): %s" % ", ".join(ghost))
            print("      declaradas: %s" % ", ".join(sorted(declared - {'durationInFrames', 'theme'})))
        for k in spanish:
            print("   ⚠ no pisás '%s' -> default ES: %s" % (k, defaults[k][:80]))

print("\nbeats premium: %d · con problema: %d" % (len(beats), bad))
sys.exit(1 if bad else 0)
