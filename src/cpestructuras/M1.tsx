// M1.tsx — MINUTO 1 v2 de cpestructuras como MUNDO CONTINUO (técnica cgordie1):
// un solo globo vector y UNA cámara que vuela de estructura en estructura; el metraje se abre en un PORTAL circular desde el pin
// y adentro los clips se funden; el desenfoque sale de la velocidad de la cámara; cada video se monta 10 cuadros antes (sin lag);
// todo viene anclado a la palabra (armar_m1v2.py → m1v2.json). No hay cortes: hay un solo plano que viaja.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H, SANS, MONO, k01, lerp, ease, easeOut, shadow, SAND, GOLD, RED, rnd, spring } from "./lib";
import { LandFx, Bathy, CarveDown, ObeliskScale, TonsRoll, Tag, TitleStone } from "./comps";
import GEO from "./geo.json";
import MRaw from "./m1v2.json";

// densificado (un punto cada ≤0,5°): los bordes rectos de las cajas finas siguen la curva de la proyección igual que
// el agujero de la máscara → sin franja entre la tierra gruesa y la fina (la "línea" de la caja de China/Egipto/Andes)
const densify = (rings: number[][][]) => rings.map((r) => { const o: number[][] = []; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; o.push(a); if (i === r.length - 1) break; const n = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / 0.5); for (let j = 1; j < n && Math.abs(b[0] - a[0]) < 180; j++) o.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n]); } return o; });
const G = Object.fromEntries(Object.entries(GEO as unknown as Record<string, number[][][]>).map(([k, v]) => [k, densify(v)])) as Record<string, number[][][]>;
const M = MRaw as any;
const R2D = Math.PI / 180;
export const M1_FRAMES = Math.round(M.end * FPS);

// ───────── cámara: [t, lon, lat, R] · slerp sobre la esfera + arco de vuelo (se aleja en los traslados largos) ─────────
type Cam = { lon: number; lat: number; R: number };
const vec = (lon: number, lat: number) => [Math.cos(lat * R2D) * Math.cos(lon * R2D), Math.cos(lat * R2D) * Math.sin(lon * R2D), Math.sin(lat * R2D)];
const CAMS = M.cams as number[][];
const cam = (t: number): Cam => {
  if (t <= CAMS[0][0]) return { lon: CAMS[0][1], lat: CAMS[0][2], R: CAMS[0][3] };
  let i = 0;
  while (i < CAMS.length - 2 && t > CAMS[i + 1][0]) i++;
  const A = CAMS[i], B = CAMS[i + 1];
  const k = ease(k01(t, A[0], B[0]));
  const va = vec(A[1], A[2]), vb = vec(B[1], B[2]);
  const om = Math.acos(Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2])));
  const deg = om / R2D, far = deg > 6;
  const kp = far ? ease(k01(k, 0.12, 0.88)) : k;                     // en vuelos largos: primero se aleja, después viaja, después baja
  let v = va;
  if (om > 1e-6) { const s = Math.sin(om), a = Math.sin((1 - kp) * om) / s, b = Math.sin(kp * om) / s; v = [a * va[0] + b * vb[0], a * va[1] + b * vb[1], a * va[2] + b * vb[2]]; }
  const la = Math.log(A[3]), lb = Math.log(B[3]);
  let lr = lerp(la, lb, k);
  if (far) { const mid = Math.log(Math.max(380, Math.min(A[3], B[3]) / (1 + deg / 12))); lr += Math.min(0, mid - (la + lb) / 2) * Math.pow(Math.sin(Math.PI * k), 0.8); }
  return { lon: Math.atan2(v[1], v[0]) / R2D, lat: Math.asin(Math.max(-1, Math.min(1, v[2]))) / R2D, R: Math.exp(lr) };
};
const CX = W / 2, CY = H / 2;
const ortho = (c: Cam) => (lon: number, lat: number) => {
  const l = (lon - c.lon) * R2D, p = lat * R2D, p0 = c.lat * R2D;
  const x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
  const v = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  if (v >= 0) return { x: CX + c.R * x, y: CY - c.R * y, v };
  const n = Math.hypot(x, y) || 1;
  return { x: CX + (c.R * x) / n, y: CY - (c.R * y) / n, v };
};
type PR = ReturnType<typeof ortho>;
// picada tipo Google Earth: con el globo entero no se inclina; cerca del lugar se inclina hasta 34° (profundidad real, nada plano)
const PERSP = 1600, OY = 600;
const tiltOf = (c: Cam) => 34 * ease(k01(Math.log(c.R), Math.log(1500), Math.log(7000)));
// punto del mundo (ya proyectado al plano del globo) → pantalla, pasando por rotateX + perspective
const tp = (a: number) => { const ca = Math.cos(a * R2D), sa = Math.sin(a * R2D); return (x: number, y: number) => { const y0 = y - OY, s = PERSP / (PERSP - y0 * sa); return { X: CX + (x - CX) * s, Y: CY + (OY + y0 * ca - CY) * s, s }; }; };
// el svg del globo se dibuja más grande que la pantalla: con la picada, arriba se ve lo que queda "lejos"
const VB = { x: -700, y: -1100, w: W + 1400, h: H + 1250 };
const ringPath = (pr: PR, ring: number[][], close = true) => {
  let s = "", any = false;
  for (let i = 0; i < ring.length; i++) { const q = pr(ring[i][0], ring[i][1]); if (q.v > 0) any = true; s += (i ? "L" : "M") + q.x.toFixed(1) + "," + q.y.toFixed(1); }
  return any ? s + (close ? "Z" : "") : "";
};
// polígono recortado al HORIZONTE: lo que pasa por detrás se recorre por el borde del globo en ARCO (no en cuerda);
// así un continente que cruza el borde no invierte el relleno (Asia azul / mar arena del v2 primero).
const rot = (c: Cam) => { const p0 = c.lat * R2D, sp0 = Math.sin(p0), cp0 = Math.cos(p0); return (lon: number, lat: number) => {
  const l = (lon - c.lon) * R2D, p = lat * R2D, cp = Math.cos(p);
  return [cp * Math.sin(l), cp0 * Math.sin(p) - sp0 * cp * Math.cos(l), sp0 * Math.sin(p) + cp0 * cp * Math.cos(l)]; }; };
