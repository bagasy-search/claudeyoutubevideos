// v5d · vuelta 5 de lc01 (P15-P29, escenas < 8): piezas nuevas (sólo las usa lc01_planos1).
// - CortesF: sub-tomas internas con fundido CORTO de 8 cuadros en curva seno (ni corte que mida tirón ni fantasma largo).
// - ListaV5: la lista de lugares (P18) grande, en el cielo, cada casilla entra con resorte SÓLO en su toma (sin fantasma).
// - VidrioAutoV5: el vidrio del auto (P16): palma APOYADA en el vidrio (se aplasta, vaho que crece) y el reflejo de la cara
//   de Theo a opacidad 0,2 recortado al vidrio y centrado en la mano; la manga de la campera colgando del asiento.
// - CuadernoHoyV5: el cuaderno de hoy (P21) con la mano de la vara (ManoV3: manga con puño y pliegues, dedos en pinza).
// - ManoInterruptorV5: el inserto del interruptor (P29) con la mano que baja/sube a la tecla en curva (antes saltaba 120 px).
// - VaporNariz: el vapor del café que se curva hacia la nariz de Theo (P19).
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { F_MONO } from "../hud";
import { Interruptor, rampa } from "./lc01_planos1_comp";
import { luzEn, ManoV3 } from "./v3b_v3";
import { ManoDedos } from "./v4b_v4";

const seno = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.sin) };

// ---------------------------------------------------------------------------------------------------------------
export const CortesF: React.FC<{ en: [number, React.ReactNode][]; d?: number }> = ({ en, d = 8 }) => {
  const f = useF();
  let i = 0;
  for (let j = 0; j < en.length; j++) if (f >= en[j][0]) i = j;
  const cur = en[i];
  if (i === 0 || f >= cur[0] + d) return <AbsoluteFill>{cur[1]}</AbsoluteFill>;
  const o = interpolate(f, [cur[0], cur[0] + d], [0, 1], seno);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{en[i - 1][1]}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: o }}>{cur[1]}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// lista tildable grande (pantalla), centrada en x; cada ítem aparece en `f` (resorte) y se tacha en `x`
