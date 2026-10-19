// compsA.tsx — componentes propios de apex02 (correcaminos vs cascabel). Todo por código, siempre sobre video que se mueve.
import React from "react";
import { SANS, COND, MONO, RED, RED2, SAND, VENOM, W, H, k01, lerp, ease, easeOut, rnd, shadow, interp } from "./lib";

const fade = (t: number, a: number, b: number, i = 0.25, o = 0.25) => k01(t, a, a + i) * (1 - k01(t, b - o, b));

// ---------- reloj de la mordida: cuenta en milisegundos y la compara con un parpadeo ----------
export const StrikeClock: React.FC<{ t: number; a: number; b: number; ms: number; blinkAt?: number; x?: number; y?: number }> = ({ t, a, b, ms, blinkAt, x = 120, y = 300 }) => {
  if (t < a || t > b) return null;
  const run = k01(t, a + 0.15, a + 0.85), v = Math.round(ms * easeOut(run));
  const bl = blinkAt != null ? easeOut(k01(t, blinkAt, blinkAt + 0.7)) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: fade(t, a, b), color: "#fff", textShadow: shadow }}>
      <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 34, letterSpacing: 8, color: RED2 }}>STRIKE · LAUNCH TO BITE</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 190, lineHeight: 1, letterSpacing: -4 }}>
        {v < ms ? String(v).padStart(3, "0") : "<100"}<span style={{ fontSize: 70, marginLeft: 12 }}>ms</span>
      </div>
      <div style={{ position: "relative", width: 900, height: 26, marginTop: 18 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 26, width: 900 * 0.33 * run, background: RED, boxShadow: `0 0 18px ${RED}` }} />
        {bl > 0 && <div style={{ position: "absolute", left: 0, top: 40, height: 26, width: 900 * bl, background: "rgba(255,255,255,.85)" }} />}
      </div>
      {bl > 0 && <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 30, letterSpacing: 6, marginTop: 52, opacity: k01(t, blinkAt! + 0.3, blinkAt! + 0.6) }}>ONE HUMAN BLINK · 100–150 ms</div>}
    </div>
  );
};

