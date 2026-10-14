// ── HÉROES de Dale Kessler (Claude, sesión A, 14-oct): fotos reales en capas, cámara por claves, cada golpe en SU palabra (t = segundo absoluto de words.json) ──
// Se copian a src/<slug>/heroes.tsx de cada video de Dale; sólo cambian las props (edl/heroes.json).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, Print, Chip, Mark, Grade, Grain, camAt, camStyle, sp, useT, ez, cl, img, C, SERIF, LABEL, HAND, shadowTxt, P } from "../lkit/core";

type Beat = { t: number; txt: string };
type Drop = { k: string; t: number; txt: string };

// nota de papel crema escrita a mano (2-6 palabras)
const Note: React.FC<{ txt: string; u: number; x: number; y: number; rot?: number; size?: number }> = ({ txt, u, x, y, rot = -2, size = 74 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: cl(u * 1.4), transform: `translateY(${(1 - u) * 26}px) rotate(${rot}deg) scale(${0.92 + 0.08 * u})` }}>
    <div style={{ background: "#F3E7CC", padding: "18px 38px 22px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: size, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{txt}</div>
  </div>
);


// 1 · LA CARTA: cama = la foto de la casa que se hunde (desenfocada); la carta (foto real) sube como copia impresa,
//     el sello rojo cae sobre ella en SU palabra ("excluded") y después la nota "PAID: $0".
export const DenialLetter: P<{ bed: string; letter: string; stamp: Beat; paid: Beat }> = ({ a, d, bed, letter, stamp, paid }) => {
  const { f, at } = useT(a);
  const T = Math.max(1, d);
  const K = [{ t: a, s: 1.0, x: 960, y: 560 }, { t: stamp.t, s: 1.1, x: 1000, y: 600 }, { t: paid.t, s: 1.06, x: 960, y: 560 }];
  const cam = camAt(f, at, K, 1.2);
  const u = sp(f, 0, 14, 140), us = sp(f, at(stamp.t), 10, 220);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={T} dim={0.55} />
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", opacity: cl(u * 1.4), transform: `translateY(${(1 - u) * 120}px) rotate(-2.5deg)` }}>
            <Print k={letter} w={1180} h={660} f={f} mat={18} />
          </div>
          {f >= at(stamp.t) ? (
            <div style={{ position: "absolute", left: 1010, top: 600, translate: "-50% -50%", opacity: cl(us * 1.6),
              transform: `rotate(-9deg) scale(${1.6 - 0.6 * us})`, border: `10px solid ${C.red}`, borderRadius: 14, padding: "14px 40px 10px",
              color: C.red, fontFamily: LABEL, fontWeight: 800, fontSize: 92, letterSpacing: 6, whiteSpace: "nowrap", background: "rgba(255,250,240,0.18)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>{stamp.txt}</div>
          ) : null}
        </div>
      </AbsoluteFill>
      {f >= at(paid.t) ? <Note txt={paid.txt} u={sp(f, at(paid.t), 14, 150)} x={1260} y={800} rot={3} size={84} /> : null}
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// 2 · LA FILA: fotos que caen en fila, cada una en SU palabra, con número y rótulo
export const RowOfThings: P<{ bed: string; items: Drop[]; extra?: Beat; head?: string }> = ({ a, d, bed, items, extra, head }) => {
  const { f, at } = useT(a);
  const n = items.length, gap = 1920 / (n + 0.4);
  const pos = (i: number) => ({ x: gap * (i + 0.7), y: 560 + (i % 2 ? 40 : -30) });
  const K = [{ t: a, s: 1.0, x: 960, y: 540 }, ...items.map((it, i) => ({ t: it.t, s: 1.04, x: 960 + (pos(i).x - 960) * 0.15, y: 545 })), ...(extra ? [{ t: extra.t, s: 1.0, x: 960, y: 540 }] : [])];
  const cam = camAt(f, at, K, 1.1);
  const T = Math.max(1, d);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={T} dim={0.5} />
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          {items.map((it, i) => {
            const u = sp(f, at(it.t), 13, 140), p = pos(i);
            if (f < at(it.t)) return null;
            return (
              <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", opacity: cl(u * 1.5), transform: `translateY(${(1 - u) * -160}px) rotate(${i % 2 ? 3 : -3}deg)` }}>
                <Print k={it.k} w={300} h={200} f={f} mat={12} />
                <div style={{ position: "absolute", left: -26, top: -30, width: 84, height: 84, borderRadius: 42, background: C.red, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 56,
                  display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px rgba(0,0,0,0.45)" }}>{i + 1}</div>
                <div style={{ position: "absolute", left: "50%", bottom: -40, translate: "-50% 0" }}><Chip txt={it.txt} size={36} maxW={330} rot={i % 2 ? 2 : -2} /></div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {head ? <div style={{ position: "absolute", left: 0, right: 0, top: 64, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 58, letterSpacing: 6, color: C.porc, textShadow: shadowTxt, opacity: cl(f / 12) }}>{head}</div> : null}
      {extra && f >= at(extra.t) ? <Note txt={extra.txt} u={sp(f, at(extra.t), 14, 150)} x={1240} y={760} rot={3} size={70} /> : null}
      <Grade /><Grain />
    </AbsoluteFill>
  );
};
