// Kit propio de ob06 (sólo lo usa este video): órganos reconocibles (estómago, corte de la pared, torso con
// órganos, corazón, vaca con rumen), comida dibujada, sets cerrados (espejo del baño, café por dentro, escenario)
// y los CTA con personaje. Todo SVG en coordenadas del mundo salvo lo marcado como HUD.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { Halo, Polvo, Charco } from "../anikit/luz";
import { SetProps, uid, mezclar } from "../anikit/sets/comun";

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const tw = (f: number, a: number, b: number, v0 = 0, v1 = 1) => interpolate(f, [a, b], [v0, v1], cl);
export const pop = (f: number, a: number, fps = 30, st = 160) => (f < a ? 0 : spring({ frame: f - a, fps, config: { damping: 11, stiffness: st } }));
const bz = (p: number[], t: number) => { const u = 1 - t; return u * u * u * p[0] + 3 * u * u * t * p[1] + 3 * u * t * t * p[2] + t * t * t * p[3]; };
export const enBez = (P: [number, number][], t: number) => ({ x: bz(P.map((q) => q[0]), t), y: bz(P.map((q) => q[1]), t) });
export const latido = (f: number, bpm: number, fps = 30) => Math.max(0, Math.sin(((f / fps) * bpm * Math.PI * 2) / 60)) ** 6;

