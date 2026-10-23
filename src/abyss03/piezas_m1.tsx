// abyss03 · MINUTO 1 (0–66 s): UN mundo continuo, UNA cámara. Todo cuelga del segundo GLOBAL t (frases.json):
// a ras del agua (vos con el chaleco, el barco que se va hasta ser una luz y desaparecer, el cronómetro desde que caíste)
// → la cámara sube sin cortar hasta ver el planeta entero: tu punto en el mar y los cinco océanos.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "../abysskit/lib";
import { FONT } from "../abysskit/kit";
import { MAPS } from "../abysskit/maps";
import { O, SV, mix, rnd } from "../abysskit/ocean";

const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.001, b - a)));
const sm = (t: number, a: number, b: number) => { const k = k01(t, a, b); return k * k * (3 - 2 * k); };
const pw = (x: number, X: number[], Y: number[]) => {
  if (x <= X[0]) return Y[0];
  for (let i = 1; i < X.length; i++) if (x <= X[i]) return Y[i - 1] + ((Y[i] - Y[i - 1]) * (x - X[i - 1])) / (X[i] - X[i - 1]);
  return Y[Y.length - 1];
};
const JACKET = "#ff7a1a", HZ = 598;

// el reloj del relato: segundos desde que caíste (la voz comprime: a los 17,4 s ya pasó 1 minuto, a los 20 s cinco)
const clock = (t: number) => pw(t, [0, 13.7, 17.4, 19.96, 21.74, 37.5], [0, 14, 60, 300, 330, 420]);
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// vos en el agua, DE ESPALDAS y a contraluz de la luna: silueta de la cabeza mojada con el borde de luz,
// hombros del chaleco con la cinta reflectiva que agarra la luz del barco. Sin cara: mirás con él cómo se va el barco.
const Swimmer: React.FC<{ x: number; y: number; s: number; t: number; glow: number }> = ({ x, y, s, t, glow }) => {
  const rise = 1 - sm(t, 10.3, 11.0), cough = t > 10.7 && t < 12.4 ? ((t - 10.7) * 2.2) % 1 : 0;
  const b = Math.sin(t * 2.1) * 8 * s + rise * 420 * s, tilt = Math.sin(t * 1.3) * 2.5 + cough * 6;
  return <svg width={900 * s} height={700 * s} viewBox="-450 -420 900 700" style={{ position: "absolute", left: x - 450 * s, top: y - 420 * s + b, overflow: "visible" }}>
    <defs>
      <linearGradient id="jk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9661a" /><stop offset="0.55" stopColor="#8a3a0c" /><stop offset="1" stopColor="#2a1206" /></linearGradient>
      <radialGradient id="hd" cx="0.35" cy="0.25" r="0.9"><stop offset="0" stopColor="#2a3644" /><stop offset="0.5" stopColor="#0c1219" /><stop offset="1" stopColor="#05080c" /></radialGradient>
      <filter id="bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>
    <g transform={`rotate(${tilt})`}>
      {/* hombros y chaleco (la parte de abajo queda bajo el agua) */}
      <path d="M-330,260 Q-340,40 -170,-30 Q-90,-62 0,-64 Q90,-62 170,-30 Q340,40 330,260 Z" fill="url(#jk)" />
      <path d="M-170,-30 Q-90,-62 0,-64 Q90,-62 170,-30" stroke="#ffb06a" strokeWidth={5} fill="none" opacity={0.55} />
      {/* cinta reflectiva: brilla con la luz del barco */}
      <path d="M-300,120 Q0,150 300,120" stroke="#eaf6ff" strokeWidth={22} fill="none" opacity={0.35 + 0.55 * glow} filter="url(#bl)" />
      <path d="M-300,120 Q0,150 300,120" stroke="#dfeaf2" strokeWidth={14} fill="none" opacity={0.75} />
      <path d="M-60,-60 Q-70,40 -64,140 M60,-60 Q70,40 64,140" stroke="#5a2408" strokeWidth={10} fill="none" opacity={0.8} />
      {/* cuello del chaleco y nuca */}
      <path d="M-120,-40 Q-120,-130 0,-140 Q120,-130 120,-40 Q60,-70 0,-72 Q-60,-70 -120,-40 Z" fill="#b8520f" />
      <path d="M-46,-120 L-40,-60 L40,-60 L46,-120 Z" fill="#101820" />
      {/* cabeza mojada en silueta, borde de luna arriba a la izquierda */}
      <path d="M-70,-110 Q-84,-150 -86,-200 Q-90,-290 -20,-318 Q40,-330 78,-284 Q96,-250 90,-196 Q86,-150 70,-110 Q0,-92 -70,-110 Z" fill="url(#hd)" />
      <path d={`M-86,-226 ${Array.from({ length: 14 }).map((_, i) => { const a = Math.PI * (1.08 + i * 0.062); return `L${Math.cos(a) * (92 + (i % 2) * 3)},${-212 + Math.sin(a) * (110 + (i % 2) * 3)}`; }).join(" ")}`} stroke="#b7cde0" strokeWidth={5} fill="none" opacity={0.8} strokeLinejoin="round" />
      <path d="M-88,-236 Q-92,-200 -84,-170" stroke="#7d97b0" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M-88,-216 Q-112,-206 -104,-176 Q-98,-160 -84,-164 Z" fill="#0a0f15" /><path d="M88,-216 Q112,-206 104,-176 Q98,-160 84,-164 Z" fill="#0a0f15" />
      <path d="M-104,-210 Q-110,-196 -102,-182" stroke="#8aa4bc" strokeWidth={3} fill="none" opacity={0.6} />
      {/* mechones pegados y gotas que corren */}
      {[-50, -20, 14, 44].map((hx, i) => <path key={i} d={`M${hx},-312 Q${hx - 8},-270 ${hx - 4},-236`} stroke="#3a4c60" strokeWidth={3} fill="none" opacity={0.7} />)}
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-70 + i * 34} cy={-170 + ((t * 70 + i * 23) % 120)} r={3.5} fill="#cfe4f2" opacity={0.75} />)}
      {/* tos: agua que sale despedida hacia adelante */}
      {cough > 0 && [0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={"c" + i} cx={(i - 3) * 22 * (1 + cough)} cy={-250 - 120 * Math.sin(cough * 3.14) + i * 4} r={5} fill="#d8ecf6" opacity={0.85 * (1 - cough)} />)}
    </g>
  </svg>;
};

