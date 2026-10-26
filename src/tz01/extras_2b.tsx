// tz01 · helpers de la vuelta 4 para planos2 (Vaishali): rótulo claro (crema, no gris sobre gris), cartel del nombre,
// inserto legible del cuenco (puerta tallada nítida, brazo de la vecina con pulseras), aro de iris nítido que nace de la llama
// y los monjes de la fila con cara, edad y altura propias.
import React from "react";
import { AbsoluteFill, interpolate, random, spring } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { EXPRESIONES, Look } from "../anikit/personaje";
import { MONJE_JOVEN, ORO } from "../tenzo/elenco";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], cl);
const TINTA = "#221c18";
const CREMA = "#f6efe2";

// ---------- rótulo de lugar legible: placa crema con tinta oscura y barra de acento ----------
export const RotuloClaro: React.FC<{ texto: string; desde?: number; hasta?: number; acento?: string }> = ({ texto, desde = 0, hasta, acento = "#c8501e" }) => {
  const f = useF();
  const s = spring({ frame: f - desde, fps: 30, config: { damping: 15, stiffness: 150 } });
  const o = lp(f, desde, desde + 8, 0, 1) * (hasta !== undefined ? lp(f, hasta - 8, hasta, 1, 0) : 1);
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: 70, bottom: 74, opacity: o, transform: `translateX(${(1 - s) * -40}px)`, display: "flex", alignItems: "stretch", boxShadow: "0 6px 18px rgba(0,0,0,0.35)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ width: 14, background: acento }} />
      <div style={{ background: CREMA, padding: "10px 26px 12px", fontFamily: F_HUD, fontWeight: 600, fontSize: texto.length > 30 ? 40 : 48, letterSpacing: 3, color: TINTA, whiteSpace: "nowrap" }}>{texto}</div>
    </div>
  );
};

// ---------- cartel del nombre (al decirlo la voz): placa crema grande, letras que se abren, subrayado de oro que se dibuja ----------
export const NombreCartel: React.FC<{ nombre: string; sub?: string; desde: number; x?: number; y?: number }> = ({ nombre, sub, desde, x = 960, y = 760 }) => {
  const f = useF() - desde;
  if (f < 0) return null;
  const s = spring({ frame: f, fps: 30, config: { damping: 13, stiffness: 170 } });
  const letras = lp(f, 2, 16, 0, 1);
  const raya = lp(f, 8, 22, 0, 1);
  const deriva = f * 0.25; // la placa nunca queda congelada: deriva lenta
  return (
    <div style={{ position: "absolute", left: x + deriva, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.4), background: CREMA, border: `5px solid ${TINTA}`, borderRadius: 26, padding: "18px 64px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.45)", textAlign: "center" }}>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 118, letterSpacing: 16 * letras, color: "#8a1f24", lineHeight: 1, clipPath: `inset(0 ${(1 - letras) * 50}% 0 ${(1 - letras) * 50}%)`, whiteSpace: "nowrap" }}>{nombre}</div>
      <div style={{ height: 8, margin: "12px auto 6px", width: `${raya * 100}%`, background: ORO, borderRadius: 4 }} />
      {sub && <div style={{ fontFamily: F_HUD, fontWeight: 500, fontSize: 38, letterSpacing: 6, color: TINTA, opacity: lp(f, 14, 22, 0, 1), whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
};

// ---------- aro del iris (PANTALLA): borde nítido de oro + filo blanco, sin desenfoque ----------
export const AroIris: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  r <= 0 || r > 2250 ? null : (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080}>
        <circle cx={x} cy={y} r={r + 16} fill="none" stroke={ORO} strokeWidth={14} opacity={0.35} />
        <circle cx={x} cy={y} r={r} fill="none" stroke={ORO} strokeWidth={16} />
        <circle cx={x} cy={y} r={r - 9} fill="none" stroke="#fff4d0" strokeWidth={5} />
      </svg>
    </AbsoluteFill>
  )
);

// ---------- cara «aguanta el aire»: ojos muy abiertos, boca apretada chiquita, cachetes colorados, gota (se suma al diccionario, sin tocar anikit) ----------
if (!EXPRESIONES.aguanta) EXPRESIONES.aguanta = { ...EXPRESIONES.sorpresa, bocaW: 4, bocaC: -1, bocaO: 0, rubor: 0.9, gota: 1, cejaY: -7 };