// ---------------- texto grande en el mundo (con borde) ----------------
export const TextoW: React.FC<{ x: number; y: number; t: string; tam?: number; color?: string; desde?: number; f: number; ancla?: "middle" | "start" | "end"; mano?: boolean; rot?: number; borde?: string }> = ({ x, y, t, tam = 60, color = "#f4efe4", desde = 0, f, ancla = "middle", mano, rot = 0, borde = "#0b1014" }) => {
  if (f < desde) return null;
  const s = pop(f, desde);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${0.6 + 0.4 * s})`} opacity={Math.min(1, s * 1.5)}>
      {t.split("\n").map((l, i) => <text key={i} y={i * tam * 1.12} fontFamily={mano ? F_MANO : F_HUD} fontWeight={mano ? 700 : 600} fontSize={tam} fill={color} textAnchor={ancla} stroke={borde} strokeOpacity={0.55} strokeWidth={tam * 0.12} paintOrder="stroke" strokeLinejoin="round">{l}</text>)}
    </g>
  );
};
// flecha que se dibuja (p 0..1) con rótulo en el origen
export const Flecha: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; ancho?: number; curva?: number }> = ({ x1, y1, x2, y2, p, color = "#f4efe4", ancho = 8, curva = 0 }) => {
  if (p <= 0.01) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * curva, my = (y1 + y2) / 2 + (x2 - x1) * curva;
  const P: [number, number][] = [[x1, y1], [mx, my], [mx, my], [x2, y2]];
  const n = 24, pts = Array.from({ length: n + 1 }).map((_, i) => enBez(P, (i / n) * p));
  const a = pts[pts.length - 1], b = pts[pts.length - 2];
  const ang = Math.atan2(a.y - b.y, a.x - b.x);
  const h = ancho * 3.2;
  return (
    <g>
      <path d={pts.map((q, i) => `${i ? "L" : "M"}${q.x},${q.y}`).join(" ")} stroke={color} strokeWidth={ancho} fill="none" strokeLinecap="round" />
      <path d={`M${a.x + Math.cos(ang) * h * 0.4},${a.y + Math.sin(ang) * h * 0.4} L${a.x + Math.cos(ang + 2.5) * h},${a.y + Math.sin(ang + 2.5) * h} L${a.x + Math.cos(ang - 2.5) * h},${a.y + Math.sin(ang - 2.5) * h} Z`} fill={color} />
    </g>
  );
};

// ---------------- ESTÓMAGO (corte): bolsa en J con esófago y duodeno ----------------
export const EST_D = "M-80,-330 L-80,-232 C-236,-212 -296,-40 -244,112 C-192,256 22,302 164,232 C246,192 284,132 304,92 L392,92 L392,30 L292,30 C272,62 232,102 172,112 C82,126 22,60 22,-60 C22,-150 -8,-200 -20,-232 L-20,-330 Z";
export const Estomago: React.FC<{ x: number; y: number; s?: number; f: number; acido?: number; moco?: number; acero?: number; lleno?: number; estira?: number; cara?: "nada" | "feliz" | "miedo" | "duda"; burb?: number; comida?: number }> = ({ x, y, s = 1, f, acido = 0, moco = 0, acero = 0, estira = 0, cara = "nada", burb = 1, comida = 0 }) => {
  const id = uid();
  const yA = 290 - acido * 470;
  const pared = mezclar("#ea7e8c", "#b9c4ce", acero);
  const borde = mezclar("#8a2c44", "#5a6670", acero);
  const sc = 1 + 0.12 * estira;
  return (
    <g transform={`translate(${x},${y}) scale(${s * sc},${s * (1 + 0.06 * estira)})`}>
      <defs><clipPath id={`e${id}`}><path d={EST_D} /></clipPath></defs>
      <path d={EST_D} fill={mezclar("#5a1a2a", "#2a3238", acero)} />
      <g clipPath={`url(#e${id})`}>
        {/* pliegues (rugas) */}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-220 + i * 30},${-120 + i * 70} q60,-30 120,0 t120,0 t120,0`} stroke="#3e1220" strokeWidth={10} fill="none" opacity={0.5 * (1 - acero)} />)}
        {/* comida que entra (trozos) */}
        {comida > 0 && Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-200 + ((i * 53) % 330)} y={260 - comida * 300 + ((i * 37) % 120)} width={44} height={30} rx={10} fill={["#d9a04a", "#8a5a3a", "#e9c27a", "#9a3a2a"][i % 4]} opacity={0.95} transform={`rotate(${(i * 47) % 90},${-178 + ((i * 53) % 330)},${275 - comida * 300 + ((i * 37) % 120)})`} />)}
        {/* el ácido */}
        {acido > 0 && <path d={`M-320,${yA} ${Array.from({ length: 15 }).map((_, i) => `Q${-300 + i * 50 + 25},${yA + Math.sin(f / 7 + i) * 10} ${-300 + (i + 1) * 50},${yA}`).join(" ")} V420 H-320 Z`} fill="#c8ff4a" opacity={0.88} />}
        {acido > 0 && burb > 0 && Array.from({ length: 16 }).map((_, i) => { const t = ((f * (0.6 + (i % 4) * 0.25) + i * 23) % 120) / 120; const by = 290 - t * (290 - yA); return <circle key={i} cx={-230 + ((i * 71) % 420)} cy={by} r={5 + (i % 3) * 4} fill="none" stroke="#f4ffd0" strokeWidth={3} opacity={(1 - t) * burb} />; })}
        {/* capa de moco protectora (azul, del lado de adentro) */}
        {moco > 0 && <path d={EST_D} fill="none" stroke="#8fd8ff" strokeWidth={34 + 46 * moco} opacity={0.85} />}
      </g>
      {/* la pared */}
      <path d={EST_D} fill="none" stroke={pared} strokeWidth={36} strokeLinejoin="round" />
      <path d={EST_D} fill="none" stroke={borde} strokeWidth={7} strokeLinejoin="round" />
      {acero > 0.05 && <path d="M-230,0 C-210,120 -100,220 40,230" stroke="#ffffff" strokeWidth={10} fill="none" opacity={0.7 * acero} strokeLinecap="round" />}
      {cara !== "nada" && <CaraOrg x={-110} y={60} f={f} cara={cara} s={1.2} />}
    </g>
  );
};
// carita para órganos (ojos blancos + boca) — la misma gramática que la cabeza de los personajes
export const CaraOrg: React.FC<{ x: number; y: number; f: number; cara: "feliz" | "miedo" | "duda" | "triste" | "lleno"; s?: number }> = ({ x, y, f, cara, s = 1 }) => {
  const par = (f % 97) < 3 ? 0.15 : 1;
  const r = cara === "miedo" ? 22 : 17;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[-34, 34].map((dx) => <g key={dx}><ellipse cx={dx} cy={0} rx={r * 0.8} ry={r * par} fill="#fff" /><circle cx={dx + 2} cy={2} r={6} fill="#14100e" /></g>)}
      {cara === "miedo" && [-34, 34].map((dx) => <path key={dx} d={`M${dx - 18},${-30 + (dx < 0 ? 6 : -6)} L${dx + 18},${-30 + (dx < 0 ? -6 : 6)}`} stroke="#14100e" strokeWidth={6} strokeLinecap="round" />)}
      {cara === "duda" && <path d="M14,-34 L52,-28" stroke="#14100e" strokeWidth={6} strokeLinecap="round" />}
      {cara === "feliz" || cara === "lleno" ? <path d="M-24,32 Q0,56 24,32" stroke="#14100e" strokeWidth={7} fill="none" strokeLinecap="round" />
        : cara === "miedo" ? <ellipse cx={0} cy={40} rx={14} ry={18} fill="#14100e" />
          : cara === "triste" ? <path d="M-22,46 Q0,30 22,46" stroke="#14100e" strokeWidth={7} fill="none" strokeLinecap="round" />
            : <path d="M-18,40 L20,36" stroke="#14100e" strokeWidth={7} strokeLinecap="round" />}
    </g>
  );
};

// ---------------- corte de la PARED del estómago (pantalla completa, coordenadas 1920×1080) ----------------
// moco 0..1, cambio 0..1 = una célula vieja se suelta y entra una nueva, acero 0..1 = la pared de Owen
export const CorteMuro: React.FC<{ f: number; moco: number; cambio?: number; acero?: number; gotas?: number }> = ({ f, moco, cambio = 0, acero = 0, gotas = 1 }) => {
  const yM = 600 - 120 * moco; // tope del moco
  const N = 9, W = 1920 / (N - 1);
  return (
    <g>
      <defs><linearGradient id="cmacido" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e9ff9a" /><stop offset="1" stopColor="#aee04a" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2400} height={900} fill="url(#cmacido)" />
      
      {/* gotas de ácido que caen y rebotan en el moco */}
      {Array.from({ length: 12 }).map((_, i) => {
        const per = 46 + (i % 4) * 9, t = ((f + i * 17) % per) / per;
        const x0 = 120 + i * 150 + (i % 2) * 40;
        const choque = 0.62;
        const yy = t < choque ? 160 + (t / choque) * (yM - 190) : yM - 30 - Math.sin(((t - choque) / (1 - choque)) * Math.PI) * 120;
        const xx = t < choque ? x0 : x0 + ((t - choque) / (1 - choque)) * 70 * (i % 2 ? 1 : -1);
        return <g key={i} opacity={gotas}><circle cx={xx} cy={yy} r={22} fill="#7aa81a" /><text x={xx} y={yy + 9} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#f4ffd0" textAnchor="middle">H+</text></g>;
      })}
      {/* moco */}
      {moco > 0.01 && <path d={`M-200,${yM} ${Array.from({ length: 24 }).map((_, i) => `Q${-200 + i * 100 + 50},${yM + Math.sin(f / 9 + i) * 14 - 10} ${-200 + (i + 1) * 100},${yM}`).join(" ")} V640 H-200 Z`} fill="#8fd8ff" opacity={0.9 * (1 - acero)} />}
      {moco > 0.01 && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={100 + i * 190 + Math.sin(f / 20 + i) * 20} cy={yM + 60} r={10} fill="#d6f2ff" opacity={0.7 * (1 - acero)} />)}
      {/* células de la superficie */}
      {Array.from({ length: N }).map((_, i) => {
        const vieja = i === 4;
        const sube = vieja ? tw(cambio, 0, 0.5) : 0;
        const nueva = vieja ? tw(cambio, 0.4, 1) : 1;
        const cx = -40 + i * W;
        const celula = (dy: number, o: number, esc: number, k: string) => (
          <g key={k} transform={`translate(${cx},${640 + dy}) scale(${esc})`} opacity={o}>
            <rect x={-W / 2 + 6} y={0} width={W - 12} height={150} rx={30} fill={mezclar("#f2a0aa", "#c9d2da", acero)} stroke={mezclar("#b4566a", "#7a8690", acero)} strokeWidth={5} />
            <ellipse cx={0} cy={86} rx={30} ry={24} fill={mezclar("#9a3a5a", "#5a6670", acero)} />
          </g>
        );
        return vieja ? <g key={i}>{celula(-sube * 260, 1 - sube, 1 - 0.2 * sube, "v")}{celula(150 * (1 - nueva), nueva, 0.6 + 0.4 * nueva, "n")}</g> : celula(0, 1, 1, `c${i}`);
      })}
      {/* músculo */}
      <rect x={-200} y={790} width={2400} height={500} fill={mezclar("#c2444f", "#6a747c", acero)} />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M-200,${812 + i * 22} q240,-10 480,0 t480,0 t480,0 t480,0 t480,0`} stroke={mezclar("#a8343e", "#58626a", acero)} strokeWidth={6} fill="none" />)}
      {acero > 0.05 && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${200 + i * 300},${660} l40,-30 l20,40`} stroke="#ffffff" strokeWidth={6} fill="none" opacity={acero * (0.5 + 0.5 * Math.sin(f / 4 + i))} />)}
    </g>
  );
};

// ---------------- TORSO de rayos X con órganos (coordenadas del mundo; (0,0) = ombligo) ----------------
const TORSO_D = "M-64,-330 C-150,-322 -214,-300 -222,-232 C-230,-130 -196,-30 -180,50 C-168,124 -192,196 -186,280 L186,280 C192,196 168,124 180,50 C196,-30 230,-130 222,-232 C214,-300 150,-322 64,-330 Z";
const BRAZO_D = "M-226,-246 C-292,-214 -306,-70 -298,60 C-294,150 -292,220 -284,284 L-238,284 C-246,200 -250,90 -240,-30 Z";
export const VAGO: [number, number][] = [[-20, -10], [70, -140], [-40, -300], [0, -420]];
export const Torso: React.FC<{
  x: number; y: number; s?: number; f: number; cara?: "feliz" | "miedo" | "duda" | "triste" | "lleno"; gorra?: boolean;
  est?: { acido?: number; acero?: number; estira?: number; comida?: number }; tripa?: number; tripaFerm?: number; cerebro?: number; cerebroColor?: string;
  corazon?: number; bpm?: number; vago?: number; vagoPulsos?: number; alpha?: number; rayos?: number;
}> = ({ x, y, s = 1, f, cara = "feliz", gorra, est, tripa = 0, tripaFerm = 0, cerebro = 0, cerebroColor = "#ff9ac0", corazon = 0, bpm = 72, vago = 0, vagoPulsos = 0, rayos = 1 }) => {
  const lat = latido(f, bpm);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* cuerpo */}
      {[1, -1].map((k) => <path key={k} d={BRAZO_D} transform={`scale(${k},1)`} fill="#1d2b38" stroke="#9fdcff" strokeWidth={5} strokeOpacity={0.7 * rayos} />)}
      <path d={TORSO_D} fill="#1d2b38" stroke="#9fdcff" strokeWidth={6} strokeOpacity={0.8 * rayos} />
      <rect x={-46} y={-382} width={92} height={70} rx={20} fill="#1d2b38" stroke="#9fdcff" strokeWidth={5} strokeOpacity={0.7 * rayos} />
      {/* costillas tenues */}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-150,${-250 + i * 38} Q0,${-210 + i * 38} 150,${-250 + i * 38}`} stroke="#9fdcff" strokeWidth={5} fill="none" opacity={0.13 * rayos} />)}
      {/* cabeza: la misma cabeza negra con ojos blancos de los personajes */}
      <circle cx={0} cy={-500} r={124} fill="#14100e" stroke="#9fdcff" strokeWidth={4} strokeOpacity={0.5 * rayos} />
      {gorra && <path d="M-128,-540 C-120,-650 120,-650 128,-540 Z M100,-546 L210,-540 L200,-520 L110,-528 Z" fill="#22305a" />}
      {cerebro > 0 && <g opacity={cerebro} transform={`translate(0,${gorra ? -520 : -540})`}>
        <path d="M-92,10 C-112,-40 -70,-92 -20,-80 C10,-108 70,-96 82,-56 C120,-40 116,20 82,30 C70,50 -60,52 -92,10 Z" fill={cerebroColor} stroke="#fff" strokeWidth={4} />
        <path d="M-60,-20 q20,-24 40,0 t40,0 M-40,20 q20,-20 40,0 t40,-4" stroke="#b9447a" strokeWidth={5} fill="none" />
      </g>}
      {cerebro <= 0 && <CaraOrg x={10} y={-500} f={f} cara={cara} s={1.15} />}
      {cerebro > 0 && <CaraOrg x={10} y={-462} f={f} cara={cara} s={0.75} />}
      {/* corazón */}
      {corazon > 0 && <g opacity={corazon} transform={`translate(44,-178) scale(${0.32 * (1 + 0.12 * lat)})`}><CorazonA x={0} y={0} f={f} bpm={bpm} sin={true} /></g>}
      {/* estómago */}
      {est && <Estomago x={-30} y={-40} s={0.36} f={f} acido={est.acido ?? 0.4} acero={est.acero ?? 0} estira={est.estira ?? 0} comida={est.comida ?? 0} burb={0.6} />}
      {/* intestinos: tubo que serpentea abajo */}
      {tripa > 0 && <g opacity={tripa}>
        <path d="M110,30 C160,80 150,140 90,150 C20,160 -100,140 -130,180 C-150,220 -60,250 0,230 C60,210 120,230 130,260" stroke={mezclar("#e9a28a", "#9ad84a", tripaFerm)} strokeWidth={38} fill="none" strokeLinecap="round" />
        <path d="M110,30 C160,80 150,140 90,150 C20,160 -100,140 -130,180 C-150,220 -60,250 0,230 C60,210 120,230 130,260" stroke={mezclar("#c47a62", "#5aa82a", tripaFerm)} strokeWidth={6} fill="none" strokeDasharray="4 18" />
        {tripaFerm > 0 && Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={-110 + ((i * 47) % 240) + Math.sin(f / 9 + i) * 8} cy={150 + ((i * 29) % 100) + Math.cos(f / 8 + i) * 6} r={6} fill="#efffbf" opacity={tripaFerm} />)}
      </g>}
      {/* nervio vago: de la panza al cerebro */}
      {vago > 0 && <g opacity={vago}>
        <path d={`M${VAGO[0][0]},${VAGO[0][1]} C${VAGO[1][0]},${VAGO[1][1]} ${VAGO[2][0]},${VAGO[2][1]} ${VAGO[3][0]},${VAGO[3][1]}`} stroke="#ffd84a" strokeWidth={12} fill="none" strokeLinecap="round" />
        {vagoPulsos > 0 && Array.from({ length: 4 }).map((_, i) => { const t = ((f / 26 + i / 4) % 1); const p = enBez(VAGO, t); return <circle key={i} cx={p.x} cy={p.y} r={20} fill="#fff8c0" opacity={vagoPulsos * (0.4 + 0.6 * Math.sin(t * Math.PI))} />; })}
      </g>}
    </g>
  );
};

