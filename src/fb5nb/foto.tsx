// fb5nb · MOTOR DE COMPONENTES CON FOTO (reusable para los 6 videos cl2nov: sólo cambian P y el fotos.json).
// La foto real es la protagonista: tarjeta 3D que entra con resorte y se acerca despacio al punto que importa;
// encima, lo que el ojo del editor marcaría a mano: círculo de marcador, lupa, barrido antes/después, abanico de fotos.
// Cada «beat» arranca en un segundo (relativo al componente) o en una marca de la voz (m.<nombre>[+s]).
// Todo es f(t). Un solo transform con perspective() por elemento (preserve-3d parpadea en el farm).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, P, cl, e, hash, idn, spr, shadowTxt } from "./lib";

export type Beat = {
  t: number | string;                 // segundos desde el inicio del componente, o "marca" / "marca+1.5"
  lay: "card" | "marca" | "lente" | "barrido" | "abanico" | "inset" | "vec";
  id?: string;                        // foto (sin extensión) de public/<slug>/img
  pt?: [number, number];              // punto de interés en % de la foto (0-100)
  txt?: string;                       // rótulo ≤5 palabras
  col?: string;                       // "ok" | "red" | "sun" | "solv" | "honey"
  id2?: string; txt2?: string; col2?: string; t2?: number | string;   // barrido: la segunda foto, su rótulo y cuándo barre
  ids?: string[]; txts?: string[]; ts?: (number | string)[]; // abanico: hasta 3 fotos
  side?: "l" | "r"; z?: number; oy?: number; mas?: { t: number | string; lay: "marca" | "lente" | "card"; pt: [number, number]; txt?: string; col?: string; side?: "l" | "r" }[];                   // inset / lente: de qué lado va
};
type Comp = React.FC<{ t: number; a: number; b: number; m: Record<string, number> }>;

const COL: Record<string, string> = { ok: C.ok, red: C.red, sun: C.sun, solv: C.solv, honey: C.honey };
const W = 1440, H = 810, CX = 960, CY = 500;
const src = (id: string) => staticFile(P + "img/" + id + ".jpg");
export const tOf = (v: number | string | undefined, a: number, m: Record<string, number>, def = a): number => {
  if (v === undefined) return def;
  if (typeof v === "number") return a + v;
  const g = /^([a-z_][a-z0-9_]*)?([+-]?[0-9.]+)?$/i.exec(v.trim());
  const base = g && g[1] ? (m[g[1]] ?? a) : a;
  return base + (g && g[2] ? parseFloat(g[2]) : 0);
};

// ---------- la foto dentro de su caja: recorte que deja fuera la estrellita (90 % del cuadro) + acercamiento al punto ----------
// mapa de un punto de la foto (0-1) a la caja (px). Con el origen del zoom en el punto, el punto queda quieto.
const geo = (w: number, h: number, pt: [number, number], z: number) => {
  const px = Math.min(0.86, Math.max(0.1, pt[0] / 100)), py = Math.min(0.86, Math.max(0.1, pt[1] / 100));
  const A = 1.11 * z, bx = 1.11 * px * w * (1 - z), by = 1.11 * py * h * (1 - z);
  return { A, bx, by, map: (q: [number, number]) => [A * (q[0] / 100) * w + bx, A * (q[1] / 100) * h + by] as [number, number] };
};
const zoomOf = (id: string, t: number, t0: number, t1: number) => {
  const n = idn(id), out = hash(n, 31) < 0.4, amp = 0.07 + 0.08 * hash(n, 32);
  const u = cl((t - t0) / Math.max(1, t1 - t0)), k = 1 - Math.pow(1 - u, 2.2);
  return 1 + amp * (out ? 1 - k : k);
};
const PhotoBox: React.FC<{ id: string; w: number; h: number; z: number; pt: [number, number]; r?: number; children?: React.ReactNode }> = ({ id, w, h, z, pt, r = 18, children }) => {
  const g = geo(w, h, pt, z);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, overflow: "hidden", background: "#1d150c" }}>
      <Img src={src(id)} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, objectFit: "cover", transformOrigin: "0 0", transform: `translate(${g.bx}px,${g.by}px) scale(${g.A})` }} />
      {/* luz de ventana que barre el vidrio de la foto */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.0) 30%, rgba(255,244,220,.10) 46%, rgba(255,255,255,.0) 60%)" }} />
      {children}
    </div>
  );
};

