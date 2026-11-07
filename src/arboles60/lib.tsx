// arboles60 — motor de animación determinista: todo cuadro = f(t). Utilidades reusables.
import React from "react";

export const W = 1920, H = 1080, FPS = 60;
export const END = 73.14; // s (fin de la voz + cola)

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const mix = (t: number, a: number, b: number, v0: number, v1: number, e: (k: number) => number = eio) => lerp(v0, v1, e(prog(t, a, b)));

// curvas
export const eio = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const eo = (k: number) => 1 - Math.pow(1 - k, 3);
export const ei = (k: number) => k * k * k;
export const es = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;
export const eback = (k: number) => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };

// resorte amortiguado (0→1 con sobrepaso). f = Hz, d = amortiguación. Objetos pesados: f baja.
export const spr = (t: number, t0: number, f = 2.2, d = 7) => {
  const x = t - t0; if (x <= 0) return 0;
  return 1 - Math.exp(-d * x) * Math.cos(2 * Math.PI * f * x);
};
// rebote que vuelve a 0 (para aplastar/estirar al aterrizar)
export const wob = (t: number, t0: number, f = 3, d = 8) => {
  const x = t - t0; if (x <= 0) return 0;
  return Math.exp(-d * x) * Math.sin(2 * Math.PI * f * x);
};
// entrada con anticipación: baja un poco antes de t0 y después salta con resorte
export const antic = (t: number, t0: number, pre = 0.18, amt = 0.12, f = 2.2, d = 7) => {
  if (t < t0 - pre) return 0;
  if (t < t0) return -amt * Math.sin((Math.PI / 2) * prog(t, t0 - pre, t0));
  return spr(t, t0, f, d) * (1 + amt) - amt * Math.exp(-12 * (t - t0));
};

// pseudoaleatorio estable
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const rr = (i: number, a: number, b: number) => lerp(a, b, rnd(i));

// parpadeo cada 2,5-4 s (cierre 0,14 s)
export const blink = (t: number, seed: number) => {
  let tk = 0.8 + rnd(seed) * 1.5;
  for (let k = 0; k < 60 && tk < t + 0.2; k++) {
    const d = t - tk;
    if (d > -0.07 && d < 0.07) return 1 - Math.abs(d) / 0.07;
    tk += 2.5 + 1.5 * rnd(seed * 31 + k);
  }
  return 0;
};

// ruido suave (respiración, flotación)
export const nz = (t: number, seed: number, hz = 0.3) =>
  Math.sin(t * hz * 6.283 + seed) * 0.6 + Math.sin(t * hz * 2.7 * 6.283 + seed * 2.1) * 0.4;

// cámara 2D virtual con paralaje
export type Cam = { x: number; y: number; z: number; r?: number };
export const Layer: React.FC<{ cam: Cam; d: number; children?: React.ReactNode }> = ({ cam, d, children }) => {
  const z = 1 + (cam.z - 1) * d;
  return (
    <g transform={`translate(${W / 2} ${H / 2}) rotate(${(cam.r || 0) * d}) scale(${z}) translate(${-W / 2 - cam.x * d} ${-H / 2 - cam.y * d})`}>
      {children}
    </g>
  );
};

// una escena = un SVG completo
export const Stage: React.FC<{ children?: React.ReactNode; bg: string }> = ({ children, bg }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, background: bg }}>
    {children}
  </svg>
);

// paleta
export const C = {
  deep: "#09134B", deep2: "#180A59", royal: "#243CDB", purple: "#6535A8", teal: "#22D7DA", cyan: "#33B9D7",
  orange: "#FF851D", pink: "#ED4BA4", yellow: "#FFD244", light: "#8CAAF7", ink: "#0B1440", white: "#FFFFFF",
  leaf: "#3FB55A", leaf2: "#2C9A55", leaf3: "#6BD96B",
};

export const FONT = "Montserrat, Poppins, Arial, sans-serif";

