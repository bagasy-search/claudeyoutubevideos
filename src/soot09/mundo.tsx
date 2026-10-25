import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { C } from "./kit";
import { CieloT, Olas, Pino, Cipres, Palmera, tonoEn, Tono } from "./kitj";

// Motor del mundo continuo de soot09: UNA tira horizontal (Londres → Atlántico → Virginia) que la cámara recorre
// durante todo el video. Coordenadas de mundo en px (a zoom 1 la pantalla muestra 1920x1080 alrededor de la cámara).
// Zonas: Londres 0-5600 · Támesis/muelle 5600-7000 · Kent 7000-8600 · Atlántico 8600-19000 (Bermudas 13200-14600)
// · bahía y río James 19000-22800 · isla de Jamestown 22800-26200 · bosque y pueblos Powhatan 26200-31000.
export const SUELO = 900; // línea de tierra
export const AGUA = 880; // nivel del agua
export const Z = {
  londres: [0, 5600], muelle: [5600, 7000], kent: [7000, 8600], mar: [8600, 19000], bermuda: [13200, 14600],
  rio: [19000, 22800], isla: [22800, 26200], bosque: [26200, 31000],
} as const;
export const esTierra = (x: number) =>
  x < 5600 || (x > 13200 && x < 14600) || x > 22800;

// ── cámara por cuadros clave [t, x, y, z]; entre claves, curva suave. Devuelve también la velocidad (para el desenfoque).
export type K = [number, number, number, number];
export const camEn = (ks: K[], t: number) => {
  if (t <= ks[0][0]) return { x: ks[0][1], y: ks[0][2], z: ks[0][3], v: 0 };
  for (let i = 0; i < ks.length - 1; i++) {
    const [ta, xa, ya, za] = ks[i];
    const [tb, xb, yb, zb] = ks[i + 1];
    if (t <= tb) {
      const u = interpolate(t, [ta, tb], [0, 1], { easing: Easing.inOut(Easing.cubic) });
      const lz = Math.log(za) + (Math.log(zb) - Math.log(za)) * u;
      const du = 1 / 30 / Math.max(0.05, tb - ta);
      const u2 = interpolate(Math.min(tb, t + 1 / 30), [ta, tb], [0, 1], { easing: Easing.inOut(Easing.cubic) });
      const v = Math.hypot((xb - xa) * (u2 - u), (yb - ya) * (u2 - u)) * Math.exp(lz) + Math.abs(Math.log(zb / za)) * (u2 - u) * 900;
      void du;
      return { x: xa + (xb - xa) * u, y: ya + (yb - ya) * u, z: Math.exp(lz), v };
    }
  }
  const l = ks[ks.length - 1];
  return { x: l[1], y: l[2], z: l[3], v: 0 };
};
// posición de un actor por cuadros clave [t, x] (o [t, x, y])
export const kx = (ks: number[][], t: number, idx = 1) => {
  if (t <= ks[0][0]) return ks[0][idx];
  for (let i = 0; i < ks.length - 1; i++) {
    if (t <= ks[i + 1][0]) return interpolate(t, [ks[i][0], ks[i + 1][0]], [ks[i][idx], ks[i + 1][idx]], { easing: Easing.inOut(Easing.sin) });
  }
  return ks[ks.length - 1][idx];
};
// ¿está en movimiento? (para animar caminatas)
export const mueve = (ks: number[][], t: number) => {
  for (let i = 0; i < ks.length - 1; i++) if (t > ks[i][0] && t < ks[i + 1][0] && ks[i][1] !== ks[i + 1][1]) return true;
  return false;
};

export const CamCtx = React.createContext({ x: 0, y: 540, z: 1 });
// sólo dibuja lo que cae cerca de la pantalla
export const En: React.FC<{ x: number; w?: number; children: React.ReactNode }> = ({ x, w = 900, children }) => {
  const c = React.useContext(CamCtx);
  const media = 960 / c.z + w;
  if (Math.abs(x - c.x) > media) return null;
  return <>{children}</>;
};

