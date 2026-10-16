// ── HÉROES de La Cocina de Doña Chayo · chayo2 (25 desayunos de rancho, 16-oct-2026) ──
// Mundo del rancho, todos nuevos (ninguno de chayo1): mesa vista desde arriba con platos de barro, cuaderno de recetas que se
// escribe solo, almanaque de tienda que se deshoja, mapa a mano de Michoacán, el día del rancho con el sol, ingredientes
// alrededor del plato, antes/ahora con cortina, sello de goma, lo que rinde, rueda del año, servilleta del itacate,
// tablero de los 25 y frase bordada. Cada golpe en SU palabra (t = segundo absoluto). Familias: Fraunces (serif) + Caveat (mano).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, sp, useT, ez, cl, img, SERIF, HAND, P } from "../lkit/core";

const GUINDA = "#7A1F2B", BARRO = "#B5562A", MAIZ = "#E9B23A", NOPAL = "#3E6A36", CREMA = "#F4E8CF", TINTA = "#2A211B", CHILE = "#B3261E", AÑIL = "#2F4A7A";
const sombra = "0 30px 60px rgba(20,10,4,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.75)";
type Beat = { t: number; txt: string };
const kraft: React.CSSProperties = { background: "radial-gradient(ellipse at 30% 20%, #D9B98A 0%, #C9A473 55%, #B98F5E 100%)" };
const papel: React.CSSProperties = { background: "radial-gradient(ellipse at 40% 30%, #FBF4E2 0%, #F1E5C6 70%, #E6D4AA 100%)" };
const madera: React.CSSProperties = {
  background: "repeating-linear-gradient(0deg, #6B4425 0px, #7A4E2B 38px, #5E3A1F 40px, #6E4627 118px, #4E3018 120px), linear-gradient(90deg, rgba(0,0,0,0.15), rgba(255,255,255,0.05), rgba(0,0,0,0.15))",
  backgroundBlendMode: "multiply",
};
// texto que se escribe solo (de izquierda a derecha) a partir de `at`, en `dur` cuadros
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - u * 110}% -20% -5%)`, whiteSpace: "nowrap" }}>{children}</div>;
};

// 1 · MESA: la mesa del rancho vista desde arriba; cada plato de barro entra en SU palabra con su letrerito
export const Mesa: P<{ bed: string; head: Beat; items: { t: number; k: string; txt: string }[] }> = ({ a, d, bed, head, items }) => {
  const { f, at } = useT(a);
  const pos = [{ x: 560, y: 470 }, { x: 1360, y: 450 }, { x: 600, y: 860 }, { x: 1330, y: 850 }];
  const hu = sp(f, at(head.t), 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ ...madera, transform: `scale(${1.05 + 0.04 * f / Math.max(1, d)})` }} />
      <div style={{ position: "absolute", left: 120, top: 210, width: 1680, height: 820, background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.0) 0 22px, rgba(179,38,30,0.12) 22px 26px), #F3EADB",
        borderRadius: 6, boxShadow: sombra, opacity: 0.18 }} />
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 12, 120), p = pos[i % 4], dir = i % 2 ? 1 : -1;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", opacity: cl(u * 1.6),
            transform: `translate(${(1 - u) * dir * 700}px, ${(1 - u) * 120}px) rotate(${(1 - u) * dir * 30}deg)` }}>
            <div style={{ width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${BARRO} 60%, #8C3E1C 61%, #A44E24 72%, #7A3416 100%)`, boxShadow: sombra,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 262, height: 262, borderRadius: "50%", overflow: "hidden", boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.25)" }}>
                <Img src={img(it.k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.25 + 0.04 * Math.sin(f / 40 + i)})` }} />
              </div>
            </div>
            <div style={{ position: "absolute", left: "50%", top: 300, translate: "-50% 0", ...papel, padding: "6px 26px 10px", borderRadius: 4, boxShadow: sombra,
              transform: `rotate(${dir * 3}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: TINTA, whiteSpace: "nowrap" }}>{it.txt}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CREMA, textShadow: txtSh,
        opacity: cl(hu * 1.5), transform: `translateY(${(1 - hu) * -30}px)` }}>{head.txt}</div>
    </AbsoluteFill>
  );
};