// el barco que se va, en silueta contra el cielo de luna: ventanas cálidas con su reflejo largo en el agua
const ShipAway: React.FC<{ x: number; s: number; t: number }> = ({ x, s, t }) => {
  if (s < 0.05) return null;
  const lights: [number, number, string, number][] = [];
  for (let i = 0; i < 16; i++) lights.push([170 + i * 36, -70, "#ffd27a", 7]);
  for (let i = 0; i < 6; i++) lights.push([430 + i * 38, -180, "#ffe2a0", 7]);
  lights.push([545, -290, "#ffffff", 9], [880, -10, "#ff3a2a", 8], [20, -10, "#30ff8a", 7]);
  return <>
    {/* reflejos en el agua (debajo del barco) */}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {lights.filter((_, i) => i % 3 === 0 || i > 21).map(([lx, ly, c], i) => { const px = x - 450 * s + lx * s;
        return <g key={i} opacity={0.55 * Math.min(1, s * 2)}>{Array.from({ length: 9 }).map((_, j) => <rect key={j} x={px - (3 + j * 0.6) * s * 2 + Math.sin(t * 3 + j + i) * 4 * s} y={HZ + 8 + j * 26 * Math.max(0.35, s)} width={(6 + j) * s * 2} height={5} fill={c} opacity={(1 - j / 9) * (0.6 + 0.4 * Math.sin(t * 5 + j * 1.7 + i))} />)}</g>; })}
    </svg>
    <svg width={900 * s} height={420 * s} viewBox="0 -320 900 440" style={{ position: "absolute", left: x - 450 * s, top: HZ - 300 * s + 14 * s, overflow: "visible" }}>
      <defs><filter id="lb" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5" /></filter></defs>
      <path d="M0,0 L900,0 L850,100 L50,100 Z" fill="#070a0e" />
      <rect x={160} y={-110} width={600} height={110} fill="#0a0e13" /><rect x={410} y={-220} width={260} height={110} fill="#0a0e13" />
      <rect x={530} y={-300} width={30} height={80} fill="#0a0e13" /><line x1={545} y1={-300} x2={545} y2={-320} stroke="#0a0e13" strokeWidth={4} />
      {/* borde de luna sobre la cubierta */}
      <path d="M0,0 L900,0 M160,-110 L760,-110 M410,-220 L670,-220" stroke="#5f7890" strokeWidth={3} opacity={0.6} />
      {lights.map(([lx, ly, c, r], i) => <g key={i}><circle cx={lx} cy={ly} r={r * 2.4} fill={c} opacity={0.35} filter="url(#lb)" /><rect x={lx - r} y={ly - r * 0.7} width={r * 2} height={r * 1.4} fill={c} opacity={i > 21 ? 0.6 + 0.4 * Math.sin(t * 6 + i) : 0.9} /></g>)}
    </svg>
  </>;
};

