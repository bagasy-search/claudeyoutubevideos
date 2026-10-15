// DocumentPage.tsx — un DOCUMENTO REAL (escaneo de informe, recorte de diario, carta) sobre la mesa de
// Walt; la cámara entra a la línea exacta y un RESALTADOR barre las palabras justo cuando Walt las dice.
//
// ⛔ La página es un escaneo REAL (archive.org, Trove, Chronicling America, Biodiversity Heritage Library,
//    informes de gobierno en PDF → `pdftoppm -r 150`). Nunca una página "escrita" por IA ni con CSS.
// ⛔ Coordenadas de cada resaltado en % DE LA PÁGINA (x,y = esquina sup-izq, w,h), medidas sobre la imagen.
// ⛔ Beats en palabras: `highlights[i].at` = segundo ABSOLUTO de la primera palabra resaltada.
//    La cámara viaja a cada resaltado 0,6 s ANTES y el barrido dura `sweep` (def 0,8 s).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { W, F_TYPE, useAbs, prog, camAt, camStyle, CamKey, Bed, Grade, KindChip, Credit, Note, rgba, useOut } from "./Stage";

type HL = { x: number; y: number; w: number; h: number; at?: number; sweep?: number; zoom?: number };

export const DocumentPage: React.FC<{
  page: string;
  aspect: number;            // ancho/alto de la imagen de la página (OBLIGATORIO: se mide)
  highlights?: HL[];
  chip?: string;             // "DOCUMENT" · "NEWSPAPER · 1935" · "LETTER"
  source?: string;           // "The Courier-Mail, Brisbane, 1935 · via Trove"
  note?: { text: string; at?: number };   // nota de Walt a mano al final (3-5 palabras)
  credit?: string;
  bed?: string;
  t0?: number;
  durationInFrames?: number;
}> = ({ page, aspect, highlights = [], chip = "DOCUMENT", source, note, credit, bed, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);
  let H = 960, Wd = H * aspect;
  if (Wd > 1640) { Wd = 1640; H = Wd / aspect; }
  const L = (1920 - Wd) / 2, T = (1080 - H) / 2 + 10;
  const px = (h: HL) => ({ x: L + (h.x / 100) * Wd, y: T + (h.y / 100) * H, w: (h.w / 100) * Wd, h: (h.h / 100) * H });

  const keys: CamKey[] = [{ t: start, x: 960, y: 540, s: 1.0 }];
  for (const h of highlights) {
    const r = px(h), at = h.at ?? start + 1;
    const last = keys[keys.length - 1];
    const s = h.zoom ?? Math.min(2.6, Math.max(1.3, 1500 / Math.max(r.w, 300)));
    keys.push({ ...last, t: Math.max(last.t + 0.05, at - 1.6) });
    keys.push({ t: Math.max(last.t + 0.3, at - 0.3), x: r.x + r.w / 2, y: r.y + r.h / 2, s });
  }
  const c0 = camAt(now, keys);
  const c = { ...c0, s: c0.s * (1 + 0.005 * Math.max(0, now - start)) };
  const enterA = prog(now, start, 0.6);
  const rot = -1.2 + 0.4 * enterA;

  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0, overflow: "hidden" }}>
      <Bed src={bed} dim={0.62} />
      <div style={camStyle(c)}>
        <div style={{ position: "absolute", left: L, top: T, width: Wd, height: H, transform: `rotate(${rot.toFixed(2)}deg) translateY(${((1 - enterA) * 40).toFixed(1)}px)`, opacity: enterA, boxShadow: "0 30px 70px rgba(0,0,0,.75), 0 6px 18px rgba(0,0,0,.6)", background: W.paper }}>
          <Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "fill", filter: "sepia(0.12) contrast(1.05)" }} />
          {highlights.map((h, i) => {
            const at = h.at ?? start + 1;
            const p = prog(now, at, h.sweep ?? 0.8);
            if (p <= 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%`, width: `${h.w * p}%`, height: `${h.h}%`, background: rgba("#F2D33A", 0.55), mixBlendMode: "multiply", borderRadius: 3 }} />
            );
          })}
        </div>
      </div>
      <Grade vignette={0.55} />
      <KindChip text={chip} a={enterA * out} color={W.manila} />
      {source ? (
        <div style={{ position: "absolute", left: 40, bottom: 30, opacity: enterA * out, fontFamily: F_TYPE, fontSize: 26, color: W.white, background: rgba(W.ink0, 0.62), padding: "6px 14px" }}>{source}</div>
      ) : null}
      {note ? <Note text={note.text} x={1460} y={880} a={prog(now, note.at ?? start + 2, 0.35) * out} rot={-4} /> : null}
      <Credit text={credit} a={enterA} />
    </AbsoluteFill>
  );
};