// ---------- la tarjeta: entra con resorte (sube, se endereza), respira, y sale empujada hacia un costado ----------
const cardTf = (t: number, t0: number, tOut: number, seed: number, x = CX, y = CY, s = 1, rot = 0) => {
  const p = spr(t, t0, 0.9, 0.42), o = cl((t - t0) * 5) * (1 - e(t, tOut, tOut + 0.5));
  const q = e(t, tOut, tOut + 0.55), dir = hash(seed, 3) < 0.5 ? -1 : 1;
  const ry = (1 - p) * dir * 24 + q * -dir * 30 + Math.sin((t - t0) * 0.35 + seed) * 1.6;
  const rx = (1 - p) * 26 + Math.sin((t - t0) * 0.27 + seed * 2) * 1.2;
  const tx = x - (W * s) / 2 + q * -dir * 520, ty = y - (H * s) / 2 + (1 - p) * 280 + q * 60;
  const rz = rot + (1 - p) * dir * -5;
  return { o, style: { position: "absolute" as const, left: 0, top: 0, width: W, height: H, opacity: o, transformOrigin: "50% 50%", transform: `translate(${tx}px,${ty}px) perspective(1900px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s * (0.86 + 0.14 * Math.min(1.04, p))})` } };
};
const Shadow: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 18, boxShadow: "0 50px 90px rgba(0,0,0,.62), 0 14px 30px rgba(0,0,0,.45), inset 0 0 0 1.5px rgba(255,240,215,.16)" }} />
);
// reflejo en el piso de vidrio
const Reflejo: React.FC<{ id: string; w: number; h: number; z: number; pt: [number, number] }> = ({ id, w, h, z, pt }) => (
  <div style={{ position: "absolute", left: 0, top: h + 14, width: w, height: h * 0.32, overflow: "hidden", opacity: 0.22, WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,.9), transparent)", maskImage: "linear-gradient(180deg, rgba(0,0,0,.9), transparent)" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: "scaleY(-1)", transformOrigin: "50% 0%", filter: "blur(3px)" }}><PhotoBox id={id} w={w} h={h} z={z} pt={pt} /></div>
  </div>
);