const polyPath = (c: Cam, rings: number[][][]) => {
  // "rejoin" como d3: tramos visibles (entra/sale por el horizonte) unidos por el BORDE en sentido horario
  // (los anillos de geo.json son todos horarios = la tierra queda a la derecha); nunca el arco "más corto".
  const r3 = rot(c), R = c.R, TAU = 2 * Math.PI; let out = "";
  const P = (x: number, y: number) => (CX + R * x).toFixed(1) + "," + (CY - R * y).toFixed(1);
  const L = (a: number) => (CX + R * Math.cos(a)).toFixed(1) + "," + (CY - R * Math.sin(a)).toFixed(1);
  const cw = (from: number, to: number) => { let d = (from - to) % TAU; if (d < 0) d += TAU; return d; }; // cuánto bajar el ángulo
  for (const ring of rings) {
    const q = ring.map((u) => r3(u[0], u[1])), n = q.length;
    const vis = q.map((v) => v[2] > 0);
    if (!vis.some(Boolean)) continue;
    if (vis.every(Boolean)) { out += "M" + q.map((v) => P(v[0], v[1])).join("L") + "Z"; continue; }
    const hz = (u: number[], v: number[]) => { const k = u[2] / (u[2] - v[2]); return Math.atan2(u[1] + (v[1] - u[1]) * k, u[0] + (v[0] - u[0]) * k); };
    let s0 = 0; while (!(vis[s0] && !vis[(s0 - 1 + n) % n])) s0++;
    const segs: { a0: number; a1: number; pts: string[] }[] = [];
    let cur: { a0: number; a1: number; pts: string[] } | null = null;
    for (let j = 0; j <= n; j++) {
      const i = (s0 + j) % n, h = (i - 1 + n) % n;
      if (vis[i] && !vis[h]) { cur = { a0: hz(q[h], q[i]), a1: 0, pts: [] }; }
      if (vis[i] && cur) cur.pts.push(P(q[i][0], q[i][1]));
      if (!vis[i] && vis[h] && cur) { cur.a1 = hz(q[h], q[i]); segs.push(cur); cur = null; }
      if (j === n) break;
    }
    const used = new Set<number>();
    for (let st = 0; st < segs.length; st++) {
      if (used.has(st)) continue;
      let k = st, path: string[] = [L(segs[st].a0)];
      while (!used.has(k)) {
        used.add(k); const sg = segs[k]; path.push(...sg.pts, L(sg.a1));
        let best = -1, bd = 1e9;
        for (let m = 0; m < segs.length; m++) { if (used.has(m) && m !== st) continue; const d = cw(sg.a1, segs[m].a0); if (d < bd) { bd = d; best = m; } }
        const nj = Math.ceil(bd / 0.04); for (let j = 1; j <= nj; j++) path.push(L(sg.a1 - (bd * j) / nj));
        if (best === st || best < 0) break; k = best;
      }
      out += "M" + path.join("L") + "Z";
    }
  }
  return out;
};
// zonas con costa 1:10m (recortadas por caja en prep_geo.py): adentro de la caja se dibuja la fina y se tapa la gruesa
const BOX: Record<string, number[]> = { uk: [-11, 49, 3, 61.5], peru: [-82, -20, -66, 0], egypt: [24, 20, 37, 33], china: [110, 25, 125, 38], india: [66, 6, 92, 30] };
const ISLAS = ["pohnpei", "rapanui"];
const boxPath = (pr: PR, b: number[]) => {
  const [w, s, e, n] = b, pts: number[][] = [];
  for (let x = w; x <= e; x += 0.5) pts.push([x, s]);
  for (let y = s; y <= n; y += 0.5) pts.push([e, y]);
  for (let x = e; x >= w; x -= 0.5) pts.push([x, n]);
  for (let y = n; y >= s; y -= 0.5) pts.push([w, y]);
  return ringPath(pr, pts);
};
const angTo = (c: Cam, lon: number, lat: number) => { const a = vec(c.lon, c.lat), b = vec(lon, lat); return Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])) / R2D; };