// ---------------- CORAZÓN anatómico (late) ----------------
export const CorazonA: React.FC<{ x: number; y: number; s?: number; f: number; bpm: number; sin?: boolean; color?: string }> = ({ x, y, s = 1, f, bpm, sin, color = "#e23a4a" }) => {
  const l = sin ? 0 : latido(f, bpm);
  return (
    <g transform={`translate(${x},${y}) scale(${s * (1 + 0.1 * l)})`}>
      {/* vasos de arriba */}
      <path d="M-30,-120 C-34,-210 40,-250 96,-214 C130,-190 120,-140 110,-120" stroke="#c42a3a" strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M-30,-200 L-30,-260 M40,-236 L46,-290 M88,-224 L110,-276" stroke="#c42a3a" strokeWidth={24} strokeLinecap="round" />
      <path d="M-110,-100 C-130,-170 -80,-200 -60,-190" stroke="#4a6ad8" strokeWidth={38} fill="none" strokeLinecap="round" />
      <path d="M10,-110 C30,-170 -30,-210 -60,-170" stroke="#5a7ae8" strokeWidth={34} fill="none" strokeLinecap="round" />
      {/* cuerpo */}
      <path d="M-20,-120 C-90,-150 -186,-118 -186,-20 C-186,94 -70,170 30,236 C110,170 196,90 190,-20 C186,-110 96,-150 30,-118 Z" fill={color} stroke="#7a1420" strokeWidth={8} />
      <path d="M30,-110 C10,-20 40,90 30,230" stroke="#9a1a2a" strokeWidth={8} fill="none" opacity={0.7} />
      <path d="M-120,-40 C-130,30 -90,90 -50,120" stroke="#ff8a96" strokeWidth={14} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M90,-60 C120,-10 110,60 80,100" stroke="#b42032" strokeWidth={6} fill="none" opacity={0.8} />
      <path d="M-40,-60 C-10,-40 0,0 -10,40" stroke="#b42032" strokeWidth={5} fill="none" opacity={0.7} />
    </g>
  );
};
// línea del electro (en pantalla o en el mundo): ancho w, alto h, desplazada con el tiempo
export const ECG: React.FC<{ x: number; y: number; w: number; h: number; f: number; bpm: number; color?: string; grosor?: number }> = ({ x, y, w, h, f, bpm, color = "#ff4a5a", grosor = 7 }) => {
  const N = 120, per = (60 / bpm) * 30; // cuadros por latido
  const pts = Array.from({ length: N + 1 }).map((_, i) => {
    const px = (i / N) * w;
    const fase = (((f - (N - i) * 0.9) % per) + per) % per / per;
    const v = fase > 0.1 && fase < 0.14 ? -0.25 : fase > 0.2 && fase < 0.24 ? 0.25 : fase >= 0.24 && fase < 0.28 ? -1 : fase >= 0.28 && fase < 0.32 ? 0.45 : fase > 0.5 && fase < 0.6 ? -0.18 : 0;
    return `${i ? "L" : "M"}${x + px},${y + v * h}`;
  });
  return <path d={pts.join(" ")} stroke={color} strokeWidth={grosor} fill="none" strokeLinejoin="round" />;
};

