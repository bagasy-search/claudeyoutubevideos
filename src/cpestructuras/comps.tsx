// comps.tsx — componentes de cpestructuras (minuto 1). Todo VECTOR / CSS, hecho a medida, atado a la palabra que lo dispara.
// Mapas = contornos Natural Earth (geo.json) proyectados acá: nítidos a cualquier zoom (§2.4 del megaprompt v3).
import React from "react";
import { AbsoluteFill } from "remotion";
import { SANS, ROMAN, MONO, W, H, k01, lerp, ease, easeOut, easeIn, rnd, shadow, SAND, GOLD, GRANITE, RED, spring } from "./lib";
import GEO from "./geo.json";

const G = GEO as unknown as Record<string, number[][][]>;
const R2D = Math.PI / 180;
type P = { t: number; a: number; b: number };

// ============ GLOBO ORTOGRÁFICO VECTOR ============
// cámara: [t, lon0, lat0, radio_px] (se interpola en log para el radio)
type Pin = { lon: number; lat: number; label: string; sub?: string; t: number };
const ortho = (lon0: number, lat0: number, R: number, cx: number, cy: number) => (lon: number, lat: number) => {
  const l = (lon - lon0) * R2D, p = lat * R2D, p0 = lat0 * R2D;
  const x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
  const c = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  if (c >= 0) return { x: cx + R * x, y: cy - R * y, v: c };
  const n = Math.hypot(x, y) || 1; // detrás del globo: se aplasta contra el borde (el relleno queda bien cerrado)
  return { x: cx + (R * x) / n, y: cy - (R * y) / n, v: c };
};
const camAt = (cams: number[][], t: number) => {
  if (t <= cams[0][0]) return cams[0].slice(1);
  for (let i = 1; i < cams.length; i++) if (t <= cams[i][0]) {
    const k = ease(k01(t, cams[i - 1][0], cams[i][0])), A = cams[i - 1], B = cams[i];
    return [lerp(A[1], B[1], k), lerp(A[2], B[2], k), Math.exp(lerp(Math.log(A[3]), Math.log(B[3]), k))];
  }
  return cams[cams.length - 1].slice(1);
};
export const GlobeVec: React.FC<P & { cams: number[][]; pins: Pin[]; title?: string; titleT?: number }> = ({ t, a, cams, pins, title, titleT = 99 }) => {
  const lt = t - a;
  const [lon0, lat0, R] = camAt(cams, lt);
  const cx = W / 2, cy = H / 2 + 20;
  const pr = ortho(lon0, lat0, R, cx, cy);
  const land: string[] = [];
  for (const ring of G.world) {
    let any = false, s = "";
    for (let i = 0; i < ring.length; i++) { const q = pr(ring[i][0], ring[i][1]); if (q.v > 0) any = true; s += (i ? "L" : "M") + q.x.toFixed(1) + "," + q.y.toFixed(1); }
    if (any) land.push(s + "Z");
  }
  const grat: string[] = [];
  for (let lon = -180; lon < 180; lon += 20) { let s = "", pen = false; for (let lat = -80; lat <= 80; lat += 4) { const q = pr(lon, lat); if (q.v > 0.02) { s += (pen ? "L" : "M") + q.x.toFixed(1) + "," + q.y.toFixed(1); pen = true; } else pen = false; } grat.push(s); }
  for (let lat = -60; lat <= 60; lat += 20) { let s = "", pen = false; for (let lon = -180; lon <= 180; lon += 4) { const q = pr(lon, lat); if (q.v > 0.02) { s += (pen ? "L" : "M") + q.x.toFixed(1) + "," + q.y.toFixed(1); pen = true; } else pen = false; } grat.push(s); }
  const tt = k01(lt, titleT, titleT + 0.7);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10161d 0%, #050608 70%)" }}>
      {/* estrellas fijas (deterministas) */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: 140 }, (_, i) => <circle key={i} cx={rnd(i, 3) * W} cy={rnd(i, 7) * H} r={rnd(i, 9) * 1.3 + 0.2} fill="#fff" opacity={0.15 + 0.5 * rnd(i, 11)} />)}
      </svg>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="gOcean" cx="38%" cy="32%" r="75%"><stop offset="0%" stopColor="#1d4a6b" /><stop offset="55%" stopColor="#0c2639" /><stop offset="100%" stopColor="#040b12" /></radialGradient>
          <radialGradient id="gShade" cx="36%" cy="30%" r="72%"><stop offset="55%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.62} /></radialGradient>
          <radialGradient id="gAtmo" cx="50%" cy="50%" r="50%"><stop offset="88%" stopColor="#6fc3ff" stopOpacity={0} /><stop offset="94%" stopColor="#6fc3ff" stopOpacity={0.35} /><stop offset="100%" stopColor="#6fc3ff" stopOpacity={0} /></radialGradient>
          <clipPath id="gClip"><circle cx={cx} cy={cy} r={R} /></clipPath>
          <linearGradient id="gLand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c9b48a" /><stop offset="100%" stopColor="#8a7350" /></linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R * 1.09} fill="url(#gAtmo)" />
        <circle cx={cx} cy={cy} r={R} fill="url(#gOcean)" />
        <g clipPath="url(#gClip)">
          <path d={grat.join("")} stroke="#9fd8ff" strokeOpacity={0.13} strokeWidth={1.1} fill="none" />
          <path d={land.join("")} fill="url(#gLand)" fillRule="nonzero" stroke="#f3e2bd" strokeOpacity={0.55} strokeWidth={1.1} />
          <circle cx={cx} cy={cy} r={R} fill="url(#gShade)" />
        </g>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#bfe6ff" strokeOpacity={0.35} strokeWidth={1.5} />
        {pins.map((p, i) => {
          const q = pr(p.lon, p.lat), k = spring(lt, p.t, 9, 0.5), vis = k01(q.v, 0.05, 0.25);
          if (lt < p.t || vis <= 0) return null;
          const pulse = ((lt - p.t) * 1.2) % 1;
          return (
            <g key={i} opacity={vis}>
              <circle cx={q.x} cy={q.y} r={10 + 46 * pulse} fill="none" stroke={GOLD} strokeOpacity={0.7 * (1 - pulse)} strokeWidth={2.5} />
              <circle cx={q.x} cy={q.y} r={9 * k} fill={GOLD} style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }} />
              <circle cx={q.x} cy={q.y} r={3.5 * k} fill="#fff" />
            </g>
          );
        })}
      </svg>
      {pins.map((p, i) => {
        const q = pr(p.lon, p.lat), vis = k01(q.v, 0.12, 0.3), k = easeOut(k01(lt, p.t + 0.08, p.t + 0.5));
        if (lt < p.t || vis <= 0) return null;
        const left = q.x > cx + R * 0.35;
        return (
          <div key={"l" + i} style={{ position: "absolute", left: q.x + (left ? -26 : 26), top: q.y - 30, opacity: vis * k, transform: `translate(${left ? "-100%" : "0"}, 0) translateX(${(left ? 1 : -1) * (1 - k) * 30}px)`, textAlign: left ? "right" : "left", whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: "#fff", textShadow: shadow }}>{p.label}</div>
            {p.sub && <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 20, letterSpacing: 3, color: SAND, textShadow: shadow }}>{p.sub}</div>}
          </div>
        );
      })}
      {title && tt > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: tt, transform: `translateY(${(1 - easeOut(tt)) * 30}px)` }}>
          <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 76, letterSpacing: 18, color: "#fff", textShadow: `0 0 40px rgba(242,181,68,.45), ${shadow}`, paddingLeft: 18 }}>{title}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============ RUTA SOBRE MAPA PLANO (equirectangular corregido) ============
