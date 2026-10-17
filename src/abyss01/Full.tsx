// abyss01 · Abyss Ledger — reproductor propio (narrador, sin avatar): edl.json → planos (foto / clip agnes / metraje real / componente) + rótulos encima.
// Look del canal: azul abisal + hielo, sin grano, sin viñeta, sin filtros (regla del creador).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import EDL from "./edl.json";

const fB = loadBarlow("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const fI = loadInter("normal", { weights: ["400", "600"], subsets: ["latin"] });
const HEAD = fB.fontFamily, BODY = fI.fontFamily;
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
const ICE = "#E8F4FA", CYAN = "#5FD3F3", WARM = "#F2A65A", NAVY = "#06101F", RED = "#F05A4F";
const src = (k: string) => staticFile(k.includes("/") ? k : `img/abyss01/${k}.jpg`);
const vsrc = (k: string) => staticFile(k.includes("/") ? k : `clips/abyss01/${k}.mp4`);
const sp = (f: number, at: number) => spring({ frame: f - at, fps: FPS, config: { damping: 14, stiffness: 120, mass: 0.8 } });
const shadow = "0 4px 24px rgba(0,0,0,0.75)";

type Shot = { a: number; b: number; t: "img" | "vid" | "comp"; k?: string; ofs?: number; rate?: number; z?: [number, number]; o?: [number, number]; c?: string; props?: any };
type Ov = { a: number; b: number; c: string; props?: any };
export const TOTAL_S = (EDL as any).end as number;

// ── base: foto con empuje lento o video ──
const Plate: React.FC<{ s: { k: string; vid?: boolean; ofs?: number; rate?: number; z?: [number, number]; o?: [number, number] }; d: number; dim?: number }> = ({ s, d, dim = 0 }) => {
  const f = useCurrentFrame();
  const [z0, z1] = s.z || [1.03, 1.11];
  const [ox, oy] = s.o || [50, 50];
  const sc = s.vid ? 1 : z0 + (z1 - z0) * f / Math.max(1, d);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: NAVY }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${ox}% ${oy}%`, filter: dim ? `brightness(${1 - dim})` : undefined }}>
        {s.vid ? <OffthreadVideo src={vsrc(s.k)} startFrom={fr(s.ofs || 0)} playbackRate={s.rate || 1} muted style={st} /> : <Img src={src(s.k)} style={st} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Bed: React.FC<{ k: string; vid?: boolean; ofs?: number; d: number; dim?: number }> = ({ k, vid, ofs, d, dim = 0.55 }) => <Plate s={{ k, vid, ofs, z: [1.06, 1.14] }} d={d} dim={dim} />;
const Scrim: React.FC<{ op?: number; side?: "left" | "bottom" | "all" }> = ({ op = 0.6, side = "all" }) => (
  <AbsoluteFill style={{ background: side === "left" ? `linear-gradient(90deg, rgba(4,10,22,${op}) 0%, rgba(4,10,22,0) 62%)` : side === "bottom" ? `linear-gradient(0deg, rgba(4,10,22,${op}) 0%, rgba(4,10,22,0) 45%)` : `rgba(4,10,22,${op})` }} />
);

// ── 1 · Title: capítulo ──
const Title: React.FC<{ d: number; k: string; vid?: boolean; ofs?: number; kicker?: string; title: string }> = ({ d, k, vid, ofs, kicker, title }) => {
  const f = useCurrentFrame();
  const u = eo(f / 22), out = 1 - cl((f - d + 12) / 12);
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
        {kicker ? <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 38, letterSpacing: 14, color: CYAN, opacity: u, textShadow: shadow }}>{kicker}</div> : null}
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: title.length > 22 ? 104 : 132, letterSpacing: 6, color: ICE, textShadow: shadow, marginTop: 10,
          clipPath: `inset(0 ${100 - u * 100}% 0 0)`, textAlign: "center", maxWidth: 1600, lineHeight: 1.02 }}>{title}</div>
        <div style={{ width: 520 * u, height: 3, background: CYAN, marginTop: 26, boxShadow: `0 0 18px ${CYAN}` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 2 · Map: Antártida en proyección polar real + Frente Polar + etiquetas/rutas por segundo absoluto ──
const MCX = 960, MCY = 540, MR = 520; // map_polar.jpg: polo al centro, 30°S en el borde (R = 520 px)
const ll = (lat: number, lon: number) => { const r = (90 + lat) / 60 * MR, t = lon * Math.PI / 180; return [MCX + r * Math.sin(t), MCY - r * Math.cos(t)]; };
// latitud aproximada del Frente Polar por longitud (≈50°S en el Atlántico/Índico, ≈58-60°S en el Pacífico y el Drake)
const PF: [number, number][] = [[-180, -61], [-150, -60], [-120, -58], [-90, -59], [-70, -58.5], [-60, -58], [-45, -51.5], [-30, -50], [0, -50.5], [30, -49.5], [60, -50], [90, -51.5], [120, -53], [150, -55], [180, -61]];
const pfLat = (lon: number) => { for (let i = 0; i < PF.length - 1; i++) { const [l0, a0] = PF[i], [l1, a1] = PF[i + 1]; if (lon >= l0 && lon <= l1) return a0 + (a1 - a0) * (lon - l0) / (l1 - l0); } return -55; };
const ringPath = (dLat = 0) => { const p: string[] = []; for (let lon = -180; lon <= 180; lon += 3) { const [x, y] = ll(pfLat(lon) + dLat, lon); p.push(`${p.length ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`); } return p.join(" ") + " Z"; };
type MapLabel = { txt: string; lat: number; lon: number; t: number; color?: string; dx?: number; dy?: number };
type MapRoute = { pts: [number, number][]; t0: number; t1: number; color?: string };
const MapC: React.FC<{ a: number; d: number; head?: string; sub?: string; ring?: boolean; ringT?: number; band?: boolean; flow?: boolean; labels?: MapLabel[]; routes?: MapRoute[]; zoom?: [number, number]; focus?: [number, number]; drift?: { t0: number; t1: number } }> =
  ({ a, d, head, sub, ring = true, ringT, band, flow, labels = [], routes = [], zoom = [1.0, 1.08], focus, drift }) => {
  const f = useCurrentFrame();
  const at = (t: number) => fr(t) - fr(a);
  const z = zoom[0] + (zoom[1] - zoom[0]) * f / Math.max(1, d);
  const [fx, fy] = focus ? ll(focus[0], focus[1]) : [MCX, MCY];
  const rU = ring ? eo((f - (ringT !== undefined ? at(ringT) : 4)) / 40) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${fx}px ${fy}px` }}>
        <Img src={staticFile("img/abyss01/map_polar.jpg")} style={{ width: 1920, height: 1080 }} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {band ? <path d={ringPath(-4) + " " + ringPath(4)} fill="rgba(95,211,243,0.16)" fillRule="evenodd" opacity={rU} /> : null}
          {ring ? <path d={ringPath()} fill="none" stroke={CYAN} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rU} style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }} /> : null}
          {flow ? Array.from({ length: 28 }, (_, i) => {
            const lon = ((i * 360) / 28 + f * 0.9) % 360 - 180; const [x, y] = ll(pfLat(lon) - 1.5, lon); const [x2, y2] = ll(pfLat(lon + 6) - 1.5, lon + 6);
            const ang = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
            return <g key={i} transform={`translate(${x},${y}) rotate(${ang})`} opacity={0.9 * rU}><path d="M-16,-8 L6,0 L-16,8" fill="none" stroke={ICE} strokeWidth={4} strokeLinecap="round" /></g>;
          }) : null}
          {routes.map((r, i) => {
            const u = eo((f - at(r.t0)) / Math.max(1, at(r.t1) - at(r.t0)));
            const pts = r.pts.map(([la, lo]) => ll(la, lo)); const dd = pts.map((p, j) => `${j ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
            return <path key={i} d={dd} fill="none" stroke={r.color || WARM} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} opacity={u > 0 ? 0.95 : 0} strokeLinecap="round" />;
          })}
          {routes.map((r, i) => { // punta que avanza sobre la ruta
            const u = eo((f - at(r.t0)) / Math.max(1, at(r.t1) - at(r.t0))); if (u <= 0) return null;
            const pts = r.pts.map(([la, lo]) => ll(la, lo)); const seg = (pts.length - 1) * u; const j = Math.min(pts.length - 2, Math.floor(seg)); const k = seg - j;
            const x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * k, y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * k;
            return <circle key={"h" + i} cx={x} cy={y} r={11} fill={r.color || WARM} style={{ filter: `drop-shadow(0 0 8px ${r.color || WARM})` }} />;
          })}
          {drift ? (() => { // larva: baja hacia la Antártida y la corriente la arrastra en círculo
            const u = cl((f - at(drift.t0)) / Math.max(1, at(drift.t1) - at(drift.t0))); if (u <= 0) return null;
            const lat = u < 0.3 ? -42 - (u / 0.3) * 13 : -55 + Math.sin((u - 0.3) * 9) * 1.2; const lon = u < 0.3 ? -20 : -20 + (u - 0.3) / 0.7 * 300;
            const [x, y] = ll(lat, lon);
            return <g><circle cx={x} cy={y} r={14} fill={WARM} opacity={0.35} /><circle cx={x} cy={y} r={7} fill={WARM} /></g>;
          })() : null}
          {labels.map((l, i) => {
            const u = sp(f, at(l.t)); if (f < at(l.t)) return null; const [x, y] = ll(l.lat, l.lon);
            return (
              <g key={"l" + i} opacity={cl(u)}>
                <circle cx={x} cy={y} r={9 * u} fill={l.color || WARM} stroke={NAVY} strokeWidth={3} />
                <text x={x + (l.dx ?? 18)} y={y + (l.dy ?? 8)} fill={ICE} fontFamily={HEAD} fontWeight={700} fontSize={34} letterSpacing={2} style={{ paintOrder: "stroke" }} stroke={NAVY} strokeWidth={7}
                  textAnchor={(l.dx ?? 18) < 0 ? "end" : "start"}>{l.txt.toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      {head ? (
        <div style={{ position: "absolute", left: 70, top: 64, opacity: eo(f / 14) }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: ICE, letterSpacing: 3, textShadow: shadow, lineHeight: 1 }}>{head}</div>
          {sub ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: CYAN, marginTop: 10, textShadow: shadow }}>{sub}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── 3 · Temp: termómetro que cuenta ──
const Temp: React.FC<{ a: number; d: number; k: string; vid?: boolean; ofs?: number; steps: { t: number; v: number; txt: string }[]; head?: string }> = ({ a, d, k, vid, ofs, steps, head }) => {
  const f = useCurrentFrame(); const at = (t: number) => fr(t) - fr(a);
  let v = steps[0].v, txt = steps[0].txt;
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i]; if (f >= at(s.t)) { const prev = i ? steps[i - 1].v : s.v; v = prev + (s.v - prev) * eo((f - at(s.t)) / 24); txt = s.txt; }
  }
  const lo = -3, hi = 9, h = 560, fill = cl((v - lo) / (hi - lo));
  const col = v > 4 ? WARM : v > 0.5 ? CYAN : "#B9E6FF";
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.35} />
      <Scrim op={0.75} side="left" />
      <div style={{ position: "absolute", left: 120, top: 250, width: 60, height: h, borderRadius: 30, background: "rgba(232,244,250,0.15)", border: `3px solid ${ICE}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h * fill, background: col, boxShadow: `0 0 24px ${col}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: h * ((0 - lo) / (hi - lo)), height: 2, background: ICE }} />
      </div>
      <div style={{ position: "absolute", left: 210, top: 250 + h * (1 - fill) - 70, fontFamily: HEAD, fontWeight: 700, fontSize: 150, color: ICE, textShadow: shadow, lineHeight: 1 }}>
        {(v < 0 ? "−" : "") + Math.abs(v).toFixed(1)}<span style={{ fontSize: 70 }}> °C</span>
      </div>
      <div style={{ position: "absolute", left: 220, top: 250 + h * (1 - fill) + 80, fontFamily: BODY, fontWeight: 600, fontSize: 36, color: col, textShadow: shadow, maxWidth: 820 }}>{txt}</div>
      {head ? <div style={{ position: "absolute", left: 120, top: 120, fontFamily: HEAD, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: CYAN, textShadow: shadow }}>{head}</div> : null}
    </AbsoluteFill>
  );
};

// ── 4 · Stat: número grande ──
const Stat: React.FC<{ a: number; d: number; k: string; vid?: boolean; ofs?: number; big: string; cap: string; kicker?: string; t?: number }> = ({ a, d, k, vid, ofs, big, cap, kicker, t }) => {
  const f = useCurrentFrame(); const st = t !== undefined ? fr(t) - fr(a) : 6; const u = sp(f, st);
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.45} />
      <Scrim op={0.55} side="bottom" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {kicker ? <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 40, letterSpacing: 10, color: CYAN, textShadow: shadow, opacity: cl(f / 10) }}>{kicker}</div> : null}
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: big.length > 9 ? 170 : 230, color: ICE, textShadow: shadow, transform: `scale(${0.85 + 0.15 * cl(u)})`, opacity: cl(u), lineHeight: 1 }}>{big}</div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 44, color: ICE, textShadow: shadow, marginTop: 24, opacity: cl((f - st - 10) / 12), maxWidth: 1400, textAlign: "center" }}>{cap}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 5 · Bars: todos los ríos contra la corriente ──
const Bars: React.FC<{ a: number; d: number; k: string; vid?: boolean; ofs?: number; rows: { txt: string; v: number; t: number; color?: string; val: string }[]; head?: string; max: number }> = ({ a, d, k, vid, ofs, rows, head, max }) => {
  const f = useCurrentFrame(); const at = (t: number) => fr(t) - fr(a);
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.6} />
      {head ? <div style={{ position: "absolute", left: 120, top: 150, fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: ICE, letterSpacing: 3, textShadow: shadow }}>{head}</div> : null}
      {rows.map((r, i) => {
        const u = eo((f - at(r.t)) / 30); if (f < at(r.t)) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 120, top: 330 + i * 230 }}>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 38, color: ICE, textShadow: shadow }}>{r.txt}</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
              <div style={{ width: Math.max(14, 1500 * (r.v / max) * u), height: 70, background: r.color || CYAN, borderRadius: 6, boxShadow: `0 0 26px ${r.color || CYAN}` }} />
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: ICE, marginLeft: 24, textShadow: shadow, opacity: u }}>{r.val}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 6 · Layers: corte del océano (agua fría que se mete por debajo / capas con cangrejos / la superficie que se filtra) ──
const Layers: React.FC<{ a: number; d: number; mode: "slide" | "crabs" | "surface"; t1?: number; t2?: number }> = ({ a, d, mode, t1, t2 }) => {
  const f = useCurrentFrame(); const at = (t: number) => fr(t) - fr(a);
  const u1 = eo((f - (t1 !== undefined ? at(t1) : 10)) / 40), u2 = eo((f - (t2 !== undefined ? at(t2) : 60)) / 30);
  const lbl = (txt: string, x: number, y: number, c: string, op: number, size = 40) => (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: HEAD, fontWeight: 700, fontSize: size, color: c, letterSpacing: 3, opacity: op, textShadow: shadow }}>{txt}</div>
  );
  if (mode === "crabs") {
    const crabs = Array.from({ length: 16 }, (_, i) => ({ x: 380 + i * 92 + (i % 3) * 14 + 16 * Math.sin(f / 22 + i * 1.7), y: 760 + ((i * 37) % 60) }));
    return (
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0B2F4A 0%, #0A2340 38%, #102B3F 60%, #081625 100%)", transform: `scale(${1 + 0.08 * f / Math.max(30, d)})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 420, background: "linear-gradient(180deg, rgba(185,230,255,0.35), rgba(185,230,255,0.08))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 540, height: 400, background: "linear-gradient(180deg, rgba(242,166,90,0.05), rgba(242,166,90,0.28))" }} />
        <svg width={1920} height={1080} style={{ position: "absolute" }}><path d="M0,1000 L300,960 L700,700 L1100,560 L1500,450 L1920,420 L1920,1080 L0,1080 Z" fill="#2A2621" opacity={0.95} /></svg>
        {lbl("SHELF · BELOW 0 °C", 1240, 170, "#B9E6FF", 1)}
        {lbl("DEEP WATER · ABOUT +1.4 °C", 300, 600, WARM, 1)}
        {crabs.map((c, i) => <div key={i} style={{ position: "absolute", left: c.x, top: c.y - (c.x - 380) * 0.18, width: 34, height: 22, borderRadius: "50% 50% 40% 40%", background: RED, opacity: cl(u1 * 16 - i), boxShadow: "0 0 8px rgba(240,90,79,0.8)" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 538, height: 4, background: CYAN, opacity: u2, boxShadow: `0 0 16px ${CYAN}` }} />
        {lbl("THE CRABS STOP HERE", 1120, 470, CYAN, u2, 46)}
      </AbsoluteFill>
    );
  }
  const surface = mode === "surface";
  return (
    <AbsoluteFill style={{ background: "#071629", transform: `scale(${1 + 0.06 * f / Math.max(30, d)})` }}>
      <div style={{ position: "absolute", left: 0, top: 160, width: 1920, height: 920, background: "linear-gradient(90deg, rgba(242,166,90,0.55) 0%, rgba(242,166,90,0.35) 45%, rgba(95,211,243,0.25) 55%, rgba(185,230,255,0.5) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={`M1920,1080 L1920,${300} C${1500},${330} ${1200 - 300 * u1},${520} ${900 - 500 * u1},${1080} Z`} fill="rgba(185,230,255,0.55)" />
        <line x1={960} y1={140} x2={960} y2={1080} stroke={CYAN} strokeWidth={4} strokeDasharray="18 14" opacity={0.9} />
        {surface ? Array.from({ length: 6 }, (_, i) => { const x = 300 + i * 260 + ((f * 4) % 260); return <path key={i} d={`M${x},185 l70,0 l-18,-14 M${x + 70},185 l-18,14`} stroke={ICE} strokeWidth={6} fill="none" opacity={u2} strokeLinecap="round" />; }) : null}
        {surface ? Array.from({ length: 4 }, (_, i) => { const x = 500 + i * 300 + ((f * 3) % 300); return <ellipse key={"k" + i} cx={x} cy={172} rx={34} ry={10} fill="#7A6A2E" opacity={u2} />; }) : null}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 6, background: ICE, opacity: 0.8 }} />
      {lbl("NORTH · WARMER", 150, 260, WARM, 1)}
      {lbl("SOUTH · COLDER, FRESHER", 1260, 260, "#B9E6FF", 1)}
      {lbl("POLAR FRONT", 990, 80, CYAN, 1, 44)}
      {surface ? lbl("WIND AND WAVES PUSH FLOATING THINGS SOUTH", 360, 210, ICE, u2, 38) : lbl("COLD WATER SLIDES UNDERNEATH", 1000, 860, ICE, u1, 44)}
    </AbsoluteFill>
  );
};

// ── 7 · Time: línea de tiempo ──
const Time: React.FC<{ a: number; d: number; k: string; vid?: boolean; ofs?: number; marks: { txt: string; sub: string; x: number; t: number }[]; head?: string }> = ({ a, d, k, vid, ofs, marks, head }) => {
  const f = useCurrentFrame(); const at = (t: number) => fr(t) - fr(a);
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.55} />
      {head ? <div style={{ position: "absolute", left: 120, top: 150, fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: ICE, letterSpacing: 3, textShadow: shadow }}>{head}</div> : null}
      <div style={{ position: "absolute", left: 160, right: 160, top: 600, height: 4, background: ICE, opacity: 0.7 }} />
      {marks.map((m, i) => {
        const u = sp(f, at(m.t)); if (f < at(m.t)) return null; const x = 160 + (1600 * m.x) / 100;
        return (
          <div key={i} style={{ position: "absolute", left: x - 200, top: 560, width: 400, textAlign: "center", opacity: cl(u) }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: CYAN, margin: "22px auto 0", transform: `scale(${cl(u)})`, boxShadow: `0 0 18px ${CYAN}` }} />
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: ICE, marginTop: 18, textShadow: shadow }}>{m.txt}</div>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: CYAN, marginTop: 6, textShadow: shadow }}>{m.sub}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 8 · Chart: curva simple ──
const Chart: React.FC<{ a: number; d: number; k: string; vid?: boolean; ofs?: number; head: string; xl: string; yl: string; pts: [number, number][]; t?: number; note?: string; color?: string }> = ({ a, d, k, vid, ofs, head, xl, yl, pts, t, note, color = WARM }) => {
  const f = useCurrentFrame(); const st = t !== undefined ? fr(t) - fr(a) : 8; const u = eo((f - st) / 50);
  const X0 = 260, X1 = 1660, Y0 = 880, Y1 = 330;
  const P = pts.map(([x, y]) => [X0 + (X1 - X0) * x, Y0 - (Y0 - Y1) * y]);
  const dd = P.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.7} />
      <div style={{ position: "absolute", left: 120, top: 120, fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: ICE, letterSpacing: 3, textShadow: shadow }}>{head}</div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={ICE} strokeWidth={3} opacity={0.7} />
        <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 30} stroke={ICE} strokeWidth={3} opacity={0.7} />
        <path d={dd} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
      </svg>
      <div style={{ position: "absolute", left: X0, top: Y0 + 24, width: X1 - X0, textAlign: "center", fontFamily: BODY, fontWeight: 600, fontSize: 32, color: ICE, textShadow: shadow }}>{xl}</div>
      <div style={{ position: "absolute", left: 60, top: Y1 - 90, fontFamily: BODY, fontWeight: 600, fontSize: 32, color: ICE, textShadow: shadow }}>{yl}</div>
      {note ? <div style={{ position: "absolute", left: X1 - 560, top: Y1 - 40, width: 560, textAlign: "right", fontFamily: HEAD, fontWeight: 700, fontSize: 54, color, opacity: cl((f - st - 40) / 14), textShadow: shadow }}>{note}</div> : null}
    </AbsoluteFill>
  );
};