// ---------- rótulo clavado: pastilla oscura translúcida con letras grandes, entra con resorte ----------
const Pin: React.FC<{ t: number; at: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ t, at, x, y, txt, col = C.ink, size = 64 }) => {
  const p = spr(t, at, 1.1), o = cl((t - at) * 7);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - p) * 40}px) rotate(${(1 - p) * -5}deg) scale(${0.75 + 0.25 * p})`, opacity: o, fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: 1, lineHeight: 1, padding: "14px 28px 10px", borderRadius: 14, background: "rgba(18,13,8,.72)", boxShadow: "0 18px 40px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.12)", textShadow: shadowTxt }}>{txt}</div>
  );
};

// círculo de marcador a mano (dos vueltas que no cierran justo) que se dibuja
const Marcador: React.FC<{ t: number; at: number; x: number; y: number; rx: number; ry: number; col: string; seed: number }> = ({ t, at, x, y, rx, ry, col, seed }) => {
  const p = e(t, at, at + 0.7);
  if (p <= 0) return null;
  const j = (k: number) => (hash(seed, k) - 0.5) * 0.12;
  let d = "";
  for (let i = 0; i <= 64; i++) {
    const u = i / 64, th = -2.2 + u * Math.PI * 2.25, rr = 1 + j(1) * Math.sin(th * 2 + j(2) * 20) + 0.05 * u;
    d += (i ? " L" : "M") + (x + Math.cos(th) * rx * rr).toFixed(1) + "," + (y + Math.sin(th) * ry * rr).toFixed(1);
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={d} pathLength={1} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={13} strokeLinecap="round" strokeDasharray={`${p} 1`} transform="translate(3,5)" />
      <path d={d} pathLength={1} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${p} 1`} style={{ filter: `drop-shadow(0 0 8px ${col})` }} />
    </svg>
  );
};
// flecha curva a mano desde (x0,y0) hasta (x1,y1)
const Flecha: React.FC<{ t: number; at: number; x0: number; y0: number; x1: number; y1: number; col: string }> = ({ t, at, x0, y0, x1, y1, col }) => {
  const p = e(t, at, at + 0.45);
  if (p <= 0) return null;
  const mx = (x0 + x1) / 2 + (y1 - y0) * 0.25, my = (y0 + y1) / 2 - (x1 - x0) * 0.25;
  const ang = Math.atan2(y1 - my, x1 - mx), hl = 26;
  const h1 = `M${x1 - hl * Math.cos(ang - 0.5)},${y1 - hl * Math.sin(ang - 0.5)} L${x1},${y1} L${x1 - hl * Math.cos(ang + 0.5)},${y1 - hl * Math.sin(ang + 0.5)}`;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M${x0},${y0} Q${mx},${my} ${x1},${y1}`} pathLength={1} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${p} 1`} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.5))" }} />
      {p > 0.95 && <path d={h1} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

// ---------- una tarjeta con su capa de marcas ----------
const Tarjeta: React.FC<{ t: number; b: Beat; t0: number; t1: number; tOut: number; m: Record<string, number>; a: number; x?: number; y?: number; s?: number; rot?: number }> = ({ t, b, t0, t1, tOut, m, a, x, y, s, rot }) => {
  const id = b.id!, pt = b.pt ?? [50, 50], seed = idn(id) % 997;
  const z = zoomOf(id, t, t0, t1), g = geo(W, H, pt, z);
  const tf = cardTf(t, t0, tOut, seed, x, y, s, rot);
  if (tf.o <= 0.005) return null;
  const ST = [{ ...b, at0: t0 + 0.55 }, ...(b.mas ?? []).map((q) => ({ ...q, at0: tOf(q.t, a, m) + 0.15 }))];
  const L: React.ReactNode[] = [];
  ST.forEach((st, si) => {
    const at = st.at0, until = si + 1 < ST.length ? ST[si + 1].at0 - 0.15 : 1e9;
    if (t < at - 0.05 || t > until + 0.4) return;
    const fo = 1 - e(t, until, until + 0.35), col = COL[st.col ?? "sun"] ?? C.sun, [px, py] = g.map(st.pt ?? pt), sd = seed + si * 37;
    const A: React.ReactNode[] = [];
    if (st.lay === "marca" || st.lay === "card") {
      const rx = 150 + 60 * hash(sd, 7), ry = rx * 0.72;
      if (st.lay === "marca") A.push(<Marcador key="mc" t={t} at={at} x={px} y={py} rx={rx} ry={ry} col={col} seed={sd} />);
      if (st.txt) {
        const up = py > H * 0.5, lx = Math.min(W - 260, Math.max(260, px + (px > W / 2 ? -1 : 1) * 220)), ly = up ? Math.max(90, py - ry - 140) : Math.min(H - 80, py + ry + 140);
        if (st.lay === "marca") A.push(<Flecha key="fl" t={t} at={at + 0.5} x0={lx} y0={ly + (up ? 50 : -50)} x1={px + (lx > px ? 0.5 : -0.5) * rx} y1={py + (up ? -0.8 : 0.8) * ry} col={col} />);
        A.push(<Pin key="pn" t={t} at={at + (st.lay === "marca" ? 0.45 : 0.2)} x={st.lay === "marca" ? lx : W / 2} y={st.lay === "marca" ? ly : H - 90} txt={st.txt} col={st.lay === "marca" ? C.ink : col} />);
      }
    }
    if (st.lay === "lente") {
      const sp: [number, number] = st.pt ?? pt;
      const R = 230, side = st.side ?? (px > W / 2 ? "l" : "r"), lx = side === "l" ? 270 : W - 270, ly = Math.min(H - 250, Math.max(250, py - 40));
      const p = spr(t, at, 1, 0.45), Z = 2.6, lw = W * Z, lh = H * Z;
      const cx = px + (lx - px) * p, cy = py + (ly - py) * p, rr = R * (0.35 + 0.65 * p);
      const g2 = geo(lw, lh, sp, 1), [qx, qy] = g2.map(sp);
      A.push(
        <svg key="hl" width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: cl((t - at) * 4) }}>
          <circle cx={px} cy={py} r={26} fill="none" stroke={col} strokeWidth={6} style={{ filter: `drop-shadow(0 0 8px ${col})` }} />
          <line x1={px} y1={py} x2={cx} y2={cy} stroke={col} strokeWidth={4} strokeDasharray="10 8" opacity={0.85} />
        </svg>,
        <div key="ln" style={{ position: "absolute", left: cx - rr, top: cy - rr, width: 2 * rr, height: 2 * rr, borderRadius: "50%", overflow: "hidden", opacity: cl((t - at) * 4), boxShadow: `0 0 0 10px rgba(20,14,8,.85), 0 0 0 13px ${col}, 0 30px 60px rgba(0,0,0,.6)` }}>
          <div style={{ position: "absolute", left: rr - qx * (rr / R), top: rr - qy * (rr / R), width: lw, height: lh, transformOrigin: "0 0", transform: `scale(${rr / R})` }}>
            <PhotoBox id={id} w={lw} h={lh} z={1} pt={sp} r={0} />
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(60% 50% at 32% 26%, rgba(255,255,255,.32), rgba(255,255,255,0) 60%)" }} />
        </div>,
      );
      if (st.txt) A.push(<Pin key="pn" t={t} at={at + 0.5} x={lx} y={Math.min(H - 40, ly + R + 70)} txt={st.txt} col={col} size={58} />);
    }
    L.push(<div key={"st" + si} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: fo }}>{A}</div>);
  });
  return (
    <div style={tf.style}>
      <Shadow w={W} h={H} />
      <PhotoBox id={id} w={W} h={H} z={z} pt={pt} />
      <Reflejo id={id} w={W} h={H} z={z} pt={pt} />
      {L}
    </div>
  );
};