// ---------- ficha del sujeto (expediente Apex): renglones que se escriben uno por uno ----------
export const CaseFile: React.FC<{ t: number; a: number; b: number; num: string; name: string; latin: string; rows: { at: number; k: string; v: string; hot?: boolean }[]; x?: number; y?: number }> =
  ({ t, a, b, num, name, latin, rows, x = 110, y = 210 }) => {
    if (t < a || t > b) return null;
    const k = easeOut(k01(t, a, a + 0.5)), o = 1 - k01(t, b - 0.3, b);
    return (
      <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateX(${(1 - k) * -60}px)` }}>
        <div style={{ position: "absolute", left: -30, top: 0, width: 8, height: 150 + rows.length * 62, background: RED, transformOrigin: "top", transform: `scaleY(${k})` }} />
        <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 32, letterSpacing: 10, color: RED2, textShadow: shadow }}>APEX FILE {num}</div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 92, lineHeight: 1, color: "#fff", textShadow: shadow }}>{name.slice(0, Math.ceil(name.length * k01(t, a + 0.1, a + 0.7)))}</div>
        <div style={{ fontFamily: SANS, fontStyle: "italic", fontWeight: 400, fontSize: 30, color: "#fff", opacity: 0.85 * k01(t, a + 0.5, a + 0.8), textShadow: shadow, marginTop: 6 }}>{latin}</div>
        <div style={{ marginTop: 24 }}>
          {rows.map((r, n) => {
            const q = easeOut(k01(t, r.at, r.at + 0.35));
            return <div key={n} style={{ display: "flex", alignItems: "baseline", height: 62, opacity: q, transform: `translateX(${(1 - q) * 30}px)`, borderTop: "1px solid rgba(255,255,255,.25)" }}>
              <div style={{ width: 300, fontFamily: COND, fontWeight: 500, fontSize: 28, letterSpacing: 5, color: "rgba(255,255,255,.75)", textShadow: shadow }}>{r.k}</div>
              <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 44, color: r.hot ? RED2 : "#fff", textShadow: shadow }}>{r.v}</div>
            </div>;
          })}
        </div>
      </div>
    );
  };

// ---------- mira de cámara que encuadra al sujeto (esquinas + etiqueta) ----------
export const Lock: React.FC<{ t: number; a: number; b: number; x: number; y: number; w: number; h: number; label?: string; sub?: string; red?: boolean }> = ({ t, a, b, x, y, w, h, label, sub, red }) => {
  if (t < a || t > b) return null;
  const g = easeOut(k01(t, a, a + 0.35)), o = fade(t, a, b, 0.1, 0.2), s = lerp(1.5, 1, g), c = red ? RED : "#fff", L = 46;
  const cx = x + w / 2, cy = y + h / 2, ww = w * s, hh = h * s, X = cx - ww / 2, Y = cy - hh / 2;
  const blink = red && Math.floor(t * 4) % 2 === 0 ? 1 : 0.55;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {[[X, Y, 1, 1], [X + ww, Y, -1, 1], [X, Y + hh, 1, -1], [X + ww, Y + hh, -1, -1]].map(([px, py, dx, dy], n) =>
          <path key={n} d={`M${px + dx * L},${py} L${px},${py} L${px},${py + dy * L}`} fill="none" stroke={c} strokeWidth={5} style={{ filter: `drop-shadow(0 0 6px rgba(0,0,0,.7))` }} />)}
        <circle cx={cx} cy={cy} r={6} fill={c} opacity={0.8} />
      </svg>
      {label && <div style={{ position: "absolute", left: X, top: Y + hh + 14, fontFamily: COND, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#fff", textShadow: shadow }}>
        {red && <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 8, background: RED, marginRight: 12, opacity: blink }} />}{label}</div>}
      {sub && <div style={{ position: "absolute", left: X, top: Y + hh + 64, fontFamily: SANS, fontWeight: 400, fontSize: 26, color: "#fff", opacity: 0.9, textShadow: shadow }}>{sub}</div>}
    </div>
  );
};

// ---------- báscula: el número del peso dentro de un plato que baja ----------
export const WeighIn: React.FC<{ t: number; a: number; b: number; from: number; to: number; unit: string; caption: string; sub?: string; x?: number; y?: number }> = ({ t, a, b, from, to, unit, caption, sub, x = 1180, y = 330 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a + 0.1, a + 1.0)), o = fade(t, a, b);
  const v = Math.round(lerp(0, to, k)), lo = Math.round(lerp(0, from, k));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, color: "#fff", textShadow: shadow, width: 640 }}>
      <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 32, letterSpacing: 8, color: RED2 }}>{caption}</div>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 150, lineHeight: 1 }}>{lo}–{v}<span style={{ fontSize: 60, marginLeft: 10 }}>{unit}</span></div>
      <div style={{ width: 600, height: 8, background: "#fff", marginTop: 10, transform: `translateY(${k * 10}px)` }} />
      <div style={{ width: 80, height: 60, background: "rgba(255,255,255,.85)", margin: "0 auto 0 260px", clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }} />
      {sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, marginTop: 14, opacity: k01(t, a + 0.8, a + 1.1) }}>{sub}</div>}
    </div>
  );
};

// ---------- velocímetro de radar que sigue al pájaro + estela que se dibuja ----------
export const RadarGun: React.FC<{ t: number; a: number; b: number; mph: number; x?: number; y?: number; trail?: { x0: number; x1: number; y: number } }> = ({ t, a, b, mph, x = 1340, y = 150, trail }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a + 0.1, a + 1.2)), o = fade(t, a, b);
  const v = Math.round(mph * k) + (k > 0.98 ? Math.round(Math.sin(t * 9)) * 0 : 0);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {trail && <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><linearGradient id="trl" x1="0" x2="1"><stop offset="0" stopColor={RED} stopOpacity={0} /><stop offset="1" stopColor={RED} stopOpacity={0.9} /></linearGradient></defs>
        <rect x={trail.x0} y={trail.y - 5} width={(trail.x1 - trail.x0) * ease(k01(t, a, b - 0.2))} height={10} fill="url(#trl)" />
      </svg>}
      <div style={{ position: "absolute", left: x, top: y, padding: "14px 26px", background: "rgba(8,8,10,.72)", border: `2px solid ${RED}`, color: "#fff", fontFamily: MONO }}>
        <div style={{ fontSize: 22, letterSpacing: 6, color: RED2 }}>● RADAR</div>
        <div style={{ fontSize: 110, fontWeight: 700, lineHeight: 1 }}>{String(v).padStart(2, "0")}<span style={{ fontSize: 40, marginLeft: 10 }}>MPH</span></div>
        <div style={{ fontSize: 30, opacity: 0.85 }}>{Math.round(v * 1.609)} KM/H</div>
      </div>
    </div>
  );
};

// ---------- huellas en X que se imprimen en la arena + flechas de "¿hacia dónde?" ----------
export const XTracks: React.FC<{ t: number; a: number; b: number; qAt?: number }> = ({ t, a, b, qAt }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b);
  const P = [[520, 760], [700, 640], [880, 760], [1060, 640], [1240, 760], [1420, 640]];
  const q = qAt != null ? easeOut(k01(t, qAt, qAt + 0.5)) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {P.map(([x, y], n) => {
          const k = easeOut(k01(t, a + 0.15 + n * 0.22, a + 0.45 + n * 0.22)); if (k <= 0) return null;
          const s = 46 * k;
          return <g key={n} transform={`translate(${x},${y}) rotate(${n % 2 ? 8 : -8})`} opacity={k}>
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], m) => <line key={m} x1={0} y1={0} x2={dx * s} y2={dy * s * 1.25} stroke="#fff" strokeWidth={9} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,.8))" }} />)}
          </g>;
        })}
        {q > 0 && <>
          <path d={`M ${960 - 520 * q} 470 l 40 -26 m -40 26 l 40 26`} stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" />
          <line x1={960} y1={470} x2={960 - 520 * q} y2={470} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          <line x1={960} y1={470} x2={960 + 520 * q} y2={470} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          <path d={`M ${960 + 520 * q} 470 l -40 -26 m 40 26 l -40 26`} stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" />
        </>}
      </svg>
      {q > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 84, color: "#fff", textShadow: shadow, opacity: q }}>WHICH WAY?</div>}
    </div>
  );
};

// ---------- cara a cara (tale of the tape) sobre video partido ----------
export const TaleTape: React.FC<{ t: number; a: number; b: number; left: { name: string; rows: { at: number; v: string }[] }; right: { name: string; rows: { at: number; v: string }[] } }> = ({ t, a, b, left, right }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), g = easeOut(k01(t, a, a + 0.5));
  const col = (side: "l" | "r", d: typeof left) => (
    <div style={{ position: "absolute", top: 170, [side === "l" ? "left" : "right"]: 90, width: 760, textAlign: side === "l" ? "left" : "right", transform: `translateX(${(1 - g) * (side === "l" ? -80 : 80)}px)` }}>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 76, color: "#fff", textShadow: shadow, borderBottom: `6px solid ${side === "l" ? RED : "#fff"}`, paddingBottom: 6 }}>{d.name}</div>
      {d.rows.map((r, n) => { const q = easeOut(k01(t, r.at, r.at + 0.35)); return <div key={n} style={{ fontFamily: COND, fontWeight: 500, fontSize: 46, color: "#fff", textShadow: shadow, marginTop: 18, opacity: q, transform: `translateY(${(1 - q) * 20}px)` }}>{r.v}</div>; })}
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {col("l", left)}{col("r", right)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 130, color: RED, textShadow: shadow, transform: `scale(${lerp(1.6, 1, g)})`, opacity: g }}>VS</div>
    </div>
  );
};

// ---------- pizarra táctica sobre el video: cono de ataque, trayectorias y "X" de fallo ----------
export const Telestrator: React.FC<{ t: number; a: number; b: number; snake: [number, number]; path?: [number, number][]; cone?: { at: number; ang: number; len: number }; miss?: { at: number; x: number; y: number }; label?: { at: number; text: string; x: number; y: number } }> =
  ({ t, a, b, snake, path, cone, miss, label }) => {
    if (t < a || t > b) return null;
    const o = fade(t, a, b);
    const pk = path ? ease(k01(t, a + 0.2, b - 0.4)) : 0;
    const cut = path ? path.slice(0, Math.max(2, Math.ceil(path.length * pk))) : [];
    const ck = cone ? easeOut(k01(t, cone.at, cone.at + 0.3)) : 0, mk = miss ? easeOut(k01(t, miss.at, miss.at + 0.3)) : 0;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <circle cx={snake[0]} cy={snake[1]} r={60} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="12 10" />
          {cut.length > 1 && <polyline points={cut.map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.8))" }} />}
          {cone && ck > 0 && (() => { const A = cone.ang * Math.PI / 180, s = 0.32, L = cone.len * ck;
            return <path d={`M${snake[0]},${snake[1]} L${snake[0] + Math.cos(A - s) * L},${snake[1] + Math.sin(A - s) * L} A ${L} ${L} 0 0 1 ${snake[0] + Math.cos(A + s) * L},${snake[1] + Math.sin(A + s) * L} Z`} fill="rgba(227,32,46,.28)" stroke={RED} strokeWidth={4} />; })()}
          {miss && mk > 0 && <g transform={`translate(${miss.x},${miss.y}) scale(${lerp(1.6, 1, mk)})`} opacity={mk}>
            <line x1={-40} y1={-40} x2={40} y2={40} stroke="#fff" strokeWidth={12} strokeLinecap="round" /><line x1={40} y1={-40} x2={-40} y2={40} stroke="#fff" strokeWidth={12} strokeLinecap="round" /></g>}
        </svg>
        {label && <div style={{ position: "absolute", left: label.x, top: label.y, fontFamily: COND, fontWeight: 700, fontSize: 54, color: "#fff", textShadow: shadow, opacity: easeOut(k01(t, label.at, label.at + 0.3)) }}>{label.text}</div>}
      </div>
    );
  };

// ---------- lista con tilde/cruz (quién es inmune) ----------
export const CheckList: React.FC<{ t: number; a: number; b: number; title: string; items: { at: number; text: string; ok: boolean }[]; x?: number; y?: number }> = ({ t, a, b, title, items, x = 1080, y = 220 }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, padding: "26px 34px", background: "rgba(6,6,8,.62)", borderLeft: `8px solid ${RED}` }}>
      <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 32, letterSpacing: 8, color: RED2, marginBottom: 10 }}>{title}</div>
      {items.map((it, n) => { const q = easeOut(k01(t, it.at, it.at + 0.3));
        return <div key={n} style={{ display: "flex", alignItems: "center", height: 74, opacity: q, transform: `translateX(${(1 - q) * 30}px)` }}>
          <div style={{ width: 54, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: it.ok ? VENOM : RED2 }}>{it.ok ? "✓" : "✕"}</div>
          <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 50, color: "#fff" }}>{it.text}</div>
        </div>; })}
    </div>
  );
};

// ---------- palabras que entran de a una en el golpe (SPEED · FEATHERS · TIMING) ----------
export const WordStack: React.FC<{ t: number; a: number; b: number; words: { at: number; text: string; hot?: boolean }[]; x?: number; y?: number; size?: number }> = ({ t, a, b, words, x = 130, y = 260, size = 150 }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b, 0.1, 0.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {words.map((w, n) => { const q = easeOut(k01(t, w.at, w.at + 0.3)); return <div key={n} style={{ fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.02, color: w.hot ? RED : "#fff", textShadow: shadow, opacity: q, transform: `translateX(${(1 - q) * -50}px) scale(${lerp(1.25, 1, q)})`, transformOrigin: "left center" }}>{w.text}</div>; })}
  </div>;
};

// ---------- polvo del desierto que cruza el cuadro (vida sobre fotos) ----------
export const Dust: React.FC<{ t: number; n?: number; op?: number; warm?: boolean }> = ({ t, n = 60, op = 0.55, warm = true }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
    {Array.from({ length: n }, (_, i) => {
      const sp = 40 + rnd(i, 2) * 90, x = ((rnd(i, 1) * W + t * sp) % (W + 80)) - 40, y = rnd(i, 3) * H + Math.sin(t * 0.7 + i) * 18, r = 1 + rnd(i, 4) * 3.2;
      return <circle key={i} cx={x} cy={y} r={r} fill={warm ? SAND : "#fff"} opacity={0.25 + rnd(i, 5) * 0.5} />;
    })}
  </svg>
);

// ---------- calor que ondula (sobre el plano, para las cifras de temperatura) ----------
export const HeatBar: React.FC<{ t: number; a: number; b: number; c: number; f: number; x?: number; y?: number }> = ({ t, a, b, c, f, x = 140, y = 300 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a + 0.1, a + 1.1)), o = fade(t, a, b);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", alignItems: "flex-end", gap: 30 }}>
      <div style={{ width: 54, height: 420, borderRadius: 27, border: "4px solid #fff", position: "relative", overflow: "hidden", background: "rgba(0,0,0,.35)" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${k * 92}%`, background: `linear-gradient(to top, ${RED}, #ffb347)` }} />
      </div>
      <div style={{ color: "#fff", textShadow: shadow }}>
        <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 32, letterSpacing: 8, color: RED2 }}>GROUND SURFACE</div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 200, lineHeight: 1 }}>{Math.round(c * k)}°C</div>
        <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 64 }}>{Math.round(f * k)}°F</div>
      </div>
    </div>
  );
};