// ---------------- VACA (de perfil, mira a la izquierda; pies en y=0) ----------------
export const Vaca: React.FC<{ x: number; y: number; s?: number; f: number; rayos?: number; rumen?: number; masca?: boolean; cabeza?: number }> = ({ x, y, s = 1, f, rayos = 0, rumen = 0, masca = true, cabeza = 0 }) => {
  const id = uid();
  const t = f / 30;
  const mand = masca ? Math.abs(Math.sin(t * 5)) * 10 : 0;
  const cola = Math.sin(t * 2.2) * 14;
  const pata = (px: number, k: number) => <g key={px}><rect x={px - 20} y={-170} width={40} height={150} rx={16} fill="#f4efe4" stroke="#2a2420" strokeWidth={6} /><rect x={px - 22} y={-30} width={44} height={30} rx={8} fill="#3a2a22" /></g>;
  const CUERPO = "M-250,-330 C-250,-400 -150,-420 0,-410 C160,-420 280,-400 290,-310 C300,-230 280,-170 230,-150 L-220,-150 C-260,-170 -250,-260 -250,-330 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={320} ry={20} fill="#000" opacity={0.18} />
      {[-180, -110, 150, 220].map(pata)}
      {/* cola */}
      <path d={`M280,-360 C330,-330 ${330 + cola},-260 ${320 + cola},-200`} stroke="#2a2420" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={322 + cola} cy={-190} rx={14} ry={22} fill="#2a2420" />
      <defs><clipPath id={`v${id}`}><path d={CUERPO} /></clipPath></defs>
      <path d={CUERPO} fill="#f4efe4" stroke="#2a2420" strokeWidth={7} />
      <g clipPath={`url(#v${id})`} opacity={1 - rayos * 0.85}>
        {[[-150, -360, 70, 50], [60, -250, 90, 60], [200, -370, 60, 46], [-40, -400, 40, 30]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#2a2420" />)}
      </g>
      {/* ubre */}
      <path d="M100,-150 q30,40 70,0 Z" fill="#f2a6b4" stroke="#2a2420" strokeWidth={5} />
      {/* RAYOS X: los 4 compartimentos, el rumen enorme */}
      {rayos > 0 && <g clipPath={`url(#v${id})`} opacity={rayos}>
        <path d={CUERPO} fill="#1d2b38" opacity={0.85} />
        <path d="M-60,-160 C-160,-170 -170,-300 -100,-350 C-20,-400 140,-390 170,-320 C200,-250 160,-170 60,-160 Z" fill={mezclar("#5a7a3a", "#9ad84a", rumen)} stroke="#d6ff9a" strokeWidth={6} />
        <circle cx={-150} cy={-250} r={44} fill="#7a9a5a" stroke="#d6ff9a" strokeWidth={4} />
        <circle cx={-190} cy={-190} r={30} fill="#8a6a4a" stroke="#d6ff9a" strokeWidth={4} />
        <path d="M-230,-200 C-250,-160 -200,-160 -170,-170" stroke="#e98a8a" strokeWidth={22} fill="none" strokeLinecap="round" />
        {rumen > 0 && Array.from({ length: 40 }).map((_, i) => { const a = i * 2.4 + t * (0.5 + (i % 5) * 0.15); const r = 20 + ((i * 37) % 110); return <g key={i} transform={`translate(${30 + Math.cos(a) * r * 1.1},${-265 + Math.sin(a * 1.3) * r * 0.55}) rotate(${a * 40})`}><ellipse rx={9} ry={4} fill={["#efffbf", "#ffd84a", "#7affd4"][i % 3]} opacity={rumen} /></g>; })}
        {rumen > 0 && Array.from({ length: 10 }).map((_, i) => { const u = ((t * 0.5 + i * 0.1) % 1); return <circle key={`b${i}`} cx={-60 + i * 22} cy={-180 - u * 180} r={6 + (i % 3) * 3} fill="none" stroke="#efffbf" strokeWidth={3} opacity={(1 - u) * rumen} />; })}
      </g>}
      {/* cabeza */}
      <g transform={`translate(-250,-330) rotate(${cabeza})`}>
        <path d="M0,-30 C-40,-60 -110,-50 -130,0 C-150,60 -150,120 -120,150 C-90,175 -40,170 -20,140 C0,100 20,30 0,-30 Z" fill="#f4efe4" stroke="#2a2420" strokeWidth={7} />
        <ellipse cx={-110} cy={130 + mand * 0.4} rx={48} ry={36} fill="#f2a6b4" stroke="#2a2420" strokeWidth={6} />
        <circle cx={-124} cy={128 + mand * 0.4} r={6} fill="#2a2420" /><circle cx={-96} cy={132 + mand * 0.4} r={6} fill="#2a2420" />
        <circle cx={-70} cy={20} r={11} fill="#2a2420" /><circle cx={-66} cy={16} r={4} fill="#fff" />
        <path d="M-20,-40 q-10,-40 30,-50" stroke="#e9d9b0" strokeWidth={14} fill="none" strokeLinecap="round" />
        <ellipse cx={14} cy={0} rx={40} ry={16} fill="#2a2420" transform="rotate(-20,14,0)" />
        {/* pasto en la boca */}
        {masca && [0, 1, 2].map((i) => <path key={i} d={`M-150,${150 + mand * 0.5} l${-20 - i * 10},${-30 + i * 20}`} stroke="#5aa83a" strokeWidth={6} strokeLinecap="round" />)}
      </g>
    </g>
  );
};

// ---------------- comida y objetos (centrados en 0,0, ~100 px) ----------------
export const Burrito: React.FC<{ s?: number; mordida?: number }> = ({ s = 1, mordida = 0 }) => {
  const L = 200 * (1 - mordida);
  return (
    <g transform={`scale(${s})`}>
      {L > 4 && <><rect x={-100} y={-34} width={L} height={68} rx={34} fill="#e9c27a" stroke="#a8803a" strokeWidth={4} />
        {[0, 1, 2].map((i) => i * 60 < L - 20 && <path key={i} d={`M${-70 + i * 60},-32 q14,30 0,64`} stroke="#c9a05a" strokeWidth={4} fill="none" />)}
        <rect x={-100} y={-36} width={Math.min(70, L)} height={72} rx={14} fill="#d6d9dc" stroke="#9aa0a6" strokeWidth={3} />
        {mordida > 0 && <g transform={`translate(${-100 + L},0)`}><circle cx={0} cy={-14} r={16} fill="#c23a2e" /><circle cx={0} cy={14} r={14} fill="#5a9a3a" /><circle cx={4} cy={0} r={10} fill="#8a5a2a" /></g>}</>}
    </g>
  );
};
export const Dona: React.FC<{ s?: number; color?: string; mordida?: number }> = ({ s = 1, color = "#e9759a", mordida = 0 }) => (
  <g transform={`scale(${s})`}>
    <circle r={50} fill="#d99a5a" /><circle r={44} fill={color} /><circle r={16} fill="#2a1a12" opacity={0.0} />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={Math.cos(i) * 30 - 6} y={Math.sin(i * 1.7) * 26 - 2} width={12} height={4} rx={2} fill={["#fff", "#ffd84a", "#7ab8ff"][i % 3]} transform={`rotate(${i * 50},${Math.cos(i) * 30},${Math.sin(i * 1.7) * 26})`} />)}
    <circle r={15} fill="#f4e6c8" />
    {mordida > 0 && <circle cx={46} cy={-20} r={30 * mordida} fill="#f4e6c8" />}
  </g>
);
export const Cebolla: React.FC<{ s?: number; mordidas?: number }> = ({ s = 1, mordidas = 0 }) => (
  <g transform={`scale(${s})`}>
    <defs><clipPath id={`ceb${mordidas}`}><path d={`M-200,-200 H200 V200 H-200 Z ${Array.from({ length: mordidas }).map((_, i) => `M${54 - i * 6},${-30 + i * 34} m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0`).join(" ")}`} clipRule="evenodd" /></clipPath></defs>
    <g clipPath={`url(#ceb${mordidas})`}>
      <path d="M0,-70 C50,-60 80,-10 76,30 C70,80 30,90 0,90 C-30,90 -70,80 -76,30 C-80,-10 -50,-60 0,-70 Z" fill="#e9dcf2" stroke="#a88ac8" strokeWidth={5} />
      {[-40, -14, 14, 40].map((x) => <path key={x} d={`M0,-66 Q${x},10 0,88`} stroke="#c8b0e2" strokeWidth={4} fill="none" />)}
    </g>
    {Array.from({ length: mordidas }).map((_, i) => <path key={i} d={`M${54 - i * 6 - 28},${-30 + i * 34} a28,28 0 0,0 ${-10},${30}`} stroke="#fbf8ff" strokeWidth={6} fill="none" opacity={0.8} />)}
    <path d="M0,-70 q-6,-30 6,-46 M0,-70 q10,-24 -2,-40" stroke="#7aa83a" strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);