// 2 · CUADERNO: hoja rayada de cuaderno de recetas; el título y cada renglón se escriben solos en su palabra
export const Cuaderno: P<{ bed: string; head: Beat; lines: Beat[] }> = ({ a, d, bed, head, lines }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const W = 1180, Hh = 820;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={12} />
      <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", opacity: cl(u * 2),
        transform: `rotate(${-3 + 1.5 * Math.sin(f / 90)}deg) translateY(${(1 - u) * 160}px) scale(${0.96 + 0.04 * u})` }}>
        <div style={{ width: W, height: Hh, background: `repeating-linear-gradient(180deg, transparent 0 78px, rgba(47,74,122,0.35) 78px 80px), #FBF7EC`,
          backgroundPosition: "0 150px", boxShadow: sombra, position: "relative", borderRadius: 6 }}>
          <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 3, background: "rgba(179,38,30,0.6)" }} />
          {Array.from({ length: 11 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40, top: 40 + i * 72, width: 34, height: 34, borderRadius: 99, background: "#3a2f26", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }} />)}
          <Escrito f={f} at={at(head.t)} dur={22} style={{ position: "absolute", left: 170, top: 60, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: GUINDA }}>{head.txt}</Escrito>
          {lines.map((l, i) => (
            <Escrito key={i} f={f} at={at(l.t)} dur={16} style={{ position: "absolute", left: 200, top: 232 + i * 160, fontFamily: HAND, fontWeight: 700, fontSize: Math.min(104, 2400 / Math.max(...lines.map((x) => x.txt.length + 2))), color: AÑIL }}>— {l.txt}</Escrito>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · ALMANAQUE: el almanaque de la tienda colgado en el adobe; en t0 se deshoja de n0 a n1, y las notas entran en su palabra
export const Almanaque: P<{ bed: string; n0: number; n1: number; t0: number; tags: Beat[] }> = ({ a, d, bed, n0, n1, t0, tags }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const steps = n0 - n1, per = 2.2;                      // cuadros por hoja
  const k = Math.max(0, f - at(t0));
  const cur = Math.max(n1, n0 - Math.floor(k / per));
  const drop = (k % per) / per;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={12} />
      <div style={{ position: "absolute", left: 640, top: 560, translate: "-50% -50%", opacity: cl(u * 2), transform: `translateY(${(1 - u) * -200}px) rotate(${-2 + Math.sin(f / 70)}deg)` }}>
        <div style={{ position: "absolute", left: "50%", top: -60, width: 22, height: 22, borderRadius: 99, background: "#555", translate: "-50% 0" }} />
        <div style={{ width: 600, background: GUINDA, borderRadius: "10px 10px 0 0", padding: "22px 0 18px", textAlign: "center", boxShadow: sombra }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: MAIZ }}>Desayunos de rancho</div>
        </div>
        <div style={{ width: 600, height: 560, ...papel, position: "relative", boxShadow: sombra, overflow: "visible" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 330, lineHeight: 1, color: cur === n1 && k > steps * per ? CHILE : TINTA }}>{cur}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: TINTA, marginTop: -10 }}>de {n0}</div>
          </div>
          {k > 0 && cur > n1 ? (
            <div style={{ position: "absolute", inset: 0, ...papel, transformOrigin: "50% 0", transform: `rotateX(${drop * 90}deg) translateY(${drop * 260}px) rotate(${drop * 14}deg)`, opacity: 1 - drop,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 330, color: TINTA, boxShadow: sombra }}>{cur + 1}</div>
          ) : null}
        </div>
      </div>
      {tags.map((g, i) => {
        if (f < at(g.t)) return null;
        const v = sp(f, at(g.t), 12, 140);
        return (
          <div key={i} style={{ position: "absolute", left: 1080, top: 250 + i * 230, opacity: cl(v * 1.5), transform: `translateX(${(1 - v) * 140}px) rotate(${[-3, 2, -1][i % 3]}deg)` }}>
            <div style={{ ...kraft, padding: "16px 46px 22px", boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: TINTA, whiteSpace: "nowrap", borderRadius: 4 }}>{g.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 4 · MAPA: Michoacán dibujado a mano en papel; el contorno se traza, cae el alfiler en `main` y la nota entra en su palabra
const LON = [-103.8, -99.9], LAT = [17.8, 20.5];
const px = (lon: number, lat: number) => ({ x: 60 + ((lon - LON[0]) / (LON[1] - LON[0])) * 1080, y: 40 + ((LAT[1] - lat) / (LAT[1] - LAT[0])) * 700 });
const EDO = [[-103.7, 18.75], [-103.1, 18.25], [-102.2, 17.95], [-101.6, 18.05], [-100.9, 18.25], [-100.3, 18.65], [-100.1, 19.3], [-100.3, 19.9], [-100.9, 20.2],
  [-101.6, 20.35], [-102.3, 20.3], [-102.9, 20.05], [-103.4, 19.6], [-103.6, 19.1]];
const PUEBLOS: Record<string, [number, number]> = { Morelia: [-101.19, 19.7], "Pátzcuaro": [-101.61, 19.51], Uruapan: [-102.06, 19.41], "Apatzingán": [-102.35, 19.09], Zamora: [-102.28, 19.98] };
export const Mapa: P<{ bed: string; main: string; t: number; note?: Beat }> = ({ a, d, bed, main, t, note }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), draw = ez(f / 30), pin = sp(f, at(t) + 6, 10, 160);
  const pts = EDO.map(([lo, la]) => px(lo, la));
  const path = "M" + pts.map((p) => `${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(" L") + " Z";
  const m = px(...PUEBLOS[main]); const lago = px(-101.65, 19.6);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={12} />
      <div style={{ position: "absolute", left: 960, top: 545, translate: "-50% -50%", width: 1200, height: 780, ...papel, boxShadow: sombra, borderRadius: 4,
        opacity: cl(u * 2), transform: `rotate(${-1.5}deg) scale(${0.94 + 0.06 * u + 0.03 * f / Math.max(1, d)})` }}>
        <svg width={1200} height={780} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={path} fill="rgba(62,106,54,0.13)" stroke={NOPAL} strokeWidth={6} strokeLinejoin="round" strokeDasharray={5200} strokeDashoffset={5200 * (1 - draw)} />
          <ellipse cx={lago.x} cy={lago.y} rx={34} ry={18} fill="rgba(47,74,122,0.55)" opacity={draw} />
          {Object.entries(PUEBLOS).filter(([n, c]) => n === main || Math.hypot(px(...c).x - m.x, px(...c).y - m.y) > 150).map(([n, c]) => { const p = px(...c); const me = n === main; return (
            <g key={n} opacity={cl(draw * 1.4 - 0.3)}>
              <circle cx={p.x} cy={p.y} r={me ? 12 : 8} fill={me ? CHILE : TINTA} />
              <text x={p.x + 16} y={p.y - 12} fontFamily={HAND} fontWeight={700} fontSize={me ? 0 : 40} fill={TINTA}>{n}</text>
            </g>); })}
          {f >= at(t) ? <circle cx={m.x} cy={m.y} r={60} fill="none" stroke={CHILE} strokeWidth={6} strokeDasharray={400} strokeDashoffset={400 * (1 - ez((f - at(t)) / 16))} /> : null}
        </svg>
        <div style={{ position: "absolute", left: 30, bottom: 18, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: NOPAL, opacity: draw }}>Michoacán</div>
        {f >= at(t) ? (
          <div style={{ position: "absolute", left: m.x, top: m.y, translate: "-50% -100%", transform: `translateY(${(1 - pin) * -300}px)`, opacity: cl(pin * 2) }}>
            <div style={{ background: CHILE, color: CREMA, fontFamily: SERIF, fontWeight: 900, fontSize: 64, padding: "4px 26px 10px", borderRadius: 10, boxShadow: sombra, whiteSpace: "nowrap", marginBottom: 14 }}>{main}</div>
          </div>
        ) : null}
        {note && f >= at(note.t) ? (
          <div style={{ position: "absolute", left: m.x + 90, top: m.y + 40, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: GUINDA, whiteSpace: "nowrap",
            opacity: cl(sp(f, at(note.t), 12, 140) * 1.5), transform: `rotate(-4deg)` }}>← {note.txt}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// 5 · JORNADA: el día del rancho; el sol sube por su arco y cada hora entra en su palabra sobre la línea del día
export const Jornada: P<{ bed: string; stops: { t: number; h: string; txt: string }[] }> = ({ a, d, bed, stops }) => {
  const { f, at } = useT(a);
  const cur = stops.reduce((m, s, i) => (f >= at(s.t) ? i : m), -1);
  const prog = cur < 0 ? 0 : (cur + ez((f - at(stops[cur].t)) / 24)) / stops.length;
  const ang = Math.PI * (1 - prog * 0.85);
  const sx = 960 + 640 * Math.cos(ang), sy = 560 - 420 * Math.sin(ang);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5 - 0.25 * prog} blur={10} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M320,560 A640,420 0 0 1 1600,560" fill="none" stroke="rgba(244,232,207,0.55)" strokeWidth={5} strokeDasharray="14 16" />
        <circle cx={sx} cy={sy} r={70} fill={MAIZ} opacity={0.95} />
        <circle cx={sx} cy={sy} r={96} fill="none" stroke={MAIZ} strokeWidth={6} opacity={0.5} />
        <line x1={200} x2={1720} y1={800} y2={800} stroke={CREMA} strokeWidth={6} />
      </svg>
      {stops.map((s, i) => {
        if (f < at(s.t)) return null;
        const v = sp(f, at(s.t), 12, 140), x = 260 + i * (1400 / Math.max(1, stops.length - 1));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 800, translate: "-50% -50%", opacity: cl(v * 1.5), transform: `translateY(${(1 - v) * 60}px)` }}>
            <div style={{ width: 30, height: 30, borderRadius: 99, background: i === cur ? CHILE : CREMA, margin: "0 auto", boxShadow: sombra }} />
            {s.h ? <div style={{ position: "absolute", bottom: 46, left: "50%", translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: CREMA, textShadow: txtSh }}>{s.h}</div> : null}
            <div style={{ position: "absolute", top: 48, left: "50%", translate: "-50% 0", ...kraft, padding: "6px 24px 10px", borderRadius: 4, boxShadow: sombra,
              fontFamily: HAND, fontWeight: 700, fontSize: 44, color: TINTA, whiteSpace: "nowrap", transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>{s.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 · INGREDIENTES: el plato al centro en un círculo nítido; cada medida sale con su línea en su palabra
export const Ingredientes: P<{ bed: string; title: string; items: { t: number; q: string; txt: string }[] }> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const n = items.length;
  const pos = (i: number) => { const ang = -Math.PI / 2 + (i - (n - 1) / 2) * (Math.PI / Math.max(2.4, n - 0.4)) + Math.PI / 2; const s = i % 2 ? 1 : -1;
    return { x: 960 + s * 560, y: 300 + Math.floor(i / 2) * 330 + (n === 3 && i === 2 ? 160 : 0), ang }; };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <div style={{ position: "absolute", left: 960, top: 590, translate: "-50% -50%", width: 520, height: 520, borderRadius: "50%", overflow: "hidden",
        border: `14px solid ${CREMA}`, boxShadow: sombra, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}>
        <Img src={img(bed)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.15 + 0.05 * f / Math.max(1, d)})` }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {items.map((it, i) => {
          if (f < at(it.t)) return null;
          const p = pos(i), w = ez((f - at(it.t)) / 12);
          const x0 = 960 + Math.sign(p.x - 960) * 270, y0 = 590 + (p.y - 590) * 0.4;
          return <line key={i} x1={x0} y1={y0} x2={x0 + (p.x - x0) * w * 0.62} y2={y0 + (p.y - y0) * w} stroke={CREMA} strokeWidth={5} strokeDasharray="12 10" />;
        })}
      </svg>
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const p = pos(i), v = sp(f, at(it.t) + 6, 12, 150);
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", opacity: cl(v * 1.5), transform: `scale(${0.6 + 0.4 * v}) rotate(${i % 2 ? 2 : -2}deg)` }}>
            <div style={{ ...papel, padding: "14px 40px 20px", borderRadius: 8, boxShadow: sombra, textAlign: "center", minWidth: 300 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, lineHeight: 1, color: GUINDA }}>{it.q}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: TINTA }}>{it.txt}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 96, color: MAIZ, textShadow: txtSh, opacity: cl(u * 1.5) }}>{title}</div>
    </AbsoluteFill>
  );
};