// ---------- timón: vista cenital del giro en seco — la cola barre al costado y la trayectoria dobla casi en ángulo recto ----------
export const RudderTurn: React.FC<{ t: number; a: number; b: number; turnAt: number }> = ({ t, a, b, turnAt }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b);
  const run1 = ease(k01(t, a + 0.2, turnAt)), sw = easeOut(k01(t, turnAt - 0.15, turnAt + 0.25)), run2 = ease(k01(t, turnAt + 0.1, turnAt + 1.4));
  const X0 = 300, X1 = 1180, Y0 = 760, Y1 = 260;
  const bx = run2 > 0 ? X1 : lerp(X0, X1, run1), by = run2 > 0 ? lerp(Y0, Y1, run2) : Y0, ang = run2 > 0 || sw > 0.5 ? -90 : 0;
  const tail = sw > 0 && run2 < 0.15 ? lerp(0, 55, Math.sin(Math.PI * sw)) : 0;
  const path = `M ${X0} ${Y0} L ${lerp(X0, X1, run1)} ${Y0}` + (run2 > 0 ? ` L ${X1} ${lerp(Y0, Y1, run2)}` : "");
  const lab = easeOut(k01(t, turnAt + 0.2, turnAt + 0.7));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <path d={path} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" />
        {run2 > 0 && <path d={`M ${X1 - 60} ${Y0} A 60 60 0 0 0 ${X1} ${Y0 - 60}`} fill="none" stroke={RED} strokeWidth={8} />}
        <g transform={`translate(${bx},${by}) rotate(${ang})`}>
          <g transform={`rotate(${tail})`}><path d="M -40 0 L -170 -16 L -170 16 Z" fill={RED} opacity={0.95} /></g>
          <ellipse cx={0} cy={0} rx={46} ry={20} fill="#fff" />
          <path d="M 44 0 L 92 -4 L 92 4 Z" fill="#fff" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: X1 + 120, top: 420, opacity: lab, transform: `translateX(${(1 - lab) * 40}px)`, color: "#fff", textShadow: shadow }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 96 }}>TAIL = <span style={{ color: RED }}>RUDDER</span></div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 4, marginTop: 6 }}>turns almost instantly</div>
      </div>
    </div>
  );
};