// ── capas lejanas por zona (paralaje f): horizonte de Londres, acantilados de Kent, costa boscosa de Virginia
const Lejos: React.FC<{ cx: number; f: number; t: number; tono: Tono }> = ({ cx, f, t, tono }) => {
  const off = -cx * f;
  const r = React.useMemo(() => rnd(77), []);
  const casas = React.useMemo(() => Array.from({ length: 60 }, (_, i) => [i * 105 + r() * 30, 120 + r() * 160, 70 + r() * 40]), [r]);
  const lejano = f < 0.3;
  const col = lejano ? "#6a6a9a" : "#4a4a7a";
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
      <g transform={`translate(${960 + off} 0)`}>
        {/* Londres: techos, torres y la aguja de la vieja San Pablo */}
        {cx < 7200 && casas.map(([x, h, w], i) => {
          const X = x * (f / 0.3) * 0.9;
          if (Math.abs(X + off) > 1400) return null;
          return <g key={i} opacity={lejano ? 0.55 : 0.8}>
            <rect x={X} y={SUELO - 40 - h} width={w} height={h + 60} fill={col} />
            <path d={`M ${X - 6} ${SUELO - 40 - h} L ${X + w / 2} ${SUELO - 90 - h} L ${X + w + 6} ${SUELO - 40 - h} Z`} fill={col} />
          </g>;
        })}
        {cx < 7200 && lejano && Math.abs(1500 * f / 0.3 * 0.9 + off) < 1500 && <g opacity={0.6}><rect x={1500 * 0.9} y={360} width={90} height={500} fill={col} /><path d={`M ${1500 * 0.9 - 10} 360 L ${1500 * 0.9 + 45} 120 L ${1500 * 0.9 + 100} 360 Z`} fill={col} /></g>}
        {/* acantilados blancos de Kent */}
        {cx > 6000 && cx < 10000 && [7300, 7700, 8100].map((x, i) => { const X = x * f; return Math.abs(X + off) < 1500 ? <path key={i} d={`M ${X - 300} ${AGUA} L ${X - 240} ${AGUA - 220 - i * 30} L ${X + 200} ${AGUA - 240 - i * 20} L ${X + 300} ${AGUA} Z`} fill="#f0ece0" opacity={lejano ? 0.6 : 0.85} /> : null; })}
        {/* costa de Virginia: lomas boscosas */}
        {cx > 17000 && Array.from({ length: 70 }, (_, i) => {
          const X = (18600 + i * 190) * f;
          if (Math.abs(X + off) > 1300) return null;
          const h = 90 + ((i * 53) % 70);
          return <ellipse key={i} cx={X} cy={AGUA - 20} rx={160} ry={h} fill={lejano ? "#3a6a5a" : "#2a5a3a"} opacity={lejano ? 0.55 : 0.9} />;
        })}
      </g>
      {/* niebla del color del cielo, para fundir las capas */}
      <rect x={-4000} y={-3000} width={10000} height={8000} fill={tono.c} opacity={lejano ? 0.25 : 0.08} />
    </svg>
  );
};