// ---------- monjes de la fila (P35): cada uno con edad, altura, cara y túnica propias ----------
const base = (piel: string, tunica: string, extra: Look["accesorios"] = [], o: Partial<Look> = {}): Look => ({
  ...MONJE_JOVEN, piel, miembro: piel, zapatos: piel, camisa: tunica, pantalon: tunica,
  accesorios: [{ t: "pelo", forma: "calvo", color: piel }, { t: "tunica", color: tunica, largo: 0.9 }, ...(extra ?? [])], ...o,
});
export const MONJE_VIEJO: Look = base("#c48a5a", "#b9602a", [{ t: "barba", color: "#efeae0" }, { t: "ojeras", color: "#8a5a3a" }, { t: "rosario", color: "#5a3a20" }], { ceja: "#f4efe6", alto: 0.88 });
export const MONJE_ALTO: Look = base("#e0b080", "#ee9036", [], { alto: 1.18 });
export const MONJE_LENTES: Look = base("#9e6c44", "#d8702a", [{ t: "lentes", color: "#2a1a10", forma: "redondo" }, { t: "rosario", color: "#7a4a2a" }], { alto: 1.0 });
export const MONJE_NOVICIO: Look = base("#dca878", "#f2a848", [], { alto: 0.7 });

// ---------- inserto legible: el cuenco recibe arroz; atrás, NÍTIDA, la puerta tallada de una casa con guirnalda y lámpara ----------
export const InsertoCuenco2: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useF() - desde;
  const inc = lp(f, 2, 12, 0, 38); // el cucharón se inclina
  const monton = lp(f, 10, 40, 0, 1);
  const bx = 960, by = 770;
  const zoom = 1 + 0.0012 * f; // empuje lento de cámara
  const sube = lp(f, 30, 54, 0, -18); // el monje levanta apenas el cuenco al recibir
  const llama = 1 + 0.12 * Math.sin(f / 2.3) * Math.sin(f / 1.3);
  return (
    <AbsoluteFill style={{ background: "#e2b47c" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", transform: `scale(${zoom})`, transformOrigin: "50% 70%" }}>
        {/* pared de adobe con hiladas suaves */}
        <rect x={0} y={0} width={1920} height={1080} fill="#e2b47c" />
        {Array.from({ length: 9 }).map((_, k) => <line key={k} x1={0} y1={90 + k * 110} x2={1920} y2={90 + k * 110} stroke="#d4a46c" strokeWidth={4} />)}
        {/* puerta tallada (izquierda): marco de oro, hojas de madera con tablas y aldaba */}
        <g opacity={0.92}>
          <path d="M120,1080 L120,330 Q300,120 480,330 L480,1080 Z" fill="#c8963a" stroke={TINTA} strokeWidth={6} />
          <path d="M160,1080 L160,350 Q300,180 440,350 L440,1080 Z" fill="#7a4a2a" stroke={TINTA} strokeWidth={5} />
          <line x1={300} y1={200} x2={300} y2={1080} stroke={TINTA} strokeWidth={5} />
          {[230, 370].map((x) => <line key={x} x1={x} y1={300} x2={x} y2={1080} stroke="#5e3820" strokeWidth={4} />)}
          {[520, 760].map((y) => <rect key={y} x={176} y={y} width={248} height={18} rx={6} fill="#5e3820" />)}
          <circle cx={275} cy={640} r={16} fill="#e8c050" stroke={TINTA} strokeWidth={4} /><circle cx={325} cy={640} r={16} fill="#e8c050" stroke={TINTA} strokeWidth={4} />
        </g>
        {/* guirnalda de caléndulas que cuelga sobre la puerta */}
        <path d="M60,170 Q300,300 560,170" stroke="#5a7a2a" strokeWidth={6} fill="none" />
        {Array.from({ length: 11 }).map((_, k) => { const t = k / 10; const x = 60 + 500 * t; const y = 170 + 4 * 130 * t * (1 - t) * 1.0 + Math.sin(f / 12 + k) * 2; return <circle key={k} cx={x} cy={y} r={17} fill={k % 2 ? "#f2a020" : "#e8781c"} stroke={TINTA} strokeWidth={3} />; })}
        {/* nicho con lámpara de aceite (derecha) */}
        <path d="M1560,520 L1560,380 Q1650,300 1740,380 L1740,520 Z" fill="#b98450" stroke={TINTA} strokeWidth={5} />
        <path d="M1600,505 Q1650,540 1700,505 L1690,490 L1610,490 Z" fill="#a8582a" stroke={TINTA} strokeWidth={4} />
        <path d={`M1650,${488} q-14,-24 0,${-52 * llama} q14,${28 * llama} 0,${52 * llama}`} fill="#ffcf4a" stroke="#e8781c" strokeWidth={3} />
        <circle cx={1650} cy={460} r={60} fill="#ffe6a0" opacity={0.25} />
        {/* mangas naranjas y manos (con pulgares) que sostienen el cuenco */}
        <g transform={`translate(0,${sube})`}>
          <path d={`M${bx - 540},1080 Q${bx - 390},${by + 80} ${bx - 240},${by + 40} L${bx - 175},${by + 150} Q${bx - 320},${by + 220} ${bx - 340},1080 Z`} fill="#e07a2c" stroke={TINTA} strokeWidth={5} />
          <path d={`M${bx + 540},1080 Q${bx + 390},${by + 80} ${bx + 240},${by + 40} L${bx + 175},${by + 150} Q${bx + 320},${by + 220} ${bx + 340},1080 Z`} fill="#d06a24" stroke={TINTA} strokeWidth={5} />
          {/* cuenco */}
          <path d={`M${bx - 230},${by - 20} Q${bx - 220},${by + 190} ${bx},${by + 200} Q${bx + 220},${by + 190} ${bx + 230},${by - 20} Z`} fill="#5a3a24" stroke={TINTA} strokeWidth={6} />
          <path d={`M${bx - 200},${by + 60} Q${bx},${by + 110} ${bx + 200},${by + 60}`} stroke="#7a5236" strokeWidth={8} fill="none" />
          <ellipse cx={bx} cy={by - 20} rx={230} ry={52} fill="#3a2414" stroke={TINTA} strokeWidth={6} />
          {/* montón de arroz que crece */}
          <path d={`M${bx - 200 * monton},${by - 18} Q${bx},${by - 18 - 120 * monton} ${bx + 200 * monton},${by - 18} Z`} fill="#f7f2e6" />
          {Array.from({ length: 30 }).map((_, k) => monton > 0.15 && <ellipse key={k} cx={bx + (random(`ra${k}`) - 0.5) * 340 * monton} cy={by - 26 - random(`rb${k}`) * 80 * monton} rx={6} ry={3.5} fill="#e4dccb" />)}
          {/* manos: palma bajo el cuenco + pulgar por encima del borde */}
          {[-1, 1].map((s) => (
            <g key={s}>
              <ellipse cx={bx + s * 205} cy={by + 95} rx={66} ry={50} fill="#d9a273" stroke={TINTA} strokeWidth={5} />
              <path d={`M${bx + s * 238},${by + 70} Q${bx + s * 262},${by - 6} ${bx + s * 222},${by - 24} Q${bx + s * 200},${by - 10} ${bx + s * 212},${by + 52}`} fill="#d9a273" stroke={TINTA} strokeWidth={5} />
            </g>
          ))}
        </g>
        {/* brazo de la vecina: manga verde, pulseras de oro, mano que agarra el cucharón de madera */}
        <g transform={`translate(${bx + 120},${by - 540}) rotate(${-inc})`}>
          <path d="M620,-260 Q330,-70 130,-24 L120,64 Q350,46 660,-120 Z" fill="#2e7a6a" stroke={TINTA} strokeWidth={5} />
          <path d="M170,-30 L176,66" stroke="#e8c050" strokeWidth={12} /><path d="M196,-36 L204,62" stroke="#e8c050" strokeWidth={10} />
          <ellipse cx={104} cy={22} rx={54} ry={46} fill="#c98a5e" stroke={TINTA} strokeWidth={5} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${82 - i * 4},${-6 + i * 18} q-30,6 -34,22`} stroke={TINTA} strokeWidth={4} fill="none" strokeLinecap="round" />)}
          <path d="M84,22 L-80,64" stroke="#8a5a32" strokeWidth={16} strokeLinecap="round" />
          <path d="M-60,44 Q-118,128 -178,72 Q-156,30 -60,44 Z" fill="#8a5a32" stroke={TINTA} strokeWidth={5} />
        </g>
        {/* granos que caen */}
        {inc > 20 && Array.from({ length: 26 }).map((_, k) => {
          const t = ((f * 1.6 + k * 7) % 26) / 26;
          const x0 = bx - 10 + (random(`gx${k}`) - 0.5) * 50;
          return <ellipse key={k} cx={x0 + t * 20} cy={by - 430 + t * 390} rx={5} ry={3} fill="#fbf7ee" stroke="#d8cfbd" strokeWidth={1} opacity={lp(f, 12, 16, 0, 1) * (f < 44 ? 1 : lp(f, 44, 52, 1, 0))} />;
        })}
      </svg>
      {/* rótulo con guía al cuenco */}
      {f >= 8 && (
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <line x1={1160} y1={740} x2={1420} y2={600} stroke={CREMA} strokeWidth={5} opacity={lp(f, 8, 14, 0, 1)} />
          <circle cx={1160} cy={740} r={10} fill={CREMA} opacity={lp(f, 8, 14, 0, 1)} />
        </svg>
      )}
      {f >= 10 && (
        <div style={{ position: "absolute", left: 1410, top: 560, opacity: lp(f, 10, 18, 0, 1), background: "rgba(22,14,10,0.86)", borderRadius: 16, padding: "8px 24px 10px", fontFamily: F_HUD, fontWeight: 600, fontSize: 52, color: CREMA, whiteSpace: "nowrap" }}>ALMS BOWL</div>
      )}
    </AbsoluteFill>
  );
};