type V = { lon: number; lat: number; sc: number };
const PJ = (v: V) => (lon: number, lat: number): [number, number] => [W / 2 + (lon - v.lon) * v.sc * Math.cos(v.lat * R2D), H / 2 - (lat - v.lat) * v.sc];
const pathOf = (pj: (a: number, b: number) => [number, number], pts: number[][], close = true) => pts.map((q, i) => { const p = pj(q[0], q[1]); return (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("") + (close ? "Z" : "");
const plen = (pj: (a: number, b: number) => [number, number], pts: number[][]) => { let L = 0; for (let i = 1; i < pts.length; i++) { const a = pj(pts[i - 1][0], pts[i - 1][1]), b = pj(pts[i][0], pts[i][1]); L += Math.hypot(b[0] - a[0], b[1] - a[1]); } return L; };
// Orcadas → Stonehenge: por tierra (a lo largo de la isla) y por mar (costa este)
const LAND = [[-3.0, 58.98], [-3.4, 58.3], [-4.2, 57.5], [-3.9, 56.8], [-3.6, 56.0], [-3.2, 55.3], [-2.8, 54.6], [-2.4, 53.8], [-2.1, 53.0], [-2.0, 52.2], [-1.9, 51.5], [-1.826, 51.179]];
const SEA = [[-3.0, 58.98], [-2.2, 58.4], [-1.6, 57.6], [-1.7, 56.6], [-1.3, 55.6], [-0.6, 54.6], [0.4, 53.6], [1.9, 52.8], [1.9, 51.6], [0.6, 50.7], [-1.0, 50.6], [-1.6, 50.75], [-1.8, 51.0], [-1.826, 51.179]];
const partial = (pts: number[][], f: number) => { if (f <= 0) return pts.slice(0, 1); const n = (pts.length - 1) * Math.min(1, f), i = Math.floor(n), r = n - i; const out = pts.slice(0, i + 1); if (i + 1 < pts.length) out.push([lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)]); return out; };
const lerpV = (A: V, B: V, k: number): V => ({ lon: lerp(A.lon, B.lon, k), lat: lerp(A.lat, B.lat, k), sc: Math.exp(lerp(Math.log(A.sc), Math.log(B.sc), k)) });
export const RouteUK: React.FC<P & { km: number; tOrk: number; tDraw: number; dDraw: number; tZoom: number }> = ({ t, a, km, tOrk, tDraw, dDraw, tZoom }) => {
  const lt = t - a;
  const v0: V = { lon: -2.6, lat: 54.9, sc: 92 }, v1: V = { lon: -2.4, lat: 55.2, sc: 100 }, v2: V = { lon: -3.0, lat: 58.6, sc: 330 };
  const v = lt < tZoom ? lerpV(v0, v1, ease(k01(lt, 0, tZoom))) : lerpV(v1, v2, ease(k01(lt, tZoom, tZoom + 2.2)));
  const pj = PJ(v);
  const d = easeOut(k01(lt, tDraw, tDraw + dDraw));
  const Ll = plen(pj, LAND);
  const sh = pj(-1.826, 51.179), ok = pj(-3.0, 58.98);
  const kmNow = Math.round(km * d);
  const zoomed = k01(lt, tZoom, tZoom + 1.2);
  const grid: string[] = [];
  for (let lon = -12; lon <= 4; lon += 2) { const p = pj(lon, 48), q = pj(lon, 62); grid.push(`M${p[0]},${p[1]}L${q[0]},${q[1]}`); }
  for (let lat = 48; lat <= 62; lat += 2) { const p = pj(-12, lat), q = pj(4, lat); grid.push(`M${p[0]},${p[1]}L${q[0]},${q[1]}`); }
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, #12202b 0%, #070b10 80%)" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><filter id="rGlow"><feGaussianBlur stdDeviation="7" /></filter></defs>
        <path d={grid.join("")} stroke="#9fd8ff" strokeOpacity={0.07} strokeWidth={1} />
        {G.uk.map((r, i) => <path key={i} d={pathOf(pj, r)} fill="#2b2a22" stroke="#d9c49a" strokeOpacity={0.75} strokeWidth={1.4} />)}
        {/* por tierra */}
        <path d={pathOf(pj, LAND, false)} fill="none" stroke={SAND} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Ll}`} strokeDashoffset={Ll * (1 - d)} opacity={1 - 0.6 * zoomed} />
        {/* por mar */}
        <path d={pathOf(pj, partial(SEA, d), false)} fill="none" stroke="#6fc3ff" strokeWidth={4} strokeLinecap="round" strokeDasharray="14 12" opacity={(1 - 0.6 * zoomed) * (d > 0 ? 1 : 0)} />
        <path d={pathOf(pj, LAND, false)} fill="none" stroke={GOLD} strokeWidth={14} filter="url(#rGlow)" strokeDasharray={`${Ll}`} strokeDashoffset={Ll * (1 - d)} opacity={0.5 * (1 - zoomed)} />
        <circle cx={sh[0]} cy={sh[1]} r={10} fill={GOLD} />
        {lt >= tOrk && <>
          <circle cx={ok[0]} cy={ok[1]} r={12 + 60 * ((lt - tOrk) % 1)} fill="none" stroke={RED} strokeWidth={3} opacity={1 - ((lt - tOrk) % 1)} />
          <circle cx={ok[0]} cy={ok[1]} r={11 * spring(lt, tOrk, 10, 0.45)} fill={RED} style={{ filter: `drop-shadow(0 0 12px ${RED})` }} />
        </>}
      </svg>
      <div style={{ position: "absolute", left: sh[0] + 22, top: sh[1] - 22, fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: "#fff", textShadow: shadow, opacity: 1 - zoomed }}>STONEHENGE</div>
      <div style={{ position: "absolute", left: 120, top: 110, opacity: k01(lt, tDraw, tDraw + 0.3) * (1 - zoomed), transform: `translateY(${(1 - easeOut(k01(lt, tDraw, tDraw + 0.5))) * 25}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: SAND }}>LA PIEDRA DEL ALTAR · 6 t</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, lineHeight: 1, color: "#fff", textShadow: shadow, fontVariantNumeric: "tabular-nums" }}>{kmNow}<span style={{ fontSize: 64, marginLeft: 14 }}>KM</span></div>
        <div style={{ display: "flex", gap: 28, marginTop: 10, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 4 }}>
          <span style={{ color: SAND }}>━ ¿POR TIERRA?</span><span style={{ color: "#6fc3ff" }}>┅ ¿POR MAR?</span>
        </div>
      </div>
      {lt >= tOrk && (
        <div style={{ position: "absolute", left: ok[0] + 30, top: ok[1] - 40, opacity: easeOut(k01(lt, tOrk + 0.1, tOrk + 0.5)), whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: "#fff", textShadow: shadow }}>ORCADAS · ESCOCIA</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: RED, textShadow: shadow }}>ORIGEN CONFIRMADO · AGOSTO 2024</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============ KAILASA: EL TEMPLO QUE SE TALLÓ DE ARRIBA HACIA ABAJO ============