// estrella de 5 puntas centrada en 0,0 (para morfear a árbol: mismo número de puntos)
export const starPath = (r: number, ri = r * 0.45) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? ri : r;
    d += `${i ? "L" : "M"}${(Math.cos(a) * rad).toFixed(2)} ${(Math.sin(a) * rad).toFixed(2)} `;
  }
  return d + "Z";
};
// pino con 10 vértices (base en y=0, punta arriba) — morfeable con starPath
export const pinePath = (h: number) => {
  const w = h * 0.42;
  const P: [number, number][] = [
    [0, -h], [w * 0.42, -h * 0.62], [w * 0.22, -h * 0.62], [w * 0.75, -h * 0.28], [w * 0.4, -h * 0.28],
    [w, 0], [-w, 0], [-w * 0.4, -h * 0.28], [-w * 0.75, -h * 0.28], [-w * 0.42, -h * 0.62],
  ];
  // reordenar para que coincida con la estrella (punta arriba primero, en sentido horario)
  return P.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ") + " Z";
};
export const lerpPoly = (a: string, b: string, k: number) => {
  const pa = a.match(/-?\d+(\.\d+)?/g)!.map(Number), pb = b.match(/-?\d+(\.\d+)?/g)!.map(Number);
  let d = "";
  for (let i = 0; i < pa.length; i += 2) d += `${i ? "L" : "M"}${lerp(pa[i], pb[i], k).toFixed(2)} ${lerp(pa[i + 1], pb[i + 1], k).toFixed(2)} `;
  return d + "Z";
};

// número con separador de miles a la española
export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// texto con entrada de resorte
export const PopText: React.FC<{ t: number; t0: number; x: number; y: number; size: number; color: string; children: React.ReactNode;
  weight?: number; anchor?: "start" | "middle" | "end"; out?: number; shadow?: string; ls?: number }> =
  ({ t, t0, x, y, size, color, children, weight = 800, anchor = "middle", out, shadow, ls = 0 }) => {
    const s = spr(t, t0, 2.4, 8);
    const o = clamp((t - t0) / 0.12) * (out ? 1 - prog(t, out, out + 0.3) : 1);
    if (o <= 0) return null;
    return (
      <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`} opacity={o}>
        {shadow && <text x={0} y={size * 0.06} fontFamily={FONT} fontWeight={weight} fontSize={size} fill={shadow} textAnchor={anchor} letterSpacing={ls}>{children}</text>}
        <text x={0} y={0} fontFamily={FONT} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} letterSpacing={ls}>{children}</text>
      </g>
    );
  };

// partículas flotantes (polen, luciérnagas, polvo)
export const Motes: React.FC<{ t: number; n: number; seed: number; color: string; r?: [number, number]; area?: [number, number, number, number]; glow?: boolean; speed?: number; op?: number }> =
  ({ t, n, seed, color, r = [2, 5], area = [-200, -100, 2320, 1180], glow, speed = 1, op = 0.8 }) => (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const s = seed * 1000 + i;
        const x = area[0] + rnd(s) * (area[2] - area[0]) + Math.sin(t * 0.4 * speed + s) * 30;
        const yy = area[1] + ((rnd(s + 7) * (area[3] - area[1]) - t * 18 * speed * rr(s + 3, 0.4, 1.2)) % (area[3] - area[1]) + (area[3] - area[1])) % (area[3] - area[1]);
        const rad = rr(s + 1, r[0], r[1]);
        const tw = 0.55 + 0.45 * Math.sin(t * rr(s + 2, 1.5, 4) + s);
        return (
          <g key={i} opacity={op * tw}>
            {glow && <circle cx={x} cy={yy} r={rad * 3.2} fill={color} opacity={0.18} />}
            <circle cx={x} cy={yy} r={rad} fill={color} />
          </g>
        );
      })}
    </g>
  );

// mancha de luz suave (glow sin filtros caros)
export const Glow: React.FC<{ id: string; x: number; y: number; r: number; color: string; op?: number }> = ({ id, x, y, r, color, op = 1 }) => (
  <g opacity={op}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={0.85} />
        <stop offset="0.35" stopColor={color} stopOpacity={0.35} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);