// ───────── el globo (mundo) ─────────
const Globe: React.FC<{ c: Cam; t: number }> = ({ c, t }) => {
  const pr = ortho(c);
  const fine = Object.entries(BOX).filter(([, b]) => c.R > 1400 && angTo(c, (b[0] + b[2]) / 2, (b[1] + b[3]) / 2) < 30);
  const world = polyPath(c, G.world);
  const det = fine.map(([k]) => polyPath(c, G[k])).join("") + (c.R > 4000 ? ISLAS.map((k) => polyPath(c, G[k])).join("") : "");
  const holes = fine.map(([, b]) => boxPath(pr, b)).join("");
  const step = c.R > 2500 ? 5 : c.R > 1200 ? 10 : 20;
  const grat: string[] = [];
  for (let lon = -180; lon < 180; lon += step) { let s = "", pen = false; for (let lat = -80; lat <= 80; lat += step / 5) { const q = pr(lon, lat); if (q.v > 0.02) { s += (pen ? "L" : "M") + q.x.toFixed(1) + "," + q.y.toFixed(1); pen = true; } else pen = false; } grat.push(s); }
  for (let lat = -80; lat <= 80; lat += step) { let s = "", pen = false; for (let lon = -180; lon <= 180; lon += step / 5) { const q = pr(lon, lat); if (q.v > 0.02) { s += (pen ? "L" : "M") + q.x.toFixed(1) + "," + q.y.toFixed(1); pen = true; } else pen = false; } grat.push(s); }
  const R = c.R, bk = Math.min(1.4, R / 330);
  return (
    <svg width={VB.w} height={VB.h} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{ position: "absolute", left: VB.x, top: VB.y }}>
      <defs>
        <radialGradient id="gOcean" cx="38%" cy="32%" r="75%"><stop offset="0%" stopColor="#1d4a6b" /><stop offset="55%" stopColor="#0c2639" /><stop offset="100%" stopColor="#040b12" /></radialGradient>
        <radialGradient id="gShade" cx="36%" cy="30%" r="72%"><stop offset="55%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.62} /></radialGradient>
        <radialGradient id="gAtmo" cx="50%" cy="50%" r="50%"><stop offset="88%" stopColor="#6fc3ff" stopOpacity={0} /><stop offset="94%" stopColor="#6fc3ff" stopOpacity={0.35} /><stop offset="100%" stopColor="#6fc3ff" stopOpacity={0} /></radialGradient>
        <linearGradient id="gLand" gradientUnits="userSpaceOnUse" x1={CX - R} y1={CY - R} x2={CX + R} y2={CY + R}><stop offset="0%" stopColor="#d8c398" /><stop offset="55%" stopColor="#b09468" /><stop offset="100%" stopColor="#6e5a3c" /></linearGradient>
        <linearGradient id="gTerm" x1="0.15" y1="0.1" x2="1" y2="0.95"><stop offset="0%" stopColor="#ffd9a0" stopOpacity={0.1} /><stop offset="55%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.55} /></linearGradient>
        <radialGradient id="gSpec"><stop offset="0%" stopColor="#fff" stopOpacity={0.16} /><stop offset="100%" stopColor="#fff" stopOpacity={0} /></radialGradient>
        <clipPath id="gClip"><circle cx={CX} cy={CY} r={R} /></clipPath>
        <mask id="gHole" maskUnits="userSpaceOnUse" x={VB.x} y={VB.y} width={VB.w} height={VB.h}><rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="#fff" /><path d={holes} fill="#000" stroke="#fff" strokeWidth={6} /></mask>
        <LandFx id="gRelief" screen box={VB} />
      </defs>
      {R < 2600 && <circle cx={CX} cy={CY} r={R * 1.09} fill="url(#gAtmo)" />}
      {R < 2600 && <circle cx={CX} cy={CY} r={R * 1.02} fill="none" stroke="#7fd0ff" strokeOpacity={0.18} strokeWidth={R * 0.05} style={{ filter: "blur(14px)" }} />}
      <circle cx={CX} cy={CY} r={R} fill="url(#gOcean)" />
      <g clipPath="url(#gClip)">
        <path d={grat.join("")} stroke="#9fd8ff" strokeOpacity={0.1} strokeWidth={1.1} fill="none" />
        <g mask={holes ? "url(#gHole)" : undefined}><Bathy d={world} k={bk} /></g>
        {det && <Bathy d={det} k={bk} />}
        <g filter="url(#gRelief)">
          <path d={world} fill="url(#gLand)" mask={holes ? "url(#gHole)" : undefined} />
          {det && <path d={det} fill="url(#gLand)" />}
        </g>
        {R < 6000 && <circle cx={CX} cy={CY} r={R} fill="url(#gTerm)" opacity={k01(6000 - R, 0, 3000)} />}
        {R < 6000 && <circle cx={CX} cy={CY} r={R} fill="url(#gShade)" opacity={k01(6000 - R, 0, 3000)} />}
        {R < 2600 && <ellipse cx={CX - R * 0.38} cy={CY - R * 0.42} rx={R * 0.34} ry={R * 0.22} fill="url(#gSpec)" transform={`rotate(-28 ${CX - R * 0.38} ${CY - R * 0.42})`} />}
      </g>
      {R < 2600 && <circle cx={CX} cy={CY} r={R} fill="none" stroke="#bfe6ff" strokeOpacity={0.35} strokeWidth={1.5} />}
    </svg>
  );
};

