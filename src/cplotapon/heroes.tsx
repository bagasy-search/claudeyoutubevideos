// ── HÉROES del Plomero (Claude, 14-oct): fotos reales en capas, cámara por claves, cada golpe en SU palabra (t = segundo absoluto de words.json) ──
// Se copian a src/<slug>/heroes.tsx de cada video del Plomero; sólo cambian las props (edl/heroes.json).
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

// 1 · ADENTRO DEL CAÑO: la foto del caño cortado a pantalla completa; la cámara entra hacia la boca (cx,cy);
//     en cada golpe entra un rótulo (se enfría / se endurece / cierra el paso) y un anillo rojo marca el paso que se achica.
export const PipeClose: P<{ k: string; cx: number; cy: number; r0: number; r1: number; beats: Beat[]; ring: number; tag?: string; tagT?: number }> =
  ({ a, d, k, cx, cy, r0, r1, beats, ring, tag, tagT }) => {
    const { f, at } = useT(a);
    const K = [{ t: a, s: 1.0, x: 960, y: 540 }, ...beats.map((b, i) => ({ t: b.t, s: 1.12 + 0.12 * i, x: 960 + (cx - 960) * (0.35 + 0.2 * i), y: 540 + (cy - 540) * (0.35 + 0.2 * i) }))];
    const cam = camAt(f, at, K, 1.3);
    const ru = ez((f - at(ring)) / 45), r = r0 + (r1 - r0) * ru;
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
        <AbsoluteFill style={camStyle(cam)}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
            <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.03 * f / Math.max(1, d)})` }} />
            {f >= at(ring) ? (
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.red} strokeWidth={9} strokeDasharray="22 12" opacity={cl((f - at(ring)) / 8)} />
              </svg>
            ) : null}
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0) 45%)" }} />
        {beats.map((b, i) => (
          <Note key={i} txt={b.txt} u={sp(f, at(b.t), 14, 150)} x={90} y={150 + i * 170} rot={i % 2 ? 1.5 : -2} />
        ))}
        {tag && tagT ? <div style={{ position: "absolute", right: 80, bottom: 90, opacity: cl(sp(f, at(tagT)) * 1.3) }}><Chip txt={tag} size={46} bg={C.red} color="#fff" rot={-3} /></div> : null}
        <Grade /><Grain />
      </AbsoluteFill>
    );
  };

// 2 · TODO TERMINA EN EL SIFÓN: la foto del mueble abierto; la cámara va al codo (x,y) cuando se nombra; cada cosa (foto con marco)
//     cae desde arriba y se mete en el codo en SU palabra; al final una nota grande.
export const IntoTrap: P<{ bed: string; x: number; y: number; label: Beat; drops: Drop[]; end?: Beat }> = ({ a, d, bed, x, y, label, drops, end }) => {
  const { f, at } = useT(a);
  const cam = camAt(f, at, [{ t: a, s: 1.0, x: 960, y: 540 }, { t: label.t, s: 1.22, x: 960 + (x - 960) * 0.55, y: 540 + (y - 540) * 0.55 }], 1.3);
  const lu = sp(f, at(label.t), 14, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.0005 * f})`, transformOrigin: `${x}px ${y}px` }}>{/* deriva lenta: nunca cuadro quieto (cplotapon 14-oct: 3 s congelado al final) */}
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Img src={img(bed)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Mark kind="circle" x={x - 230} y={y - 150} w={460} h={300} f={f} at={at(label.t) + 6} dur={12} sw={10} />
          <div style={{ position: "absolute", left: x + 200, top: y - 260, opacity: cl(lu * 1.4), transform: `scale(${0.9 + 0.1 * lu}) rotate(-3deg)` }}>
            <Chip txt={label.txt} size={64} bg="#FFFDF4" rot={-3} />
          </div>
        </div>
      </AbsoluteFill>
      </AbsoluteFill>
      {drops.map((p, i) => {
        const u = ez((f - at(p.t)) / 22);           // entra
        const v = ez((f - at(p.t) - 30) / 18);       // se mete en el codo
        if (u <= 0) return null;
        const sx = 360 + i * 420, sy = 230;
        const px = sx + (960 - sx) * v, py = sy + (700 - sy) * v - 240 * (1 - u);
        return (
          <div key={i} style={{ position: "absolute", left: px, top: py, translate: "-50% -50%", opacity: 1 - v * 0.85, transform: `rotate(${(i % 2 ? 4 : -5) * (1 - v)}deg) scale(${1 - 0.65 * v})` }}>
            <Print k={p.k} w={330} h={210} f={f} mat={12} />
            <div style={{ position: "absolute", left: "50%", bottom: -34, translate: "-50% 0" }}><Chip txt={p.txt} size={40} rot={i % 2 ? 2 : -2} /></div>
          </div>
        );
      })}
      {end ? <Note txt={end.txt} u={sp(f, at(end.t), 14, 150)} x={560} y={110} size={88} /> : null}
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// 3 · LAS CINCO (o N) COSAS sobre la mesada: fotos con marco que aterrizan en fila, cada una con su número en SU palabra;
//     la cámara las recorre; opcional una carta extra boca abajo ("¿y la sexta?").
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