// ── 9 · Recap: tres razones ──
const Recap: React.FC<{ a: number; d: number; k: string; vid?: boolean; ofs?: number; head: string; items: { t: number; txt: string }[] }> = ({ a, d, k, vid, ofs, head, items }) => {
  const f = useCurrentFrame(); const at = (t: number) => fr(t) - fr(a);
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.55} />
      <Scrim op={0.7} side="left" />
      <div style={{ position: "absolute", left: 130, top: 190, fontFamily: HEAD, fontWeight: 700, fontSize: 70, color: ICE, letterSpacing: 3, textShadow: shadow }}>{head}</div>
      {items.map((it, i) => {
        const u = sp(f, at(it.t)); if (f < at(it.t)) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 130 + (1 - cl(u)) * -60, top: 360 + i * 150, display: "flex", alignItems: "center", opacity: cl(u) }}>
            <div style={{ width: 74, height: 74, borderRadius: 37, border: `4px solid ${CYAN}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 46, color: CYAN }}>{i + 1}</div>
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 48, color: ICE, marginLeft: 30, textShadow: shadow }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 10 · End ──
const End: React.FC<{ a: number; d: number; k: string; vid?: boolean; ofs?: number; next: string }> = ({ d, k, vid, ofs, next }) => {
  const f = useCurrentFrame(); const u = eo(f / 20);
  return (
    <AbsoluteFill>
      <Bed k={k} vid={vid} ofs={ofs} d={d} dim={0.55} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 40, letterSpacing: 14, color: CYAN, opacity: u, textShadow: shadow }}>NEXT ON ABYSS LEDGER</div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 86, color: ICE, textAlign: "center", maxWidth: 1500, marginTop: 16, opacity: u, textShadow: shadow, lineHeight: 1.05 }}>{next}</div>
        <div style={{ marginTop: 44, padding: "16px 44px", border: `3px solid ${ICE}`, borderRadius: 8, fontFamily: HEAD, fontWeight: 700, fontSize: 44, letterSpacing: 8, color: ICE, opacity: cl((f - 20) / 14) }}>SUBSCRIBE</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── overlays ──
const Lower: React.FC<{ d: number; name: string; sub?: string }> = ({ d, name, sub }) => {
  const f = useCurrentFrame(); const u = eo(f / 14), out = 1 - cl((f - d + 12) / 12);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 90, bottom: 110, borderLeft: `6px solid ${CYAN}`, paddingLeft: 24, transform: `translateX(${(1 - u) * -40}px)`, opacity: u }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 56, color: ICE, letterSpacing: 2, textShadow: shadow, lineHeight: 1.05 }}>{name}</div>
        {sub ? <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: CYAN, textShadow: shadow, marginTop: 6 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
const Credit: React.FC<{ d: number; txt: string }> = ({ txt }) => (
  <div style={{ position: "absolute", right: 34, bottom: 26, fontFamily: BODY, fontSize: 20, color: "rgba(232,244,250,0.75)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{txt}</div>
);

const COMPS: Record<string, React.FC<any>> = { Title, Map: MapC, Temp, Stat, Bars, Layers, Time, Chart, Recap, End };
const OVS: Record<string, React.FC<any>> = { Lower, Credit };

export const Full: React.FC = () => {
  const E = EDL as any as { end: number; shots: Shot[]; overlays?: Ov[] };
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {E.shots.map((s, i) => {
        const from = fr(s.a), d = fr(s.b) - fr(s.a);
        if (s.t === "comp") {
          const K = COMPS[s.c || ""]; if (!K) throw new Error(`abyss01: componente desconocido "${s.c}" en el plano ${i}`);
          return <Sequence key={i} from={from} durationInFrames={d}><K {...s.props} a={s.a} d={d} /></Sequence>;
        }
        return <Sequence key={i} from={from} durationInFrames={d}><Plate s={{ k: s.k!, vid: s.t === "vid", ofs: s.ofs, rate: s.rate, z: s.z, o: s.o }} d={d} /></Sequence>;
      })}
      {(E.overlays || []).map((o, i) => {
        const K = OVS[o.c]; if (!K) throw new Error(`abyss01: rótulo desconocido "${o.c}"`);
        const d = fr(o.b) - fr(o.a);
        return <Sequence key={"o" + i} from={fr(o.a)} durationInFrames={d}><K {...o.props} d={d} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