// 7 · ANTES / AHORA: la foto de antes a pantalla completa; en t una cortina trae la de hoy y la parte al medio
export const AntesAhora: P<{ bed: string; t: number; old: { k: string; txt: string }; neu: { k: string; txt: string } }> = ({ a, d, t, old, neu }) => {
  const { f, at } = useT(a);
  const w = ez((f - at(t)) / 16);
  const cut = 1920 - 960 * w;
  const lab = (txt: string, x: number, op: number, c: string) => (
    <div style={{ position: "absolute", left: x, top: 820, translate: "-50% 0", background: c, color: CREMA, fontFamily: HAND, fontWeight: 700, fontSize: 70, padding: "6px 36px 12px",
      borderRadius: 8, boxShadow: sombra, whiteSpace: "nowrap", opacity: op }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#15110c" }}>
      <AbsoluteFill style={{ transform: `scale(${1.05 + 0.05 * f / Math.max(1, d)})` }}><Img src={img(old.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: cut, top: 0, width: 1920 - cut, height: 1080, overflow: "hidden" }}>
        <Img src={img(neu.k)} style={{ position: "absolute", left: -480, top: 0, width: 1920, height: 1080, objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: cut - 5, top: 0, width: 10, height: 1080, background: CREMA, boxShadow: "0 0 20px rgba(0,0,0,0.6)", opacity: w > 0 ? 1 : 0 }} />
      {lab(old.txt, 480 + (1 - w) * 480, 1, NOPAL)}
      {lab(neu.txt, 1440, cl(w * 1.5), CHILE)}
    </AbsoluteFill>
  );
};

// 8 · SELLO: la foto nítida; en t baja un sello de goma con su tinta (verde = así sí, rojo = así no) y una nota a mano
export const Sello: P<{ bed: string; txt: string; sub?: string; ok?: boolean; t: number }> = ({ a, d, bed, txt, sub, ok, t }) => {
  const { f, at } = useT(a);
  const k = f - at(t), u = cl(k / 6), hit = k >= 6 ? Math.exp(-(k - 6) / 5) * Math.sin((k - 6) * 1.6) : 0;
  const c = ok ? NOPAL : CHILE;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#15110c" }}>
      <AbsoluteFill style={{ transform: `scale(${1.04 + 0.06 * f / Math.max(1, d)}) translate(${hit * 8}px, ${hit * 6}px)` }}><Img src={img(bed)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      {k >= 0 ? (
        <div style={{ position: "absolute", left: 960, top: 470, translate: "-50% -50%", transform: `rotate(-9deg) scale(${1.9 - 0.9 * u})`, opacity: cl(u * 1.4) }}>
          <div style={{ border: `12px solid ${c}`, borderRadius: 18, padding: "18px 60px 26px", background: "rgba(244,232,207,0.82)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 132, lineHeight: 1, color: c, textTransform: "uppercase", letterSpacing: 4, whiteSpace: "nowrap" }}>{txt}</div>
          </div>
        </div>
      ) : null}
      {sub && k > 10 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: CREMA, textShadow: txtSh,
          opacity: cl(sp(f, at(t) + 10, 12, 140) * 1.5) }}>{sub}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// 9 · RINDE: una cosa sola a la izquierda (t1); en t2 la flecha y los platos que salen de ella, uno tras otro
export const Rinde: P<{ bed: string; one: string; t1: number; n: number; many: string; t2: number; why?: Beat }> = ({ a, d, bed, one, t1, n, many, t2, why }) => {
  const { f, at } = useT(a);
  const u1 = sp(f, at(t1), 14, 120), w = ez((f - at(t2)) / 14);
  const cols = Math.min(n, 3), rows = Math.ceil(n / cols);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={12} />
      <div style={{ position: "absolute", left: 380, top: 520, translate: "-50% -50%", opacity: cl(u1 * 1.5), transform: `scale(${0.7 + 0.3 * u1}) rotate(-3deg)` }}>
        <div style={{ ...kraft, padding: "30px 46px 38px", borderRadius: 8, boxShadow: sombra, textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: one.length > 12 ? 64 : 96, lineHeight: 1.05, color: TINTA }}>{one}</div>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M640,520 L${640 + 260 * w},520`} stroke={CREMA} strokeWidth={10} strokeLinecap="round" />
        {w > 0.9 ? <path d="M900,520 l-36,-26 M900,520 l-36,26" stroke={CREMA} strokeWidth={10} strokeLinecap="round" /> : null}
      </svg>
      {Array.from({ length: n }).map((_, i) => {
        const v = sp(f, at(t2) + 8 + i * 4, 11, 170);
        if (f < at(t2) + 8 + i * 4) return null;
        const x = 1180 + (i % cols) * 230, y = 520 + (Math.floor(i / cols) - (rows - 1) / 2) * 230;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", transform: `scale(${v})` }}>
            <div style={{ width: 190, height: 190, borderRadius: "50%", background: `radial-gradient(circle, ${BARRO} 62%, #7A3416 100%)`, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={150} height={150} viewBox="0 0 150 150">
                <circle cx={75} cy={75} r={66} fill="#F3E6C8" />
                {Array.from({ length: 16 }).map((_, j) => <circle key={j} cx={75 + 58 * Math.cos((j / 16) * 2 * Math.PI)} cy={75 + 58 * Math.sin((j / 16) * 2 * Math.PI)} r={3.2} fill={j % 2 ? "#2F6B3A" : "#8E2A2A"} />)}
                <circle cx={75} cy={75} r={46} fill="#E8D3A0" stroke="#C9A86A" strokeWidth={2} />
                <ellipse cx={70} cy={72} rx={30} ry={26} fill="#D9B46A" />
                {[[60, 64], [78, 80], [82, 62], [64, 84]].map(([x, y2], j) => <circle key={j} cx={x} cy={y2} r={3} fill="#A9783A" opacity={0.7} />)}
              </svg>
            </div>
          </div>
        );
      })}
      {f >= at(t2) ? <div style={{ position: "absolute", left: 1410, top: 520 + rows * 115 + 40, translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: MAIZ, textShadow: txtSh,
        opacity: cl(sp(f, at(t2) + 8 + n * 4, 12, 140) * 1.5), whiteSpace: "nowrap" }}>{many}</div> : null}
      {why && f >= at(why.t) ? <div style={{ position: "absolute", left: 380, top: 720, translate: "-50% 0", fontFamily: HAND, fontWeight: 700, fontSize: 74, color: CREMA, textShadow: txtSh,
        opacity: cl(sp(f, at(why.t), 12, 140) * 1.5), whiteSpace: "nowrap", transform: "rotate(-3deg)" }}>{why.txt}</div> : null}
    </AbsoluteFill>
  );
};