// ---------- barrido antes/después: la segunda foto entra detrás de una línea de luz que cruza la tarjeta ----------
const Barrido: React.FC<{ t: number; b: Beat; t0: number; t1: number; tOut: number; m: Record<string, number>; a: number }> = ({ t, b, t0, t1, tOut, m, a }) => {
  const id = b.id!, id2 = b.id2!, pt = b.pt ?? [50, 50], seed = idn(id) % 997;
  const tw = tOf(b.t2, a, m, t0 + (t1 - t0) / 2), w = e(t, tw, tw + 1.1), z = zoomOf(id, t, t0, t1);
  const tf = cardTf(t, t0, tOut, seed);
  if (tf.o <= 0.005) return null;
  const xl = W * (1 - w), c1 = COL[b.col ?? "red"] ?? C.red, c2 = COL[b.col2 ?? "ok"] ?? C.ok;
  return (
    <div style={tf.style}>
      <Shadow w={W} h={H} />
      <PhotoBox id={id} w={W} h={H} z={z} pt={pt} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: 18, overflow: "hidden", clipPath: `inset(0 0 0 ${xl}px)` }}>
        <PhotoBox id={id2} w={W} h={H} z={zoomOf(id2, t, tw, t1)} pt={pt} />
      </div>
      {w > 0 && w < 1 && <div style={{ position: "absolute", left: xl - 4, top: -20, width: 8, height: H + 40, background: C.sun, boxShadow: `0 0 30px 8px ${C.sun}`, borderRadius: 4 }} />}
      <Reflejo id={w > 0.5 ? id2 : id} w={W} h={H} z={z} pt={pt} />
      {b.txt && <div style={{ opacity: 1 - e(t, tw, tw + 0.4) }}><Pin t={t} at={t0 + 0.6} x={W / 2} y={H - 90} txt={b.txt} col={c1} /></div>}
      {b.txt2 && <Pin t={t} at={tw + 1} x={W / 2} y={H - 90} txt={b.txt2} col={c2} />}
    </div>
  );
};