// alzado en corte: la montaña de basalto, tres zanjas que bajan, y el templo que aparece de arriba hacia abajo
const TEMPLE = "M 760 300 C 800 300 812 250 820 230 C 835 190 850 160 860 120 L 880 120 C 890 160 905 190 920 230 C 928 250 940 300 980 300 L 1000 300 L 1000 340 L 1060 340 L 1060 300 C 1080 300 1088 270 1094 256 L 1110 256 C 1116 270 1124 300 1144 300 L 1160 300 L 1160 690 L 600 690 L 600 300 L 616 300 C 636 300 644 270 650 256 L 666 256 C 672 270 680 300 700 300 L 700 340 L 760 340 Z";
export const CarveDown: React.FC<P & { tTr: number; tCarve: number; tErr: number }> = ({ t, a, b, tTr, tCarve, tErr }) => {
  const lt = t - a, dur = b - a;
  const top = 120, bot = 690;
  const tr = easeOut(k01(lt, tTr, tTr + 1.1));                 // zanjas
  const cv = ease(k01(lt, tCarve, Math.min(dur - 0.4, tCarve + 3.0)));   // talla de arriba hacia abajo
  const yCut = lerp(top - 10, bot, cv);
  const sway = 1 + 0.035 * k01(lt, 0, dur);
  const err = k01(lt, tErr, tErr + 0.5);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0d0f12 0%, #17140f 100%)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", transform: `scale(${sway})`, transformOrigin: "50% 60%" }}>
        <defs>
          <linearGradient id="kRock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b3833" /><stop offset="100%" stopColor="#1d1b18" /></linearGradient>
          <linearGradient id="kTemple" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d9c9a6" /><stop offset="100%" stopColor="#8f7a5a" /></linearGradient>
          <pattern id="kStrata" width="1920" height="38" patternUnits="userSpaceOnUse"><path d="M0 19 Q 480 10 960 21 T 1920 17" stroke="#000" strokeOpacity={0.25} strokeWidth={2} fill="none" /></pattern>
          <clipPath id="kBelow"><rect x={0} y={yCut} width={W} height={H} /></clipPath>
          <clipPath id="kAbove"><rect x={0} y={0} width={W} height={yCut} /></clipPath>
        </defs>
        {/* cielo y montaña */}
        <rect x={0} y={top} width={W} height={H - top} fill="url(#kRock)" />
        <rect x={0} y={top} width={W} height={H - top} fill="url(#kStrata)" />
        <line x1={0} y1={top} x2={W} y2={top} stroke={SAND} strokeOpacity={0.5} strokeWidth={2} />
        {/* zanjas: tres cortes en U que bajan desde la cima */}
        <rect x={540} y={top} width={46} height={(bot - top) * tr} fill="#060606" />
        <rect x={1174} y={top} width={46} height={(bot - top) * tr} fill="#060606" />
        <rect x={540} y={bot - 6} width={680} height={tr > 0.98 ? 46 : 0} fill="#060606" />
        {/* lo que ya se tallo: el templo arriba del corte, la roca maciza abajo */}
        <g clipPath="url(#kAbove)">
          <rect x={586} y={top} width={588} height={bot - top} fill="#060606" />
          <path d={TEMPLE} fill="url(#kTemple)" stroke="#f6e7c4" strokeWidth={2} />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={630 + i * 60} y={420} width={16} height={240} fill="#000" opacity={0.28} />)}
        </g>
        <g clipPath="url(#kBelow)"><path d={TEMPLE} fill="none" stroke={SAND} strokeOpacity={0.35} strokeDasharray="8 10" strokeWidth={2} /></g>
        {/* frente de talla: polvo y lascas que caen */}
        {cv > 0 && cv < 1 && Array.from({ length: 40 }, (_, i) => {
          const x = 600 + rnd(i, 2) * 560, ph = ((lt * 1.6 + rnd(i, 5)) % 1);
          return <circle key={i} cx={x + (rnd(i, 8) - 0.5) * 30 * ph} cy={yCut + ph * 120} r={1.5 + 3 * rnd(i, 4)} fill={SAND} opacity={0.6 * (1 - ph)} />;
        })}
        {cv > 0 && cv < 1 && <line x1={586} y1={yCut} x2={1174} y2={yCut} stroke={GOLD} strokeWidth={3} style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }} />}
        {/* flecha que baja */}
        <g opacity={k01(lt, tCarve, tCarve + 0.3) * (1 - err * 0.6)} transform={`translate(1330, ${lerp(top + 40, bot - 140, cv)})`}>
          <path d="M 0 0 L 0 90 M -22 66 L 0 92 L 22 66" stroke={GOLD} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1400, top: 300, opacity: k01(lt, tCarve, tCarve + 0.4) }}>
        <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: "#fff", textShadow: shadow }}>DE ARRIBA<br />HACIA ABAJO</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: SAND, marginTop: 14 }}>UNA SOLA ROCA · SIGLO VIII</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 110, opacity: k01(lt, 0.1, 0.5) }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: "#fff", textShadow: shadow }}>KAILASA</div>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 4, color: SAND }}>ELLORA · INDIA</div>
      </div>
      {err > 0 && (
        <div style={{ position: "absolute", left: 1400, top: 560, opacity: err, transform: `scale(${lerp(1.25, 1, easeOut(err))})`, transformOrigin: "0 50%" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: 6, color: RED, textShadow: shadow }}>0 MARGEN DE ERROR</div>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#fff", opacity: 0.85 }}>lo que se saca, no vuelve</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============ OBELISCO: ESCALA Y GRIETA ============
export const ObeliskScale: React.FC<P & { tCmp: number; tCrack: number }> = ({ t, a, b, tCmp, tCrack }) => {
  const lt = t - a, dur = b - a;
  const m2px = 36, x0 = 200, yb = 640;                      // 42 m = 1512 px
  const L = 42 * m2px, h0 = 4.2 * m2px, h1 = 2.6 * m2px;
  const grow = easeOut(k01(lt, 0, 0.9));
  const cmp = easeOut(k01(lt, tCmp, tCmp + 0.6));
  const cr = easeIn(k01(lt, tCrack, tCrack + 0.45)), split = easeOut(k01(lt, tCrack + 0.35, tCrack + 1.2));
  const zx = 1 + 0.06 * k01(lt, 0, dur);
  // grieta en zig-zag (determinista)
  const cx = x0 + L * 0.58;
  const crack = Array.from({ length: 12 }, (_, i) => [cx + (rnd(i, 21) - 0.5) * 34 + i * 2, yb - h0 + (i / 11) * h0]);
  const crackD = crack.slice(0, Math.max(2, Math.ceil(12 * cr))).map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
  const obel = (x: number, y: number, len: number, hb: number, ht: number) => `M ${x} ${y} L ${x + len * 0.94} ${y - (hb - ht) / 2} L ${x + len} ${y - hb / 2} L ${x + len * 0.94} ${y - hb + (hb - ht) / 2} L ${x} ${y - hb} Z`;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a1210 0%, #0b0807 100%)" }}>
      <svg width={W} height={H} style={{ position: "absolute", transform: `scale(${zx})`, transformOrigin: "35% 58%" }}>
        <defs>
          <linearGradient id="oGran" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e3a594" /><stop offset="100%" stopColor="#8d5246" /></linearGradient>
          <clipPath id="oL"><rect x={0} y={0} width={cx} height={H} /></clipPath>
          <clipPath id="oR"><rect x={cx} y={0} width={W} height={H} /></clipPath>
        </defs>
        <line x1={120} y1={yb + 2} x2={1800} y2={yb + 2} stroke={SAND} strokeOpacity={0.4} strokeWidth={2} />
        {[0, 1].map((side) => (
          <g key={side} clipPath={`url(#${side ? "oR" : "oL"})`} transform={`translate(${side ? split * 34 : -split * 10}, ${side ? split * 10 : 0}) rotate(${side ? split * 2.2 : 0}, ${cx}, ${yb})`}>
            <path d={obel(x0, yb, L * grow, h0, h1)} fill="url(#oGran)" stroke="#f3c7b9" strokeWidth={2} />
          </g>
        ))}
        {cr > 0 && <path d={crackD} stroke="#120706" strokeWidth={6} fill="none" strokeLinejoin="round" />}
        {cr > 0 && <path d={crackD} stroke={RED} strokeWidth={2} fill="none" opacity={0.9} style={{ filter: `drop-shadow(0 0 8px ${RED})` }} />}
        {split > 0 && Array.from({ length: 36 }, (_, i) => { const ph = k01(lt, tCrack + 0.3 + rnd(i, 3) * 0.3, tCrack + 1.4 + rnd(i, 3) * 0.5); return ph > 0 && ph < 1 ? <circle key={i} cx={cx + (rnd(i, 6) - 0.5) * 140 * ph} cy={yb - h0 / 2 - 80 * ph + 160 * ph * ph} r={2 + 3 * rnd(i, 9)} fill={SAND} opacity={1 - ph} /> : null; })}
        {/* Letrán, 32 m, 455 t: el obelisco antiguo más grande en pie */}
        <g opacity={cmp}>
          <path d={obel(x0, yb + 150, 32 * m2px * cmp, 2.9 * m2px, 1.9 * m2px)} fill="none" stroke={SAND} strokeWidth={2.5} strokeDasharray="10 8" />
        </g>
        {/* persona 1,7 m */}
        <g transform={`translate(${x0 - 70}, ${yb})`} opacity={grow}>
          <circle cx={0} cy={-1.7 * m2px + 7} r={7} fill="#fff" />
          <rect x={-5} y={-1.7 * m2px + 15} width={10} height={1.7 * m2px - 15} rx={4} fill="#fff" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 120, top: 100, opacity: k01(lt, 0.1, 0.5) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 8, color: SAND }}>ASUÁN · EGIPTO · c. 1500 a. C.</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 132, lineHeight: 1, color: "#fff", textShadow: shadow }}>+1.000 t</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: "#fff", opacity: 0.9 }}>42 METROS DE GRANITO</div>
      </div>
      <div style={{ position: "absolute", left: x0 + 32 * m2px * cmp + 20, top: yb + 150 - 70, opacity: cmp, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: SAND, whiteSpace: "nowrap" }}>
        OBELISCO DE LETRÁN · 455 t<br /><span style={{ fontFamily: MONO, fontSize: 18, opacity: 0.8 }}>el más grande que sigue en pie</span>
      </div>
      {split > 0.2 && <div style={{ position: "absolute", left: cx - 120, top: yb - h0 - 110, opacity: k01(split, 0.2, 0.6), fontFamily: ROMAN, fontWeight: 800, fontSize: 64, letterSpacing: 10, color: "#fff", textShadow: `0 0 30px rgba(255,75,58,.6), ${shadow}` }}>SE PARTIÓ</div>}
    </AbsoluteFill>
  );
};