// 10 · TEMPORADA: la rueda del año; en t gira hasta dejar arriba los meses m0..m1 y se marcan con un arco
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
export const Temporada: P<{ bed: string; t: number; m0: number; m1: number; txt: string }> = ({ a, d, bed, t, m0, m1, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), w = ez((f - at(t)) / 26), mk = ez((f - at(t) - 26) / 14);
  const mid = (m0 + m1) / 2;
  const rot = -(mid * 30 + 15) * w + 40 * (1 - u);
  const R = 330, cx = 960, cy = 520;
  const arc = (a0: number, a1: number, r: number) => {
    const p = (ang: number) => `${cx + r * Math.sin((ang * Math.PI) / 180)},${cy - r * Math.cos((ang * Math.PI) / 180)}`;
    return `M${p(a0)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={12} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cl(u * 2) }}>
        <circle cx={cx} cy={cy} r={R + 40} fill="rgba(244,232,207,0.92)" />
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          {MESES.map((m, i) => {
            const ang = i * 30 + 15, on = i >= m0 && i <= m1;
            const x = cx + (R - 30) * Math.sin((ang * Math.PI) / 180), y = cy - (R - 30) * Math.cos((ang * Math.PI) / 180);
            return (
              <g key={m}>
                <line x1={cx} y1={cy} x2={cx + (R + 40) * Math.sin((i * 30 * Math.PI) / 180)} y2={cy - (R + 40) * Math.cos((i * 30 * Math.PI) / 180)} stroke="rgba(42,33,27,0.25)" strokeWidth={3} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${ang} ${x} ${y})`} fontFamily={SERIF} fontWeight={900} fontSize={46}
                  fill={on && mk > 0.5 ? CHILE : TINTA}>{m}</text>
              </g>
            );
          })}
          {mk > 0 ? <path d={arc(m0 * 30 + 2, m0 * 30 + 2 + ((m1 - m0 + 1) * 30 - 4) * mk, R + 22)} fill="none" stroke={CHILE} strokeWidth={22} strokeLinecap="round" /> : null}
        </g>
        <circle cx={cx} cy={cy} r={150} fill={GUINDA} />
        <path d={`M${cx},${cy - R - 70} l-22,-34 l44,0 z`} fill={CHILE} />
      </svg>
      <div style={{ position: "absolute", left: cx, top: cy, translate: "-50% -50%", width: 280, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.0, color: CREMA }}>el año del rancho</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 88, color: CREMA, textShadow: txtSh,
        opacity: cl(mk * 1.5), transform: `translateY(${(1 - mk) * 30}px)` }}>{txt}</div>
    </AbsoluteFill>
  );
};