export const Tortilla: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><ellipse rx={80} ry={16} fill="#ecd29a" stroke="#c9a05a" strokeWidth={4} />{[-40, 0, 36].map((x) => <circle key={x} cx={x} cy={-2} r={5} fill="#c9944a" opacity={0.6} />)}</g>
);
export const Frasco: React.FC<{ s?: number; nivel?: number }> = ({ s = 1, nivel = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-46} y={-120} width={92} height={130} rx={14} fill="#dcf0f2" opacity={0.55} stroke="#9ac0c8" strokeWidth={4} />
    <rect x={-40} y={4 - 116 * nivel} width={80} height={116 * nivel} rx={10} fill="#6aa83a" />
    {nivel > 0.1 && Array.from({ length: Math.round(8 * nivel) }).map((_, i) => <circle key={i} cx={-24 + (i % 3) * 24} cy={-10 - Math.floor(i / 3) * 34} r={11} fill="#3a7a2a" stroke="#a8d86a" strokeWidth={3} />)}
    <rect x={-50} y={-138} width={100} height={22} rx={6} fill="#c23a2e" />
    <rect x={-38} y={-80} width={76} height={40} rx={6} fill="#f4efe4" /><text y={-52} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#2f6b2a" textAnchor="middle">JALAPEÑO</text>
  </g>
);
export const Galon: React.FC<{ s?: number; nivel?: number }> = ({ s = 1, nivel = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-60,-120 L-60,90 Q-60,110 -40,110 L60,110 Q80,110 80,90 L80,-80 L40,-120 L20,-150 L-20,-150 L-40,-120 Z" fill="#f6f8fa" opacity={0.65} stroke="#c9d0d6" strokeWidth={5} />
    <path d={`M-56,${106 - 210 * nivel} H76 V90 Q76,106 60,106 H-40 Q-56,106 -56,90 Z`} fill="#ffffff" />
    <path d="M40,-110 q40,0 36,40 q-4,30 -36,26" stroke="#c9d0d6" strokeWidth={10} fill="none" />
    <rect x={-26} y={-172} width={52} height={26} rx={6} fill="#2a6fd6" />
    <rect x={-50} y={-20} width={110} height={60} rx={6} fill="#2a6fd6" /><text x={5} y={20} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#fff" textAnchor="middle">MILK</text>
  </g>
);
// la barra gris sellada con número (legible)
export const Barra: React.FC<{ n: number | string; s?: number; mordida?: number; resalta?: boolean; abierta?: number }> = ({ n, s = 1, mordida = 0, resalta, abierta = 0 }) => {
  const W = 220 * (1 - mordida);
  return (
    <g transform={`scale(${s})`}>
      {resalta && <rect x={-124} y={-50} width={248} height={100} rx={22} fill="none" stroke="#ffc94a" strokeWidth={8} />}
      <rect x={-110} y={-36} width={W} height={72} rx={12} fill="#8d9096" stroke="#5e6268" strokeWidth={4} />
      {mordida > 0 && Array.from({ length: 4 }).map((_, i) => <circle key={i} cx={-110 + W} cy={-27 + i * 18} r={10} fill="#4a4e54" />)}
      {abierta < 0.5 && <rect x={-118} y={-44} width={236} height={88} rx={16} fill="#eaf4ff" opacity={0.35 * (1 - abierta * 2)} stroke="#ffffff" strokeWidth={3} />}
      {mordida < 0.4 && <text x={-110 + W / 2} y={18} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#f4f6f8" textAnchor="middle" stroke="#3a3e44" strokeWidth={4} paintOrder="stroke">{n}</text>}
    </g>
  );
};
export const Bici: React.FC<{ s?: number; partes?: number }> = ({ s = 1, partes = 1 }) => (
  <g transform={`scale(${s})`} strokeLinecap="round">
    {partes > 0.75 && <circle cx={-95} r={70} fill="none" stroke="#2a2a30" strokeWidth={12} />}
    {partes > 0.5 && <circle cx={95} r={70} fill="none" stroke="#2a2a30" strokeWidth={12} />}
    {partes > 0.25 && <path d="M-95,0 L-30,-90 H70 L95,0 M-30,-90 L10,0 L70,-90 M60,-110 h40 M-45,-110 h40" stroke="#d23a2e" strokeWidth={12} fill="none" />}
    {partes > 0 && <circle cx={10} cy={0} r={14} fill="#2a2a30" />}
  </g>
);
export const Tele: React.FC<{ s?: number; partes?: number; f?: number }> = ({ s = 1, partes = 1, f = 0 }) => (
  <g transform={`scale(${s})`}>
    <defs><clipPath id={`tv${Math.round(partes * 10)}`}><rect x={-130} y={-200} width={260 * partes} height={400} /></clipPath></defs>
    <g clipPath={`url(#tv${Math.round(partes * 10)})`}>
      <rect x={-130} y={-100} width={260} height={190} rx={22} fill="#7a5a3a" stroke="#4a3220" strokeWidth={6} />
      <rect x={-110} y={-82} width={180} height={150} rx={20} fill="#9ac0d8" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-110} y={-82 + i * 15} width={180} height={4} fill="#fff" opacity={random(`tv${i}${Math.floor(f / 3)}`) * 0.4} />)}
      <circle cx={100} cy={-40} r={12} fill="#2a2420" /><circle cx={100} cy={0} r={12} fill="#2a2420" />
      <path d="M-40,-100 l-50,-70 M40,-100 l50,-70" stroke="#2a2a30" strokeWidth={6} />
    </g>
  </g>
);
export const Avion: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {/* Cessna 150 de perfil: ala alta, morro a la izquierda */}
    <path d="M-330,10 C-330,-30 -300,-50 -250,-54 L180,-40 L330,-120 L360,-120 L330,20 L-250,40 C-300,40 -330,30 -330,10 Z" fill="#f4f6f8" stroke="#5a6670" strokeWidth={6} />
    <path d="M-250,-10 L300,-10" stroke="#c23a2e" strokeWidth={14} />
    <path d="M-160,-54 L-140,-110 L20,-110 L40,-50" fill="#bcd8ec" stroke="#5a6670" strokeWidth={6} />
    <rect x={-260} y={-128} width={420} height={22} rx={10} fill="#f4f6f8" stroke="#5a6670" strokeWidth={5} />
    <path d="M-330,-60 L-330,80" stroke="#3a3e44" strokeWidth={8} />
    <path d="M-120,40 L-150,110 M-150,110 h0" stroke="#3a3e44" strokeWidth={8} /><circle cx={-150} cy={118} r={20} fill="#2a2a30" /><circle cx={60} cy={118} r={20} fill="#2a2a30" /><path d="M60,30 L60,100" stroke="#3a3e44" strokeWidth={8} />
    <text x={80} y={24} fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#3a4a5a">N150</text>
  </g>
);
export const Banana: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}><path d="M-90,30 Q0,-150 110,-60 Q0,-80 -60,60 Z" fill="#f6d84a" stroke="#9a8a1a" strokeWidth={6} /><path d="M100,-62 l20,-14" stroke="#5a4a1a" strokeWidth={10} strokeLinecap="round" /></g>;
export const Huevo: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}><ellipse rx={74} ry={94} fill="#fbf8f0" stroke="#c9c0ac" strokeWidth={6} /><ellipse rx={74} ry={20} cy={0} fill="#fbf8f0" /><circle r={40} fill="#f6c43a" /></g>;
export const Pizza: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}><path d="M0,-90 L70,80 Q0,100 -70,80 Z" fill="#f2c14a" stroke="#c98a2a" strokeWidth={6} /><path d="M-70,80 Q0,100 70,80 L74,92 Q0,116 -74,92 Z" fill="#d8943a" />{[[0, -10], [-20, 40], [24, 34]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill="#c23a2e" />)}</g>;
export const Taco: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}><path d="M-80,30 A80,80 0 0,1 80,30 Z" fill="#ecc66a" stroke="#c9944a" strokeWidth={6} /><path d="M-64,26 q20,-30 40,-10 q20,-30 40,-10 q20,-24 40,-6" stroke="#5aa83a" strokeWidth={14} fill="none" strokeLinecap="round" /><circle cx={-20} cy={6} r={10} fill="#c23a2e" /></g>;
export const Pastel: React.FC<{ s?: number; c?: number }> = ({ s = 1, c = 0 }) => {
  const col = ["#e9c27a", "#d9a04a", "#f2d39a", "#c9864a"][c % 4];
  return <g transform={`scale(${s})`}><path d="M-50,10 C-60,-30 -20,-50 0,-40 C20,-56 64,-30 50,10 Z" fill={col} stroke="#8a5a2a" strokeWidth={4} /><path d="M-30,-20 q10,10 20,0 M10,-26 q10,10 20,0" stroke="#8a5a2a" strokeWidth={3} fill="none" /></g>;
};
export const TazaCafe: React.FC<{ s?: number; f?: number }> = ({ s = 1, f = 0 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-34,-50 H34 L28,30 H-28 Z" fill="#f4efe6" stroke="#b9ad98" strokeWidth={4} /><rect x={-36} y={-58} width={72} height={12} rx={4} fill="#5a3a24" /><rect x={-34} y={-20} width={68} height={22} fill="#2f6b4a" />
    {[0, 1].map((i) => <path key={i} d={`M${-10 + i * 18},-66 q8,-14 0,-28`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.3 + 0.25 * Math.sin(f / 6 + i)} />)}
  </g>
);

// ---------------- SETS cerrados ----------------
// espejo del baño en primer plano: el reflejo (children) se dibuja dentro del espejo con su propio clip
export const ESP = { x: 960, y: 520, w: 1060, h: 760 };
export const BañoEspejo: React.FC<SetProps & { reflejo?: React.ReactNode }> = ({ capa, f }) => {
  if (capa === "lejos") return <rect x={-2000} y={-1500} width={6000} height={4000} fill="#cfe0e2" />;
  if (capa === "frente") return (
    <g>
      {/* lavabo abajo */}
      <rect x={300} y={980} width={1320} height={60} rx={20} fill="#f4f6f6" stroke="#c9d2d4" strokeWidth={5} />
      <rect x={880} y={930} width={50} height={60} rx={10} fill="#c9ced2" /><rect x={850} y={920} width={120} height={22} rx={8} fill="#dfe3e6" />
      <rect x={1180} y={940} width={80} height={44} rx={10} fill="#7ab8a8" /><rect x={1200} y={920} width={14} height={24} fill="#f4f6f6" />
    </g>
  );
  return (
    <g>
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-400 + i * 120} y={-600} width={4} height={2400} fill="#b7cacd" />)}
      {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-400} y={-600 + i * 120} width={3600} height={4} fill="#b7cacd" />)}
      <Halo x={960} y={60} r={900} color="#fff6d8" fuerza={0.45} />
      <rect x={ESP.x - ESP.w / 2 - 26} y={ESP.y - ESP.h / 2 - 26} width={ESP.w + 52} height={ESP.h + 52} rx={30} fill="#e9eef0" stroke="#aab6ba" strokeWidth={6} />
      <rect x={760} y={60} width={400} height={26} rx={13} fill="#fffbe8" />
    </g>
  );
};
// el reflejo: fondo del cuarto invertido + lo que se pase, recortado al espejo, con brillo encima
export const Reflejo6: React.FC<{ children: React.ReactNode; f: number }> = ({ children, f }) => {
  const id = uid();
  return (
    <g>
      <defs><clipPath id={`r${id}`}><rect x={ESP.x - ESP.w / 2} y={ESP.y - ESP.h / 2} width={ESP.w} height={ESP.h} rx={14} /></clipPath></defs>
      <g clipPath={`url(#r${id})`}>
        <rect x={ESP.x - ESP.w / 2} y={ESP.y - ESP.h / 2} width={ESP.w} height={ESP.h} fill="#a9c6cf" />
        {Array.from({ length: 14 }).map((_, i) => <rect key={`v${i}`} x={ESP.x - ESP.w / 2 + i * 80} y={ESP.y - ESP.h / 2} width={3} height={ESP.h} fill="#8fb0ba" />)}
        {Array.from({ length: 10 }).map((_, i) => <rect key={`h${i}`} x={ESP.x - ESP.w / 2} y={ESP.y - ESP.h / 2 + i * 80} width={ESP.w} height={3} fill="#8fb0ba" />)}
        <rect x={ESP.x - 120} y={ESP.y - ESP.h / 2} width={240} height={24} rx={10} fill="#fffbe8" opacity={0.9} />
        <rect x={ESP.x + 180} y={ESP.y - 300} width={260} height={520} fill="#c9a87a" opacity={0.7} />
        <rect x={ESP.x - 480} y={ESP.y - 320} width={200} height={240} fill="#5a6a9a" opacity={0.6} />
        {children}
        <path d={`M${ESP.x - 420},${ESP.y - 380} l140,0 l-260,760 l-140,0 Z`} fill="#ffffff" opacity={0.16} />
        <path d={`M${ESP.x - 200},${ESP.y - 380} l50,0 l-260,760 l-50,0 Z`} fill="#ffffff" opacity={0.1} />
      </g>
    </g>
  );
};

