// lc01 · vuelta 4 · componentes de v4b (planos 15-29): rótulo con número que rueda, eco de globos, mano de inserto
// con dedos (la de P52/P56: manga + puño + mano negra) para pasar hojas, pizarra con texto que siempre entra.
import React from "react";
import { AbsoluteFill, random, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { F_MONO } from "../hud";
import { rampa } from "./lc01_planos1_comp";
import { osc } from "../../anikit/sets/comun";
import { Halo } from "../../anikit/luz";
import { Interruptor } from "./lc01_planos1_comp";
import { luzEn, ManoV3 } from "./v3b_v3";

// ---------------- rótulo con caja; cada valor puede rodar (claves [f, v]) y entra con resorte ----------------
export type LineaR = { e: string; v: string | [number, number][]; c: string; suf?: string };
const valorR = (v: string | [number, number][], f: number) => {
  if (typeof v === "string") return { t: v, pop: 0 };
  let x = v[0][1];
  let pop = 0;
  for (let i = 1; i < v.length; i++) {
    const [a, w] = v[i];
    const b = i + 1 < v.length ? Math.min(v[i + 1][0], a + 40) : a + 40;
    const u = rampa(f, a, b);
    x = x + (w - x) * u;
    if (f >= b && f < b + 8) pop = 1 - (f - b) / 8;
  }
  return { t: String(Math.round(x)), pop };
};
export const PilarR: React.FC<{ lineas: LineaR[]; x: number; y: number; desde: number; hasta?: number; tam?: number; centro?: boolean }> = ({ lineas, x, y, desde, hasta = 1e9, tam = 44, centro = false }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 150 } });
  const o = Math.min(1, (f - desde) / 8, 1 - rampa(f, hasta - 10, hasta));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(${centro ? "-50%" : "0"},${(1 - s) * 18}px)`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color: "#f6ecd2", background: "rgba(14,12,20,0.86)", padding: "10px 24px", borderRadius: 14, border: `3px solid ${AMBAR}`, lineHeight: 1.25 }}>
      {lineas.map((l, i) => {
        const { t, pop } = valorR(l.v, f);
        return <div key={i} style={{ whiteSpace: "nowrap" }}>{l.e} <span style={{ color: l.c, display: "inline-block", transform: `scale(${1 + 0.18 * pop})` }}>{t}{l.suf ?? ""}</span></div>;
      })}
    </div>
  );
};

// ---------------- eco: globos que se achican, se alejan y se apagan ----------------
export const Eco: React.FC<{ texto: string; x: number; y: number; desde: number; n?: number; dx?: number; dy?: number; tam?: number }> = ({ texto, x, y, desde, n = 2, dx = 260, dy = -40, tam = 50 }) => {
  const f = useF();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = desde + 8 + i * 9;
        if (f < a) return null;
        const u = Math.min(1, (f - a) / 34);
        const o = Math.min(1, (f - a) / 6) * (0.75 - 0.22 * i) * (1 - u * 0.6);
        const t = tam * (0.8 - 0.2 * i);
        return (
          <div key={i} style={{ position: "absolute", left: x + dx * (i + 1) + u * 50, top: y + dy * (i + 1) - u * 16, opacity: o, fontFamily: F_HUD, fontWeight: 600, fontSize: t, color: "#221c18", background: "#fbf8f1", borderRadius: 999, padding: `${t * 0.25}px ${t * 0.55}px`, whiteSpace: "nowrap", letterSpacing: 2 }}>{texto}</div>
        );
      })}
    </>
  );
};

// ---------------- mano de inserto con dedos (vara P52/P56): brazo desde abajo-derecha, puño claro, mano negra con dedos ----------------
// (x, y) = la yema del índice / la pinza; gesto pinza = índice y pulgar juntos (toma una esquina de papel)
export const ManoDedos: React.FC<{ x: number; y: number; manga?: string; puno?: string; gesto?: "pinza" | "palma" | "dedo"; giro?: number; s?: number }> = ({ x, y, manga = "#2f4a7a", puno = "#e8e2d0", gesto = "pinza", giro = 0, s = 1 }) => {
  const P = "#17100d";
  return (
    <g transform={`translate(${x},${y}) rotate(${giro}) scale(${s})`}>
      {/* brazo (manga) que viene desde abajo a la derecha */}
      <path d="M150,-30 L1400,1400" stroke={osc(manga, 0.8)} strokeWidth={164} strokeLinecap="round" />
      <path d="M150,-40 L1400,1390" stroke={manga} strokeWidth={150} strokeLinecap="round" />
      {[300, 430].map((d) => <path key={d} d={`M${150 + d * 0.66 - 60},${-40 + d * 0.75 + 52} q46,-10 90,-82`} stroke={osc(manga, 0.65)} strokeWidth={6} fill="none" opacity={0.6} />)}
      <path d="M118,-82 L172,-22" stroke={puno} strokeWidth={154} strokeLinecap="butt" />
      {/* palma */}
      <ellipse cx={70} cy={-70} rx={72} ry={58} fill={P} transform="rotate(-38 70 -70)" />
      {gesto === "pinza" && <>
        <path d="M30,-74 L-6,-8" stroke={P} strokeWidth={30} strokeLinecap="round" />
        <path d="M4,-40 L-4,-2" stroke={P} strokeWidth={26} strokeLinecap="round" />
        <path d="M60,-110 L36,-120" stroke={P} strokeWidth={28} strokeLinecap="round" />
        <path d="M84,-124 L68,-136" stroke={P} strokeWidth={26} strokeLinecap="round" />
      </>}
      {gesto === "dedo" && <>
        <path d="M30,-70 L-8,0" stroke={P} strokeWidth={30} strokeLinecap="round" />
        <path d="M44,-40 L22,-14 M66,-28 L46,-4 M84,-14 L66,8" stroke={P} strokeWidth={28} strokeLinecap="round" />
      </>}
      {gesto === "palma" && (() => {
        // dedos abiertos hacia arriba-izquierda (la mano apoyada en un vidrio, vista de atrás)
        const d = [-0.62, -0.78], q = [0.78, -0.62];
        const c = [70, -70];
        return <>{[-42, -14, 14, 40].map((o, i) => {
          const bx = c[0] + d[0] * 36 + q[0] * o, by = c[1] + d[1] * 36 + q[1] * o;
          const L = [70, 86, 82, 64][i];
          return <path key={i} d={`M${bx},${by} L${bx + d[0] * L + q[0] * o * 0.25},${by + d[1] * L + q[1] * o * 0.25}`} stroke={P} strokeWidth={28} strokeLinecap="round" />;
        })}
        <path d={`M${c[0] - q[0] * 52},${c[1] - q[1] * 52} L${c[0] - q[0] * 98 + d[0] * 30},${c[1] - q[1] * 98 + d[1] * 30}`} stroke={P} strokeWidth={30} strokeLinecap="round" /></>;
      })()}
      <path d="M96,-96 q-28,22 -4,52" stroke="#3a2a22" strokeWidth={5} fill="none" opacity={0.6} />
    </g>
  );
};

// ---------------- pizarra de pared con texto que SIEMPRE entra (el tamaño se ajusta al ancho) ----------------
export const PizarraTexto: React.FC<{ x: number; y: number; w: number; h: number; lineas: string[]; trazo?: number; tamMax?: number; color?: string }> = ({ x, y, w, h, lineas, trazo = 1, tamMax = 60, color = "#1d3a8a" }) => {
  const largo = Math.max(...lineas.map((l) => l.length));
  const pad = 30;
  const tam = Math.min(tamMax, (w - 2 * pad) / (largo * 0.56), (h - 2 * pad) / (lineas.length * 1.25));
  const total = lineas.reduce((a, l) => a + l.length, 0);
  let usado = 0;
  return (
    <g>
      <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} rx={8} fill="#8a8a92" />
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#fbfbf6" />
      <rect x={x + w * 0.25} y={y + h + 8} width={w * 0.5} height={10} rx={3} fill="#6a6a72" />
      {lineas.map((l, i) => {
        const de = usado / total, a = (usado + l.length) / total;
        usado += l.length;
        const u = Math.max(0, Math.min(1, (trazo - de) / Math.max(0.001, a - de)));
        const n = Math.round(l.length * u);
        const yy = y + h / 2 + (i - (lineas.length - 1) / 2) * tam * 1.25 + tam * 0.35;
        return <text key={i} x={x + w / 2} y={yy} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={color}>{l.slice(0, n)}</text>;
      })}
    </g>
  );
};

// ---------------- 16 · capa extra del auto por dentro: manga que cuelga del asiento, reflejo de la cara de Theo y su palma en el vidrio ----------------
export const AutoExtraV4: React.FC<{ e0: number; refl: number; palma: number }> = ({ e0, refl, palma }) => {
  const f = useF();
  const z = 1 + rampa(f, e0, e0 + 200, false) * 0.1;
  const r = rampa(f, refl, refl + 16) * 0.3;
  const m = rampa(f, palma, palma + 14);
  const vaho = rampa(f, palma + 10, palma + 70);
  const px = 1250, py = 380;
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "900px 600px" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* la manga derecha de la campera cuelga por el borde del asiento, con puño elástico */}
        <g transform="translate(600,770) rotate(-4)">
          <path d="M150,30 Q236,40 250,110 L262,210 Q200,226 168,214 L160,120 Q150,70 110,62 Z" fill="#5a6c42" stroke="#4a5838" strokeWidth={4} />
          <rect x={164} y={196} width={100} height={34} rx={10} fill="#3e4a30" transform="rotate(-6 214 213)" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={176 + i * 22} y={200} width={5} height={26} fill="#2f3824" transform="rotate(-6 214 213)" />)}
          <rect x={-20} y={-74} width={52} height={22} rx={4} fill="#d8b24a" />
        </g>
        {/* reflejo de Theo en el vidrio (gorro rojo, cara) */}
        {r > 0.005 && <g opacity={r} transform="translate(1060,330) scale(0.85)">
          <circle cx={0} cy={0} r={150} fill="#0a0808" />
          <path d="M-150,-30 Q-140,-170 0,-176 Q140,-170 150,-30 Z" fill="#c8302a" />
          <rect x={-156} y={-50} width={312} height={40} rx={18} fill="#f4efe6" />
          <ellipse cx={-50} cy={30} rx={26} ry={30} fill="#fff" /><ellipse cx={50} cy={30} rx={26} ry={30} fill="#fff" />
          <path d="M-300,420 Q-200,190 0,175 Q200,190 300,420 Z" fill="#c8582b" opacity={0.6} />
        </g>}
        {/* vaho alrededor de la palma */}
        {vaho > 0 && <ellipse cx={px - 30} cy={py - 40} rx={170 * (0.6 + 0.4 * vaho)} ry={140 * (0.6 + 0.4 * vaho)} fill="#eef3fa" opacity={0.2 * vaho} />}
        {m > 0 && <ManoDedos x={px + (1 - m) * 420} y={py + (1 - m) * 380} gesto="palma" manga="#c8582b" puno="#efe3c8" s={1.05} />}
      </svg>
    </AbsoluteFill>
  );
};

// polvo flotando en un haz (pantalla)
export const PolvoHaz: React.FC<{ f: number; n?: number; x0?: number; w?: number }> = ({ f, n = 36, x0 = 0, w = 900 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = x0 + random(`v4pv${i}`) * w + ((f * (0.3 + random(`v4pw${i}`) * 0.4)) % 200);
      const y = (random(`v4py${i}`) * 1080 + f * (0.3 + random(`v4pz${i}`) * 0.4)) % 1080;
      return <circle key={i} cx={x + y * 0.35} cy={y} r={1.6 + random(`v4pr${i}`) * 2.6} fill="#eef4ff" opacity={0.25 + 0.25 * Math.sin(f / 11 + i)} />;
    })}
  </g>
);
// ---------------- 21 · cuaderno hoy (v4): mano de inserto con dedos; sale ENTERA por la derecha (sin desaparecer en cuadro) ----------------
export const CuadernoHoyV4: React.FC<{ pasa: number; zoom: number; marca: number }> = ({ pasa, zoom, marca }) => {
  const f = useF();
  const u = rampa(f, pasa, pasa + 30);
  const z = 1 + rampa(f, zoom, zoom + 60) * 0.35;
  const sx = Math.cos(u * Math.PI);
  const llega = rampa(f, pasa - 40, pasa - 6), va = rampa(f, pasa + 34, pasa + 70);
  // la pinza toma la esquina de la hoja 1 (derecha) y la lleva sobre el lomo a la izquierda
  const esq = { x: 1000 + 520 * sx, y: 830 - Math.sin(u * Math.PI) * 90 };
  const hx = esq.x + (1 - llega) * 900 + va * 1700, hy = esq.y + (1 - llega) * 420 + va * 700;
  const marcaO = rampa(f, marca, marca + 14);
  return (
    <AbsoluteFill style={{ background: "#14161e" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1010px 900px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#3a3e48" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={0} y={i * 96} width={1920} height={3} fill="#2c3038" />)}
          <path d="M0,0 L760,0 L1500,1080 L0,1080 Z" fill="#cfe0ff" opacity={0.1} />
          {/* etiqueta de archivo, abajo a la izquierda (lejos de los rótulos) */}
          <g transform="translate(560,975) rotate(-5)"><rect x={-130} y={-40} width={260} height={80} rx={4} fill="#efe6cc" /><text x={0} y={10} textAnchor="middle" fontFamily={F_MONO} fontWeight={700} fontSize={26} fill="#3a3e48">ITEM 001</text></g>
          <g transform="rotate(-2 1000 560)">
            <rect x={460} y={262} width={1100} height={640} rx={12} fill="#000" opacity={0.4} />
            <rect x={440} y={240} width={540} height={640} rx={10} fill="#e6d8b0" />
            <rect x={1000} y={240} width={540} height={640} rx={10} fill="#e9dcb6" />
            {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
            {/* restos de la hoja 2 arrancada en el lomo */}
            {u > 0.5 && <path d="M1000,246 l22,30 -14,26 20,34 -16,30 18,44 -18,40 14,52 -16,44 18,54 -14,46 16,60 -18,56 12,96 -26,0 0,-632 Z" fill="#f1e6c4" stroke="#c9b88a" strokeWidth={3} />}
            {/* hoja 1 que gira sobre el lomo */}
            <g transform={`translate(1000,0) scale(${sx},1) translate(-1000,0)`}>
              <rect x={1000} y={240} width={540} height={640} rx={10} fill={sx > 0 ? "#efe2c0" : "#e2d2a6"} />
              {sx > 0 && <>{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1020} y={310 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
                <text x={1110} y={410} fontFamily={F_MANO} fontWeight={700} fontSize={92} fill="#2a3a7a" opacity={0.85}>CENSUS</text>
                <text x={1240} y={600} fontFamily={F_MANO} fontWeight={700} fontSize={150} fill="#2a3a7a" opacity={0.85}>1</text>
                <circle cx={1420} cy={790} r={56} fill="#a07a3a" opacity={0.15} /></>}
            </g>
            <rect x={992} y={236} width={16} height={648} rx={6} fill="#5a1a14" />
            {/* el borde arrancado, marcado con lápiz rojo */}
            {marcaO > 0 && <ellipse cx={1010} cy={575} rx={70} ry={275} fill="none" stroke="#d8382c" strokeWidth={8} strokeDasharray={2200} strokeDashoffset={2200 * (1 - marcaO)} opacity={0.9} />}
          </g>
          {/* polvo en el haz de luz */}
          {Array.from({ length: 40 }).map((_, i) => { const x = random(`pv${i}`) * 900 + ((f * (0.3 + random(`pw${i}`) * 0.4)) % 300), y = (random(`py${i}`) * 1080 + f * (0.4 + random(`pz${i}`) * 0.5)) % 1080; return <circle key={i} cx={x + y * 0.4} cy={y} r={1.5 + random(`pr${i}`) * 2.5} fill="#e8f0ff" opacity={0.25 + 0.3 * Math.sin(f / 10 + i)} />; })}
          {llega > 0 && va < 1 && <ManoDedos x={hx} y={hy} giro={-10 + u * 8} manga="#2f4a7a" puno="#e8e2d0" gesto="pinza" s={1.15} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// ---------------- 29 · inserto del interruptor (v4) ----------------
export const ManoInterruptorV4: React.FC<{ toques: number[]; manga?: string; z0?: number; z1?: number; dur?: number }> = ({ toques, manga = "#2f7f86", z0 = 1, z1 = 1.08, dur = 140 }) => {
  const f = useF();
  // v4: cada toque invierte la luz con fundido de 14 cuadros (con 8 el medidor lo marcaba como tirón: 169,7/170,3)
  const cl: [number, number][] = [[-1000, 1]];
  let on = 1;
  for (const t of toques) { on = 1 - on; cl.push([t + 2, on]); }
  const luz = luzEn(f, cl, 14);
  let est = true;
  for (const t of toques) if (f >= t + 3) est = !est;
  // el dedo baja/sube a la tecla en cada toque
  const ult = toques.filter((t) => t - 8 <= f).pop();
  const pr = ult === undefined ? 0 : Math.max(0, 1 - Math.abs(f - ult) / 8);
  const z = z0 + (z1 - z0) * rampa(f, 0, dur, false);
  const tecla = { x: 900, y: est ? 500 : 620 };
  return (
    <AbsoluteFill style={{ background: "#2a3038", transform: `scale(${z})` }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#2a3038" />
        <rect x={0} y={0} width={1920} height={1080} fill="#c8d2d6" opacity={luz} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 240} y={0} width={3} height={1080} fill="#000" opacity={0.06} />)}
        <path d="M1920,0 L1400,0 L1100,1080 L1920,1080 Z" fill="#6a7aa0" opacity={0.25 * (1 - luz)} />
        {luz > 0.02 && <Halo x={960} y={-100} r={1300} color="#fff6dc" fuerza={0.5 * luz} />}
        <g transform="translate(900,560) scale(2.6)"><Interruptor on={est} /></g>
        <ManoV3 x={tecla.x + 20 + (1 - pr) * 60} y={tecla.y + (est ? -20 : 20) * pr} ang={22} manga={manga} puno="#e6f0ee" gesto="dedo" s={1.15} />
      </svg>
    </AbsoluteFill>
  );
};

export const _usa = [AbsoluteFill, F_MONO];