// ---------- abanico: hasta 3 fotos que llegan de a una y se abren en abanico sobre la mesa ----------
const Abanico: React.FC<{ t: number; b: Beat; t0: number; tOut: number; m: Record<string, number>; a: number }> = ({ t, b, t0, tOut, m, a }) => {
  const ids = b.ids ?? [], n = ids.length, sc = n === 2 ? 0.56 : 0.46;
  const X = n === 2 ? [600, 1320] : [430, 960, 1490], R = n === 2 ? [-4, 4] : [-7, 0, 7], Y = n === 2 ? [520, 520] : [560, 500, 560];
  return (
    <>
      {ids.map((id, i) => {
        const ti = b.ts?.[i] !== undefined ? tOf(b.ts[i], a, m) : t0 + i * 0.7, tf = cardTf(t, ti, tOut, idn(id) % 997, X[i], Y[i], sc, R[i]);
        if (tf.o <= 0.005) return null;
        const pt: [number, number] = [50, 50], z = zoomOf(id, t, ti, ti + 12), txt = b.txts?.[i];
        return (
          <div key={id} style={tf.style}>
            <Shadow w={W} h={H} />
            <PhotoBox id={id} w={W} h={H} z={z} pt={pt} />
            {txt && <Pin t={t} at={ti + 0.5} x={W / 2} y={H + 110} txt={txt} col={COL[b.col ?? "sun"]} size={120} />}
          </div>
        );
      })}
    </>
  );
};

// ---------- la escena entera: los beats en orden, el que entra empuja al que sale ----------
export const FotoEscena: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; beats: Beat[]; Comp?: Comp }> = ({ t, a, b, m, beats, Comp }) => {
  const T0 = beats.map((x, i) => (i === 0 ? a : tOf(x.t, a, m)));
  const L: React.ReactNode[] = [];
  beats.forEach((bt, i) => {
    const t0 = T0[i], t1 = i + 1 < beats.length ? T0[i + 1] : b, tOut = i + 1 < beats.length ? t1 : b + 9;
    if (t < t0 - 0.05 || t > tOut + 0.6) return;
    const key = "b" + i;
    if (bt.lay === "vec" || bt.lay === "inset") {
      if (Comp) {
        const o = cl((t - t0) * 3) * (1 - e(t, tOut, tOut + 0.45));
        L.push(<AbsoluteFill key={key + "v"} style={{ opacity: o, transform: `scale(${bt.z ?? (bt.lay === "vec" ? 1.28 : 1)})`, transformOrigin: `50% ${bt.oy ?? 50}%` }}><Comp t={t} a={a} b={b} m={m} /></AbsoluteFill>);
      }
      if (bt.lay === "inset" && bt.id) {
        const r = bt.side !== "l";
        L.push(<Tarjeta key={key} t={t} b={{ ...bt, lay: "card" }} t0={t0} t1={t1} tOut={tOut} m={m} a={a} x={r ? 1470 : 450} y={330} s={0.36} rot={r ? 3 : -3} />);
      }
    } else if (bt.lay === "barrido") L.push(<Barrido key={key} t={t} b={bt} t0={t0} t1={t1} tOut={tOut} m={m} a={a} />);
    else if (bt.lay === "abanico") L.push(<Abanico key={key} t={t} b={bt} t0={t0} tOut={tOut} m={m} a={a} />);
    else L.push(<Tarjeta key={key} t={t} b={bt} t0={t0} t1={t1} tOut={tOut} m={m} a={a} />);
  });
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