// café de Lena por dentro (mostrador al frente, vitrina de facturas, pizarra del menú)
export const CAFE_PISO = 900;
export const CafeDentro: React.FC<SetProps> = ({ capa, f }) => {
  const P = CAFE_PISO;
  if (capa === "lejos") return <rect x={-2000} y={-1500} width={6000} height={4000} fill="#3a2a22" />;
  if (capa === "frente") return (
    <g>
      {/* mostrador (delante de Lena, detrás de Owen) se dibuja en medio; acá sólo el borde del vidrio */}
      <Polvo x={200} y={100} w={1600} h={700} n={16} f={f} seed={61} color="#fff3d6" />
    </g>
  );
  return (
    <g>
      <rect x={-1000} y={-600} width={4000} height={P + 600} fill="#e9d9bf" />
      <rect x={-1000} y={P - 380} width={4000} height={380} fill="#d2bc98" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1000 + i * 100} y={P - 380} width={4} height={380} fill="#bfa47e" />)}
      {/* pizarra del menú */}
      <rect x={260} y={140} width={620} height={330} rx={10} fill="#2a2e2a" stroke="#7a5a3a" strokeWidth={16} />
      <text x={570} y={210} fontFamily={F_MANO} fontWeight={700} fontSize={56} fill="#f4efe4" textAnchor="middle">LENA'S · STOP 18</text>
      {["espresso .... 2.50", "café de olla .. 3", "conchas ....... 2", "empanadas ... 3.5"].map((t, i) => <text key={i} x={320} y={270 + i * 50} fontFamily={F_MANO} fontWeight={600} fontSize={38} fill={["#ffd27a", "#f4efe4", "#9fdcff", "#f4efe4"][i]}>{t}</text>)}
      {/* repisa con tazas y la máquina de café */}
      <rect x={1000} y={330} width={700} height={18} rx={4} fill="#7a4a2e" />
      {Array.from({ length: 7 }).map((_, i) => <g key={i} transform={`translate(${1040 + i * 96},300)`}><path d="M-22,-30 H22 L18,24 H-18 Z" fill={["#f4efe6", "#2f6b4a", "#e2483a"][i % 3]} /></g>)}
      <rect x={1100} y={P - 520} width={260} height={180} rx={18} fill="#c9ced2" stroke="#8a9096" strokeWidth={6} />
      <rect x={1130} y={P - 490} width={200} height={40} rx={8} fill="#3a3f46" />
      <circle cx={1180} cy={P - 410} r={20} fill="#3a3f46" /><circle cx={1280} cy={P - 410} r={20} fill="#3a3f46" />
      {[0, 1].map((i) => <path key={i} d={`M${1200 + i * 60},${P - 540} q10,-20 0,-40 q-10,-20 0,-40`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.35 + 0.2 * Math.sin(f / 7 + i)} />)}
      {/* lámparas colgantes */}
      {[600, 1300].map((x) => <g key={x}><rect x={x - 2} y={-200} width={4} height={260} fill="#2a2420" /><path d={`M${x - 60},90 L${x + 60},90 L${x + 34},50 L${x - 34},50 Z`} fill="#2f6b4a" /><Halo x={x} y={100} r={320} color="#ffd27a" fuerza={0.4} /></g>)}
      <rect x={-1000} y={P} width={4000} height={500} fill="#6a4a34" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-1000 + i * 140} y={P} width={70} height={500} fill="#5e4230" />)}
      <Charco x={960} y={P + 40} rx={900} color="#ffd27a" fuerza={0.25} />
    </g>
  );
};
// el mostrador del café: va DESPUÉS de Lena y ANTES de Owen
export const MostradorCafe: React.FC<{ x?: number }> = ({ x = 960 }) => (
  <g>
    <rect x={x - 760} y={CAFE_PISO - 300} width={1100} height={300} fill="#7a4a2e" />
    {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={x - 760 + i * 100} y={CAFE_PISO - 300} width={6} height={300} fill="#5e3820" />)}
    <rect x={x - 780} y={CAFE_PISO - 316} width={1140} height={22} rx={6} fill="#c9864a" />
  </g>
);