const OC: [string, number[], string][] = [["PACIFIC", [0.5, 0.5263], "pac"], ["ATLANTIC", [0.8333, 0.40], "atl"], ["INDIAN", [0.1667, 0.6579], "ind"], ["ARCTIC", [0.62, 0.07], "arc"], ["SOUTHERN", [0.55, 0.93], "sou"]];
const YOU = [0.585, 0.47];

export const Adrift: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame(), t = t0 + f / FPS;
  // fase del agua (0–39 s) → subida al planeta (37,6–40 s)
  const up = sm(t, 37.6, 39.2), mapOn = sm(t, 38.2, 39.0);
  const shipS = pw(t, [0, 11.7, 13.7, 17.4, 19.96], [1.15, 1.0, 0.8, 0.22, 0.05]), shipX = pw(t, [0, 11.7, 17.4, 19.96], [1560, 1580, 1620, 1600]);
  const light = t > 18.6 ? sm(t, 18.6, 19.6) * (1 - sm(t, 20.6, 21.7)) : 0;
  const glow = sm(t, 21.9, 22.8) * (1 - sm(t, 25.4, 26.2));
  // la ola grande que te tapa un instante (frase 3, salís tosiendo) y el balanceo de la cámara
  const roll = Math.sin(t * 0.9) * 1.6 * (1 - up), heave = Math.sin(t * 1.3) * 14 * (1 - up);
  const secs = clock(t);
  // mapa: zoom desde tu punto (×28) hasta el planeta entero
  const m = MAPS.world, W = 1640, H = W / m.ar, X = (1920 - W) / 2, Y = (1080 - H) / 2;
  const P = (p: number[]): [number, number] => [X + p[0] * W, Y + p[1] * H];
  const z = Math.exp(Math.log(28) * (1 - sm(t, 38.0, 40.2))), [yx, yy] = P(YOU);
  const ask = k01(t, 37.6, 38.6), dm = sm(t, 44.6, 45.6) * (1 - sm(t, 49.0, 49.6)), five = sm(t, 49.5, 50.4), guess = sm(t, 57.9, 58.8);
  const spin = Math.floor(t * 6) % 5;
  return (
    <AbsoluteFill style={{ background: "#081a2c", overflow: "hidden" }}>
      {/* ---------- a ras del agua ---------- */}
      {up < 1 && <AbsoluteFill style={{ opacity: 1 - mapOn, transform: `translateY(${heave}px) rotate(${roll}deg) scale(${1 - 0.3 * up})`, transformOrigin: "760px 700px" }}>
        {/* plato REAL: mar de noche con la luna y su camino de luz (Pexels), un poco levantado */}
        <AbsoluteFill style={{ transform: "scale(1.12)", transformOrigin: "50% 30%" }}>
          <OffthreadVideo src={staticFile("abyss03/real/night_32597068.mp4")} muted playbackRate={0.36} startFrom={Math.max(0, Math.round((t0 - 9.8) * FPS * 0.36))} style={{ width: 1920, height: 1080, filter: "brightness(1.35) saturate(0.7) hue-rotate(-12deg)" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,40,70,.35) 0%, rgba(10,25,45,.0) 45%, rgba(4,14,26,.45) 100%)" }} />
        <ShipAway x={shipX} s={shipS} t={t} />
        {light > 0 && <div style={{ position: "absolute", left: shipX - 8, top: HZ - 8, width: 16, height: 16, borderRadius: 8, background: "#fff6c8", opacity: light, boxShadow: "0 0 40px 18px rgba(255,240,180,.75)" }} />}
        {/* destellos de luna en las olas cercanas */}
        <SV>{Array.from({ length: 90 }).map((_, i) => { const yy0 = 640 + rnd(i, 71) * 440, cx = 990 + (rnd(i, 72) - 0.5) * (300 + (yy0 - 600) * 1.6), ph = Math.sin(t * (2 + rnd(i, 73) * 3) + i);
          return <ellipse key={i} cx={cx + Math.sin(t + i) * 10} cy={yy0} rx={6 + (yy0 - 600) * 0.05} ry={1.6 + (yy0 - 600) * 0.006} fill="#e6eef6" opacity={Math.max(0, ph) * 0.55 * (1 - up)} />; })}</SV>
        <Swimmer x={560} y={930} s={1.3} t={t} glow={Math.max(glow, light)} />
        {/* el agua a la altura del pecho, de lado a lado: negra-azul con el borde que agarra la luna */}
        <SV><defs><linearGradient id="wch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d2a40" stopOpacity="0.92" /><stop offset="1" stopColor="#020a12" /></linearGradient></defs>
          <path d={`M-40,1100 L-40,1000 ${Array.from({ length: 42 }).map((_, i) => `L${i * 50},${1000 + Math.sin(i * 0.6 + t * 2.2) * 12 + Math.sin(i * 0.23 - t) * 9}`).join(" ")} L2000,1000 L2000,1100 Z`} fill="url(#wch)" />
          <path d={`M-40,1000 ${Array.from({ length: 42 }).map((_, i) => `L${i * 50},${1000 + Math.sin(i * 0.6 + t * 2.2) * 12 + Math.sin(i * 0.23 - t) * 9}`).join(" ")}`} stroke="#8fb0c8" strokeWidth={3} fill="none" opacity={0.45} />
          {[0, 1, 2].map((i) => { const k = (t * 0.45 + i / 3) % 1; return <ellipse key={i} cx={560} cy={1006} rx={330 + k * 420} ry={18 + k * 26} fill="none" stroke="#b8d0e2" strokeWidth={3} opacity={0.4 * (1 - k)} />; })}
          {t > 10.3 && t < 11.8 && Array.from({ length: 30 }).map((_, i) => { const k = k01(t, 10.3, 11.8), a = (i / 30) * Math.PI;
            return <circle key={i} cx={560 + Math.cos(a) * 380 * k * (0.6 + rnd(i, 5) * 0.6)} cy={880 - Math.sin(a) * 420 * k + 560 * k * k} r={5 + rnd(i, 6) * 9} fill="#dcecf6" opacity={0.9 * (1 - k)} />; })}
        </SV>
        {glow > 0 && <div style={{ position: "absolute", left: 1000, top: 610, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: O.ink, opacity: glow, textShadow: "0 4px 24px rgba(0,0,0,.6)" }}>you will float <span style={{ color: "#7dff9a" }}>✓</span></div>}
        {/* rótulos del barco: "1 minute" → "5 minutes · gone" */}
        <div style={{ position: "absolute", right: 230, top: 150, textAlign: "right", fontFamily: FONT, fontWeight: 900, color: O.ink, textShadow: "0 4px 24px rgba(0,0,0,.6)" }}>
          <div style={{ fontSize: 56, opacity: sm(t, 14.2, 15.0) * (1 - sm(t, 17.2, 17.6)) }}>nobody on deck saw you</div>
          <div style={{ fontSize: 56, marginTop: -64, opacity: sm(t, 17.6, 18.2) * (1 - sm(t, 19.8, 20.2)) }}>1 minute · a light</div>
          <div style={{ fontSize: 56, marginTop: -64, opacity: sm(t, 20.2, 20.8) * (1 - sm(t, 24.0, 24.6)) }}>5 minutes · gone</div>
        </div>
      </AbsoluteFill>}
      {/* ---------- el planeta: la cámara sigue subiendo ---------- */}
      {mapOn > 0 && <AbsoluteFill style={{ opacity: mapOn, background: "radial-gradient(ellipse at 50% 45%, #14385a 0%, #081a2c 70%, #050f1a 100%)" }}>
        <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${yx}px ${yy}px` }}>
          <Img src={staticFile("abyss03/map/world_sat.png")} style={{ position: "absolute", left: X, top: Y, width: W, height: H }} />
        </AbsoluteFill>
        {/* los cinco océanos (posiciones con el mismo zoom) */}
        {OC.map(([n, p, key], i) => { const [x0, y0] = P(p), x = yx + (x0 - yx) * z, y = yy + (y0 - yy) * z;
          const warm = key === "ind", cold = key === "sou", hot = guess > 0 ? (spin === i ? 1 : 0.25) : 1;
          const kk = sm(t, 39.6 + i * 0.25, 40.2 + i * 0.25);
          const col = dm > 0 && warm ? O.gold : dm > 0 && cold ? O.red : O.ink;
          return <React.Fragment key={n}>
            {dm > 0 && (warm || cold) && <div style={{ position: "absolute", left: x - 130, top: y - 130, width: 260, height: 260, borderRadius: 130, background: `radial-gradient(circle, ${warm ? "rgba(233,199,98,.55)" : "rgba(255,59,48,.55)"} 0%, transparent 70%)`, opacity: dm }} />}
            <div style={{ position: "absolute", left: x - 12, top: y - 12, width: 24, height: 24, borderRadius: 12, background: col, opacity: kk * hot, boxShadow: `0 0 22px ${col}` }} />
            <div style={{ position: "absolute", left: x - 300, width: 600, top: cold ? y - 64 - (dm > 0 ? 84 : 0) : y + 22, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 3, color: col, opacity: kk * hot, textShadow: "0 3px 16px rgba(0,0,0,.9)" }}>
              {n}
              {dm > 0 && warm && <div style={{ fontSize: 70, opacity: dm }}>DAYS</div>}
              {dm > 0 && cold && <div style={{ fontSize: 70, opacity: dm }}>≈ {mmss(Math.max(0, 180 - (t - 46.2) * 18))}</div>}
            </div>
            {five > 0 && guess === 0 && <div style={{ position: "absolute", left: x - 26, top: y - 84, width: 52, height: 52, borderRadius: 26, border: `4px solid ${O.ink}`, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: O.ink, display: "flex", alignItems: "center", justifyContent: "center", opacity: five * sm(t, 49.5 + i * 0.3, 50 + i * 0.3) }}>?</div>}
          </React.Fragment>; })}
        {/* vos: el punto naranja que late donde caíste */}
        <div style={{ position: "absolute", left: yx - 14, top: yy - 14, width: 28, height: 28, borderRadius: 14, background: JACKET, boxShadow: `0 0 0 ${10 + 8 * Math.sin(t * 5)}px rgba(255,122,26,.25)` }} />
        <div style={{ position: "absolute", left: yx - 560, width: 530, textAlign: "right", top: yy - 30, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: JACKET, opacity: ask * (1 - five), textShadow: "0 3px 16px rgba(0,0,0,.9)" }}>you · but which ocean?</div>
        {guess > 0 && <div style={{ position: "absolute", left: 230, top: 750, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: O.red, opacity: guess, textShadow: "0 0 40px rgba(255,59,48,.45)" }}>#1 = <span style={{ color: O.ink }}>?</span></div>}
      </AbsoluteFill>}
      {t > 37.4 && t < 40.2 && <AbsoluteFill style={{ pointerEvents: "none" }}>{Array.from({ length: 9 }).map((_, i) => { const k = k01(t, 37.5 + i * 0.12, 39.4 + i * 0.12);
        return <div key={i} style={{ position: "absolute", left: rnd(i, 61) * 1700 - 200, top: 1200 - k * 1900 + rnd(i, 62) * 300, width: 700 + rnd(i, 63) * 500, height: 260 + rnd(i, 64) * 160, borderRadius: "50%", background: "#e8eef2", opacity: 0.85 * Math.sin(k * Math.PI), filter: "blur(30px)" }} />; })}</AbsoluteFill>}
      {/* el cronómetro desde que caíste: sigue corriendo en las dos escalas */}
      <div style={{ position: "absolute", right: 220, bottom: 100, textAlign: "right", fontFamily: FONT, fontWeight: 900, color: O.ink, opacity: sm(t, 10.4, 11.2) * (1 - sm(t, 37.6, 38.4)), textShadow: "0 4px 24px rgba(0,0,0,.7)" }}>
        <div style={{ fontSize: 30, color: O.dim, letterSpacing: 4 }}>IN THE WATER</div>
        <div style={{ fontSize: 120, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{mmss(secs)}</div>
      </div>
      {/* sal en la lente */}
      <SV>{Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={rnd(i, 31) * 1920} cy={rnd(i, 32) * 1080} r={4 + rnd(i, 33) * 8} fill="#dff3f8" opacity={0.08 * (1 - up)} />)}</SV>
    </AbsoluteFill>
  );
};