// ── el mundo: cielo + capas lejanas + tierra/agua + hijos en coordenadas de mundo + capa cercana
export const Mundo: React.FC<{ t: number; cam: K[]; cielo: [number, string][]; children: React.ReactNode; frente?: React.ReactNode; sinLejos?: boolean; cieloExtra?: React.ReactNode }> = ({ t, cam, cielo, children, frente, sinLejos, cieloExtra }) => {
  const c = camEn(cam, t);
  const tono = tonoEn(cielo, t);
  const blur = Math.min(14, Math.max(0, c.v - 40) / 14);
  const tr = `translate(960px, 540px) scale(${c.z}) translate(${-c.x}px, ${-c.y}px)`;
  const capa = (f: number) => {
    const zf = Math.pow(c.z, f);
    return { transform: `translate(0, ${(540 - c.y) * f * 0.6}px) scale(${zf})`, transformOrigin: "50% 60%" };
  };
  return (
    <CamCtx.Provider value={{ x: c.x, y: c.y, z: c.z }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <CieloT tono={tono} />
        {cieloExtra}
        {!sinLejos && <AbsoluteFill style={capa(0.2)}><Lejos cx={c.x} f={0.2} t={t} tono={tono} /></AbsoluteFill>}
        {!sinLejos && <AbsoluteFill style={capa(0.45)}><Lejos cx={c.x} f={0.45} t={t} tono={tono} /></AbsoluteFill>}
        <AbsoluteFill style={{ filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transform: tr, transformOrigin: "0 0" }}>
            <Suelo t={t} cx={c.x} z={c.z} />
            {children}
            <AguaFrente t={t} cx={c.x} z={c.z} cy={c.y} />
          </div>
        </AbsoluteFill>
        {frente}
        {blur > 2 && <Rafagas t={t} op={Math.min(0.6, blur / 20)} />}
      </AbsoluteFill>
    </CamCtx.Provider>
  );
};

// tierra y agua visibles (se dibujan por tramos alrededor de la cámara)
const Suelo: React.FC<{ t: number; cx: number; z: number }> = ({ t, cx, z }) => {
  const a = Math.floor((cx - 1100 / z) / 100) * 100, b = Math.ceil((cx + 1100 / z) / 100) * 100;
  const tramos: [number, number, boolean][] = [];
  for (let x = a; x < b; x += 100) {
    const tierra = esTierra(x + 50);
    const last = tramos[tramos.length - 1];
    if (last && last[2] === tierra) last[1] = x + 100;
    else tramos.push([x, x + 100, tierra]);
  }
  return (
    <svg style={{ position: "absolute", left: a, top: 0, overflow: "visible" }} width={b - a} height={10}>
      {/* agua de fondo (todo el ancho, debajo de la tierra) */}
      <rect x={0} y={AGUA} width={b - a} height={22000} fill={cx > 8600 && cx < 19000 ? "#1a5aa8" : "#2a6a9a"} />
      <Olas t={t} y={AGUA - 8} dx={a} x0={0} ancho={b - a} color="#3a8ad0" amp={10} largo={300} vel={0.7} />
      {tramos.filter((s) => s[2]).map(([x0, x1], i) => {
        const X0 = x0 - a, X1 = x1 - a;
        const londres = x0 < 5600;
        const virginia = x0 > 22000;
        const col = londres ? "#7a5a4a" : virginia ? "#5a8a3a" : "#e8d090";
        const col2 = londres ? "#5a3e32" : virginia ? "#3e6a28" : "#c8a868";
        return <g key={i}>
          <path d={`M ${X0 - 40} ${SUELO + 60} Q ${X0} ${SUELO - 4} ${X0 + 60} ${SUELO} L ${X1 - 60} ${SUELO} Q ${X1} ${SUELO - 4} ${X1 + 40} ${SUELO + 60} L ${X1 + 40} 22000 L ${X0 - 40} 22000 Z`} fill={col} />
          <rect x={X0} y={SUELO + 40} width={X1 - X0} height={22000} fill={col2} />
          {londres && Array.from({ length: Math.floor((X1 - X0) / 90) }, (_, k) => <rect key={k} x={X0 + k * 90 + ((k * 37) % 20)} y={SUELO + 14 + (k % 3) * 22} width={60} height={14} rx={6} fill="#8a6a58" />)}
          {virginia && Array.from({ length: Math.floor((X1 - X0) / 70) }, (_, k) => <path key={k} d={`M ${X0 + k * 70} ${SUELO + 4} q 8 -26 16 0 q 8 -20 14 0`} fill="#6aa040" />)}
        </g>;
      })}
    </svg>
  );
};
// olitas por delante de barcos y costas (dan profundidad)
const AguaFrente: React.FC<{ t: number; cx: number; z: number; cy: number }> = ({ t, cx, z, cy }) => {
  if (cy > AGUA + 120) return null;
  const a = Math.floor((cx - 1100 / z) / 100) * 100, b = Math.ceil((cx + 1100 / z) / 100) * 100;
  if (esTierra(cx) && esTierra(a + 50) && esTierra(b - 50)) return null;
  // sólo sobre el agua: recorte por tramos (si no, las olas tapan la calle de Londres o la costa)
  const agua: [number, number][] = [];
  for (let x = a; x < b; x += 100) {
    if (esTierra(x + 50)) continue;
    const last = agua[agua.length - 1];
    if (last && last[1] === x) last[1] = x + 100; else agua.push([x, x + 100]);
  }
  const id = `af${Math.round(a)}`;
  return (
    <svg style={{ position: "absolute", left: a, top: 0, overflow: "visible", pointerEvents: "none" }} width={b - a} height={10}>
      <defs><clipPath id={id}>{agua.map(([x0, x1], i) => <rect key={i} x={x0 - a - 30} y={AGUA - 200} width={x1 - x0 + 60} height={600} />)}</clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <Olas t={t} y={AGUA + 30} dx={a + 90} x0={0} ancho={b - a} color="#2a7ac8" amp={12} largo={260} vel={1.1} op={0.85} />
        <Olas t={t} y={AGUA + 90} dx={a + 40} x0={0} ancho={b - a} color="#1a5aa8" amp={14} largo={340} vel={0.9} />
      </g>
    </svg>
  );
};
const Rafagas: React.FC<{ t: number; op: number }> = ({ t, op }) => {
  const r = rnd(Math.floor(t * 10));
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: 22 }, (_, i) => { const y = r() * 1080, x = r() * 1920, l = 200 + r() * 500; return <line key={i} x1={x} y1={y} x2={x + l} y2={y} stroke="#fff" strokeWidth={3 + r() * 5} opacity={op * r()} strokeLinecap="round" />; })}
    </svg>
  );
};

// ── vegetación fija del mundo (se dibuja una vez por zona)
export const Vegetacion: React.FC<{ t: number }> = ({ t }) => {
  const pinos = React.useMemo(() => { const r = rnd(12); const o: [number, number, number][] = []; for (let x = 22900; x < 31000; x += 180 + r() * 220) { if (x < 26150) continue; o.push([x, 0.8 + r() * 0.6, r()]); } return o; }, []);
  return (
    <>
      {pinos.map(([x, s, k], i) => (
        <En key={i} x={x} w={300}>
          {k < 0.3 ? <Cipres x={x} y={SUELO - 300 * s} s={s} /> : <Pino x={x} y={SUELO - 190 * s} s={s} color={k < 0.6 ? "#1f6a3a" : "#2a7a44"} />}
        </En>
      ))}
      {[13350, 13700, 14150, 14450].map((x, i) => <En key={i} x={x}><Palmera t={t} x={x} y={SUELO - 230} s={0.9 + (i % 2) * 0.2} /></En>)}
    </>
  );
};
export { C };