// escenario con telón rojo y reflector (Monsieur Mangetout)
export const Escenario: React.FC<SetProps> = ({ capa, f }) => {
  if (capa === "lejos") return <rect x={-2000} y={-1500} width={6000} height={4000} fill="#2a1418" />;
  if (capa === "frente") return <g>{[0, 1].map((k) => <path key={k} d={k ? "M2400,-300 C2200,200 2260,700 2120,1200 L2600,1200 L2600,-300 Z" : "M-480,-300 C-280,200 -340,700 -200,1200 L-680,1200 L-680,-300 Z"} fill="#8a1a24" />)}</g>;
  return (
    <g>
      {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M${-600 + i * 120},-400 q30,700 0,1300`} stroke={i % 2 ? "#9a2028" : "#7a141c"} strokeWidth={130} fill="none" />)}
      <path d="M-600,-400 H3000 V-160 Q1200,-60 -600,-160 Z" fill="#b8323a" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-600 + i * 130} cy={-150 + Math.sin(i) * 10} r={10} fill="#ffd27a" />)}
      <rect x={-1000} y={900} width={5000} height={500} fill="#5a3a28" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1000 + i * 125} y={900} width={4} height={500} fill="#4a2e1e" />)}
      <path d="M760,-400 L1160,-400 L1560,900 L360,900 Z" fill="#fff3c8" opacity={0.14} />
      <Charco x={960} y={930} rx={700} color="#fff3c8" fuerza={0.5} />
      <Halo x={960} y={500} r={800} color="#ffe0a0" fuerza={0.22} />
    </g>
  );
};

// ---------------- HUD: CTA con personaje ----------------
// tarjeta de comentario estilo YouTube que se escribe sola
export const Comentario: React.FC<{ x: number; y: number; desde: number; texto: string; nombre?: string; w?: number; f: number }> = ({ x, y, desde, texto, nombre = "@you", w = 760, f }) => {
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 140 } });
  const n = Math.max(0, Math.floor((f - desde - 8) * 0.9));
  const cur = Math.floor(f / 8) % 2 ? "|" : "";
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 40}px)`, opacity: Math.min(1, s * 1.4), transformOrigin: "0 0", background: "#ffffff", borderRadius: 28, padding: "26px 32px", boxShadow: "0 18px 50px rgba(0,0,0,0.45)", fontFamily: F_HUD, display: "flex", gap: 22 }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, background: "#ffc94a", flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 600, color: "#2a2420" }}>☺</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 30, fontWeight: 600, color: "#606060" }}>{nombre} · now</div>
        <div style={{ fontSize: 50, fontWeight: 600, color: "#14181c", lineHeight: 1.15, minHeight: 58 }}>{texto.slice(0, n)}{n < texto.length ? cur : ""}</div>
        <div style={{ fontSize: 30, color: "#606060", marginTop: 10 }}>👍 {Math.max(0, Math.floor((f - desde - 40) / 3))}  ·  Reply</div>
      </div>
    </div>
  );
};
// botón SUBSCRIBE con el cursor que lo aprieta
export const BotonSub6: React.FC<{ x: number; y: number; desde: number; clic: number; f: number; tam?: number }> = ({ x, y, desde, clic, f, tam = 64 }) => {
  if (f < desde) return null;
  const p = interpolate(f - desde, [0, 5, 9], [0.3, 1.15, 1], cl);
  const k = interpolate(f, [clic - 4, clic, clic + 4], [1, 0.9, 1], cl);
  const hecho = f >= clic;
  const cx = interpolate(f, [desde + 4, clic - 2], [x + 420, x + 120], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const cy = interpolate(f, [desde + 4, clic - 2], [y + 220, y + 50], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) scale(${p * k})`, background: hecho ? "#3a3f46" : "#e0262b", color: "#fff", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, padding: `${tam * 0.28}px ${tam}px`, borderRadius: 80, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>{hecho ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      {hecho && f < clic + 14 && <div style={{ position: "absolute", left: x - 200, top: y - 60, width: 400, height: 220, borderRadius: 200, border: `6px solid #ffc94a`, transform: `scale(${1 + (f - clic) / 10})`, opacity: 1 - (f - clic) / 14 }} />}
      <svg width={80} height={100} style={{ position: "absolute", left: cx, top: cy, overflow: "visible" }}><path d="M0,0 L0,70 L18,54 L32,86 L46,80 L32,48 L56,48 Z" fill="#ffffff" stroke="#14181c" strokeWidth={4} strokeLinejoin="round" /></svg>
    </>
  );
};
// rótulo en pastilla (para nombres y lugares)
export const Pastilla: React.FC<{ t: string; x: number; y: number; f: number; desde: number; hasta: number; color?: string; tam?: number; centro?: boolean }> = ({ t, x, y, f, desde, hasta, color = "#7dff6a", tam = 46, centro }) => {
  const o = Math.min(tw(f, desde, desde + 6), tw(f, hasta - 6, hasta, 1, 0));
  if (o <= 0) return null;
  return <div style={{ position: "absolute", left: centro ? 0 : x, right: centro ? 0 : undefined, top: y, textAlign: centro ? "center" : "left", opacity: o }}><span style={{ display: "inline-block", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color, background: "rgba(12,16,22,0.78)", padding: "6px 24px", borderRadius: 16, transform: `scale(${0.85 + 0.15 * o})` }}>{t}</span></div>;
};
// subtítulo a mano (zona limpia, NUNCA sobre caras)
export const Mano: React.FC<{ t: string; x: number; y: number; f: number; desde: number; hasta: number; color?: string; tam?: number; rot?: number; centro?: boolean }> = ({ t, x, y, f, desde, hasta, color = "#f4efe4", tam = 60, rot = 0, centro }) => {
  const o = Math.min(tw(f, desde, desde + 6), tw(f, hasta - 6, hasta, 1, 0));
  if (o <= 0) return null;
  return <div style={{ position: "absolute", left: centro ? 0 : x, right: centro ? 0 : undefined, top: y, textAlign: centro ? "center" : "left", opacity: o, transform: `rotate(${rot}deg)` }}><span style={{ display: "inline-block", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, color, background: "rgba(12,16,22,0.72)", padding: "2px 24px", borderRadius: 16, whiteSpace: "pre-line", lineHeight: 1.1, textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{t}</span></div>;
};
// sacudida de cámara en HUD (para golpes)
export const Sacude: React.FC<{ f: number; en: number[]; amp?: number; children: React.ReactNode }> = ({ f, en, amp = 10, children }) => {
  let dx = 0, dy = 0;
  en.forEach((a) => { if (f >= a && f < a + 12) { const k = Math.exp(-(f - a) / 3); dx += Math.sin((f - a) * 2.3) * amp * k; dy += Math.cos((f - a) * 1.9) * amp * 0.7 * k; } });
  return <AbsoluteFill style={{ transform: `translate(${dx}px,${dy}px)` }}>{children}</AbsoluteFill>;
};
export { Halo, Charco, Polvo };