// estrellas fijas (deterministas) detrás del globo
const Stars = React.memo(() => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={rnd(i, 3) * W} cy={rnd(i, 7) * H} r={rnd(i, 9) * 1.3 + 0.2} fill="#fff" opacity={0.15 + 0.5 * rnd(i, 11)} />)}
  </svg>
));

// ───────── capas de pantalla proyectadas (siguen a la cámara) ─────────
type Pin = { site: string; n: number; label: string; sub: string; t0: number; lon: number; lat: number };
const PINS = M.pins as Pin[];
const SEVEN = M.seven as { t0: number; t1: number; on: Record<string, number> };
const PORT = M.portals as any[];
const doneAt = (site: string, t0: number) => { const p = PORT.find((x) => x.site === site && x.t0 >= t0 - 0.5); return p ? p.t1 : t0 + 3; };
const Pins: React.FC<{ c: Cam; t: number }> = ({ c, t }) => {
  const pr = ortho(c), tl = tiltOf(c), T = tp(tl), up = k01(tl, 4, 20);
  return (
    <>
      {PINS.map((p, i) => {
        if (t < p.t0) return null;
        const q0 = pr(p.lon, p.lat), vis = k01(q0.v, 0.05, 0.25), P0 = T(q0.x, q0.y), q = { x: P0.X, y: P0.Y };
        if (vis <= 0 || q.x < -200 || q.x > W + 200 || q.y < -200 || q.y > H + 200) return null;
        const on7 = SEVEN.on[p.site], s7 = t >= on7 && t < SEVEN.t1 + 0.6 ? spring(t, on7, 9, 0.5) : 0;
        const live = t < doneAt(p.site, p.t0) + 0.2;                 // lugar del momento: grande, con pulso y nombre
        const k = live ? spring(t, p.t0, 9, 0.5) : Math.max(0.55, s7);
        const pulse = ((t - (s7 ? on7 : p.t0)) * 1.2) % 1;
        const showLab = live || s7 > 0, lk = live ? easeOut(k01(t, p.t0 + 0.08, p.t0 + 0.5)) : easeOut(k01(t, on7 + 0.05, on7 + 0.45));
        const left = q.x > W * 0.72;
        // pilar de luz: hacia arriba de la pantalla con picada; radial (sale del globo) con el globo entero
        const glow = live ? k01(t, p.t0, p.t0 + 0.6) * (1 - k01(t, doneAt(p.site, p.t0), doneAt(p.site, p.t0) + 0.6)) : s7 * (1 - k01(t, SEVEN.t1, SEVEN.t1 + 0.6));
        const rx = (q0.x - CX) / c.R, ry = (q0.y - CY) / c.R, hl = (live ? 300 : 210) * glow * P0.s;
        const ex = q.x + lerp(rx * hl * 1.3, 0, up), ey = q.y + lerp(ry * hl * 1.3, -hl, up);
        const gid = `pl${i}`;
        return (
          <React.Fragment key={i}>
            {glow > 0.01 && (
              <svg width={W} height={H} style={{ position: "absolute", overflow: "visible", opacity: vis, mixBlendMode: "screen" }}>
                <defs><linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={q.x} y1={q.y} x2={ex} y2={ey}><stop offset="0%" stopColor="#fff2cf" stopOpacity={0.95} /><stop offset="35%" stopColor={GOLD} stopOpacity={0.55} /><stop offset="100%" stopColor={GOLD} stopOpacity={0} /></linearGradient></defs>
                <ellipse cx={q.x} cy={q.y} rx={46 * P0.s * glow} ry={46 * P0.s * glow * lerp(1, Math.cos(tl * R2D), up)} fill={GOLD} opacity={0.35} style={{ filter: "blur(10px)" }} />
                <line x1={q.x} y1={q.y} x2={ex} y2={ey} stroke={`url(#${gid})`} strokeWidth={26 * P0.s} strokeLinecap="round" style={{ filter: "blur(9px)" }} />
                <line x1={q.x} y1={q.y} x2={ex} y2={ey} stroke={`url(#${gid})`} strokeWidth={5 * P0.s} strokeLinecap="round" />
              </svg>
            )}
            <svg width={W} height={H} style={{ position: "absolute", overflow: "visible", opacity: vis }}>
              {(live || s7 > 0) && <circle cx={q.x} cy={q.y} r={10 + 46 * pulse} fill="none" stroke={GOLD} strokeOpacity={0.7 * (1 - pulse)} strokeWidth={2.5} />}
              <circle cx={q.x} cy={q.y} r={9 * k} fill={GOLD} opacity={live || s7 > 0 ? 1 : 0.6} style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }} />
              <circle cx={q.x} cy={q.y} r={3.5 * k} fill="#fff" />
            </svg>
            {showLab && lk > 0 && (
              <div style={{ position: "absolute", left: q.x + (left ? -28 : 28), top: q.y - 32, opacity: vis * lk, transform: `translate(${left ? "-100%" : "0"},0) translateX(${(left ? 1 : -1) * (1 - lk) * 30}px)`, textAlign: left ? "right" : "left", whiteSpace: "nowrap" }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: 5, color: "#fff", textShadow: shadow }}>
                  {s7 > 0 && <span style={{ fontFamily: MONO, color: GOLD, marginRight: 12 }}>{String(p.n).padStart(2, "0")}</span>}{p.label}
                </div>
                <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 20, letterSpacing: 3, color: SAND, textShadow: shadow }}>{p.sub}</div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
const Names: React.FC<{ c: Cam; t: number }> = ({ c, t }) => {
  const pr = ortho(c), T = tp(tiltOf(c));
  return (
    <>
      {(M.names as any[]).filter((n) => t > n.t0 - 0.1 && t < n.t1 + 0.4).map((n, i) => {
        const q0 = pr(n.lon, n.lat), P = T(q0.x, q0.y), q = { x: P.X, y: P.Y }, o = Math.min(easeOut(k01(t, n.t0, n.t0 + 0.45)), 1 - k01(t, n.t1, n.t1 + 0.35)) * k01(q0.v, 0.1, 0.3)
          * k01(q.y, 70, 190) * (1 - k01(q.y, H - 190, H - 70)) * k01(q.x, 150, 380) * (1 - k01(q.x, W - 380, W - 150));   // nunca cortado contra el borde
        return <div key={i} style={{ position: "absolute", left: q.x, top: q.y, transform: `translate(-50%,-50%) scale(${lerp(0.92, 1, o) * Math.min(1.15, P.s)})`, opacity: o * 0.92, fontFamily: SANS, fontWeight: 800, fontSize: n.size, letterSpacing: n.size * 0.42, paddingLeft: n.size * 0.42, color: "#fff7e8", textShadow: "0 2px 14px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{n.text}</div>;
      })}
    </>
  );
};

// ───────── ruta Stonehenge ↔ Orcadas dibujada SOBRE el globo (no es otra pantalla: la cámara la sigue) ─────────
const LAND = [[-1.826, 51.179], [-1.9, 51.5], [-2.0, 52.2], [-2.1, 53.0], [-2.4, 53.8], [-2.8, 54.6], [-3.2, 55.3], [-3.6, 56.0], [-3.9, 56.8], [-4.2, 57.5], [-3.4, 58.3], [-3.0, 58.98]];
const SEA = [[-1.826, 51.179], [-1.8, 51.0], [-1.6, 50.75], [-1.0, 50.6], [0.6, 50.7], [1.9, 51.6], [1.9, 52.8], [0.4, 53.6], [-0.6, 54.6], [-1.3, 55.6], [-1.7, 56.6], [-1.6, 57.6], [-2.2, 58.4], [-3.0, 58.98]];
const partial = (pts: number[][], f: number) => { if (f <= 0) return pts.slice(0, 1); const n = (pts.length - 1) * Math.min(1, f), i = Math.floor(n), r = n - i; const out = pts.slice(0, i + 1); if (i + 1 < pts.length) out.push([lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)]); return out; };
// ground = las líneas (van en la capa inclinada, pegadas al suelo) · hud = contador y rótulo de Orcadas (pantalla)
const Route: React.FC<{ c: Cam; t: number; ground?: boolean }> = ({ c, t, ground }) => {
  const r = M.route;
  if (t < r.tDraw - 0.1 || t > r.t1 + 1.2) return null;
  const pr = ortho(c), d = easeOut(k01(t, r.tDraw, r.tDraw + r.dDraw)), fo = 1 - k01(t, r.t1, r.t1 + 1.0);
  const lp = partial(LAND, d), sp = partial(SEA, d), head = pr(lp[lp.length - 1][0], lp[lp.length - 1][1]);
  const ok = pr(-3.0, 58.98), orc = t >= r.tOrk ? 1 : 0, ph = ((t - r.tOrk) * 1.1) % 1;
  const okS = tp(tiltOf(c))(ok.x, ok.y);
  const km = Math.round(r.km * easeOut(k01(t, r.tKm, r.tKm + 1.0)));
  const lab = easeOut(k01(t, r.tOrk + 0.15, r.tOrk + 0.6)) * fo;
  if (ground) return (
      <svg width={VB.w} height={VB.h} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{ position: "absolute", left: VB.x, top: VB.y, opacity: fo }}>
        <defs><filter id="rGlow" filterUnits="userSpaceOnUse" x={VB.x} y={VB.y} width={VB.w} height={VB.h}><feGaussianBlur stdDeviation="7" /></filter></defs>
        <path d={ringPath(pr, lp, false)} fill="none" stroke={GOLD} strokeWidth={16} opacity={0.45} filter="url(#rGlow)" />
        <path d={ringPath(pr, lp, false)} fill="none" stroke={SAND} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d={ringPath(pr, sp, false)} fill="none" stroke="#6fc3ff" strokeWidth={4} strokeLinecap="round" strokeDasharray="14 12" />
        {d > 0 && d < 1 && <><circle cx={head.x} cy={head.y} r={22} fill={GOLD} opacity={0.4} filter="url(#rGlow)" /><circle cx={head.x} cy={head.y} r={8} fill="#fff" /></>}
        {orc > 0 && <>
          <circle cx={ok.x} cy={ok.y} r={14 + 70 * ph} fill="none" stroke={RED} strokeWidth={3} opacity={1 - ph} />
          <circle cx={ok.x} cy={ok.y} r={12 * spring(t, r.tOrk, 10, 0.45)} fill={RED} style={{ filter: `drop-shadow(0 0 14px ${RED})` }} />
        </>}
      </svg>
  );
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: 100, opacity: k01(t, r.tKm - 0.2, r.tKm + 0.2) * (1 - k01(t, r.tOrk - 0.6, r.tOrk)), transform: `translateY(${(1 - easeOut(k01(t, r.tKm - 0.2, r.tKm + 0.4))) * 25}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: SAND, textShadow: shadow }}>LA PIEDRA DEL ALTAR · 6 t</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, lineHeight: 1, color: "#fff", textShadow: shadow, fontVariantNumeric: "tabular-nums" }}>{km}<span style={{ fontSize: 64, marginLeft: 14 }}>KM</span></div>
        <div style={{ display: "flex", gap: 28, marginTop: 10, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 4, textShadow: shadow }}>
          <span style={{ color: SAND }}>━ ¿POR TIERRA?</span><span style={{ color: "#6fc3ff" }}>┅ ¿POR MAR?</span>
        </div>
      </div>
      {lab > 0 && (
        <div style={{ position: "absolute", left: okS.X + 34, top: okS.Y - 44, opacity: lab, transform: `translateX(${(1 - lab) * -30}px)`, whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 8, color: "#fff", textShadow: shadow }}>ORCADAS · ESCOCIA</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: RED, textShadow: shadow }}>ORIGEN CONFIRMADO · AGOSTO 2024</div>
        </div>
      )}
    </>
  );
};
// contador de los 7 (sube a medida que el globo los vuelve a encender)
const Count7: React.FC<{ t: number }> = ({ t }) => {
  if (t < SEVEN.t0 || t > SEVEN.t1 + 0.6) return null;
  const n = Object.values(SEVEN.on).filter((x) => t >= x).length;
  const last = Math.max(0, ...Object.values(SEVEN.on).filter((x) => t >= x));
  const o = Math.min(easeOut(k01(t, SEVEN.t0, SEVEN.t0 + 0.5)), 1 - k01(t, SEVEN.t1, SEVEN.t1 + 0.4));
  return (
    <div style={{ position: "absolute", left: 120, top: 84, opacity: o }}>{/* arriba a la izquierda, como el HUD: no pisa el globo */}
      <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 120, lineHeight: 1, color: "#fff", textShadow: `0 0 40px rgba(242,181,68,.45), ${shadow}`, transform: `scale(${n ? lerp(1.18, 1, spring(t, last, 12, 0.45)) : 1})` }}>{n}</span>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 16, color: SAND, marginLeft: 22, textShadow: shadow }}>ESTRUCTURAS</span>
    </div>
  );
};

// ───────── portal: el metraje se abre en círculo desde el pin; adentro los planos se funden ─────────
const XF = M.xf as number;
const COMP: Record<string, React.FC<any>> = { CarveDown, ObeliskScale };
const Portal: React.FC<{ p: any; c: Cam; t: number }> = ({ p, c, t }) => {
  if (t < p.t0 - 0.6 || t > p.t1 + 0.05) return null;
  const k = Math.min(ease(k01(t, p.t0, p.t0 + 0.55)), p.close ? 1 - ease(k01(t, p.t1 - 0.5, p.t1)) : 1);
  const q0 = ortho(c)(p.lon, p.lat), q = tp(tiltOf(c))(q0.x, q0.y);
  const cx = Math.max(-150, Math.min(W + 150, q.X)), cy = Math.max(-150, Math.min(H + 150, q.Y));
  const r = 2350 * Math.pow(k, 1.35);
  const ring = k < 0.995 ? 1 - k01(k, 0.55, 0.95) : 0;
  return (
    <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: `circle(${Math.max(0, r).toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`, background: "#000" }}>
        {(p.items as any[]).map((it, i) => {
          const a0 = it.a - (i ? XF / 2 : 0), b0 = it.b + (i < p.items.length - 1 ? XF / 2 : 0);
          if (t < a0 - 0.6 || t > b0 + 0.02) return null;
          const op = i ? ease(k01(t, a0, a0 + XF)) : 1;
          // cam = [z0, fx0, fy0, z1, fx1, fy1]: zoom + foco que se corre (paneo / tilt) — cada plano con su movimiento
          const cm: number[] = it.cam || [it.z[0], 0.5, 0.5, it.z[1], 0.5, 0.5], ke = ease(k01(t, a0, b0));
          const z = lerp(cm[0], cm[3], ke), fx = lerp(cm[1], cm[4], ke), fy = lerp(cm[2], cm[5], ke);
          let body: React.ReactNode;
          if (it.comp) { const Cm = COMP[it.comp]; body = Cm ? <Cm t={t} a={it.a} b={it.b} {...it.props} /> : null; }
          else {
            const F0 = Math.round(a0 * FPS) - 10;                      // se monta 10 cuadros antes: el decodificador ya tiene el cuadro
            const sf = Math.max(0, Math.round(it.from * FPS - (it.a * FPS - F0) * it.rate));
            body = (
              <Sequence from={F0} durationInFrames={Math.round((b0 - a0) * FPS) + 14} layout="none">
                <OffthreadVideo src={staticFile(`${it.v}.mp4`)} startFrom={sf} playbackRate={it.rate} muted
                  style={{ width: W, height: H, objectFit: "cover", transform: `scale(${z.toFixed(4)})`, transformOrigin: `${(fx * 100).toFixed(2)}% ${(fy * 100).toFixed(2)}%`, filter: "contrast(1.05) saturate(1.04)" }} />
              </Sequence>
            );
          }
          return <AbsoluteFill key={i} style={{ opacity: t < a0 ? 0 : op }}>{body}</AbsoluteFill>;
        })}
      </AbsoluteFill>
      {ring > 0 && r > 1 && <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "6px solid #fff6e6", opacity: ring, boxShadow: `0 0 26px rgba(242,181,68,.55), 0 0 0 1px rgba(0,0,0,.4)` }} />}
    </AbsoluteFill>
  );
};

// ───────── gancho found-footage: va entero y al final se cierra en iris sobre el globo ─────────
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const g = M.gc, [i0, i1] = g.iris;
  if (t > i1 + 0.02) return null;
  const k = ease(k01(t, i0, i1)), r = 1250 * (1 - k);
  return (
    <AbsoluteFill style={{ zIndex: 20 }}>
      <AbsoluteFill style={{ clipPath: k > 0 ? `circle(${r.toFixed(1)}px at 960px 560px)` : undefined }}>
        <OffthreadVideo src={staticFile(`${g.v}.mp4`)} muted style={{ width: W, height: H, objectFit: "cover", transform: `scale(${1 + 0.06 * k})` }} />
      </AbsoluteFill>
      {k > 0 && r > 2 && <div style={{ position: "absolute", left: 960 - r, top: 560 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "6px solid #fff6e6", boxShadow: "0 0 26px rgba(242,181,68,.55)" }} />}
    </AbsoluteFill>
  );
};

const OVER: Record<string, React.FC<any>> = { TonsRoll, TitleStone };
export const M1: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = cam(t), c0 = cam(Math.max(0, t - 1 / FPS));
  // desenfoque de movimiento = velocidad de la cámara (px de pantalla por cuadro) + zoom
  let dl = c.lon - c0.lon; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
  const vx = Math.abs(dl * Math.cos(c.lat * R2D)) * R2D * c.R, vy = Math.abs(c.lat - c0.lat) * R2D * c.R;
  // obturador 180° = estela de medio cuadro; gauss ≈ largo/3 → 0,17·v. Tope 6 px: se tiene que poder LEER el mapa en vuelo
  const bz = Math.min(0.9, Math.abs(Math.log(c.R / c0.R)) * 900 * 0.03);   // el zoom sólo insinúa: un blur parejo parece desenfoque
  const bx = Math.min(4, vx * 0.12) + bz, by = Math.min(4, vy * 0.12) + bz, blur = bx + by > 0.6;
  const tl = tiltOf(c);
  const covered = PORT.some((p) => t > p.t0 + 0.6 && t < p.t1 - 0.55) && t > 12.1;   // portal abierto entero: el globo no se ve
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10161d 0%, #050608 70%)", overflow: "hidden" }}>
      {!farm && <Audio src={staticFile("cpestructuras/mix.wav")} />}
      {!covered && <>
        <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
        {c.R < 2600 && <Stars />}
        <AbsoluteFill style={{ filter: blur ? "url(#mb)" : undefined, perspective: PERSP, perspectiveOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ transform: `rotateX(${tl.toFixed(3)}deg)`, transformOrigin: `50% ${OY}px` }}>
            <Globe c={c} t={t} />
            <Route c={c} t={t} ground />
          </AbsoluteFill>
        </AbsoluteFill>
        {tl > 0.5 && <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(150,185,215,${(0.42 * tl / 34).toFixed(3)}) 0%, rgba(150,185,215,${(0.12 * tl / 34).toFixed(3)}) 22%, rgba(150,185,215,0) 45%)` }} />}
        <Route c={c} t={t} />
        <Names c={c} t={t} />
        <Pins c={c} t={t} />
        <Count7 t={t} />
      </>}
      {PORT.map((p, i) => <Portal key={i} p={p} c={c} t={t} />)}
      <Hook t={t} />
      <AbsoluteFill style={{ zIndex: 30, pointerEvents: "none" }}>
        {PORT.filter((p) => p.tag).map((p, i) => <Tag key={i} t={t} a={p.tag[0]} b={p.tag[1]} text={p.label} sub={p.sub} x={120} y={96} />)}
        {(M.overs as any[]).filter((o) => t >= o.a - 0.1 && t <= o.b + 1.0).map((o, j) => { const Cm = OVER[o.n]; return Cm ? <Cm key={j} t={t} a={o.a} b={o.b} {...o.p} /> : null; })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