// ============ OVERLAYS ============
// número TALLADO en la piedra, con los dígitos que ruedan, sobre el plano de Yangshan
const Roll: React.FC<{ v: number; size: number }> = ({ v, size }) => {
  const h = size * 1.02;
  return (
    <span style={{ display: "inline-block", height: h, overflow: "hidden", verticalAlign: "top" }}>
      <span style={{ display: "block", transform: `translateY(${-((v % 10) + 10) % 10 * h}px)` }}>
        {Array.from({ length: 11 }, (_, i) => <span key={i} style={{ display: "block", height: h, lineHeight: `${h}px` }}>{i % 10}</span>)}
      </span>
    </span>
  );
};
export const TonsRoll: React.FC<P & { to: number; unit: string; kicker?: string; x?: number; y?: number; size?: number; dur?: number }> = ({ t, a, b, to, unit, kicker, x = 140, y = 300, size = 230, dur = 1.6 }) => {
  if (t < a || t > b + 0.4) return null;
  const k = easeOut(k01(t, a, a + dur)), o = 1 - k01(t, b, b + 0.4);
  const v = to * k;
  const digits = String(to).length;
  const parts: React.ReactNode[] = [];
  for (let d = digits - 1; d >= 0; d--) {
    const place = Math.pow(10, d), raw = v / place, lower = (v % place) / place, base = Math.floor(raw);
    const frac = d === 0 ? raw - base : Math.max(0, (lower - 0.85) / 0.15);
    parts.push(<Roll key={d} v={base + frac} size={size} />);
    if (d === 3) parts.push(<span key="p">.</span>);
  }
  const land = spring(t, a + dur - 0.1, 12, 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o * k01(t, a, a + 0.12) }}>
      {kicker && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 10, color: SAND, textShadow: shadow, marginBottom: 6 }}>{kicker}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: -4, fontVariantNumeric: "tabular-nums",
        color: "#e7dccb", textShadow: "0 -2px 0 rgba(0,0,0,.55), 0 2px 0 rgba(255,255,255,.18), 0 10px 40px rgba(0,0,0,.7)", transform: `scale(${lerp(1.06, 1, land)})`, transformOrigin: "0 100%" }}>
        {parts}
        <span style={{ fontSize: size * 0.3, letterSpacing: 6, marginLeft: 22, marginBottom: size * 0.14, color: GOLD }}>{unit}</span>
      </div>
    </div>
  );
};
// rótulo de lugar con línea que se dibuja (entra con el movimiento del plano)
export const Tag: React.FC<P & { text: string; sub?: string; x?: number; y?: number; dx?: number }> = ({ t, a, b, text, sub, x = 120, y = 860, dx = 1 }) => {
  if (t < a || t > b + 0.3) return null;
  const k = easeOut(k01(t, a, a + 0.55)), o = 1 - k01(t, b, b + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o * k, transform: `translateX(${(1 - k) * 40 * dx}px)` }}>
      <div style={{ width: 200 * k, height: 3, background: GOLD, boxShadow: `0 0 12px ${GOLD}` }} />
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 9, color: "#fff", textShadow: shadow, marginTop: 10 }}>{text}</div>
      {sub && <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 4, color: SAND, textShadow: shadow }}>{sub}</div>}
    </div>
  );
};
// título: las letras caen como bloques y levantan polvo
export const TitleStone: React.FC<P & { l1: string; l2?: string; y?: number }> = ({ t, a, b, l1, l2, y = 430 }) => {
  if (t < a || t > b + 0.5) return null;
  const o = 1 - k01(t, b, b + 0.5);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-flex", fontFamily: ROMAN, fontWeight: 800, fontSize: 150, letterSpacing: 10, color: "#fff" }}>
        {l1.split("").map((c, i) => {
          const ti = a + i * 0.045, s = spring(t, ti, 11, 0.45), dropY = (1 - s) * -120;
          return <span key={i} style={{ display: "inline-block", transform: `translateY(${dropY}px)`, opacity: k01(t, ti, ti + 0.08), textShadow: `0 0 34px rgba(242,181,68,.4), ${shadow}`, minWidth: c === " " ? 50 : undefined }}>{c}</span>;
        })}
      </div>
      {l2 && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, letterSpacing: 16, color: SAND, marginTop: 10, opacity: k01(t, a + 0.6, a + 1.1), textShadow: shadow, paddingLeft: 16 }}>{l2}</div>}
    </div>
  );
};
// columna/polvo en primer plano que cruza el cuadro en un corte enmascarado (dir 1 = izq→der)
export const ColumnWipe: React.FC<P & { dir?: number }> = ({ t, a, b, dir = 1 }) => {
  if (t < a || t > b) return null;
  const e = ease(k01(t, a, b)), x = dir > 0 ? lerp(-0.35, 1.15, e) : lerp(1.15, -0.35, e);
  return <div style={{ position: "absolute", top: -40, bottom: -40, left: x * W - 230, width: 460, background: "linear-gradient(90deg, rgba(8,6,5,0) 0%, rgba(8,6,5,.96) 28%, rgba(14,11,9,1) 50%, rgba(8,6,5,.96) 72%, rgba(8,6,5,0) 100%)", filter: "blur(10px)" }} />;
};