// 11 · ITACATE: la servilleta bordada se abre por las puntas y cada cosa del almuerzo se borda en su palabra
export const Itacate: P<{ bed: string; items: Beat[] }> = ({ a, d, bed, items }) => {
  const { f, at } = useT(a);
  const o = ez(f / 22);
  const borde = "repeating-linear-gradient(90deg, #B3261E 0 14px, transparent 14px 22px, #2F4A7A 22px 36px, transparent 36px 44px)";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={10} />
      <div style={{ position: "absolute", left: 960, top: 545, translate: "-50% -50%", width: 1100, height: 860, background: "#FBF8F1", boxShadow: sombra, borderRadius: 6,
        transform: `rotate(-2deg) scale(${0.9 + 0.1 * o})` }}>
        {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: 40, right: 40, height: 14, top: s ? undefined : 34, bottom: s ? 34 : undefined, background: borde }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 86, color: GUINDA }}>el itacate</div>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: 170, top: 210 + i * 112, display: "flex", alignItems: "center", gap: 30 }}>
            <svg width={60} height={60} style={{ opacity: f >= at(it.t) ? 1 : 0 }}>
              <path d="M10,10 L50,50 M50,10 L10,50" stroke={i % 2 ? AÑIL : CHILE} strokeWidth={8} strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - ez((f - at(it.t)) / 10))} />
            </svg>
            <Escrito f={f} at={at(it.t)} dur={14} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: TINTA }}>{it.txt}</Escrito>
          </div>
        ))}
      </div>
      {/* las cuatro puntas de la servilleta que se abren */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <div key={i} style={{ position: "absolute", left: 960, top: 545, width: 640, height: 640, translate: "-50% -50%", background: "#F6F1E6", boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          clipPath: "polygon(50% 50%, 0 0, 100% 0)", transformOrigin: "50% 50%",
          transform: `rotate(${[0, 90, 270, 180][i]}deg) translateY(${-o * 700}px)`, opacity: 1 - o }} />
      ))}
    </AbsoluteFill>
  );
};

