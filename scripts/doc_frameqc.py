# doc_frameqc.py — descarta candidatos que NO sirven a pantalla completa:
#   texto quemado (rapidocr), video vertical con barras (pillarbox).  (La cara de presentador la penaliza el NEG de CLIP.)
# Como módulo (lo usa doc_litplan, bajo demanda y con caché en <raiz>/qc.json):  QC(raiz).malo(ruta, esvid) → motivo | ''
# Suelto:  python -I scripts/doc_frameqc.py <raiz_lit>   → revisa todos los candidatos de rank.json
import json, sys, os
import cv2, numpy as np

class QC:
    def __init__(self, R):
        self.R, self.out = R, os.path.join(R, 'qc.json')
        self.c = json.load(open(self.out, encoding='utf8')) if os.path.exists(self.out) else {}
        self.ocr, self.n = None, 0
    def malo(self, p, esvid):
        if p in self.c: return self.c[p]
        if self.ocr is None:
            from rapidocr_onnxruntime import RapidOCR
            self.ocr = RapidOCR()
        im = cv2.imread(os.path.join(self.R, p)); mot = ''
        if im is None: mot = 'ilegible'
        else:
            h, w = im.shape[:2]
            if w > 640: im = cv2.resize(im, (640, int(h * 640 / w))); h, w = im.shape[:2]
            g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
            if esvid:
                col = g.mean(0); lado = int(w * 0.12)
                if col[:lado].mean() < 18 and col[-lado:].mean() < 18 and col[w // 3:2 * w // 3].mean() > 35: mot = 'vertical'
            if not mot:
                big = im if w >= 400 else cv2.resize(im, None, fx=2, fy=2)
                res, _ = self.ocr(big)
                area = sum(cv2.contourArea(np.array(b, dtype=np.float32)) for b, t, s in (res or []) if s > 0.6 and len(t.strip()) >= 3)
                area /= big.shape[0] * big.shape[1]
                if area > 0.012: mot = f'texto {area:.3f}'
        self.c[p] = mot; self.n += 1
        if self.n % 50 == 0: self.save()
        return mot
    def save(self): json.dump(self.c, open(self.out, 'w', encoding='utf8'))

if __name__ == '__main__':
    q = QC(sys.argv[1])
    for r in json.load(open(os.path.join(sys.argv[1], 'rank.json'), encoding='utf8')):
        for c in r['cands']: q.malo(c['p'], c['vid'] != 'fotos')
    q.save()
    from collections import Counter
    print('total', len(q.c), Counter(v.split()[0] if v else 'ok' for v in q.c.values()))