export const ListaV5: React.FC<{ cx: number; y: number; items: { t: string; f: number; x?: number }[]; tam?: number }> = ({ cx, y, items, tam = 58 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const caja = Math.round(tam * 0.72);
  return (
    <div style={{ position: "absolute", left: cx, top: y, transform: "translateX(-50%)", display: "flex", gap: 22 }}>
      {items.map((it, i) => {
        const vis = f >= it.f;
        const s = vis ? spring({ frame: f - it.f, fps, config: { damping: 13, stiffness: 140 } }) : 0;
        const o = vis ? Math.min(1, (f - it.f) / 8) : 0;
        const t = it.x !== undefined ? rampa(f, it.x, it.x + 10) : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: o, transform: `translateY(${(1 - s) * -26}px) scale(${0.8 + 0.2 * s})`, background: "#fdf6d8", borderRadius: 14, padding: `10px 26px`, boxShadow: "0 8px 20px rgba(0,0,0,0.45)", border: "3px solid #1d3a8a", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, lineHeight: 1.1, color: "#1d3a8a", whiteSpace: "nowrap" }}>
            <div style={{ width: caja, height: caja, border: "6px solid #1d3a8a", borderRadius: 6, position: "relative", flex: "none" }}>
              {t > 0 && <svg width={caja + 24} height={caja + 24} style={{ position: "absolute", left: -18, top: -18 }}>
                <path d={`M8,8 L${8 + (caja + 8) * Math.min(1, t * 2)},${8 + (caja + 8) * Math.min(1, t * 2)}`} stroke="#d8382c" strokeWidth={9} strokeLinecap="round" />
                {t > 0.5 && <path d={`M${caja + 16},8 L${caja + 16 - (caja + 8) * (t * 2 - 1)},${8 + (caja + 8) * (t * 2 - 1)}`} stroke="#d8382c" strokeWidth={9} strokeLinecap="round" />}
              </svg>}
            </div>
            {it.t}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 16 · el vidrio de la puerta visto desde afuera: el reflejo de Theo (0,2, recortado al vidrio) y su palma que se APOYA
export const VidrioAutoV5: React.FC<{ e0: number; refl: number; palma: number }> = ({ e0, refl, palma }) => {
  const f = useF();
  const z = 1 + rampa(f, e0, e0 + 200, false) * 0.1;
  const r = rampa(f, refl, refl + 18) * 0.13;
  // la palma llega en 16 cuadros, se aplasta contra el vidrio (1,06 → 1) y queda quieta
  const m = rampa(f, palma, palma + 16);
  const apl = f < palma + 16 ? 1 : 1 + 0.06 * Math.exp(-(f - palma - 16) / 4) * Math.cos((f - palma - 16) / 2);
  const vaho = rampa(f, palma + 12, palma + 80);
  const px = 1250, py = 300; // la palma (centro), sobre el vidrio, a la altura de la frente de la cara reflejada
  const cx = 1010, cy = 380; // la cara reflejada (a la izquierda del volante)
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "900px 600px" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="v5dVidrio"><rect x={70} y={50} width={1820} height={960} rx={60} /></clipPath></defs>
        {/* la manga derecha de la campera cuelga por el borde del asiento, con puño elástico */}
        <g transform="translate(600,770) rotate(-4)">
          <path d="M150,30 Q236,40 250,110 L262,210 Q200,226 168,214 L160,120 Q150,70 110,62 Z" fill="#5a6c42" stroke="#4a5838" strokeWidth={4} />
          <rect x={164} y={196} width={100} height={34} rx={10} fill="#3e4a30" transform="rotate(-6 214 213)" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={176 + i * 22} y={200} width={5} height={26} fill="#2f3824" transform="rotate(-6 214 213)" />)}
        </g>
        <g clipPath="url(#v5dVidrio)">
          {/* reflejo: silueta de la cara de Theo con el gorro, en el vidrio */}
          {r > 0.004 && <g opacity={r} transform={`translate(${cx + (z - 1) * 60},${cy})`}>
            {/* en un vidrio el reflejo se ve CLARO: hombros, cara, gorro y ojos en tonos pálidos, con un brillo que lo cruza */}
            <path d="M-330,700 Q-260,250 0,236 Q260,250 330,700 Z" fill="#ffd2b8" />
            <circle cx={0} cy={0} r={190} fill="#dfe6f2" />
            <path d="M-192,-34 Q-180,-226 0,-232 Q180,-226 192,-34 Z" fill="#ffb4a4" />
            <rect x={-200} y={-62} width={400} height={52} rx={24} fill="#ffffff" />
            <ellipse cx={-62} cy={40} rx={32} ry={38} fill="#5a6070" /><ellipse cx={62} cy={40} rx={32} ry={38} fill="#5a6070" />
          </g>}
          {r > 0.004 && <path d={`M${cx - 260},${cy + 420} L${cx - 60},${cy - 300} L${cx + 10},${cy - 300} L${cx - 190},${cy + 420} Z`} fill="#ffffff" opacity={r * 0.5} />}
          {/* vaho del aliento y de la palma, en el vidrio */}
          {vaho > 0 && <>
            <ellipse cx={px - 20} cy={py + 10} rx={200 * (0.55 + 0.45 * vaho)} ry={170 * (0.55 + 0.45 * vaho)} fill="#eef3fa" opacity={0.16 * vaho} />
            <ellipse cx={cx + 10} cy={cy + 150} rx={120 * (0.5 + 0.5 * vaho)} ry={60 * (0.5 + 0.5 * vaho)} fill="#eef3fa" opacity={0.14 * vaho} />
          </>}
        </g>
        {/* la palma apoyada: brazo corto desde abajo a la derecha, dedos abiertos contra el vidrio */}
        {m > 0 && <g transform={`translate(${px},${py}) scale(${apl}) translate(${-px},${-py})`}>
          <ManoDedos x={px - 40 + (1 - m) * 160} y={py + 80 + (1 - m) * 640} giro={24} gesto="palma" manga="#c8582b" puno="#efe3c8" s={1.25} />
        </g>}
        {/* huellas de los dedos que quedan en el vaho */}
        {vaho > 0.3 && [-0.62, -0.2, 0.2, 0.55].map((o, i) => <ellipse key={i} cx={px - 150 + i * 30 + o * 10} cy={py - 150 - [0, 18, 16, 4][i]} rx={14} ry={20} fill="#ffffff" opacity={0.08 * vaho} />)}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 21 · cuaderno hoy (v5): la mano de la vara (manga azul con puño claro y 2 pliegues, dedos en pinza) pasa la hoja
export const CuadernoHoyV5: React.FC<{ pasa: number; zoom: number; marca: number }> = ({ pasa, zoom, marca }) => {
  const f = useF();
  const u = rampa(f, pasa, pasa + 30);
  const z = 1 + rampa(f, zoom, zoom + 60) * 0.35;
  const sx = Math.cos(u * Math.PI);
  const llega = rampa(f, pasa - 40, pasa - 6), va = rampa(f, pasa + 34, pasa + 70);
  const esq = { x: 1000 + 520 * sx, y: 830 - Math.sin(u * Math.PI) * 90 };
  const hx = esq.x + (1 - llega) * 800 + va * 1500, hy = esq.y + (1 - llega) * 560 + va * 900;
  const marcaO = rampa(f, marca, marca + 14);
  return (
    <AbsoluteFill style={{ background: "#14161e" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1010px 900px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#3a3e48" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={0} y={i * 96} width={1920} height={3} fill="#2c3038" />)}
          <path d="M0,0 L760,0 L1500,1080 L0,1080 Z" fill="#cfe0ff" opacity={0.1} />
          <g transform="translate(560,975) rotate(-5)"><rect x={-130} y={-40} width={260} height={80} rx={4} fill="#efe6cc" /><text x={0} y={10} textAnchor="middle" fontFamily={F_MONO} fontWeight={700} fontSize={26} fill="#3a3e48">ITEM 001</text></g>
          <g transform="rotate(-2 1000 560)">
            <rect x={460} y={262} width={1100} height={640} rx={12} fill="#000" opacity={0.4} />
            <rect x={440} y={240} width={540} height={640} rx={10} fill="#e6d8b0" />
            <rect x={1000} y={240} width={540} height={640} rx={10} fill="#e9dcb6" />
            {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
            {u > 0.5 && <path d="M1000,246 l22,30 -14,26 20,34 -16,30 18,44 -18,40 14,52 -16,44 18,54 -14,46 16,60 -18,56 12,96 -26,0 0,-632 Z" fill="#f1e6c4" stroke="#c9b88a" strokeWidth={3} />}
            <g transform={`translate(1000,0) scale(${sx},1) translate(-1000,0)`}>
              <rect x={1000} y={240} width={540} height={640} rx={10} fill={sx > 0 ? "#efe2c0" : "#e2d2a6"} />
              {sx > 0 && <>{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
                <text x={1110} y={410} fontFamily={F_MANO} fontWeight={700} fontSize={92} fill="#2a3a7a" opacity={0.85}>CENSUS</text>
                <text x={1240} y={600} fontFamily={F_MANO} fontWeight={700} fontSize={150} fill="#2a3a7a" opacity={0.85}>1</text>
                <circle cx={1420} cy={790} r={56} fill="#a07a3a" opacity={0.15} /></>}
            </g>
            <rect x={992} y={236} width={16} height={648} rx={6} fill="#5a1a14" />
            {marcaO > 0 && <ellipse cx={1010} cy={575} rx={70} ry={275} fill="none" stroke="#d8382c" strokeWidth={8} strokeDasharray={2200} strokeDashoffset={2200 * (1 - marcaO)} opacity={0.9} />}
          </g>
          {Array.from({ length: 40 }).map((_, i) => { const x = random(`pv${i}`) * 900 + ((f * (0.3 + random(`pw${i}`) * 0.4)) % 300), y = (random(`py${i}`) * 1080 + f * (0.4 + random(`pz${i}`) * 0.5)) % 1080; return <circle key={i} cx={x + y * 0.4} cy={y} r={1.5 + random(`pr${i}`) * 2.5} fill="#e8f0ff" opacity={0.25 + 0.3 * Math.sin(f / 10 + i)} />; })}
          {llega > 0 && va < 1 && <ManoV3 x={hx} y={hy} ang={-38 + u * 10} manga="#2f4a7a" puno="#e8e2d0" gesto="pinza" s={1.1} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 29 · inserto del interruptor (v5): el dedo viaja a la tecla en curva (12 cuadros), aprieta y la tecla cambia con él
export const ManoInterruptorV5: React.FC<{ toques: number[]; manga?: string; z0?: number; z1?: number; dur?: number }> = ({ toques, manga = "#2f7f86", z0 = 1, z1 = 1.08, dur = 140 }) => {
  const f = useF();
  const cl: [number, number][] = [[-1000, 1]];
  let on = 1;
  for (const t of toques) { on = 1 - on; cl.push([t + 2, on]); }
  const luz = luzEn(f, cl, 14);
  let est = true;
  for (const t of toques) if (f >= t + 2) est = !est;
  // y de la tecla: 500 (arriba, prendida) ↔ 620 (abajo, apagada); el dedo la sigue con curva de 10 cuadros
  let yT = 500, e0 = true;
  for (const t of toques) { const a = e0 ? 500 : 620, b = e0 ? 620 : 500; yT = f < t - 4 ? yT : a + (b - a) * interpolate(f, [t - 4, t + 6], [0, 1], seno); e0 = !e0; if (f < t - 4) break; }
  // empuje del dedo: se acerca a la pared 6 cuadros antes de cada toque y se aleja después
  const pr = Math.max(0, ...toques.map((t) => 1 - Math.abs(f - t) / 10));
  const z = z0 + (z1 - z0) * rampa(f, 0, dur, false);
  return (
    <AbsoluteFill style={{ background: "#2a3038", transform: `scale(${z})` }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#2a3038" />
        <rect x={0} y={0} width={1920} height={1080} fill="#c8d2d6" opacity={luz} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 240} y={0} width={3} height={1080} fill="#000" opacity={0.06} />)}
        <path d="M1920,0 L1400,0 L1100,1080 L1920,1080 Z" fill="#6a7aa0" opacity={0.25 * (1 - luz)} />
        {luz > 0.02 && <Halo x={960} y={-100} r={1300} color="#fff6dc" fuerza={0.5 * luz} />}
        <g transform="translate(900,560) scale(2.6)"><Interruptor on={est} /></g>
        <ManoV3 x={920 + (1 - pr) * 50} y={yT} ang={22} manga={manga} puno="#e6f0ee" gesto="dedo" s={1.15} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 19 · vapor que sube del café y se curva hacia la nariz (mundo): de (x0,y0) a (x1,y1)
export const VaporNariz: React.FC<{ f: number; x0: number; y0: number; x1: number; y1: number; o: number }> = ({ f, x0, y0, x1, y1, o }) => {
  if (o <= 0.01) return null;
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((k) => {
        const t = (f / 34 + k / 4) % 1;
        const x = x0 + (x1 - x0) * t + Math.sin(t * 6 + k) * 10;
        const y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 40;
        return <path key={k} d={`M${x},${y} q10,-14 0,-28 q-10,-14 4,-26`} stroke="#f4ecdc" strokeWidth={6} fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI) * 0.75} />;
      })}
    </g>
  );
};

export const _usaV5d = [F_HUD];