// 12 · TABLERO DE LOS 25: 25 fichas de madera (del 25 al 1); cada una se voltea a crema cuando Chayo la nombra
export const Tablero: P<{ bed: string; names: string[]; ts: number[]; pre: number }> = ({ a, d, bed, names, ts, pre }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const last = ts.reduce((m, t, j) => (f >= at(t) ? pre + j : m), pre - 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.65} blur={14} />
      <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", display: "grid", gridTemplateColumns: "repeat(5, 330px)", gap: 18, opacity: cl(u * 2),
        transform: `scale(${0.95 + 0.05 * u})` }}>
        {names.map((nm, i) => {
          const tj = i - pre, on = i < pre || (tj >= 0 && tj < ts.length && f >= at(ts[tj]));
          const v = i < pre ? 1 : on ? ez((f - at(ts[tj])) / 8) : 0;
          return (
            <div key={i} style={{ height: 150, borderRadius: 10, position: "relative", boxShadow: "0 10px 24px rgba(0,0,0,0.45)", transform: `rotateX(${(1 - v) * 0}deg) scale(${i === last ? 1.06 : 1})`,
              background: on ? CREMA : "linear-gradient(180deg, #7A4E2B, #5E3A1F)", border: i === last ? `5px solid ${MAIZ}` : "5px solid transparent", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 14, top: 6, fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: on ? GUINDA : "rgba(244,232,207,0.55)" }}>{25 - i}</div>
              <div style={{ position: "absolute", left: 10, right: 10, bottom: 12, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: nm.length > 16 ? 40 : 50, lineHeight: 1.0,
                color: TINTA, opacity: v }}>{nm}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 13 · BORDADO: el dicho de la abuela se borda en una servilleta dentro del bastidor de madera, letra por letra desde t
export const Bordado: P<{ bed: string; txt: string; sign: string; t: number }> = ({ a, d, bed, txt, sign, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const n = Math.floor(cl((f - at(t)) / (txt.length * 1.1)) * txt.length);
  const sg = ez((f - at(t) - txt.length * 1.1 - 6) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={10} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: 860, height: 860, borderRadius: "50%", opacity: cl(u * 2),
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0 3px, transparent 3px 7px), repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0 3px, transparent 3px 7px), #FBF8F1",
        border: "34px solid #B98A55", boxShadow: `${sombra}, inset 0 0 0 6px #8E6436`, transform: `scale(${0.9 + 0.1 * u}) rotate(${-2 + Math.sin(f / 80)}deg)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 110, boxSizing: "border-box" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 98, lineHeight: 1.1, textAlign: "center", color: CHILE, letterSpacing: 1 }}>
          {txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span>
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: AÑIL, marginTop: 24, opacity: sg }}>{sign}</div>
      </div>
    </AbsoluteFill>
  );
};