// ---------- panel solar: rayos que bajan en diagonal sobre el parche de piel negra, el calor entra a la sangre y sube un medidor sin gastar combustible ----------
export const SolarPatch: React.FC<{ t: number; a: number; b: number; x?: number; y?: number; heatAt: number }> = ({ t, a, b, x = 1100, y = 560, heatAt }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), ray = easeOut(k01(t, a + 0.1, a + 0.9)), heat = ease(k01(t, heatAt, heatAt + 2.6));
  const N = 9;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="spRay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE6A0" stopOpacity="0" /><stop offset="1" stopColor="#FFD36B" stopOpacity="0.9" /></linearGradient>
          <radialGradient id="spGlow"><stop offset="0" stopColor="#FF4A2B" stopOpacity={0.85 * heat} /><stop offset="1" stopColor="#FF4A2B" stopOpacity="0" /></radialGradient>
        </defs>
        {Array.from({ length: N }, (_, i) => {
          const sx = x - 900 + i * 70, sy = y - 640, ex = x - 120 + i * 30, ey = y - 30;
          const ph = (t * 0.9 + i * 0.13) % 1;
          return <g key={i}>
            <line x1={sx} y1={sy} x2={lerp(sx, ex, ray)} y2={lerp(sy, ey, ray)} stroke="url(#spRay)" strokeWidth={5} strokeLinecap="round" />
            {ray > 0.95 && <circle cx={lerp(sx, ex, ph)} cy={lerp(sy, ey, ph)} r={7} fill="#FFF3C4" opacity={0.9} />}
          </g>;
        })}
        <ellipse cx={x} cy={y} rx={190} ry={70} fill="url(#spGlow)" />
        <ellipse cx={x} cy={y} rx={150} ry={46} fill="#120d0b" stroke="#FFD36B" strokeWidth={4} strokeDasharray="12 10" />
        {heat > 0 && Array.from({ length: 5 }, (_, i) => {
          const ph = (t * 0.7 + i * 0.2) % 1, xx = x - 110 + i * 55;
          return <path key={i} d={`M ${xx} ${y + 60 + ph * 160} q 14 -22 0 -44`} fill="none" stroke={RED2} strokeWidth={5} opacity={heat * (1 - ph)} strokeLinecap="round" />;
        })}
      </svg>
      <div style={{ position: "absolute", left: x + 220, top: y - 90, color: "#fff", textShadow: shadow, opacity: ray }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 84 }}>SOLAR <span style={{ color: "#FFD36B" }}>PANEL</span></div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 3, marginTop: 4 }}>black skin under the back feathers</div>
        <div style={{ marginTop: 26, opacity: k01(t, heatAt, heatAt + 0.4) }}>
          <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 30, letterSpacing: 6, color: RED2 }}>BLOOD WARMS UP · FUEL BURNED</div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 10 }}>
            <div style={{ width: 360, height: 22, border: "3px solid #fff", position: "relative" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${heat * 100}%`, background: RED }} /></div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40 }}>0 kcal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- glándula de sal: un punto delante del ojo, sangre que pasa por un filtro y gotas de salmuera que caen ----------
export const SaltDrip: React.FC<{ t: number; a: number; b: number; x: number; y: number; dripAt: number }> = ({ t, a, b, x, y, dripAt }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), g = easeOut(k01(t, a + 0.1, a + 0.7)), dr = k01(t, dripAt, dripAt + 0.3);
  const flow = (t * 160) % 60;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <path d={`M ${x - 520} ${y + 40} C ${x - 300} ${y + 40}, ${x - 120} ${y - 10}, ${x} ${y}`} fill="none" stroke={RED} strokeWidth={14} strokeDasharray="30 30" strokeDashoffset={-flow} opacity={g} />
        <path d={`M ${x} ${y} C ${x + 140} ${y + 10}, ${x + 300} ${y + 60}, ${x + 520} ${y + 60}`} fill="none" stroke={RED2} strokeWidth={14} strokeDasharray="30 30" strokeDashoffset={-flow} opacity={g * 0.8} />
        <circle cx={x} cy={y} r={46 * g} fill="none" stroke="#fff" strokeWidth={5} />
        <circle cx={x} cy={y} r={22 * g} fill="#fff" opacity={0.85} />
        {dr > 0 && Array.from({ length: 4 }, (_, i) => {
          const ph = ((t - dripAt) * 0.8 + i * 0.25) % 1;
          return <path key={i} d={`M ${x} ${y + 60 + ph * 300} q -14 22 0 30 q 14 -8 0 -30`} fill="#E9F4FF" opacity={dr * (1 - ph)} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: x + 90, top: y - 150, color: "#fff", textShadow: shadow, opacity: g }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 78 }}>SALT GLAND</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 3 }}>one in front of each eye</div>
      </div>
      <div style={{ position: "absolute", left: x + 90, top: y + 170, color: "#fff", textShadow: shadow, opacity: dr }}>
        <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 34, letterSpacing: 6, color: SAND }}>OUT: CONCENTRATED SALT · WATER KEPT</div>
      </div>
    </div>
  );
};

// ---------- carrera mordida vs parpadeo: reloj en cámara lenta, dos barras; la mordida termina antes de que el párpado cierre ----------
export const BlinkRace: React.FC<{ t: number; a: number; b: number; runA: number; runB: number }> = ({ t, a, b, runA, runB }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), u = k01(t, runA, runB), ms = Math.round(u * 150);
  const strike = Math.min(1, ms / 70), blink = Math.min(1, ms / 150);
  const row = (label: string, p: number, col: string, done: string, y: number, show: boolean) => (
    <div style={{ position: "absolute", left: 260, top: y, width: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: COND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: shadow }}>
        <span>{label}</span><span style={{ color: col, opacity: show ? 1 : 0 }}>{done}</span>
      </div>
      <div style={{ height: 34, marginTop: 10, border: "3px solid rgba(255,255,255,.8)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: col, boxShadow: `0 0 18px ${col}` }} />
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 120, color: "#fff", textShadow: shadow }}>
        {String(ms).padStart(3, "0")}<span style={{ fontSize: 50, marginLeft: 10 }}>ms</span>
      </div>
      {row("RATTLESNAKE STRIKE", strike, RED, "BITE DONE", 400, strike >= 1)}
      {row("HUMAN BLINK", blink, "#fff", "EYES CLOSED", 620, blink >= 1)}
    </div>
  );
};

// ---------- la ventana: línea de tiempo del golpe (ida rapidísima, vuelta lenta) con la franja expuesta resaltada ----------
export const RecoilWindow: React.FC<{ t: number; a: number; b: number; winAt: number }> = ({ t, a, b, winAt }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), d1 = easeOut(k01(t, a + 0.2, a + 0.6)), d2 = ease(k01(t, a + 0.7, a + 2.2)), w = easeOut(k01(t, winAt, winAt + 0.5));
  const X = 260, L = 1400, s1 = 0.12;
  const pulse = 0.75 + 0.25 * Math.sin(t * 8);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <line x1={X} y1={600} x2={X + L * s1 * d1} y2={600} stroke={RED} strokeWidth={30} />
        {d2 > 0 && <line x1={X + L * s1} y1={600} x2={X + L * s1 + L * (1 - s1) * d2} y2={600} stroke="rgba(255,255,255,.55)" strokeWidth={30} />}
        {w > 0 && <rect x={X + L * s1} y={540} width={L * 0.32 * w} height={120} fill="none" stroke={SAND} strokeWidth={6} opacity={pulse} />}
      </svg>
      <div style={{ position: "absolute", left: X, top: 450, fontFamily: COND, fontWeight: 700, fontSize: 48, color: RED2, textShadow: shadow, opacity: d1 }}>STRIKE</div>
      <div style={{ position: "absolute", left: X + L * 0.45, top: 450, fontFamily: COND, fontWeight: 700, fontSize: 48, color: "#fff", textShadow: shadow, opacity: d2 }}>PULL BACK · RE-COIL</div>
      <div style={{ position: "absolute", left: X + L * s1, top: 690, width: L * 0.32, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 64, color: SAND, textShadow: shadow, opacity: w }}>HEAD EXPOSED</div>
    </div>
  );
};

// ---------- tamaño contra tamaño: serpiente de 2 pies contra pájaro de 2 pies que es más de la mitad cola ----------
export const SizeMatch: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), k1 = easeOut(k01(t, a + 0.2, a + 1.0)), k2 = easeOut(k01(t, a + 1.0, a + 1.8)), k3 = easeOut(k01(t, a + 2.2, a + 2.8));
  const X = 360, L = 1200;
  const bar = (y: number, k: number, label: string, parts: { f: number; c: string; txt?: string }[]) => (
    <div style={{ position: "absolute", left: X, top: y }}>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: shadow, opacity: k }}>{label}</div>
      <div style={{ display: "flex", width: L * k, height: 54, marginTop: 10, overflow: "hidden" }}>
        {parts.map((p, n) => <div key={n} style={{ width: `${p.f * 100}%`, background: p.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: COND, fontWeight: 700, fontSize: 32, color: "#111" }}>{p.txt}</div>)}
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {bar(300, k1, "RATTLESNAKE · 2 FT", [{ f: 1, c: RED }])}
      {bar(560, k2, "ROADRUNNER · 2 FT", [{ f: 0.45, c: "#fff", txt: "BIRD" }, { f: 0.55, c: SAND, txt: k3 > 0.5 ? "TAIL" : "" }])}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 80, color: "#fff", textShadow: shadow, opacity: k3 }}>IT DOESN'T FIT</div>
    </div>
  );
};

// ---------- la mañana: dos curvas de temperatura del cuerpo desde el amanecer; el pájaro sube rápido, la serpiente tarde ----------
export const MorningCurves: React.FC<{ t: number; a: number; b: number; gapAt: number }> = ({ t, a, b, gapAt }) => {
  if (t < a || t > b) return null;
  const o = fade(t, a, b), u = ease(k01(t, a + 0.3, a + 3.2)), g = easeOut(k01(t, gapAt, gapAt + 0.6));
  const X = 300, Y = 820, Wd = 1320, Hd = 520, N = 60;
  const bird = (x: number) => 1 - Math.exp(-x * 6.5), snake = (x: number) => 1 / (1 + Math.exp(-(x - 0.62) * 11));
  const pts = (fn: (x: number) => number) => Array.from({ length: Math.max(2, Math.round(N * u)) }, (_, i) => { const x = i / N; return `${X + x * Wd},${Y - (0.12 + 0.8 * fn(x)) * Hd}`; }).join(" ");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <line x1={X} y1={Y} x2={X + Wd} y2={Y} stroke="rgba(255,255,255,.6)" strokeWidth={3} />
        <line x1={X} y1={Y} x2={X} y2={Y - Hd} stroke="rgba(255,255,255,.6)" strokeWidth={3} />
        {g > 0 && <rect x={X + 0.08 * Wd} y={Y - Hd} width={0.42 * Wd * g} height={Hd} fill="rgba(233,196,138,.16)" stroke={SAND} strokeWidth={3} strokeDasharray="10 10" />}
        <polyline points={pts(bird)} fill="none" stroke={RED} strokeWidth={9} strokeLinejoin="round" />
        <polyline points={pts(snake)} fill="none" stroke="#9FD8FF" strokeWidth={9} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: X, top: Y + 16, fontFamily: COND, fontWeight: 500, fontSize: 34, letterSpacing: 6, color: "#fff", textShadow: shadow }}>SUNRISE →</div>
      <div style={{ position: "absolute", left: X + 20, top: Y - Hd - 70, fontFamily: COND, fontWeight: 500, fontSize: 34, letterSpacing: 6, color: "#fff", textShadow: shadow }}>BODY HEAT · SPEED</div>
      <div style={{ position: "absolute", left: X + 0.3 * Wd, top: Y - 0.95 * Hd, fontFamily: COND, fontWeight: 700, fontSize: 54, color: RED2, textShadow: shadow, opacity: k01(t, a + 1.0, a + 1.5) }}>ROADRUNNER</div>
      <div style={{ position: "absolute", left: X + 0.72 * Wd, top: Y - 0.42 * Hd, fontFamily: COND, fontWeight: 700, fontSize: 54, color: "#9FD8FF", textShadow: shadow, opacity: k01(t, a + 2.2, a + 2.7) }}>RATTLESNAKE</div>
      <div style={{ position: "absolute", left: X + 0.08 * Wd, top: Y - Hd - 130, width: 0.42 * Wd, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 60, color: SAND, textShadow: shadow, opacity: g }}>THE BIRD'S HOUR</div>
    </div>
  );
};

// ---------- cierre: placa de caso archivado + adelanto del próximo expediente ----------
export const EndCard: React.FC<{ t: number; a: number; b: number; nextAt: number }> = ({ t, a, b, nextAt }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.4), k = easeOut(k01(t, a + 0.2, a + 0.9)), n = easeOut(k01(t, nextAt, nextAt + 0.6)), st = easeOut(k01(t, a + 1.0, a + 1.3));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 36, letterSpacing: 14, color: RED2, opacity: k }}>APEX FILES · CASE 02</div>
      <div style={{ position: "relative", marginTop: 14 }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 150, color: "#fff", textShadow: shadow, transform: `scale(${lerp(1.15, 1, k)})`, opacity: k }}>GREATER ROADRUNNER</div>
        <div style={{ position: "absolute", right: -40, top: -78, border: `8px solid ${RED}`, color: RED, fontFamily: COND, fontWeight: 700, fontSize: 70, padding: "4px 26px", transform: `rotate(-9deg) scale(${lerp(2.2, 1, st)})`, opacity: st }}>CLOSED</div>
      </div>
      <div style={{ marginTop: 70, opacity: n, transform: `translateY(${(1 - n) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 38, letterSpacing: 10, color: SAND }}>NEXT CASE FILE</div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 72, color: "#fff", textShadow: shadow, marginTop: 8 }}>OCEAN'S TOP KILLER <span style={{ color: RED }}>VS</span> LAND'S TOP KILLER</div>
        <div style={{ display: "inline-block", marginTop: 36, background: RED, color: "#fff", fontFamily: COND, fontWeight: 700, fontSize: 52, padding: "10px 46px", letterSpacing: 4 }}>SUBSCRIBE</div>
      </div>
    </div>
  );
};
